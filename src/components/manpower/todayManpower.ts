import { staffAvailability } from '../../data/mockData'

export type TodayStaffRow = {
  id: string
  name: string
  role: string
  dept: string
  date: string
  punchTime: string
  status: 'Active' | 'On Leave' | 'Absent'
}

export const todayLabel = () => {
  const now = new Date()
  return `${now.toLocaleDateString('en-GB', { weekday: 'long' })}, ${now.toLocaleDateString('en-GB')}`
}

/** Illustrative per-STP roster until the attendance API is connected. */
export function buildTodayManpower(seed: string, stpName: string) {
  const hash = [...seed].reduce((sum, char, i) => (sum + char.charCodeAt(0) * (i + 3)) % 9973, 7)
  const capacity = Number(stpName.match(/[\d.]+/)?.[0] ?? 10)
  const required = Math.min(12, Math.max(8, Math.round(capacity / 8) + 6))
  const absentCount = hash % 3
  const leaveCount = Math.floor(hash / 3) % 3
  const date = todayLabel()

  const rank = Array.from({ length: required }, (_, i) => i)
    .sort((a, b) => ((a * 2654435761 + hash) % 1009) - ((b * 2654435761 + hash) % 1009))

  const rows: TodayStaffRow[] = Array.from({ length: required }, (_, i) => {
    const base = staffAvailability.rows[i % staffAvailability.rows.length]
    const position = rank.indexOf(i)
    const status = position < absentCount ? 'Absent' : position < absentCount + leaveCount ? 'On Leave' : 'Active'
    const punch = base.punchTime !== '—' ? base.punchTime : '09:45 AM'
    return {
      id: `#${100000 + hash * 13 + i}`,
      name: base.name,
      role: base.role,
      dept: base.dept,
      date,
      punchTime: status === 'Active' ? punch : status === 'Absent' ? 'Not punched in' : 'On leave',
      status,
    }
  })

  const present = rows.filter((r) => r.status === 'Active').length
  const absent = rows.filter((r) => r.status === 'Absent').length
  const leave = rows.filter((r) => r.status === 'On Leave').length

  return { required, present, absent, leave, shortage: Math.max(0, required - present), rows, date }
}
