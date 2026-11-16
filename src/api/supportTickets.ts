import { authFetch, getSession } from '../auth/session'
import { API_BASE_URL, ENDPOINTS } from '../config/api'
import { DUMMY_SUPPORT_TICKETS } from '../data/supportTicketDummy'

const SUPPORT_API = API_BASE_URL.supportTicket
const DUMMY_DATA_EMAIL = 'admin@namami.com'

/** Sample tickets are served only to the admin@namami.com login; everyone else uses the API. */
function usesDummyTickets(): boolean {
  return getSession()?.email?.toLowerCase() === DUMMY_DATA_EMAIL
}

export type ApiCategory = {
  id: number
  name: string
  subCategories: { id: number; name: string }[]
}

export type ApiTicketListItem = {
  ticketNo: string
  subject: string
  priority: string
  status: string
  stpName?: string | null
  userId: number | string
  categoryName?: string | null
  assignedTo?: string | number | null
  createdAt: string
  updatedAt: string
}

export type ApiTicketDetail = {
  ticketNo: string
  subject: string
  description?: string | null
  categoryId?: string | null
  subCategoryId?: string | null
  priority: string
  status: string
  userId: number | string
  stpId?: number | null
  stpName?: string | null
  violationId?: string | number | null
  assignedTo?: string | number | null
  createdAt: string
  updatedAt: string
  closedAt?: string | null
}

export type ApiMessageAttachment = {
  id: number
  fileName: string
  contentType: string
  fileSize: number
}

export type ApiMessage = {
  id: number
  senderType: 'USER' | 'SUPPORT'
  senderId: number | string
  message: string
  createdAt: string
  attachments: ApiMessageAttachment[]
}

export type ApiTimelineEvent = {
  id: number
  eventType: string
  actorId?: number | string | null
  remarks?: string | null
  createdAt: string
}

export type ApiPage<T> = {
  content: T[]
  totalElements: number
}

export type ApiSummary = {
  total: number
  byStatus: Record<string, number>
}

/** Row shape consumed by SupportTicketTable. */
export type SupportTicketRow = {
  id: string
  category: string
  issue: string
  stpName: string
  date: string
  priority: string
  status: string
  updatedOn: string
}

/** Row shape consumed by AdminTicketTable. */
export type AdminTicketRow = {
  id: string
  createdOn: string
  contractor: string
  stpName: string
  category: string
  priority: string
  status: string
  assignee: string
}

export type SupportTicketDetail = ReturnType<typeof toTicketDetail>

type ApiEnvelope<T> = { success?: boolean; message?: string; data?: T }

const STATUS_LABEL: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  ACTION_REQUIRED: 'Action Required',
  CLOSED: 'Closed',
}

/** UI priority ids (see supportTicketPriorities) mapped to the API enum. */
const PRIORITY_TO_API: Record<string, string> = { Low: 'LOW', Mid: 'MEDIUM', High: 'HIGH' }
const PRIORITY_FROM_API: Record<string, string> = { LOW: 'Low', MEDIUM: 'Mid', HIGH: 'High' }

/** Priority choices offered by the "Raise a Ticket" form. */
export const supportTicketPriorities = [
  { id: 'Low', label: 'Low' },
  { id: 'Mid', label: 'Medium' },
  { id: 'High', label: 'High' },
]

const TIMELINE_META: Record<string, { label: string; icon: string }> = {
  TICKET_RAISED: { label: 'Ticket Raised', icon: 'raised' },
  TICKET_ASSIGNED: { label: 'Ticket Assigned', icon: 'assigned' },
  SUPPORT_TEAM_REPLY: { label: 'Support Team Reply', icon: 'reply' },
  ADDITIONAL_INFO_REQUESTED: { label: 'Additional Information Requested', icon: 'info' },
  DOCUMENT_SUBMITTED: { label: 'Document Submitted', icon: 'document' },
  RESOLUTION_PROVIDED: { label: 'Resolution Provided', icon: 'resolution' },
  PENDING_USER_CONFIRMATION: { label: 'Pending Your Confirmation', icon: 'confirmation' },
  TICKET_CLOSED: { label: 'Ticket Closed', icon: 'confirmation' },
}

/** Unwraps the common ApiResponse envelope and throws with the server message on failure. */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await authFetch(`${SUPPORT_API}${path}`, init)
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed (${response.status})`)
  }
  return payload?.data as T
}

function jsonInit(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

/** The backend reads the `data` part as JSON, so it is sent as a typed Blob next to the files. */
function multipartInit(method: string, data: unknown, files: File[] = []): RequestInit {
  const form = new FormData()
  form.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  files.forEach((file) => form.append('files', file))
  return { method, body: form }
}

const DATE_PART = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/

/** Parses the zone-less LocalDateTime strings the backend returns, as local time. */
function parseLocal(value?: string | null): Date | null {
  const match = value ? DATE_PART.exec(value) : null
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] ?? 0), Number(match[5] ?? 0))
}

const pad = (n: number) => String(n).padStart(2, '0')

function formatTableDate(value?: string | null): string {
  const date = parseLocal(value)
  return date ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

/** Matches the detail-view stamp format, e.g. 15/02/2026, 10:30 AM. */
function formatStamp(value?: string | null): string {
  const date = parseLocal(value)
  if (!date) return value ?? ''
  const hours24 = date.getHours()
  const hours12 = hours24 % 12 || 12
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(hours12)}:${pad(
    date.getMinutes(),
  )} ${hours24 < 12 ? 'AM' : 'PM'}`
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

/** Local calendar date as yyyy-MM-dd, the format the list and summary endpoints expect. */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function toRow(item: ApiTicketListItem): SupportTicketRow {
  return {
    id: item.ticketNo,
    category: item.categoryName ?? '',
    issue: item.subject,
    stpName: item.stpName ?? '',
    date: formatTableDate(item.createdAt),
    priority: PRIORITY_FROM_API[item.priority] ?? item.priority,
    status: STATUS_LABEL[item.status] ?? item.status,
    updatedOn: formatTableDate(item.updatedAt),
  }
}

function toAdminRow(item: ApiTicketListItem): AdminTicketRow {
  return {
    id: item.ticketNo,
    createdOn: formatTableDate(item.createdAt),
    contractor: `User ${item.userId}`,
    stpName: item.stpName ?? '',
    category: item.categoryName ?? '',
    priority: PRIORITY_FROM_API[item.priority] ?? item.priority,
    status: STATUS_LABEL[item.status] ?? item.status,
    assignee: item.assignedTo != null ? `User ${item.assignedTo}` : 'Not assigned',
  }
}

function toConversationMessage(message: ApiMessage) {
  const fromUser = message.senderType === 'USER'
  return {
    id: String(message.id),
    author: fromUser ? 'You' : 'Support Team',
    side: fromUser ? ('left' as const) : ('right' as const),
    time: formatStamp(message.createdAt),
    text: message.message,
    attachments: message.attachments.map((file) => ({
      id: file.id,
      name: file.fileName,
      size: formatFileSize(file.fileSize),
    })),
  }
}

function toTimelineStep(event: ApiTimelineEvent) {
  const meta = TIMELINE_META[event.eventType]
  return {
    key: String(event.id),
    label: meta?.label ?? event.eventType,
    time: formatStamp(event.createdAt),
    icon: meta?.icon ?? 'raised',
  }
}

function toTicketDetail(
  detail: ApiTicketDetail,
  categories: ApiCategory[],
  messages: ApiMessage[],
  timeline: ApiTimelineEvent[],
) {
  const category = categories.find((c) => String(c.id) === detail.categoryId)
  const subCategory = category?.subCategories.find((s) => String(s.id) === detail.subCategoryId)
  const latest = timeline[timeline.length - 1]
  const assignee = detail.assignedTo != null ? String(detail.assignedTo) : ''

  return {
    id: detail.ticketNo,
    status: STATUS_LABEL[detail.status] ?? detail.status,
    priority: PRIORITY_FROM_API[detail.priority] ?? detail.priority,
    createdOn: formatStamp(detail.createdAt),
    category: {
      title: subCategory?.name ?? category?.name ?? detail.subject,
      group: category?.name ?? '',
    },
    lastUpdate: {
      message: latest?.remarks || detail.subject,
      on: formatStamp(detail.updatedAt),
    },
    raisedBy: { userId: String(detail.userId), name: `User ${detail.userId}`, phone: '' },
    assignedTo: {
      userId: assignee,
      name: assignee ? `User ${assignee}` : 'Not assigned',
      phone: '',
    },
    description: detail.description ?? '',
    attachments: [] as { name: string; size: string }[],
    violationId: detail.violationId != null ? String(detail.violationId) : '',
    conversation: messages.map(toConversationMessage),
    timeline: timeline.map(toTimelineStep),
  }
}

export function fetchTicketCategories(): Promise<ApiCategory[]> {
  return request<ApiCategory[]>(ENDPOINTS.supportTickets.categories)
}

function dummyTicketList(search?: string, size = 100): ApiTicketListItem[] {
  const term = search?.trim().toLowerCase()
  return DUMMY_SUPPORT_TICKETS.filter(
    (t) => !term || t.ticketNo.toLowerCase().includes(term) || t.subject.toLowerCase().includes(term),
  ).slice(0, size)
}

export async function fetchTicketRows(filters: {
  from: string
  to: string
  search?: string
  size?: number
}): Promise<SupportTicketRow[]> {
  if (usesDummyTickets()) return dummyTicketList(filters.search, filters.size).map(toRow)
  const params = new URLSearchParams({ from: filters.from, to: filters.to, size: String(filters.size ?? 100) })
  if (filters.search?.trim()) params.set('search', filters.search.trim())
  const page = await request<ApiPage<ApiTicketListItem>>(`${ENDPOINTS.supportTickets.tickets}?${params}`)
  return page.content.map(toRow)
}

export function fetchTicketSummary(from: string, to: string): Promise<ApiSummary> {
  if (usesDummyTickets()) {
    const byStatus: Record<string, number> = {}
    for (const t of DUMMY_SUPPORT_TICKETS) byStatus[t.status] = (byStatus[t.status] ?? 0) + 1
    return Promise.resolve({ total: DUMMY_SUPPORT_TICKETS.length, byStatus })
  }
  const params = new URLSearchParams({ from, to })
  return request<ApiSummary>(`${ENDPOINTS.supportTickets.summary}?${params}`)
}

export async function fetchTicketView(ticketNo: string, categories: ApiCategory[]): Promise<SupportTicketDetail> {
  const dummy = usesDummyTickets() ? DUMMY_SUPPORT_TICKETS.find((t) => t.ticketNo === ticketNo) : undefined
  if (dummy) {
    const { messages, timeline, ...detail } = dummy
    return toTicketDetail(detail, categories, messages, timeline)
  }
  const path = ENDPOINTS.supportTickets
  const [detail, messages, timeline] = await Promise.all([
    request<ApiTicketDetail>(path.byNo(ticketNo)),
    request<ApiMessage[]>(path.messages(ticketNo)),
    request<ApiTimelineEvent[]>(path.timeline(ticketNo)),
  ])
  return toTicketDetail(detail, categories, messages, timeline)
}

export type CreateTicketInput = {
  categoryId: string
  subCategoryId?: string
  subject: string
  description: string
  /** UI priority id: Low | Mid | High */
  priority: string
  files?: File[]
}

export function createTicket(input: CreateTicketInput): Promise<ApiTicketDetail> {
  return request<ApiTicketDetail>(
    ENDPOINTS.supportTickets.tickets,
    multipartInit(
      'POST',
      {
        categoryId: input.categoryId,
        subCategoryId: input.subCategoryId || undefined,
        subject: input.subject,
        description: input.description,
        priority: PRIORITY_TO_API[input.priority] ?? 'MEDIUM',
      },
      input.files,
    ),
  )
}

export function postTicketMessage(ticketNo: string, message: string, files: File[] = []): Promise<ApiMessage> {
  return request<ApiMessage>(ENDPOINTS.supportTickets.messages(ticketNo), multipartInit('POST', { message }, files))
}

export function confirmTicketResolution(ticketNo: string): Promise<ApiTicketDetail> {
  return request<ApiTicketDetail>(ENDPOINTS.supportTickets.confirmResolution(ticketNo), { method: 'PATCH' })
}

/** Attachments are served as raw bytes, so this bypasses the ApiResponse envelope. */
async function saveAttachment(path: string, fileName: string) {
  const response = await authFetch(`${SUPPORT_API}${path}`)
  if (!response.ok) throw new Error('Could not download the attachment')

  const url = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function downloadTicketAttachment(ticketNo: string, attachment: { id: number; name: string }) {
  return saveAttachment(ENDPOINTS.supportTickets.attachment(ticketNo, attachment.id), attachment.name)
}

/** Admin endpoints (ROLE_ADMIN). */
export const adminTicketApi = {
  list(filters: { from: string; to: string; status?: string; assigneeId?: number; search?: string; size?: number }) {
    const params = new URLSearchParams({ from: filters.from, to: filters.to, size: String(filters.size ?? 100) })
    if (filters.status) params.set('status', filters.status)
    if (filters.assigneeId != null) params.set('assigneeId', String(filters.assigneeId))
    if (filters.search?.trim()) params.set('search', filters.search.trim())
    return request<ApiPage<ApiTicketListItem>>(`${ENDPOINTS.supportTickets.admin.tickets}?${params}`)
  },
  assign(ticketNo: string, assigneeId: number) {
    return request<ApiTicketDetail>(ENDPOINTS.supportTickets.admin.assign(ticketNo), jsonInit('PATCH', { assigneeId }))
  },
  updateStatus(ticketNo: string, status: string) {
    return request<ApiTicketDetail>(ENDPOINTS.supportTickets.admin.status(ticketNo), jsonInit('PATCH', { status }))
  },
  postMessage(ticketNo: string, message: string, files: File[] = []) {
    return request<ApiMessage>(ENDPOINTS.supportTickets.admin.messages(ticketNo), multipartInit('POST', { message }, files))
  },
}

export async function fetchAdminTicketRows(filters: {
  from: string
  to: string
  search?: string
  size?: number
}): Promise<AdminTicketRow[]> {
  if (usesDummyTickets()) return dummyTicketList(filters.search, filters.size).map(toAdminRow)
  const page = await adminTicketApi.list(filters)
  return page.content.map(toAdminRow)
}

export async function fetchAdminTicketView(ticketNo: string, categories: ApiCategory[]): Promise<SupportTicketDetail> {
  const dummy = usesDummyTickets() ? DUMMY_SUPPORT_TICKETS.find((t) => t.ticketNo === ticketNo) : undefined
  if (dummy) {
    const { messages, timeline, ...detail } = dummy
    return toTicketDetail(detail, categories, messages, timeline)
  }
  const path = ENDPOINTS.supportTickets.admin
  const [detail, messages, timeline] = await Promise.all([
    request<ApiTicketDetail>(path.byNo(ticketNo)),
    request<ApiMessage[]>(path.messages(ticketNo)),
    request<ApiTimelineEvent[]>(path.timeline(ticketNo)),
  ])
  return toTicketDetail(detail, categories, messages, timeline)
}

export function downloadAdminTicketAttachment(ticketNo: string, attachment: { id: number; name: string }) {
  return saveAttachment(ENDPOINTS.supportTickets.admin.attachment(ticketNo, attachment.id), attachment.name)
}
