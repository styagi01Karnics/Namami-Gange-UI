import { fetchStpDetailRecords, STP_DETAIL_PLANT_CODES, type StpDetail } from '../api/cctv'
import { fetchPermissionCatalog, fetchRole } from '../api/roles'

/** Dashboard plant codes that differ from the canonical `STP_DETAIL_PLANT_CODES` entry. */
const PLANT_CODE_ALIASES: Record<string, string> = {
  'map-bazpur-10': '10mldbazpur',
  'map-kashipur-10': '10mldkashipur',
  'map-sarai-upgrade-18': '18mldsarai_upg',
  'map-jagjeetpur-18': '18mldjag',
  'map-jagjeetpur-upgrade-27': '27mldjag_upg',
  'map-haldwani-28': '28mldindira',
}

export const NO_STP_ACCESS_MESSAGE = 'You do not have access to this STP'

/** Plant codes of the STP details a role can access (the `stpDetail` ids are the role's `stpIds`). */
export function plantCodesForStpDetails(details: StpDetail[]): Set<string> {
  const codes = new Set<string>()
  for (const detail of details) {
    const code = STP_DETAIL_PLANT_CODES[detail.id]
    if (code) codes.add(code)
  }
  return codes
}

export function canAccessStp(allowedPlantCodes: ReadonlySet<string>, plantCode?: string | null): boolean {
  const key = plantCode?.trim().toLowerCase()
  if (!key) return false
  return allowedPlantCodes.has(PLANT_CODE_ALIASES[key] ?? key)
}

export type RoleAccess = {
  roleName: string
  /** moduleId → permission keys, built from the role's permissionIds and the permission catalog. */
  permissions: Record<string, string[]>
  stpDetails: StpDetail[]
}

/**
 * Resolves everything the session needs from the login `roleId`:
 * role details → permissionIds → permission catalog, and allStps / stpIds → STP details.
 */
export async function loadRoleAccess(roleId: string): Promise<RoleAccess> {
  const [role, catalog, details] = await Promise.all([
    fetchRole(roleId),
    fetchPermissionCatalog(),
    fetchStpDetailRecords(),
  ])

  const permissionIds = new Set(role.permissionIds ?? [])
  const permissions: Record<string, string[]> = {}
  for (const entry of catalog) {
    if (!entry.active || !permissionIds.has(entry.id)) continue
    permissions[entry.moduleId] = [...(permissions[entry.moduleId] ?? []), entry.permissionKey]
  }

  const stpIds = new Set((role.stpIds ?? []).map(Number))
  const stpDetails = role.allStps ? details : details.filter((detail) => stpIds.has(detail.id))

  return { roleName: role.name, permissions, stpDetails }
}
