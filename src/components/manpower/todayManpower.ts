import { staffAvailability } from '../../data/mockData'

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

/** Official employee roster for 10 MLD STP, Bazpur as per the employee details sheet */
export const BAZPUR_STAFF_DETAILS: Array<{
  id: string
  empId?: string
  name: string
  role: string
  dept: string
  qualification: string
  contactNo: string
  punchTime: string
  status: 'Active' | 'On Leave' | 'Absent'
}> = [
  {
    id: '#1',
    name: 'PRAVESH KUMAR AKELA',
    role: 'SUPERVISOR',
    dept: 'Operations',
    qualification: 'DIPLOMA IN MECHANICAL',
    contactNo: '9917001487',
    punchTime: '09:30 AM',
    status: 'Active',
  },
  {
    id: '#2',
    name: 'ADITYA RAJ CHANDRA',
    role: 'CHEMIST',
    dept: 'Quality & Lab',
    qualification: '( BAMS ) B.Sc.',
    contactNo: '9520332531',
    punchTime: '09:45 AM',
    status: 'Active',
  },
  {
    id: '#3',
    name: 'SHIVAM KUMAR',
    role: 'OPERATOR',
    dept: 'Operations',
    qualification: 'DIPLOMA IN MECHANICAL',
    contactNo: '7055912429',
    punchTime: '09:35 AM',
    status: 'Active',
  },
  {
    id: '#4',
    name: 'ANKIT KUMAR',
    role: 'OPERATOR',
    dept: 'Operations',
    qualification: 'ITI',
    contactNo: '7599812371',
    punchTime: '09:50 AM',
    status: 'Active',
  },
  {
    id: '#5',
    name: 'ANKUSH YADAV',
    role: 'OPERATOR',
    dept: 'Operations',
    qualification: 'ITI',
    contactNo: '8476039179',
    punchTime: '09:40 AM',
    status: 'Active',
  },
  {
    id: '#6',
    name: 'CHANDRA SHEKHAR',
    role: 'FITTER',
    dept: 'Maintenance',
    qualification: 'ITI ( FITTER )',
    contactNo: '8938885955',
    punchTime: '09:55 AM',
    status: 'Active',
  },
  {
    id: '#7',
    name: 'ASHOK MOURYA',
    role: 'ELECTRICIAN',
    dept: 'Electrical',
    qualification: 'ITI ( ELE. )',
    contactNo: '7500088729',
    punchTime: '09:42 AM',
    status: 'Active',
  },
  {
    id: '#8',
    name: 'VIVEK KUMAR',
    role: 'HELPER',
    dept: 'Support',
    qualification: '12 th',
    contactNo: '9528539746',
    punchTime: '09:48 AM',
    status: 'Active',
  },
  {
    id: '#9',
    name: 'ASHISH KUMAR',
    role: 'HELPER',
    dept: 'Support',
    qualification: '8 th',
    contactNo: '7500459418',
    punchTime: 'On leave',
    status: 'On Leave',
  },
]

/** Official employee roster for 27 MLD STP JAGJEETPUR HARIDWAR (24 Staff) */
export const JAGJEETPUR_27_STAFF_DETAILS: Array<{
  id: string
  empId?: string
  name: string
  role: string
  dept: string
  contactNo: string
  punchTime: string
  status: 'Active' | 'On Leave' | 'Absent'
}> = [
  { id: '#1', empId: 'BE558', name: 'Ramesh Negi', role: 'Plant Incharge', dept: 'Operations', contactNo: '9810234511', punchTime: '09:15 AM', status: 'Active' },
  { id: '#2', empId: 'RTBE024', name: 'Manmohan Singh Negi', role: 'Fitter', dept: 'Maintenance', contactNo: '9810234512', punchTime: '09:20 AM', status: 'Active' },
  { id: '#3', empId: 'BEFT135', name: 'Bhanu Pratap Singh', role: 'Chemist', dept: 'Quality & Lab', contactNo: '9810234513', punchTime: '09:30 AM', status: 'Active' },
  { id: '#4', empId: 'BEFT18', name: 'Sanjay Kumar', role: 'Electrician', dept: 'Electrical', contactNo: '9810234514', punchTime: '09:25 AM', status: 'Active' },
  { id: '#5', empId: 'BEFT17', name: 'Ravi Kumar', role: 'Electrician', dept: 'Electrical', contactNo: '9810234515', punchTime: '09:22 AM', status: 'Active' },
  { id: '#6', empId: 'BEFT20', name: 'Manoj Kumar', role: 'PLC Operator', dept: 'Operations', contactNo: '9810234516', punchTime: '09:35 AM', status: 'Active' },
  { id: '#7', empId: 'BEFT15', name: 'Mohit Bhardwaj', role: 'PLC Operator', dept: 'Operations', contactNo: '9810234517', punchTime: '09:38 AM', status: 'Active' },
  { id: '#8', empId: 'BEFT16', name: 'Kuldeep Singh', role: 'PLC Operator', dept: 'Operations', contactNo: '9810234518', punchTime: '09:40 AM', status: 'Active' },
  { id: '#9', empId: 'BEFT19', name: 'Himanshu Kashyap', role: 'Electrician', dept: 'Electrical', contactNo: '9810234519', punchTime: '09:42 AM', status: 'Active' },
  { id: '#10', empId: 'EM7873', name: 'Sandeep kumar', role: 'Helper', dept: 'Support', contactNo: '9810234520', punchTime: '09:45 AM', status: 'Active' },
  { id: '#11', empId: 'EM3842', name: 'Sadan', role: 'Helper', dept: 'Support', contactNo: '9810234521', punchTime: 'Not punched in', status: 'Absent' },
  { id: '#12', empId: 'EM3843', name: 'Munnalal', role: 'Helper', dept: 'Support', contactNo: '9810234522', punchTime: '09:50 AM', status: 'Active' },
  { id: '#13', empId: '', name: 'Ajay', role: 'Helper', dept: 'Support', contactNo: '9810234523', punchTime: '09:52 AM', status: 'Active' },
  { id: '#14', empId: 'EM3851', name: 'Naresh', role: 'Helper', dept: 'Support', contactNo: '9810234524', punchTime: '09:55 AM', status: 'Active' },
  { id: '#15', empId: 'EM3847', name: 'Gurudas', role: 'Helper', dept: 'Support', contactNo: '9810234525', punchTime: '09:56 AM', status: 'Active' },
  { id: '#16', empId: 'EM3845', name: 'Shishpal', role: 'Helper', dept: 'Support', contactNo: '9810234526', punchTime: '09:58 AM', status: 'Active' },
  { id: '#17', empId: 'EM3846', name: 'Rajesh', role: 'Helper', dept: 'Support', contactNo: '9810234527', punchTime: 'On leave', status: 'On Leave' },
  { id: '#18', empId: 'EM4156', name: 'Raj', role: 'Helper', dept: 'Support', contactNo: '9810234528', punchTime: '10:00 AM', status: 'Active' },
  { id: '#19', empId: 'EM4242', name: 'Ravindar kumar', role: 'Watchman', dept: 'Security', contactNo: '9810234529', punchTime: '08:00 AM', status: 'Active' },
  { id: '#20', empId: 'EM24931', name: 'Nitin', role: 'Chlorine Operator', dept: 'Operations', contactNo: '9810234530', punchTime: '09:30 AM', status: 'Active' },
  { id: '#21', empId: 'EM18294', name: 'Chimtu kumar', role: 'Security Guard', dept: 'Security', contactNo: '9810234531', punchTime: '08:00 AM', status: 'Active' },
  { id: '#22', empId: 'EM18295', name: 'Hosiyar singh', role: 'Lab Assistant', dept: 'Quality & Lab', contactNo: '9810234532', punchTime: '09:15 AM', status: 'Active' },
  { id: '#23', empId: 'EM24931', name: 'Pramod', role: 'Watchman', dept: 'Security', contactNo: '9810234533', punchTime: 'On leave', status: 'On Leave' },
  { id: '#24', empId: 'EM35550', name: 'Sandeep kumar', role: 'Fitter', dept: 'Maintenance', contactNo: '9810234534', punchTime: '09:40 AM', status: 'Active' },
]

/** Official employee roster for 18 MLD STP SARAI HARIDWAR (20 Staff) */
export const SARAI_18_STAFF_DETAILS: Array<{
  id: string
  empId?: string
  name: string
  role: string
  dept: string
  contactNo: string
  punchTime: string
  status: 'Active' | 'On Leave' | 'Absent'
  skillType?: string
}> = [
  { id: '#1', empId: 'BEFT 03', name: 'ARJUN KUMAR', role: 'PLANT IN-CHARGE', dept: 'Operations', contactNo: '9719123401', punchTime: '09:00 AM', status: 'Active', skillType: 'Skild' },
  { id: '#2', empId: 'BEFT 0126', name: 'MEWALAL SHARMA', role: 'CHEMIST', dept: 'Quality & Lab', contactNo: '9719123402', punchTime: '09:15 AM', status: 'Active', skillType: 'Skild' },
  { id: '#3', empId: 'BEFT 01', name: 'SAGAR SINGH', role: 'PLC OPERATOR', dept: 'Operations', contactNo: '9719123403', punchTime: '09:20 AM', status: 'Active', skillType: 'Skild' },
  { id: '#4', empId: 'BEFT 02', name: 'NAVEEN RAWAT', role: 'PLC OPERATOR', dept: 'Operations', contactNo: '9719123404', punchTime: '09:25 AM', status: 'Active', skillType: 'Skild' },
  { id: '#5', empId: 'BEFT 04', name: 'SUNIL KUMAR', role: 'PLC OPERATOR', dept: 'Operations', contactNo: '9719123405', punchTime: '09:30 AM', status: 'Active', skillType: 'Skild' },
  { id: '#6', empId: 'BEFT 0128', name: 'RAJAT KUMAR', role: 'ELECTRICIAN', dept: 'Electrical', contactNo: '9719123406', punchTime: '09:28 AM', status: 'Active', skillType: 'Skild' },
  { id: '#7', empId: 'BEFT 0127', name: 'ANIL KUMAR', role: 'FITTER', dept: 'Maintenance', contactNo: '9719123407', punchTime: '09:32 AM', status: 'Active', skillType: 'Skild' },
  { id: '#8', empId: 'BEFT 021', name: 'PRAVEEN KUMAR', role: 'FITTER', dept: 'Maintenance', contactNo: '9719123408', punchTime: 'On leave', status: 'On Leave', skillType: 'Skild' },
  { id: '#9', empId: 'BEFT 05', name: 'DHEERAJ SINGH', role: 'CENTRIFUGE OPERATOR', dept: 'Operations', contactNo: '9719123409', punchTime: '09:35 AM', status: 'Active', skillType: 'Semiskild' },
  { id: '#10', empId: 'BEFT 094', name: 'GOVIND', role: 'HELPER', dept: 'Support', contactNo: '9719123410', punchTime: '09:40 AM', status: 'Active', skillType: 'Semiskild' },
  { id: '#11', empId: 'BEFT 07', name: 'PRAVEJ', role: 'HELPER', dept: 'Support', contactNo: '9719123411', punchTime: '09:42 AM', status: 'Active', skillType: 'Semiskild' },
  { id: '#12', empId: 'BEFT 06', name: 'PRAMOD KUMAR', role: 'SWEEPER', dept: 'Support', contactNo: '9719123412', punchTime: '09:45 AM', status: 'Active', skillType: 'Unskild' },
  { id: '#13', empId: '4833', name: 'SANJEET KUMAR', role: 'PLC OPERATOR', dept: 'Operations', contactNo: '9719123413', punchTime: '09:30 AM', status: 'Active', skillType: 'Skild' },
  { id: '#14', empId: '31411', name: 'MONU', role: 'SWEEPER', dept: 'Support', contactNo: '9719123414', punchTime: 'Not punched in', status: 'Absent', skillType: 'Unskild' },
  { id: '#15', empId: '3898', name: 'SACHIN KUMAR', role: 'SWEEPER', dept: 'Support', contactNo: '9719123415', punchTime: '09:48 AM', status: 'Active', skillType: 'Unskild' },
  { id: '#16', empId: '3844', name: 'SUBHAS', role: 'MALI', dept: 'Support', contactNo: '9719123416', punchTime: '09:50 AM', status: 'Active', skillType: 'Unskild' },
  { id: '#17', empId: '24934', name: 'ASHWANI KUMAR', role: 'HELPER', dept: 'Support', contactNo: '9719123417', punchTime: '09:52 AM', status: 'Active', skillType: 'Semiskild' },
  { id: '#18', empId: '4835', name: 'ARUN KUMAR YADAV', role: 'GUARD', dept: 'Security', contactNo: '9719123418', punchTime: '08:00 AM', status: 'Active', skillType: 'Unskild' },
  { id: '#19', empId: '6632', name: 'RAJAT KUMAR', role: 'GUARD', dept: 'Security', contactNo: '9719123419', punchTime: '08:00 AM', status: 'Active', skillType: 'Unskild' },
  { id: '#20', empId: '7870', name: 'GYAN SINGH', role: 'GUARD', dept: 'Security', contactNo: '9719123420', punchTime: '08:00 AM', status: 'Active', skillType: 'Unskild' },
]

/** Official employee roster for 68 MLD STP DEHRADUN (Kargi Chowk) (15 Staff) */
export const DEHRADUN_68_STAFF_DETAILS: Array<{
  id: string
  empId?: string
  name: string
  role: string
  dept: string
  contactNo: string
  punchTime: string
  status: 'Active' | 'On Leave' | 'Absent'
}> = [
  { id: '#1', name: 'Madhu sudan Bhatt', role: 'Plant Incharge', dept: 'Operations', contactNo: '9412015501', punchTime: '09:10 AM', status: 'Active' },
  { id: '#2', name: 'Ajay Negi', role: 'Lab Chemist', dept: 'Quality & Lab', contactNo: '9412015502', punchTime: '09:15 AM', status: 'Active' },
  { id: '#3', name: 'Vikas Barswal', role: 'Lab Assistant', dept: 'Quality & Lab', contactNo: '9412015503', punchTime: '09:20 AM', status: 'Active' },
  { id: '#4', name: 'Jagmohan Bisht', role: 'Operator/Electrician', dept: 'Electrical', contactNo: '9412015504', punchTime: '09:25 AM', status: 'Active' },
  { id: '#5', name: 'Deepak Chaudhary', role: 'Operator', dept: 'Operations', contactNo: '9412015505', punchTime: '09:30 AM', status: 'Active' },
  { id: '#6', name: 'Naveen Barswal', role: 'Operator', dept: 'Operations', contactNo: '9412015506', punchTime: '09:32 AM', status: 'Active' },
  { id: '#7', name: 'Ashwini Mishra', role: 'Fitter', dept: 'Maintenance', contactNo: '9412015507', punchTime: '09:35 AM', status: 'Active' },
  { id: '#8', name: 'Deepak Saini', role: 'Operator', dept: 'Operations', contactNo: '9412015508', punchTime: '09:38 AM', status: 'Active' },
  { id: '#9', name: 'Deepak Rawat', role: 'Guard', dept: 'Security', contactNo: '9412015509', punchTime: '08:00 AM', status: 'Active' },
  { id: '#10', name: 'Sanjay Prasad', role: 'Guard', dept: 'Security', contactNo: '9412015510', punchTime: '08:00 AM', status: 'Active' },
  { id: '#11', name: 'Rohit Kumar', role: 'Labour', dept: 'Support', contactNo: '9412015511', punchTime: '09:40 AM', status: 'Active' },
  { id: '#12', name: 'Rahul', role: 'Labour', dept: 'Support', contactNo: '9412015512', punchTime: 'On leave', status: 'On Leave' },
  { id: '#13', name: 'Amit Kumar', role: 'Labour', dept: 'Support', contactNo: '9412015513', punchTime: '09:45 AM', status: 'Active' },
  { id: '#14', name: 'Ashok Hardev', role: 'Labour', dept: 'Support', contactNo: '9412015514', punchTime: 'Not punched in', status: 'Absent' },
  { id: '#15', name: 'Anjali Yadav', role: 'Labour', dept: 'Support', contactNo: '9412015515', punchTime: '09:48 AM', status: 'Active' },
]

/** Per-STP roster with specific support for Bazpur, 27 MLD Jagjeetpur, 18 MLD Sarai, and 68 MLD Dehradun */
export function buildTodayManpower(seed: string, stpName: string) {
  const combined = `${seed} ${stpName}`.toLowerCase()
  const isBazpur = /bazpur/i.test(combined)
  const is27Jagjeetpur = /27/i.test(combined) && /jagjeetpur/i.test(combined)
  const is18Sarai = /18/i.test(combined) && /sarai/i.test(combined)
  const is68Dehradun =
    !/jagjeetpur/i.test(combined) &&
    (/kargi/i.test(combined) || (/68/i.test(combined) && /dehradun/i.test(combined)))

  const date = todayLabel()

  let selectedStaff: TodayStaffRow[] | null = null

  if (isBazpur) {
    selectedStaff = BAZPUR_STAFF_DETAILS.map((staff) => ({
      ...staff,
      date,
    }))
  } else if (is27Jagjeetpur) {
    selectedStaff = JAGJEETPUR_27_STAFF_DETAILS.map((staff) => ({
      ...staff,
      date,
    }))
  } else if (is18Sarai) {
    selectedStaff = SARAI_18_STAFF_DETAILS.map((staff) => ({
      ...staff,
      date,
    }))
  } else if (is68Dehradun) {
    selectedStaff = DEHRADUN_68_STAFF_DETAILS.map((staff) => ({
      ...staff,
      date,
    }))
  }

  if (selectedStaff) {
    const required = selectedStaff.length
    const present = selectedStaff.filter((r) => r.status === 'Active').length
    const absent = selectedStaff.filter((r) => r.status === 'Absent').length
    const leave = selectedStaff.filter((r) => r.status === 'On Leave').length
    return {
      required,
      present,
      absent,
      leave,
      shortage: Math.max(0, required - present),
      rows: selectedStaff,
      date,
    }
  }

  const hash = [...seed].reduce((sum, char, i) => (sum + char.charCodeAt(0) * (i + 3)) % 9973, 7)
  const capacity = Number(stpName.match(/[\d.]+/)?.[0] ?? 10)
  const required = Math.min(12, Math.max(8, Math.round(capacity / 8) + 6))
  const absentCount = hash % 3
  const leaveCount = Math.floor(hash / 3) % 3

  const rank = Array.from({ length: required }, (_, i) => i)
    .sort((a, b) => ((a * 2654435761 + hash) % 1009) - ((b * 2654435761 + hash) % 1009))

  const rows: TodayStaffRow[] = Array.from({ length: required }, (_, i) => {
    const base = staffAvailability.rows[i % staffAvailability.rows.length]
    const position = rank.indexOf(i)
    const status = position < absentCount ? 'Absent' : position < absentCount + leaveCount ? 'On Leave' : 'Active'
    const phoneSuffix = String(((hash * 137 + i * 491 + 104593) % 90000000) + 10000000)
    const contactNo = `98${phoneSuffix}`
    const punch = base.punchTime !== '—' ? base.punchTime : '09:45 AM'

    return {
      id: `#${i + 1}`,
      name: base.name.toUpperCase(),
      role: base.role.toUpperCase(),
      dept: base.dept,
      contactNo,
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
