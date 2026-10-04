const ROLE_API = import.meta.env.VITE_ROLE_API_URL ?? '/role-api'

export type RoleStatus = 'Active' | 'Inactive'

export type TeamRole = {
  id: string
  name: string
  status: RoleStatus | string
  description: string
  users: number
  permissions: number
  createdOn: string
  template?: string
  permissionPreset?: string
  granted?: Record<string, string[]>
}

export type RoleCatalogModule = {
  id: string
  label: string
  blurb: string
  permissions: string[]
  color?: string
  icon?: string
}

export type RoleCatalog = {
  statuses: string[]
  permissionPresets: string[]
  modules: RoleCatalogModule[]
  presetGrants: Record<string, Record<string, string[]>>
}

type ApiEnvelope<T> = {
  success?: boolean
  status?: number
  message?: string
  data?: T
}

type RoleCardDto = {
  id: string
  name: string
  status?: string
  statusLabel?: string
  description?: string
  userCount?: number
  permissionCount?: number
  createdOn?: string
  permissionPreset?: string | null
  permissionLabel?: string | null
  granted?: Record<string, string[]>
}

type CatalogDto = {
  statuses?: Array<{ id: string; label: string }>
  permissionPresets?: Array<{ id: string; label: string }>
  modules?: Array<{ id: string; label: string; blurb?: string; permissions?: string[] }>
  presetGrants?: Record<string, Record<string, string[]>>
}

const MODULE_META: Record<string, { color: string; icon: string }> = {
  dashboard: { color: '#2563EB', icon: 'dashboard' },
  stp: { color: '#15803D', icon: 'building' },
  cctv: { color: '#B45309', icon: 'camera' },
  support: { color: '#7C3AED', icon: 'support' },
  reports: { color: '#DC2626', icon: 'reports' },
  team: { color: '#EA580C', icon: 'team' },
  settings: { color: '#15803D', icon: 'settings' },
}

async function readEnvelope<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || body.success === false) {
    throw new Error(body.message || 'Role request failed')
  }
  return body.data as T
}

function toStatusLabel(status?: string, statusLabel?: string) {
  if (statusLabel) return statusLabel
  if (status?.toUpperCase() === 'INACTIVE') return 'Inactive'
  return 'Active'
}

export function toTeamRole(card: RoleCardDto): TeamRole {
  return {
    id: card.id,
    name: card.name,
    status: toStatusLabel(card.status, card.statusLabel),
    description: card.description ?? '',
    users: card.userCount ?? 0,
    permissions: card.permissionCount ?? 0,
    createdOn: card.createdOn ?? '',
    template: card.permissionLabel ?? '',
    permissionPreset: card.permissionPreset ?? '',
    granted: card.granted,
  }
}

function toRoleRequest(payload: {
  name: string
  description: string
  status: string
  template?: string
  permissionPreset?: string
  granted?: Record<string, string[]>
}) {
  return {
    name: payload.name,
    description: payload.description,
    status: payload.status,
    permissionPreset: payload.permissionPreset || payload.template || null,
    granted: payload.granted ?? {},
  }
}

export async function fetchRoles(): Promise<TeamRole[]> {
  const response = await fetch(`${ROLE_API}/roles`)
  const data = await readEnvelope<RoleCardDto[]>(response)
  return (data ?? []).map(toTeamRole)
}

export async function fetchRole(id: string): Promise<TeamRole> {
  const response = await fetch(`${ROLE_API}/roles/${id}`)
  return toTeamRole(await readEnvelope<RoleCardDto>(response))
}

export async function fetchRoleCatalog(): Promise<RoleCatalog> {
  const response = await fetch(`${ROLE_API}/roles/catalog`)
  const data = await readEnvelope<CatalogDto>(response)
  const presets = data.permissionPresets ?? []

  const presetGrants: Record<string, Record<string, string[]>> = {}
  presets.forEach((preset) => {
    presetGrants[preset.label] = data.presetGrants?.[preset.id] ?? {}
  })

  return {
    statuses: (data.statuses ?? []).map((item) => item.label),
    permissionPresets: presets.map((item) => item.label),
    presetGrants,
    modules: (data.modules ?? []).map((module) => ({
      id: module.id,
      label: module.label,
      blurb: module.blurb ?? '',
      permissions: module.permissions ?? [],
      ...(MODULE_META[module.id] ?? { color: '#2563EB', icon: 'dashboard' }),
    })),
  }
}

export async function createRole(payload: {
  name: string
  description: string
  status: string
  template?: string
  permissionPreset?: string
  granted?: Record<string, string[]>
}): Promise<TeamRole> {
  const response = await fetch(`${ROLE_API}/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toRoleRequest(payload)),
  })
  return toTeamRole(await readEnvelope<RoleCardDto>(response))
}

export async function updateRole(
  id: string,
  payload: {
    name: string
    description: string
    status: string
    template?: string
    permissionPreset?: string
    granted?: Record<string, string[]>
  },
): Promise<TeamRole> {
  const response = await fetch(`${ROLE_API}/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toRoleRequest(payload)),
  })
  return toTeamRole(await readEnvelope<RoleCardDto>(response))
}

export async function deleteRole(id: string): Promise<void> {
  const response = await fetch(`${ROLE_API}/roles/${id}`, { method: 'DELETE' })
  await readEnvelope<unknown>(response)
}

export async function fetchRoleUsers(id: string) {
  const response = await fetch(`${ROLE_API}/roles/${id}/users`)
  return readEnvelope<{ roleId: string; roleName: string; users: Array<Record<string, string>> }>(response)
}
