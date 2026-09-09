const ATTENDANCE_API =
  import.meta.env.VITE_ATTENDANCE_API_URL ?? '/api/v1/employee-attendances/daily'

export const STAFF_TABS = ['All', 'Present', 'On Leave', 'Absent']

export function getStatusDisplay(status) {
  const normalized = String(status ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')

  if (normalized === 'PRESENT' || normalized === 'ACTIVE') return 'Active'
  if (normalized === 'ON_LEAVE' || normalized === 'ONLEAVE') return 'On Leave'
  if (normalized === 'ABSENT') return 'Absent'
  return status || '—'
}

export function matchesTab(status, tab) {
  const normalized = String(status ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')

  if (tab === 'All') return true
  if (tab === 'Present') return normalized === 'PRESENT' || normalized === 'ACTIVE'
  if (tab === 'On Leave') return normalized === 'ON_LEAVE' || normalized === 'ONLEAVE'
  if (tab === 'Absent') return normalized === 'ABSENT'
  return true
}

export function getAttendanceTimestamp(date) {
  if (!date) return 0
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

export function formatAttendanceDate(date) {
  if (!date) return '—'
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function matchesStp(rowStp, selectedName, selectedId) {
  if (!selectedName && !selectedId) return true
  if (!rowStp) return true

  const hay = String(rowStp).toLowerCase()
  if (selectedId === 'sarai-14') {
    return hay.includes('14 mld') || hay.includes('14mld') || hay.includes('sarai-14')
  }
  if (selectedId === 'jagjeetpur-68') {
    return hay.includes('68 mld') || hay.includes('68mld') || hay.includes('jagjeetpur')
  }

  const name = String(selectedName ?? '').toLowerCase()
  if (!name) return true
  return hay.includes(name) || name.includes(hay)
}

export function mapAttendanceRow(row) {
  return {
    empId: row.empId,
    id: row.empId ? `#${row.empId}` : '—',
    name: row.empName ?? '—',
    department: row.department ?? '—',
    shift: row.shift ?? '—',
    stp: row.stp ?? '—',
    date: formatAttendanceDate(row.attendanceDate),
    dateRaw: row.attendanceDate ?? '',
    status: getStatusDisplay(row.attendanceStatus),
    attendanceStatus: row.attendanceStatus ?? '',
  }
}

export async function fetchDailyAttendance() {
  const response = await fetch(ATTENDANCE_API)
  if (!response.ok) {
    throw new Error(`Failed to fetch attendance (${response.status})`)
  }

  const json = await response.json()
  const rows = Array.isArray(json?.data) ? json.data : []
  return rows.map(mapAttendanceRow)
}
