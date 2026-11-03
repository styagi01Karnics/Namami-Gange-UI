/**
 * User Service API client
 * Microservice endpoint: /api/users
 */

import { authFetch } from '../auth/session'
import { API_BASE_URL, ENDPOINTS } from '../config/api'

const USER_API_URL = API_BASE_URL.user

export type UserItem = {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  name: string
  phone: string
  email: string
  role: string
  roleId?: string
  status: string
  statusLabel?: string
  lastLogin?: string
}

export type UserRequest = {
  firstName?: string
  lastName?: string
  name?: string
  phone: string
  email: string
  password?: string
  roleId?: string
  role: string
  status: string
}

export type UserPatchRequest = {
  role?: string
  roleId?: string
  status?: string
}

type ApiResponseEnvelope<T> = {
  success: boolean
  status: number
  message: string
  data: T
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${USER_API_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  const response = await authFetch(url, { ...options, headers })
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
 * GET /api/users - List users, optionally filtered by role
 */
export async function fetchUsers(params?: {
  roleId?: string
  roleName?: string
}): Promise<UserItem[]> {
  const search = new URLSearchParams()
  if (params?.roleId) search.set('roleId', params.roleId)
  if (params?.roleName && params.roleName !== 'All Roles') search.set('roleName', params.roleName)

  const query = search.toString() ? `?${search.toString()}` : ''
  const data = await request<any[]>(`${ENDPOINTS.users.list}${query}`)
  if (!Array.isArray(data)) return []

  return data.map((item) => ({
    ...item,
    id: String(item.id),
    userId: item.userId || `#${item.id}`,
    name: item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'User',
    phone: item.phone || '',
    email: item.email || '',
    role: item.role || '',
    roleId: item.roleId || '',
    status: item.statusLabel || item.status || 'Active',
    statusLabel: item.statusLabel || item.status || 'Active',
    lastLogin: item.lastLogin || '—',
  }))
}

/**
 * GET /api/users/{id} - Get user details
 */
export async function fetchUser(id: string): Promise<UserItem> {
  return request<UserItem>(ENDPOINTS.users.byId(id))
}

/**
 * POST /api/users - Create user
 */
export async function createUser(user: UserRequest): Promise<UserItem> {
  return request<UserItem>(ENDPOINTS.users.list, {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

/**
 * PUT /api/users/{id} - Full update user
 */
export async function updateUser(id: string, user: UserRequest): Promise<UserItem> {
  return request<UserItem>(ENDPOINTS.users.byId(id), {
    method: 'PUT',
    body: JSON.stringify(user),
  })
}

/**
 * PATCH /api/users/{id} - Partial update user (role, status)
 */
export async function patchUser(id: string, patch: UserPatchRequest): Promise<UserItem> {
  return request<UserItem>(ENDPOINTS.users.byId(id), {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

/**
 * DELETE /api/users/{id} - Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  await request<void>(ENDPOINTS.users.byId(id), {
    method: 'DELETE',
  })
}

/**
 * GET /api/users/count - Count users by role
 */
export async function countUsersByRole(params?: {
  roleId?: string
  roleName?: string
}): Promise<number> {
  const search = new URLSearchParams()
  if (params?.roleId) search.set('roleId', params.roleId)
  if (params?.roleName) search.set('roleName', params.roleName)

  const query = search.toString() ? `?${search.toString()}` : ''
  return request<number>(`${ENDPOINTS.users.count}${query}`)
}
