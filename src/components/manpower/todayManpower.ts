export type TodayStaffRow = {
  id: string
  empId?: string
  name: string
  role: string
  dept: string
  date: string
  punchTime: string
  status: 'Active' | 'On Leave' | 'Absent'
  qualification?: string
  contactNo?: string
  skillType?: string
}

export const todayLabel = () => {
  const now = new Date()
  return `${now.toLocaleDateString('en-GB', { weekday: 'long' })}, ${now.toLocaleDateString('en-GB')}`
}
