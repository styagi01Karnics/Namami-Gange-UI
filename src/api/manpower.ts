import { authFetch } from '../auth/session'
import { API_BASE_URL, ENDPOINTS } from '../config/api'
import { STP_DETAIL_PLANT_CODES } from './cctv'
import { PLANT_CODE_TO_STP_ID } from './plants'
import { todayLabel, type TodayStaffRow } from '../components/manpower/todayManpower'

type ManpowerRecord = {
  id: number
  stpId: number
  employeeName?: string | null
  designation?: string | null
  qualification?: string | null
  contactNo?: string | null
  department?: string | null
  status?: string | null
}

/** The manpower API is keyed by the /stp-details `id`, which is the plantCode's index in this list. */
export function resolveManpowerStpId(plantCode?: string, stpId?: string): number | null {
  let code = plantCode
  if (!code && stpId) {
    code = Object.keys(PLANT_CODE_TO_STP_ID).find((key) => PLANT_CODE_TO_STP_ID[key] === stpId)
  }
  const index = code ? STP_DETAIL_PLANT_CODES.indexOf(code) : -1
  return index >= 0 ? index : null
}

function toStaffStatus(status?: string | null): TodayStaffRow['status'] {
  const value = (status ?? '').trim().toLowerCase()
  if (value.includes('leave')) return 'On Leave'
  if (value === 'active' || value === 'present') return 'Active'
  return 'Absent'
}

/** Staff rows for one STP from the manpower API; null when the request fails. */
export async function fetchManpowerRows(stpDetailId: number): Promise<TodayStaffRow[] | null> {
  try {
    const response = await authFetch(`${API_BASE_URL.stpDetails}${ENDPOINTS.manpower.byStp(stpDetailId)}`)
    if (!response.ok) return null

    const payload = await response.json()
    const records: ManpowerRecord[] = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
    const date = todayLabel()

    return records.map((record, index) => ({
      id: `#${index + 1}`,
      name: record.employeeName?.trim() || '—',
      role: record.designation?.trim() || '—',
      dept: record.department?.trim() || '—',
      contactNo: record.contactNo?.trim() || undefined,
      qualification: record.qualification?.trim() || undefined,
      date,
      punchTime: '—',
      status: toStaffStatus(record.status),
    }))
  } catch {
    return null
  }
}
