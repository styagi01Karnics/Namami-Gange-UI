const USER_API = import.meta.env.VITE_USER_API_URL ?? '/user-api'

export type UserStatus = 'Active' | 'Inactive'

export type TeamUser = {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  name: string
  phone: string
  email: string
  role: string
  roleId?: string
  status: UserStatus | string
  lastLogin: string
}

type ApiEnvelope<T> = {
  success?: boolean
  status?: number
  message?: string
  data?: T
}

type UserDto = {
  id: string
  userId?: string
  firstName?: string
  lastName?: string
  name: string
  phone?: string
  email?: string
  role?: string
  roleId?: string
  status?: string
  statusLabel?: string
  lastLogin?: string
}

export type UserWritePayload = {
  firstName?: string
  lastName?: string
  name: string
  phone: string
  email: string
  password?: string
  role: string
  roleId?: string
  status: string
}

async function readEnvelope<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || body.success === false) {
    throw new Error(body.message || 'User request failed')
  }
  return body.data as T
}

function toStatusLabel(status?: string, statusLabel?: string) {
  if (statusLabel) return statusLabel
  if (status?.toUpperCase() === 'INACTIVE') return 'Inactive'
  return 'Active'
}

export function toTeamUser(user: UserDto): TeamUser {
  return {
    id: user.id,
    userId: user.userId ?? '',
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    phone: user.phone ?? '',
    email: user.email ?? '',
    role: user.role ?? '',
    roleId: user.roleId,
    status: toStatusLabel(user.status, user.statusLabel),
    lastLogin: user.lastLogin || '—',
  }
}

export async function fetchUsers(filters?: { roleId?: string; roleName?: string }): Promise<TeamUser[]> {
  const params = new URLSearchParams()
  if (filters?.roleId) params.set('roleId', filters.roleId)
  if (filters?.roleName) params.set('roleName', filters.roleName)
  const query = params.toString()
  const response = await fetch(`${USER_API}/users${query ? `?${query}` : ''}`)
  const data = await readEnvelope<UserDto[]>(response)
  return (data ?? []).map(toTeamUser)
}

export async function createUser(payload: UserWritePayload): Promise<TeamUser> {
  const response = await fetch(`${USER_API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return toTeamUser(await readEnvelope<UserDto>(response))
}

export async function updateUser(id: string, payload: UserWritePayload): Promise<TeamUser> {
  const response = await fetch(`${USER_API}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return toTeamUser(await readEnvelope<UserDto>(response))
}

export async function patchUser(
  id: string,
  payload: { role?: string; roleId?: string; status?: string },
): Promise<TeamUser> {
  const response = await fetch(`${USER_API}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return toTeamUser(await readEnvelope<UserDto>(response))
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${USER_API}/users/${id}`, { method: 'DELETE' })
  await readEnvelope<unknown>(response)
}
