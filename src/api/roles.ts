/**
 * Role Service API client
 * Microservice endpoint: /api/roles
 */

const ROLE_API_URL = import.meta.env.VITE_ROLE_API_URL ?? 'http://45.195.229.15:18089/api'

export type LabeledValue = {
  id: string
  label: string
}

export type ModuleCatalogItem = {
  id: string
  label: string
  blurb: string
  permissions: string[]
}

export type Catalog = {
  statuses: LabeledValue[]
  permissionPresets: LabeledValue[]
  modules: ModuleCatalogItem[]
  presetGrants: Record<string, Record<string, string[]>>
}

export type RoleCardItem = {
  id: string
  name: string
  status: string
  statusLabel?: string
  description: string
  userCount: number
  permissionCount: number
  createdOn: string
  permissionPreset?: string
  permissionLabel?: string
  // Aliases for UI compatibility
  users: number
  permissions: number
}

export type RoleDetail = {
  id: string
  name: string
  description: string
  status: string
  statusLabel?: string
  permissionPreset?: string
  permissionLabel?: string
  permissionCount: number
  userCount: number
  createdOn: string
  granted: Record<string, string[]>
}

export type RoleUser = {
  id: string
  userId: string
  name: string
  email: string
  status: string
}

export type RoleUsersResponse = {
  roleId: string
  roleName: string
  users: RoleUser[]
}

export type RoleRequest = {
  name: string
  description: string
  status: string
  permissionPreset?: string
  granted?: Record<string, string[]>
}

type ApiResponseEnvelope<T> = {
  success: boolean
  status: number
  message: string
  data: T
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${ROLE_API_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  const response = await fetch(url, { ...options, headers })
  const text = await response.text()

  let payload: ApiResponseEnvelope<T> | null = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      // Non-JSON response
    }
  }

  if (!response.ok) {
    const errorMsg =
      payload?.message ||
      (payload as any)?.error ||
      `Request failed with status ${response.status}: ${response.statusText}`
    throw new Error(errorMsg)
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data
  }

  return payload as unknown as T
}

/**
 * 1. GET /api/roles - List role cards
 */
export async function fetchRoles(): Promise<RoleCardItem[]> {
  const data = await request<any[]>('/roles')
  if (!Array.isArray(data)) return []

  return data.map((item) => ({
    ...item,
    id: String(item.id),
    name: item.name || '',
    status: item.statusLabel || item.status || 'Active',
    statusLabel: item.statusLabel || item.status || 'Active',
    description: item.description || '',
    userCount: item.userCount ?? item.users ?? 0,
    permissionCount: item.permissionCount ?? item.permissions ?? 0,
    createdOn: item.createdOn || '',
    users: item.userCount ?? item.users ?? 0,
    permissions: item.permissionCount ?? item.permissions ?? 0,
  }))
}

/**
 * 2. GET /api/roles/catalog - Dropdown and permission data for Create/Edit Role
 */
export async function fetchRoleCatalog(): Promise<Catalog> {
  return request<Catalog>('/roles/catalog')
}

/**
 * 3. GET /api/roles/{id} - Get role details
 */
export async function fetchRole(id: string): Promise<RoleDetail> {
  return request<RoleDetail>(`/roles/${encodeURIComponent(id)}`)
}

/**
 * 4. GET /api/roles/{id}/users - Users assigned to a role
 */
export async function fetchRoleUsers(id: string): Promise<RoleUsersResponse> {
  return request<RoleUsersResponse>(`/roles/${encodeURIComponent(id)}/users`)
}

/**
 * 5. POST /api/roles - Create role
 */
export async function createRole(role: RoleRequest): Promise<RoleDetail> {
  return request<RoleDetail>('/roles', {
    method: 'POST',
    body: JSON.stringify(role),
  })
}

/**
 * 6. PUT /api/roles/{id} - Update role
 */
export async function updateRole(id: string, role: RoleRequest): Promise<RoleDetail> {
  return request<RoleDetail>(`/roles/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(role),
  })
}

/**
 * 7. DELETE /api/roles/{id} - Delete role
 */
export async function deleteRole(id: string): Promise<void> {
  await request<void>(`/roles/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
