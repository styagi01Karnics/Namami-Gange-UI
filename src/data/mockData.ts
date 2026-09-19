/* ==========================================================================
   SINGLE SOURCE OF MOCK DATA
   --------------------------------------------------------------------------
   Every hard-coded value rendered anywhere in the app lives in this file.
   When the APIs are ready, replace each export with the response of its
   endpoint (shapes below are already the shapes the components consume) —
   no component needs to change.

   Sections
     1. Shared          — user, STP picker options
     2. Dashboard       — /dashboard
     3. STP Management  — /stp-management
   ========================================================================== */

/* ==========================================================================
   1. SHARED
   ========================================================================== */

export const currentUser = {
  name: 'Rajesh Nair',
  role: 'Super Admin',
}

export const stateOptions = [
  'All States',
  'Uttar Pradesh',
  'Uttarakhand',
  'Bihar',
  'West Bengal',
  'Jharkhand',
]

export const defaultDateRange = '6 May 2026 - 6 June 2026'

/** Options for the STP picker at the top of STP Management. */
export const stpOptions = [
  { id: 'sarai-14', label: '14 MLD STP, Sarai' },
  { id: 'lakkar-ghat-26', label: '26 MLD STP, Lakkar Ghat' },
  { id: 'jagjeetpur-68', label: '68 MLD STP, Jagjeetpur' },
  { id: 'sarai-18', label: '18 MLD STP, Sarai' },
  { id: 'kankhal-27', label: '27 MLD STP, Kankhal' },
  { id: 'bhagwanpur-5', label: '5 MLD STP, Bhagwanpur' },
]

/* ==========================================================================
   2. DASHBOARD
   ========================================================================== */

export const stpSummary = {
  total: 48,
  breakdown: [
    { key: 'operational', label: 'Online', value: 35, tone: 'ok' },
    { key: 'nonOperational', label: 'Offline', value: 4, tone: 'slate' },
    { key: 'maintenance', label: 'Delay', value: 6, tone: 'warn' },
    { key: 'critical', label: 'Critical', value: 4, tone: 'danger' },
  ],
}

export const compliance = {
  percent: 92.4,
  scopeLabel: "Across all 48 STP's",
  barPercent: 88,
  reasons: [
    { key: 'parameter', label: 'Parameter Breach', stps: 18, penalty: '₹70 k', tone: 'brand' },
    { key: 'equipment', label: 'Equipment Failure', stps: 7, penalty: '₹30 k', tone: 'brandLight' },
  ],
}

export const manpower = {
  stats: [
    { label: 'Required', value: 320, tone: 'ink' },
    { label: 'Total Manpower', value: 300, tone: 'ok' },
    { label: 'Shortage', value: 20, tone: 'warn' },
  ],
  attendance: [
    { key: 'present', label: 'Present', value: 250, percent: '83.33%', color: '#2E9E5B' },
    { key: 'absent', label: 'Absent', value: 30, percent: '10%', color: '#E5484D' },
    { key: 'leave', label: 'On Leave', value: 20, percent: '6.67%', color: '#F5B417' },
  ],
}

export const inletFlow = {
  title: 'Total Inlet Flow',
  fillPercent: 78.5,
  currentFlow: '7246.5 m³/hr',
  capacity: '10,000 KL',
  occupancy: '7,850 KL',
}

export const outletFlow = {
  title: 'Total Outlet Flow',
  fillPercent: 78.5,
  currentFlow: '9082.7 m³/hr',
  capacity: '10,000 KL',
  occupancy: '7,850 KL',
}

// `fill` is the bar width in percent — the small shares keep a visible stub.
export const inventoryStock = {
  total: 1254,
  rows: [
    { key: 'adequate', label: 'Adequate Stock', value: 1516, percent: '92.1%', fill: 92.1, tone: 'ok' },
    { key: 'low', label: 'Low Stock', value: 24, percent: '1.9%', fill: 10, tone: 'danger' },
    { key: 'out', label: 'Out of Stock', value: 8, percent: '0.6%', fill: 5, tone: 'warn' },
  ],
}

// 1 May → 7 May, sampled every ~8h so the curve reads as smooth as the artwork.
export const flowTrend = [
  { t: '1 May', inlet: 340, outlet: 620 },
  { t: '1 May 08', inlet: 420, outlet: 700 },
  { t: '1 May 16', inlet: 470, outlet: 820 },
  { t: '2 May', inlet: 520, outlet: 900 },
  { t: '2 May 08', inlet: 500, outlet: 860 },
  { t: '2 May 16', inlet: 560, outlet: 940 },
  { t: '3 May', inlet: 900, outlet: 1210 },
  { t: '3 May 08', inlet: 700, outlet: 1120 },
  { t: '3 May 16', inlet: 540, outlet: 900 },
  { t: '4 May', inlet: 600, outlet: 1010 },
  { t: '4 May 08', inlet: 760, outlet: 1180 },
  { t: '4 May 16', inlet: 680, outlet: 1060 },
  { t: '5 May', inlet: 720, outlet: 1160 },
  { t: '5 May 08', inlet: 860, outlet: 1290 },
  { t: '5 May 16', inlet: 780, outlet: 1150 },
  { t: '6 May', inlet: 700, outlet: 1210 },
  { t: '6 May 08', inlet: 640, outlet: 1080 },
  { t: '6 May 16', inlet: 700, outlet: 1130 },
  { t: '7 May', inlet: 760, outlet: 1190 },
]

export const flowTrendTicks = ['1 May', '2 May', '3 May', '4 May', '5 May', '6 May', '7 May']
export const flowTrendRanges = ['Weekly', 'Daily', 'Monthly']

export const criticalStps = {
  tabs: ['Parameter Breach', 'Equipment Failure'],
  'Parameter Breach': [
    { name: 'pH', stps: 12, delta: '>13.3%' },
    { name: 'BOD', stps: 10, delta: '>23.3%' },
    { name: 'COD', stps: 8, delta: '>16.0%' },
    { name: 'TSS', stps: 12, delta: '>15.2%' },
    { name: 'Ammonia', stps: 6, delta: '>9.4%' },
  ],
  'Equipment Failure': [
    { name: 'Blower', stps: 9, delta: '>18.1%' },
    { name: 'Aerator', stps: 7, delta: '>12.6%' },
    { name: 'Pump', stps: 6, delta: '>11.2%' },
    { name: 'Flow Meter', stps: 5, delta: '>8.7%' },
    { name: 'Dosing Unit', stps: 3, delta: '>4.5%' },
  ],
}

/* ==========================================================================
   3. STP MANAGEMENT
   ========================================================================== */

/** Header card. Keyed by the id used in `stpOptions` so the picker can swap it. */
export const stpDetails = {
  'sarai-14': {
    name: '14 MLD STP, Sarai',
    status: 'Online',
    address: 'Haridwar, Uttarakhand, 249401, India',
    createdOn: '15/02/2026 ,10:30 AM',
    lastSeen: '15/04/2026 ,10:30 AM',
    penalty: { amount: '₹7,000', reason: 'Parameter Breach' },
    inCharge: {
      name: 'Sanjay kumar',
      phone: '+91 8006358423',
      email: 'sanjaykumar.tungalsingh@wabag.in',
      role: 'Plant In charge',
    },
    vendor: { name: 'AAXIS NANO TECHNOLOGIES PVT  LTD', prefixId: '1mldfd4p2' },
    site: { state: 'Uttarakhand', city: 'Haridwar', zip: '286073', lat: '29.94569', lng: '78.16425' },
  },
  'lakkar-ghat-26': {
    name: '26 MLD STP, Lakkar Ghat',
    status: 'Online',
    address: 'Lakkar Ghat, Rishikesh, Uttarakhand, 249201, India',
    createdOn: '08/01/2026 ,08:45 AM',
    lastSeen: '15/04/2026 ,10:29 AM',
    penalty: { amount: '₹4,500', reason: 'Parameter Breach' },
    inCharge: {
      name: 'K. Semwal',
      phone: '+91 98110 33418',
      email: 'k.semwal@uttarakhandpeyjal.in',
      role: 'Plant In charge',
    },
    vendor: { name: 'Ganga Enviro Systems Pvt. Ltd.', prefixId: '26mldlkgt2' },
    site: { state: 'Uttarakhand', city: 'Rishikesh', zip: '249201', lat: '30.08690', lng: '78.26760' },
  },
  'jagjeetpur-68': {
    name: '68 MLD STP, Jagjeetpur',
    status: 'Online',
    address: 'Jagjeetpur, Haridwar, Uttarakhand, 249408, India',
    createdOn: '02/01/2026 ,09:15 AM',
    lastSeen: '15/04/2026 ,10:28 AM',
    penalty: { amount: '₹12,500', reason: 'Equipment Failure' },
    inCharge: {
      name: 'M. Iyer',
      phone: '+91 98110 55310',
      email: 'm.iyer@upjalnigam.in',
      role: 'Plant In charge',
    },
    vendor: { name: 'Nirmal Infratech Pvt. Ltd.', prefixId: '68mldjgt1' },
    site: { state: 'Uttarakhand', city: 'Haridwar', zip: '249408', lat: '29.94520', lng: '78.16480' },
  },
  'sarai-18': {
    name: '18 MLD STP, Sarai',
    status: 'Under Maintenance',
    address: 'Sarai, Haridwar, Uttarakhand, 249401, India',
    createdOn: '11/03/2026 ,11:40 AM',
    lastSeen: '14/04/2026 ,06:05 PM',
    penalty: { amount: '₹3,200', reason: 'Parameter Breach' },
    inCharge: {
      name: 'S. Rawat',
      phone: '+91 98110 77841',
      email: 's.rawat@uttarakhandpeyjal.in',
      role: 'Plant In charge',
    },
    vendor: { name: 'Aqua Controls India Pvt. Ltd.', prefixId: '18mldsar3' },
    site: { state: 'Uttarakhand', city: 'Haridwar', zip: '249401', lat: '29.94610', lng: '78.16390' },
  },
  'kankhal-27': {
    name: '27 MLD STP, Kankhal',
    status: 'Online',
    address: 'Kankhal, Haridwar, Uttarakhand, 249408, India',
    createdOn: '28/12/2025 ,08:00 AM',
    lastSeen: '15/04/2026 ,10:31 AM',
    penalty: { amount: '₹0', reason: 'No active penalty' },
    inCharge: {
      name: 'D. Chauhan',
      phone: '+91 98110 90222',
      email: 'd.chauhan@upjalnigam.in',
      role: 'Plant In charge',
    },
    vendor: { name: 'Eco Smart Solutions Pvt. Ltd.', prefixId: '27mldknh4' },
    site: { state: 'Uttarakhand', city: 'Haridwar', zip: '249408', lat: '29.93210', lng: '78.14840' },
  },
  'bhagwanpur-5': {
    name: '5 MLD STP, Bhagwanpur',
    status: 'Offline',
    address: 'Bhagwanpur, Haridwar, Uttarakhand, 247661, India',
    createdOn: '20/02/2026 ,02:10 PM',
    lastSeen: '10/04/2026 ,04:45 PM',
    penalty: { amount: '₹18,000', reason: 'Equipment Failure' },
    inCharge: {
      name: 'P. Negi',
      phone: '+91 98110 61093',
      email: 'p.negi@uttarakhandpeyjal.in',
      role: 'Plant In charge',
    },
    vendor: { name: 'Bharat Chem Distributors', prefixId: '5mldbgp6' },
    site: { state: 'Uttarakhand', city: 'Haridwar', zip: '247661', lat: '29.93880', lng: '77.81820' },
  },
}

/**
 * Influent / Effluent stream chrome, shared by the "Realtime Parameter Values"
 * and "Parameter Trend Analysis" panels.
 */
export const stpStreams = [
  { key: 'influent', title: 'Influent', subtitle: 'Incoming (Raw Water)', tone: 'brand', icon: 'in' },
  { key: 'effluent', title: 'Effluent', subtitle: 'Treated (Outgoing Water)', tone: 'ok', icon: 'out' },
]

/** "Realtime Parameter Values" accordion — one flow headline + 6 tiles per stream. */
export const stpRealtime = {
  at: '19 May 2026, 05:30 PM',
  influent: {
    flow: { value: '748.83', unit: 'm³/hr' },
    params: [
      { key: 'bod', label: 'BOD', icon: 'bod', value: '394.74 mg/L', tone: 'breach', note: 'Ideal: 0 – 10' },
      { key: 'ph', label: 'pH', icon: 'ph', value: '7.48 pH', tone: 'breach', note: 'Ideal: 5.5 - 9' },
      { key: 'totalizer', label: 'Totalizer', icon: 'totalizer', value: '7577.16 m³', tone: 'ok', note: '(54.12%)' },
      { key: 'tss', label: 'TSS', icon: 'tss', value: '114.34 mg/L', tone: 'breach', note: 'Ideal: 0 – 20' },
      { key: 'cod', label: 'COD', icon: 'cod', value: '852.44 mg/L', tone: 'breach', note: 'Ideal: 0 – 50' },
      { key: 'no3n', label: 'NO₃-N', icon: 'no3n', value: '6 mg/L', tone: 'ok', note: 'Ideal: 0 – 10' },
    ],
  },
  effluent: {
    flow: { value: '6492.05', unit: 'm³/hr' },
    params: [
      { key: 'bod', label: 'BOD', icon: 'bod', value: '4.51 mg/L', tone: 'ok', note: 'Ideal: 0 – 10' },
      { key: 'ph', label: 'pH', icon: 'ph', value: '7.6 pH', tone: 'ok', note: 'Ideal: 5.5 - 9' },
      { key: 'totalizer', label: 'Totalizer', icon: 'totalizer', value: '7577.16 m³', tone: 'ok', note: '(54.12%)' },
      { key: 'tss', label: 'TSS', icon: 'tss', value: '134 mg/L', tone: 'breach', note: 'Ideal: 0 – 20' },
      { key: 'cod', label: 'COD', icon: 'cod', value: '24.12 mg/L', tone: 'ok', note: 'Ideal: 0 – 50' },
      { key: 'no3n', label: 'NO₃-N', icon: 'no3n', value: '6 mg/L', tone: 'ok', note: 'Ideal: 0 – 10' },
    ],
  },
}

/** Deterministic sparkline shape — Sparkline normalises, so raw units don't matter. */
const wiggle = (seed, n = 34) =>
  Array.from(
    { length: n },
    (_, i) => Math.sin(i / 3.4 + seed) + 0.42 * Math.sin(i / 1.55 + seed * 1.7) + 0.024 * i,
  )

export const stpTrendRanges = ['7D', '24H', '3M']

/** "Parameter Trend Analysis" accordion — one sparkline row per parameter, per stream. */
export const stpTrends = {
  at: '19 May 2026, 05:30 PM',
  influent: {
    rows: [
      { key: 'ph', label: 'pH', unit: 'pH', value: '7.48', tone: 'ok', color: '#1668E3', points: wiggle(0.4) },
      { key: 'bod', label: 'BOD', unit: 'mg/L', value: '394.74 mg/L', tone: 'breach', color: '#7C5CFC', points: wiggle(1.1) },
      { key: 'cod', label: 'COD', unit: 'mg/L', value: '852.44 mg/L', tone: 'breach', color: '#2E9E5B', points: wiggle(1.8) },
      { key: 'tss', label: 'TSS', unit: 'mg/L', value: '114.34 mg/L', tone: 'breach', color: '#EE9B2C', points: wiggle(2.5) },
      { key: 'no3n', label: 'NO₃-N', unit: 'mg/L', value: '6 mg/L', tone: 'ok', color: '#B4483A', points: wiggle(3.2) },
      { key: 'flow', label: 'Flow Rate', unit: 'm³/hr', value: '748.83 m³/hr', tone: 'ink', color: '#5AA7F0', points: wiggle(3.9) },
      { key: 'totalizer', label: 'Totalizer', unit: 'm³', value: '7577.16 m³', tone: 'ink', color: '#8B5CF6', points: wiggle(4.6) },
    ],
  },
  effluent: {
    rows: [
      { key: 'ph', label: 'pH', unit: 'pH', value: '7.6 pH', tone: 'ok', color: '#1668E3', points: wiggle(0.7) },
      { key: 'bod', label: 'BOD', unit: 'mg/L', value: '4.51 mg/L', tone: 'ok', color: '#7C5CFC', points: wiggle(1.4) },
      { key: 'cod', label: 'COD', unit: 'mg/L', value: '24.12 mg/L', tone: 'ok', color: '#2E9E5B', points: wiggle(2.1) },
      { key: 'tss', label: 'TSS', unit: 'mg/L', value: '134 mg/L', tone: 'breach', color: '#EE9B2C', points: wiggle(2.8) },
      { key: 'no3n', label: 'NO₃-N', unit: 'mg/L', value: '6 mg/L', tone: 'ok', color: '#B4483A', points: wiggle(3.5) },
      { key: 'flow', label: 'Flow Rate', unit: 'm³/hr', value: '6492.05 m³/hr', tone: 'ink', color: '#5AA7F0', points: wiggle(4.2) },
      { key: 'totalizer', label: 'Totalizer', unit: 'm³', value: '7577.16 m³', tone: 'ink', color: '#8B5CF6', points: wiggle(4.9) },
    ],
  },
}

export const stpSectionTabs = [
  'Manpower',
  'Inventory',
  'CCTV',
  'Remote Calibration',
  'Transaction Logs',
  'Contracts',
  'Compliance',
  'Billing',
]

/* ---- Billing (STP Management tab) ---------------------------------------
   Vendor → SMCG approval → penalty → final payment workflow.
   ------------------------------------------------------------------------ */

export const stpBilling = {
  steps: [
    {
      key: 'raised',
      title: 'Amount Raised By the Vendor',
      amount: '₹5,00,000',
      status: 'Raised',
      tone: 'warn',
      dateLabel: 'Raised On',
      date: '15/02/2026',
      icon: 'money',
    },
    {
      key: 'approved',
      title: 'Amount Approved by SMCG',
      amount: '₹4,80,000',
      status: 'Approved',
      tone: 'brand',
      dateLabel: 'Approved On',
      date: '15/02/2026',
      icon: 'check',
    },
    {
      key: 'penalty',
      title: 'Penalty Imposed',
      amount: '₹20,000',
      status: 'Applied',
      tone: 'danger',
      dateLabel: 'Approved On',
      date: '15/02/2026',
      icon: 'alert',
    },
    {
      key: 'payable',
      title: 'Final Amount Payable',
      amount: '₹4,60,000',
      status: 'Paid',
      tone: 'ok',
      dateLabel: 'Approved On',
      date: '15/02/2026',
      icon: 'wallet',
    },
  ],
}

/** "Calculation Summary" strip — how the payable figure is arrived at. */
export const stpBillingSummary = {
  terms: [
    { key: 'approved', label: 'Approved Amount', value: '₹5,00,000', tone: 'ink', operator: '−' },
    { key: 'penalty', label: 'Penalty Imposed', value: '₹20,000', tone: 'danger', operator: '=' },
    { key: 'final', label: 'Final Payable', value: '₹4,60,000', tone: 'ok' },
  ],
  paymentStatus: 'Successful',
}

/** "Billing Logs" table — one settlement row per month. */
export const billingLogColumns = [
  { key: 'month', label: 'Month', width: '12%' },
  { key: 'raised', label: 'Amt. Raised By the Vendor', width: '20%' },
  { key: 'approved', label: 'Amount Approved by SMCG', width: '20%' },
  { key: 'penalty', label: 'Penalty Imposed', width: '16%' },
  { key: 'payable', label: 'Final Amount Payable', width: '18%' },
  { key: 'status', label: 'Payment Status', width: '14%' },
]

/** Each money cell carries its own date, shown under the amount. */
export const billingLogRows = [
  {
    id: 'jan',
    month: 'Jan',
    raised: { amount: '₹5,00,000', date: '01/01/2026' },
    approved: { amount: '₹4,80,000', date: '01/01/2026' },
    penalty: { amount: '₹20,000', date: '01/01/2026' },
    payable: { amount: '₹4,60,000', date: '01/01/2026' },
    status: 'Successful',
  },
  {
    id: 'feb',
    month: 'Feb',
    raised: { amount: '₹6,00,000', date: '01/02/2026' },
    approved: { amount: '₹4,50,000', date: '01/02/2026' },
    penalty: { amount: '₹20,000', date: '01/02/2026' },
    payable: { amount: '₹4,30,000', date: '01/02/2026' },
    status: 'Pending',
  },
  {
    id: 'mar',
    month: 'March',
    raised: { amount: '₹7,00,000', date: '01/03/2026' },
    approved: { amount: '₹3,00,000', date: '01/03/2026' },
    penalty: null,
    payable: { amount: '₹3,00,000', date: '01/03/2026' },
    status: 'Pending',
  },
]

/* ---- Manpower ----------------------------------------------------------
   Shared by the standalone /manpower page AND the Manpower tab inside
   STP Management — both render components/manpower/ManpowerTab.
   ------------------------------------------------------------------------ */

export const stpManpower = {
  totalEmployees: 98,
  scopeLabel: 'Across all location',
  // drives both the gauge segments and the legend
  breakdown: [
    { key: 'present', label: 'Present', value: 82, percent: '83.33%', color: '#2E9E5B' },
    { key: 'absent', label: 'Absent', value: 8, percent: '10%', color: '#F5B417' },
    { key: 'leave', label: 'On leave', value: 5, percent: '6.67%', color: '#E5484D' },
  ],
}

export const attendanceTrends = {
  legend: [
    { key: 'present', label: 'Present', color: '#2E9E5B' },
    { key: 'leave', label: 'On leave', color: '#F5B417' },
    { key: 'absent', label: 'Absent', color: '#E5484D' },
  ],
  // callout rendered on the chart
  marker: { month: 'Jul', series: 'absent', value: 320, label: '320: July' },
  series: [
    { month: 'Jan', present: 290, leave: 250, absent: 180 },
    { month: 'Feb', present: 320, leave: 200, absent: 130 },
    { month: 'Mar', present: 330, leave: 150, absent: 150 },
    { month: 'Apr', present: 260, leave: 210, absent: 275 },
    { month: 'May', present: 160, leave: 255, absent: 235 },
    { month: 'Jun', present: 220, leave: 130, absent: 185 },
    { month: 'Jul', present: 175, leave: 205, absent: 320 },
    { month: 'Aug', present: 240, leave: 275, absent: 300 },
    { month: 'Sept', present: 290, leave: 230, absent: 250 },
    { month: 'Oct', present: 285, leave: 265, absent: 210 },
    { month: 'Nov', present: 250, leave: 190, absent: 150 },
    { month: 'Dec', present: 230, leave: 145, absent: 105 },
  ],
}

export const staffAvailability = {
  filters: ['All', 'Present', 'On Leave', 'Absent'],
  columns: ['ID', 'Employee', 'Role', 'Dept', 'Date', 'Punch Time', 'Status'],
  rows: [
    { id: '#1231456', name: 'Rahul Sharma', role: 'Plant Operator', dept: 'Operations', date: '19 May 2026', punchTime: '10:30 AM', status: 'Active' },
    { id: '#1231457', name: 'Amit Verma', role: 'Shift Supervisor', dept: 'Operations', date: '19 May 2026', punchTime: '10:30 AM', status: 'On Leave' },
    { id: '#1231458', name: 'Vikash Singh', role: 'Maintenance Tech', dept: 'Maintenance', date: '19 May 2026', punchTime: '10:30 AM', status: 'Absent' },
    { id: '#1231459', name: 'Priya Menon', role: 'Lab Technician', dept: 'Quality', date: '19 May 2026', punchTime: '09:55 AM', status: 'Active' },
    { id: '#1231460', name: 'Imran Qureshi', role: 'Electrician', dept: 'Electrical', date: '19 May 2026', punchTime: '10:05 AM', status: 'Active' },
    { id: '#1231461', name: 'Sunita Devi', role: 'Safety Officer', dept: 'Safety', date: '19 May 2026', punchTime: '—', status: 'Absent' },
    { id: '#1231462', name: 'Arjun Rawat', role: 'Site Engineer', dept: 'Operations', date: '19 May 2026', punchTime: '10:12 AM', status: 'Active' },
    { id: '#1231463', name: 'Neha Kulkarni', role: 'Housekeeping Lead', dept: 'Housekeeping', date: '19 May 2026', punchTime: '—', status: 'On Leave' },
    { id: '#1231464', name: 'Deepak Joshi', role: 'Fitter', dept: 'Maintenance', date: '19 May 2026', punchTime: '09:40 AM', status: 'Active' },
    { id: '#1231465', name: 'Meera Patel', role: 'Quality Analyst', dept: 'Quality', date: '19 May 2026', punchTime: '10:18 AM', status: 'Active' },
    { id: '#1231466', name: 'Ravi Chauhan', role: 'Instrument Tech', dept: 'Electrical', date: '19 May 2026', punchTime: '—', status: 'On Leave' },
    { id: '#1231467', name: 'Kavita Rawat', role: 'Helper', dept: 'Housekeeping', date: '19 May 2026', punchTime: '—', status: 'Absent' },
  ],
}

/** "All" maps to no filter; the rest match the row `status` values. */
export const staffStatusFilterMap = {
  All: null,
  Present: 'Active',
  'On Leave': 'On Leave',
  Absent: 'Absent',
}

export const departmentManpower = [
  { key: 'operations', name: 'Operations', total: 12, required: 4, shortage: 5, tone: 'blue' },
  { key: 'maintenance', name: 'Maintenance', total: 12, required: 4, shortage: 5, tone: 'violet' },
  { key: 'safety', name: 'Safety', total: 12, required: 4, shortage: 5, tone: 'rose' },
  { key: 'quality', name: 'Quality', total: 12, required: 4, shortage: 5, tone: 'amber' },
  { key: 'electrical', name: 'Electrical', total: 12, required: 4, shortage: 5, tone: 'green' },
  { key: 'housekeeping', name: 'Housekeeping', total: 12, required: 4, shortage: 5, tone: 'peach' },
]

/* ==========================================================================
   4. CONTRACTS
   ========================================================================== */

export const contractsSummary = [
  { key: 'total', label: 'Total Contracts', value: '26', note: 'Across all locations', icon: 'file', tone: 'brand' },
  { key: 'active', label: 'Active Contracts', value: '26', note: 'Across all locations', icon: 'check', tone: 'ok' },
  { key: 'inactive', label: 'Inactive Contracts', value: '26', note: 'Across all locations', icon: 'cross', tone: 'danger' },
  { key: 'value', label: 'Total Contract Value', value: '₹1,24,500', note: 'Across all locations', icon: 'money', tone: 'warn' },
]

export const contractColumns = [
  { key: 'sno', label: 'S.No.', width: '6%' },
  { key: 'id', label: 'Contract No.', width: '13%', sortable: true },
  { key: 'name', label: 'Contract Name', width: '18%', sortable: true },
  { key: 'vendor', label: 'Vendor', width: '20%', sortable: true },
  { key: 'status', label: 'Status', width: '11%', sortable: true },
  { key: 'duration', label: 'Duration', width: '16%' },
  { key: 'details', label: 'Details', width: '10%', align: 'right' },
]

/**
 * `detail` is rendered as-is by ContractDetailPanel: one column per group,
 * one row per { label, value }. `type: 'file'` renders a PDF chip.
 */
export const contracts = [
  {
    sno: 1,
    id: 'CN-001',
    name: 'Haridwar STP Project',
    vendor: 'Eco Smart Solutions Pvt .Ltd.',
    status: 'Active',
    startDate: '19 May 2026',
    endDate: '19 May 2026',
    description: 'Construction of 20 MLD STP at Haridwar',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹1,24,500' },
          { label: 'Security Deposit', value: '₹24,500 (5%)' },
          { label: 'Contract Document', value: 'CN-001_Contract.pdf', type: 'file' },
        ],
      },
      {
        title: 'Project Duration',
        rows: [
          { label: 'Original Duration', value: '1 year' },
          { label: 'Extended Duration', value: '6 months' },
          { label: 'Revised End Date', value: '19 Nov 2027' },
        ],
      },
      {
        title: 'Contractor Information',
        rows: [
          { label: 'Contact Person', value: 'Mr. Ramesh Sharma' },
          { label: 'Email', value: 'rameshsharma@ecosmart.in' },
          { label: 'Phone', value: '+918635429632' },
        ],
      },
    ],
  },
  {
    sno: 2,
    id: 'CN-002',
    name: 'Jagjeetpur O&M',
    vendor: 'Ganga Enviro Systems Pvt. Ltd.',
    status: 'Active',
    startDate: '01 Apr 2026',
    endDate: '31 Mar 2029',
    description: 'Operation and maintenance of Jagjeetpur STP',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹8,64,000' },
          { label: 'Security Deposit', value: '₹86,400 (10%)' },
          { label: 'Contract Document', value: 'CN-002_Contract.pdf', type: 'file' },
        ],
      },
      {
        title: 'Project Duration',
        rows: [
          { label: 'Original Duration', value: '3 years' },
          { label: 'Extended Duration', value: '—' },
          { label: 'Revised End Date', value: '31 Mar 2029' },
        ],
      },
      {
        title: 'Contractor Information',
        rows: [
          { label: 'Contact Person', value: 'Ms. Kavita Joshi' },
          { label: 'Email', value: 'kavita.joshi@gangaenviro.in' },
          { label: 'Phone', value: '+919820114577' },
        ],
      },
    ],
  },
  {
    sno: 3,
    id: 'CN-003',
    name: 'Sludge Handling Upgrade',
    vendor: 'Nirmal Infratech Pvt. Ltd.',
    status: 'Inactive',
    startDate: '12 Jan 2025',
    endDate: '11 Jan 2026',
    description: 'Upgrade of sludge handling infrastructure',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹3,42,750' },
          { label: 'Security Deposit', value: '₹17,140 (5%)' },
          { label: 'Contract Document', value: 'CN-003_Contract.pdf', type: 'file' },
        ],
      },
      {
        title: 'Project Duration',
        rows: [
          { label: 'Original Duration', value: '1 year' },
          { label: 'Extended Duration', value: '—' },
          { label: 'Revised End Date', value: '11 Jan 2026' },
        ],
      },
      {
        title: 'Contractor Information',
        rows: [
          { label: 'Contact Person', value: 'Mr. Alok Verma' },
          { label: 'Email', value: 'alok.verma@nirmalinfra.in' },
          { label: 'Phone', value: '+917742093311' },
        ],
      },
    ],
  },
  {
    sno: 4,
    id: 'CN-004',
    name: 'SCADA & Instrumentation AMC',
    vendor: 'Aqua Controls India Pvt. Ltd.',
    status: 'Active',
    startDate: '05 Jun 2026',
    endDate: '04 Jun 2028',
    description: 'Annual SCADA and instrumentation maintenance',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹2,10,000' },
          { label: 'Security Deposit', value: '₹21,000 (10%)' },
          { label: 'Contract Document', value: 'CN-004_Contract.pdf', type: 'file' },
        ],
      },
      {
        title: 'Project Duration',
        rows: [
          { label: 'Original Duration', value: '2 years' },
          { label: 'Extended Duration', value: '3 months' },
          { label: 'Revised End Date', value: '04 Sep 2028' },
        ],
      },
      {
        title: 'Contractor Information',
        rows: [
          { label: 'Contact Person', value: 'Mr. S. Narayanan' },
          { label: 'Email', value: 'narayanan@aquacontrols.co.in' },
          { label: 'Phone', value: '+919440287610' },
        ],
      },
    ],
  },
  {
    sno: 5,
    id: 'CN-005',
    name: 'Chemical Supply — Annual',
    vendor: 'Bharat Chem Distributors',
    status: 'Inactive',
    startDate: '20 Feb 2025',
    endDate: '19 Feb 2026',
    description: 'Annual chemical supply for treatment operations',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹96,300' },
          { label: 'Security Deposit', value: '₹4,815 (5%)' },
          { label: 'Contract Document', value: 'CN-005_Contract.pdf', type: 'file' },
        ],
      },
      {
        title: 'Project Duration',
        rows: [
          { label: 'Original Duration', value: '1 year' },
          { label: 'Extended Duration', value: '—' },
          { label: 'Revised End Date', value: '19 Feb 2026' },
        ],
      },
      {
        title: 'Contractor Information',
        rows: [
          { label: 'Contact Person', value: 'Mr. Deepak Ahuja' },
          { label: 'Email', value: 'deepak@bharatchem.in' },
          { label: 'Phone', value: '+918851730264' },
        ],
      },
    ],
  },
  {
    sno: 6,
    id: 'CN-006',
    name: 'Housekeeping & Security',
    vendor: 'Shakti Facility Services',
    status: 'Active',
    startDate: '01 Jul 2026',
    endDate: '30 Jun 2027',
    description: 'Housekeeping and security services at the plant',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹1,48,200' },
          { label: 'Security Deposit', value: '₹7,410 (5%)' },
          { label: 'Contract Document', value: 'CN-006_Contract.pdf', type: 'file' },
        ],
      },
      {
        title: 'Project Duration',
        rows: [
          { label: 'Original Duration', value: '1 year' },
          { label: 'Extended Duration', value: '—' },
          { label: 'Revised End Date', value: '30 Jun 2027' },
        ],
      },
      {
        title: 'Contractor Information',
        rows: [
          { label: 'Contact Person', value: 'Ms. Rekha Pillai' },
          { label: 'Email', value: 'rekha.pillai@shaktifs.in' },
          { label: 'Phone', value: '+919003418825' },
        ],
      },
    ],
  },
]

/* ==========================================================================
   5. COMPLIANCE
   ========================================================================== */

export const complianceSummary = [
  { key: 'violations', label: 'Total Violations', value: '10', note: 'Across all locations', icon: 'triangleAlert', tone: 'brand' },
  { key: 'penalty', label: 'Total Penalty Amount', value: '₹45,000', note: 'Across all locations', icon: 'money', tone: 'warn' },
  { key: 'payable', label: 'Total Amount to Pay', value: '26', note: 'Across all locations', icon: 'money', tone: 'danger' },
]

export const complianceTypes = ['Parameter Breach', 'Equipment Failure']
export const complianceBasisOptions = ['Based On Parameter Breach', 'Based On Equipment Failure']

export const complianceParameters = ['pH', 'BOD', 'COD', 'TSS', 'Flow', 'Temperature']

export const violationColumns = [
  { key: 'id', label: 'Violation ID', width: '14%' },
  { key: 'type', label: 'Type', width: '16%' },
  { key: 'parameter', label: 'Parameter', width: '13%' },
  { key: 'location', label: 'Location', width: '13%' },
  { key: 'downtime', label: 'Downtime Duration', width: '18%' },
  { key: 'detectedOn', label: 'Detected On', width: '18%' },
  { key: 'details', label: 'Details', width: '8%', align: 'right' },
]

/** pH trend behind the first violation: 15-minute samples, 08:00 → 14:00. */
const phTrendSeries = [
  { t: '08:00 AM', value: 8.2 },
  { t: '08:15 AM', value: 8.0 },
  { t: '08:30 AM', value: 7.9 },
  { t: '08:45 AM', value: 8.1 },
  { t: '09:00 AM', value: 8.0 },
  { t: '09:15 AM', value: 7.9 },
  { t: '09:30 AM', value: 8.2 },
  { t: '09:45 AM', value: 8.6 },
  { t: '10:00 AM', value: 9.4 },
  { t: '10:15 AM', value: 9.9 },
  { t: '10:30 AM', value: 10.0 },
  { t: '10:45 AM', value: 10.1 },
  { t: '11:00 AM', value: 10.2 },
  { t: '11:15 AM', value: 10.1 },
  { t: '11:30 AM', value: 9.9 },
  { t: '11:45 AM', value: 10.0 },
  { t: '12:00 PM', value: 9.9 },
  { t: '12:15 PM', value: 9.2 },
  { t: '12:30 PM', value: 8.3 },
  { t: '12:45 PM', value: 8.0 },
  { t: '01:00 PM', value: 7.9 },
  { t: '01:15 PM', value: 8.0 },
  { t: '01:30 PM', value: 7.8 },
  { t: '01:45 PM', value: 7.9 },
  { t: '02:00 PM', value: 8.0 },
]

export const trendHourTicks = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
]

export const violations = [
  {
    id: 'VL123456',
    type: 'Parameter Breach',
    parameter: 'pH',
    exceedance: '13.3%',
    location: 'Effluent',
    downtime: '1h 45min',
    detectedOn: '15/02/2026 ,10:30 AM',
    status: 'Recovered',

    // top strip of the expanded panel
    summary: [
      { label: 'Parameter', value: 'pH', tone: 'ink' },
      { label: 'Current Value', value: '10.20', tone: 'danger' },
      { label: 'Ideal Range', value: '6.0 – 9.0', tone: 'ok' },
      { label: 'Exceedance', value: '13.3%', tone: 'danger', trend: 'up' },
    ],

    tracking: {
      rows: [
        { label: 'Violation Type', value: 'Parameter Breach' },
        { label: 'Detected', value: '15/02/2026 ,10:30 AM' },
        { label: 'Recovered on', value: '15/02/2026 ,10:30 AM' },
        { label: 'Total Duration', value: '1 hr 45m' },
      ],
      remarks: 'High organic load due to industrial discharge',
    },

    recovery: [
      { label: 'Violation Started', time: '15/02/2026, 10:30 AM', tone: 'danger' },
      { label: 'Peak Value Recorded', time: '15/02/2026, 11:05 AM', tone: 'danger' },
      { label: 'Recovery Started', time: '15/02/2026, 12:05 PM', tone: 'warn' },
      { label: 'Recovered', time: '15/02/2026, 12:15 PM', tone: 'ok' },
    ],

    penalty: {
      total: '₹7,500',
      amounts: [
        { label: 'Recovered Amount', value: '₹7,500' },
        { label: 'Pending Amount', value: '₹0' },
      ],
      calculation: [
        { label: 'Penalty Rule', value: 'Clause 5.2', tone: 'warn' },
        { label: 'Penalty Basis', value: 'Per occurrence' },
        { label: 'Calculation', value: '1 occurrence  x ₹7,500' },
      ],
      recoveryDetails: [
        { label: 'Recovered By', value: 'Mr. Rakesh Gupta' },
        { label: 'Recovery Mode', value: 'Bank Transfer' },
      ],
      document: 'CN-001_Contract.pdf',
    },

    trend: {
      unit: 'pH',
      series: phTrendSeries,
      domain: [0, 12],
      ticks: [0, 3, 6, 9, 12],
      lowerLimit: 6,
      upperLimit: 9,
      violationFrom: '10:00 AM',
      violationTo: '12:15 PM',
      peak: { t: '11:00 AM', value: '10.20', stamp: '15/02/2026 11:05 AM' },
    },
  },
  {
    id: 'VL123457',
    type: 'Parameter Breach',
    parameter: 'pH',
    exceedance: '9.8%',
    location: 'Effluent',
    downtime: '1h 10min',
    detectedOn: '18/02/2026 ,08:15 AM',
    status: 'Recovered',
    summary: [
      { label: 'Parameter', value: 'pH', tone: 'ink' },
      { label: 'Current Value', value: '9.88', tone: 'danger' },
      { label: 'Ideal Range', value: '6.0 – 9.0', tone: 'ok' },
      { label: 'Exceedance', value: '9.8%', tone: 'danger', trend: 'up' },
    ],
    tracking: {
      rows: [
        { label: 'Violation Type', value: 'Parameter Breach' },
        { label: 'Detected', value: '18/02/2026 ,08:15 AM' },
        { label: 'Recovered on', value: '18/02/2026 ,09:25 AM' },
        { label: 'Total Duration', value: '1 hr 10m' },
      ],
      remarks: 'Dosing pump calibration drift on line 2',
    },
    recovery: [
      { label: 'Violation Started', time: '18/02/2026, 08:15 AM', tone: 'danger' },
      { label: 'Peak Value Recorded', time: '18/02/2026, 08:40 AM', tone: 'danger' },
      { label: 'Recovery Started', time: '18/02/2026, 09:05 AM', tone: 'warn' },
      { label: 'Recovered', time: '18/02/2026, 09:25 AM', tone: 'ok' },
    ],
    penalty: {
      total: '₹5,000',
      amounts: [
        { label: 'Recovered Amount', value: '₹5,000' },
        { label: 'Pending Amount', value: '₹0' },
      ],
      calculation: [
        { label: 'Penalty Rule', value: 'Clause 5.2', tone: 'warn' },
        { label: 'Penalty Basis', value: 'Per occurrence' },
        { label: 'Calculation', value: '1 occurrence  x ₹5,000' },
      ],
      recoveryDetails: [
        { label: 'Recovered By', value: 'Mr. Rakesh Gupta' },
        { label: 'Recovery Mode', value: 'Bank Transfer' },
      ],
      document: 'CN-001_Contract.pdf',
    },
    trend: {
      unit: 'pH',
      series: phTrendSeries.map((p) => ({ ...p, value: Math.round((p.value - 0.35) * 100) / 100 })),
      domain: [0, 12],
      ticks: [0, 3, 6, 9, 12],
      lowerLimit: 6,
      upperLimit: 9,
      violationFrom: '10:00 AM',
      violationTo: '12:00 PM',
      peak: { t: '11:00 AM', value: '9.88', stamp: '18/02/2026 08:40 AM' },
    },
  },
  {
    id: 'VL123458',
    type: 'Parameter Breach',
    parameter: 'BOD',
    exceedance: '23.3%',
    location: 'Outlet',
    downtime: '3h 20min',
    detectedOn: '22/02/2026 ,02:05 PM',
    status: 'Pending',
    summary: [
      { label: 'Parameter', value: 'BOD', tone: 'ink' },
      { label: 'Current Value', value: '18.5 mg/L', tone: 'danger' },
      { label: 'Ideal Range', value: '< 10 mg/L', tone: 'ok' },
      { label: 'Exceedance', value: '23.3%', tone: 'danger', trend: 'up' },
    ],
    tracking: {
      rows: [
        { label: 'Violation Type', value: 'Parameter Breach' },
        { label: 'Detected', value: '22/02/2026 ,02:05 PM' },
        { label: 'Recovered on', value: '—' },
        { label: 'Total Duration', value: '3 hr 20m' },
      ],
      remarks: 'Aeration blower tripped during peak inflow',
    },
    recovery: [
      { label: 'Violation Started', time: '22/02/2026, 02:05 PM', tone: 'danger' },
      { label: 'Peak Value Recorded', time: '22/02/2026, 03:10 PM', tone: 'danger' },
      { label: 'Recovery Started', time: '22/02/2026, 04:40 PM', tone: 'warn' },
      { label: 'Recovered', time: 'Awaiting confirmation', tone: 'muted' },
    ],
    penalty: {
      total: '₹12,000',
      amounts: [
        { label: 'Recovered Amount', value: '₹0' },
        { label: 'Pending Amount', value: '₹12,000' },
      ],
      calculation: [
        { label: 'Penalty Rule', value: 'Clause 5.4', tone: 'warn' },
        { label: 'Penalty Basis', value: 'Per hour' },
        { label: 'Calculation', value: '4 hours  x ₹3,000' },
      ],
      recoveryDetails: [
        { label: 'Recovered By', value: '—' },
        { label: 'Recovery Mode', value: '—' },
      ],
      document: 'CN-002_Contract.pdf',
    },
    trend: {
      unit: 'mg/L',
      series: [
        { t: '08:00 AM', value: 7.4 },
        { t: '09:00 AM', value: 7.8 },
        { t: '10:00 AM', value: 8.6 },
        { t: '11:00 AM', value: 9.2 },
        { t: '12:00 PM', value: 11.4 },
        { t: '01:00 PM', value: 15.2 },
        { t: '02:00 PM', value: 18.5 },
      ],
      domain: [0, 24],
      ticks: [0, 6, 12, 18, 24],
      lowerLimit: 2,
      upperLimit: 10,
      violationFrom: '11:00 AM',
      violationTo: '02:00 PM',
      peak: { t: '02:00 PM', value: '18.5', stamp: '22/02/2026 03:10 PM' },
    },
  },
]

/* ==========================================================================
   6. CCTV MONITORING
   ========================================================================== */

export const cctvSummary = {
  total: 2,
  scopeLabel: 'Across all location',
  breakdown: [
    { key: 'online', label: 'Online Camera', value: 1, tone: 'ok' },
    { key: 'offline', label: 'Offline Camera', value: 1, tone: 'danger' },
    { key: 'maintenance', label: 'Under Maintenance', value: 1, tone: 'warn' },
  ],
}

/**
 * `image` is the still/poster for the tile and `stream` the playable source.
 * Both are null in mock data, so the tile falls back to a drawn placeholder —
 * point them at real URLs and the tile renders them with no code change.
 */
export const cameraFeeds = [
  {
    key: 'influent',
    id: 'CAM-IN',
    location: 'Influent',
    lastActive: '15/02/2026 ,10:30 AM',
    status: 'Live',
    timecode: '9:03:36:20',
    image: null,
    stream: null,
  },
  {
    key: 'effluent',
    id: 'CAM-OUT',
    location: 'Effluent',
    lastActive: '15/02/2026 ,10:30 AM',
    status: 'Offline',
    timecode: null,
    image: null,
    stream: null,
  },
]

/**
 * "CCTV Logs" card in the CCTV section — recording uptime per camera, so the
 * tabs mirror the camera IDs above.
 */
export const cctvLogColumns = [
  { key: 'timestamp', label: 'Timestamp', width: '22%' },
  { key: 'status', label: 'Status', width: '20%', sortable: true },
  { key: 'downtime', label: 'Downtime Duration', width: '19%' },
  { key: 'reason', label: 'Reason', width: '22%' },
  { key: 'storage', label: 'Storage', width: '17%' },
]

export const cctvLogs = {
  tabs: ['CAM-IN', 'CAM-OUT'],
  rows: {
    'CAM-IN': [
      { id: 'in-1', timestamp: '15/02/2026 ,10:30 AM', status: 'Recording Stopped', downtime: '42 m', reason: 'Network Issue', storage: '72%' },
      { id: 'in-2', timestamp: '15/02/2026 ,10:45 AM', status: 'Recording Resumed', downtime: '-', reason: '-', storage: '72%' },
      { id: 'in-3', timestamp: '15/02/2026 ,11:00 AM', status: 'Storage near full', downtime: '-', reason: 'Storage', storage: '90%' },
    ],
    'CAM-OUT': [
      { id: 'out-1', timestamp: '15/02/2026 ,09:10 AM', status: 'Recording Stopped', downtime: '1 h 12 m', reason: 'Power Failure', storage: '64%' },
      { id: 'out-2', timestamp: '15/02/2026 ,10:22 AM', status: 'Recording Resumed', downtime: '-', reason: '-', storage: '64%' },
      { id: 'out-3', timestamp: '15/02/2026 ,12:05 PM', status: 'Storage near full', downtime: '-', reason: 'Storage', storage: '88%' },
    ],
  },
}

/* ---- Standalone CCTV Monitoring page ------------------------------------
   Every STP that has cameras, grouped the way the page lists them. Only the
   camera data lives here — the plant name and address are read back from
   `stpDetails` so the STP list stays the single source of truth.

   `image` is the still shown in the tile. Leave it null for the drawn
   placeholder scene, or point it at a file in /public ('/feeds/influent.jpg')
   or any URL — the tile and the expanded view both pick it up as-is.
   ------------------------------------------------------------------------ */

const cctvSiteCameras = [
  {
    stpId: 'sarai-14',
    cameras: [
      { key: 'influent', id: 'CAM-IN-01', location: 'Influent', status: 'Live', lastActive: '15/02/2026 ,10:30 AM', timecode: '9:03:36:20', image: null },
      { key: 'effluent', id: 'CAM-EF-01', location: 'Effluent', status: 'Offline', lastActive: '15/02/2026 ,10:30 AM', timecode: '9:03:36:20', image: null },
    ],
  },
  {
    stpId: 'lakkar-ghat-26',
    cameras: [
      { key: 'influent', id: 'CAM-IN-02', location: 'Influent', status: 'Live', lastActive: '15/04/2026 ,10:28 AM', timecode: '9:03:36:20', image: null },
      { key: 'effluent', id: 'CAM-EF-02', location: 'Effluent', status: 'Live', lastActive: '15/04/2026 ,10:28 AM', timecode: '9:03:36:20', image: null },
    ],
  },
  {
    stpId: 'jagjeetpur-68',
    cameras: [
      { key: 'influent', id: 'CAM-IN-03', location: 'Influent', status: 'Live', lastActive: '15/04/2026 ,09:52 AM', timecode: '9:03:36:20', image: null },
      { key: 'effluent', id: 'CAM-EF-03', location: 'Effluent', status: 'Under Maintenance', lastActive: '13/04/2026 ,04:15 PM', timecode: null, image: null },
    ],
  },
  {
    stpId: 'kankhal-27',
    cameras: [
      { key: 'influent', id: 'CAM-IN-04', location: 'Influent', status: 'Live', lastActive: '15/04/2026 ,10:05 AM', timecode: '9:03:36:20', image: null },
      { key: 'effluent', id: 'CAM-EF-04', location: 'Effluent', status: 'Offline', lastActive: '12/04/2026 ,07:40 PM', timecode: null, image: null },
    ],
  },
  {
    stpId: 'bhagwanpur-5',
    cameras: [
      { key: 'influent', id: 'CAM-IN-05', location: 'Influent', status: 'Live', lastActive: '15/04/2026 ,10:18 AM', timecode: '9:03:36:20', image: null },
      { key: 'effluent', id: 'CAM-EF-05', location: 'Effluent', status: 'Live', lastActive: '15/04/2026 ,10:18 AM', timecode: '9:03:36:20', image: null },
    ],
  },
]

export const cctvSites = cctvSiteCameras.map(({ stpId, cameras }) => ({
  stpId,
  name: stpDetails[stpId].name,
  address: stpDetails[stpId].address,
  cameras: cameras.map((camera) => ({ ...camera, key: `${stpId}-${camera.key}` })),
}))

/** Filter above the site list — 'all' keeps every STP on screen. */
export const cctvStpFilterOptions = [
  { id: 'all', label: "All STP's" },
  ...cctvSites.map((site) => ({ id: site.stpId, label: site.name })),
]

/* ==========================================================================
   7. INVENTORY
   ========================================================================== */

export const inventorySummary = {
  label: 'Total Chemicals',
  total: 98,
  scopeLabel: 'Across all location',
  breakdown: [
    { key: 'adequate', label: 'Adequate', value: 82, percent: '83.33%', color: '#2E9E5B' },
    { key: 'low', label: 'Low', value: 8, percent: '10%', color: '#F5B417' },
    { key: 'out', label: 'Out of Stock', value: 5, percent: '6.67%', color: '#E5484D' },
  ],
}

export const inventoryStats = [
  { key: 'value', label: 'Total Inventory Value', value: '₹7,000', note: 'Across all locations', icon: 'money', tone: 'warn' },
  { key: 'required', label: 'Required inventory', value: '730 L', note: 'Across all locations', icon: 'boxOut', tone: 'brand' },
  { key: 'consumption', label: 'Total Consumption', value: '1230 L', note: 'Across all locations', icon: 'boxes', tone: 'okQuiet' },
  { key: 'daysLeft', label: 'Days of inventory left', value: '18', note: 'Across all locations', icon: 'timer', tone: 'dangerQuiet' },
]

export const chemicalInventory = {
  filters: ['All', 'Adequate', 'Low Stock', 'Out of Stock'],
  columns: [
    { key: 'name', label: 'Chemical Name', width: '26%' },
    { key: 'category', label: 'Category', width: '18%', sortable: true },
    { key: 'currentQty', label: 'Current Qty', width: '14%' },
    { key: 'requiredQty', label: 'Required Qty', width: '15%' },
    { key: 'daysLeft', label: 'Days Left', width: '12%' },
    { key: 'status', label: 'Status', width: '15%', sortable: true },
  ],
  rows: [
    { name: 'Alum (Liquid)', category: 'Coagulant', currentQty: '12.5', requiredQty: '-', daysLeft: '21', status: 'Adequate' },
    { name: 'PAC', category: 'Disinfectant', currentQty: '12.5', requiredQty: '10.5', daysLeft: '8', status: 'Low Stock' },
    { name: 'Sodium Hypochlorite', category: 'Disinfectant', currentQty: '-', requiredQty: '12.5', daysLeft: '0', status: 'Out of Stock' },
    { name: 'Polyelectrolyte', category: 'Polymers', currentQty: '48.0', requiredQty: '-', daysLeft: '34', status: 'Adequate' },
    { name: 'Caustic Soda', category: 'pH Adjusters', currentQty: '9.2', requiredQty: '15.0', daysLeft: '6', status: 'Low Stock' },
    { name: 'Ferric Chloride', category: 'Coagulant', currentQty: '31.4', requiredQty: '-', daysLeft: '27', status: 'Adequate' },
    { name: 'Antifoam Agent', category: 'Others', currentQty: '-', requiredQty: '5.0', daysLeft: '0', status: 'Out of Stock' },
  ],
}

/** "All" maps to no filter; the rest match the row `status` values. */
export const chemicalStatusFilterMap = {
  All: null,
  Adequate: 'Adequate',
  'Low Stock': 'Low Stock',
  'Out of Stock': 'Out of Stock',
}

export const inventoryByCategory = [
  { key: 'coagulant', label: 'Coagulant', value: 82, share: 20, percent: '20%', color: '#3E63DD' },
  { key: 'disinfectant', label: 'Disinfectant', value: 82, share: 20, percent: '20%', color: '#8B5CF6' },
  { key: 'polymers', label: 'Polymers', value: 82, share: 20, percent: '20%', color: '#2AB3A6' },
  { key: 'ph', label: 'pH Adjusters', value: 82, share: 20, percent: '20%', color: '#F5A524' },
  { key: 'others', label: 'Others', value: 82, share: 20, percent: '20%', color: '#CBD5E1' },
]

/* ==========================================================================
   8. DATA REPORTS  (cross-STP roll-ups: /reports/*)
   ========================================================================== */

export const reportStpOptions = [
  "All STP's",
  '14 MLD STP, Sarai, Haridwar',
  '68 MLD STP, Sarai, Haridwar',
  '26 MLD STP Lakkar Ghat',
  '1.2 MLD Happy Valley, Dehradun',
]

/* ---- Contracts report --------------------------------------------------- */

export const contractsReportColumns = [
  { key: 'sno', label: 'S.No.', width: '6%' },
  { key: 'id', label: 'Contract No.', width: '11%', sortable: true },
  { key: 'name', label: 'Contract Name', width: '15%', sortable: true },
  { key: 'vendor', label: 'Vendor', width: '18%', sortable: true },
  { key: 'stp', label: 'STP', width: '18%', sortable: true },
  { key: 'status', label: 'Status', width: '10%', sortable: true },
  { key: 'duration', label: 'Duration', width: '14%' },
  { key: 'action', label: 'Action', width: '8%' },
]

export const contractsReportRows = [
  { id: 'CN-001', sno: 1, name: 'Haridwar STP Project', vendor: 'Eco Smart Solutions Pvt .Ltd.', stp: '14 MLD STP, Sarai, Haridwar', status: 'Active', startDate: '19 May 2026', endDate: '19 May 2026' },
  { id: 'CN-002', sno: 2, name: 'Dehradun STP Project', vendor: 'ABC', stp: '1.2 MLD Happy Valley, Dehradun', status: 'Inactive', startDate: '19 May 2026', endDate: '19 May 2026' },
  { id: 'CN-003', sno: 3, name: 'Lakkar Ghat O&M', vendor: 'Ganga Enviro Systems Pvt. Ltd.', stp: '26 MLD STP Lakkar Ghat', status: 'Active', startDate: '01 Apr 2026', endDate: '31 Mar 2029' },
  { id: 'CN-004', sno: 4, name: 'Sludge Handling Upgrade', vendor: 'Nirmal Infratech Pvt. Ltd.', stp: '68 MLD STP, Sarai, Haridwar', status: 'Inactive', startDate: '12 Jan 2025', endDate: '11 Jan 2026' },
  { id: 'CN-005', sno: 5, name: 'SCADA & Instrumentation AMC', vendor: 'Aqua Controls India Pvt. Ltd.', stp: '14 MLD STP, Sarai, Haridwar', status: 'Active', startDate: '05 Jun 2026', endDate: '04 Jun 2028' },
]

/* ---- Compliance report -------------------------------------------------- */

export const complianceReportParameters = ['All', 'pH', 'BOD', 'COD', 'TSS', 'Flow', 'Temperature']

export const complianceReportColumns = [
  { key: 'stp', label: 'STP', width: '20%', sortable: true },
  { key: 'id', label: 'Violation ID', width: '11%' },
  { key: 'type', label: 'Type', width: '13%' },
  { key: 'parameter', label: 'Parameter', width: '10%' },
  { key: 'location', label: 'Location', width: '10%' },
  { key: 'downtime', label: 'Downtime Duration', width: '15%' },
  { key: 'detectedOn', label: 'Detected On', width: '12%' },
  { key: 'status', label: 'Status', width: '11%', sortable: true },
]

export const complianceReportRows = [
  { id: 'VL123456', stp: '14 MLD STP, Sarai, Haridwar', type: 'Parameter Breach', parameter: 'pH', exceedance: '13.3%', location: 'Effluent', downtime: '1h 45min', penalty: '₹7,500', date: '15/02/2026', time: '10:30 AM', status: 'Recovered' },
  { id: 'VL1233520', stp: '26 MLD STP Lakkar Ghat', type: 'Parameter Breach', parameter: 'pH', exceedance: '13.3%', location: 'Effluent', downtime: '1h 45min', penalty: '₹7,500', date: '15/02/2026', time: '10:30 AM', status: 'Recovered' },
  { id: 'VL123458', stp: '14 MLD STP, Sarai, Haridwar', type: 'Parameter Breach', parameter: 'pH', exceedance: '13.3%', location: 'Effluent', downtime: '1h 45min', penalty: '₹7,500', date: '15/02/2026', time: '10:30 AM', status: 'Recovered' },
  { id: 'VL123461', stp: '68 MLD STP, Sarai, Haridwar', type: 'Parameter Breach', parameter: 'BOD', exceedance: '23.3%', location: 'Outlet', downtime: '3h 20min', penalty: '₹12,000', date: '22/02/2026', time: '02:05 PM', status: 'Pending' },
  { id: 'VL123465', stp: '1.2 MLD Happy Valley, Dehradun', type: 'Equipment Failure', parameter: 'Flow', exceedance: '8.4%', location: 'Inlet', downtime: '0h 55min', penalty: '₹3,000', date: '26/02/2026', time: '09:40 AM', status: 'Recovered' },
  { id: 'VL123470', stp: '26 MLD STP Lakkar Ghat', type: 'Parameter Breach', parameter: 'TSS', exceedance: '15.2%', location: 'Effluent', downtime: '2h 05min', penalty: '₹6,500', date: '28/02/2026', time: '11:15 AM', status: 'Pending' },
]

/* ---- Manpower report ---------------------------------------------------- */

export const manpowerReportStats = [
  { key: 'total', label: 'Total Manpower', value: '1,248 Employees', note: "Across all STP's", icon: 'user', tone: 'brand' },
  { key: 'present', label: 'Avg. Present / Day', value: '1,086', note: '87% attendance', icon: 'userCheck', tone: 'okQuiet' },
  { key: 'required', label: 'Avg. Required / Day', value: '1,154', note: "Across all STP's", icon: 'userClock', tone: 'dangerQuiet' },
  { key: 'shortage', label: 'Manpower Shortage', value: '68', note: '5.9% below requirement', icon: 'userAlert', tone: 'warnQuiet' },
]

export const manpowerTrend = {
  legend: [
    { key: 'required', label: 'Required', color: '#2C3644', dashed: true },
    { key: 'present', label: 'Present', color: '#2E9E5B', dashed: false },
  ],
  marker: { value: '1175', stamp: '15/02/2026 11:05 AM' },
  domain: [1000, 1200],
  ticks: [1000, 1050, 1100, 1150, 1200],
  axisTicks: ['1 Aug', '5 Aug', '10 Aug', '15 Aug', '20 Aug', '25 Aug', '30 Aug'],
  series: [
    { t: '1 Aug', required: 1120, present: 1050 },
    { t: '3 Aug', required: 1122, present: 1052 },
    { t: '5 Aug', required: 1128, present: 1058 },
    { t: '7 Aug', required: 1140, present: 1075 },
    { t: '10 Aug', required: 1178, present: 1100 },
    { t: '12 Aug', required: 1182, present: 1104 },
    { t: '15 Aug', required: 1180, present: 1110 },
    { t: '18 Aug', required: 1178, present: 1108 },
    { t: '20 Aug', required: 1174, present: 1104 },
    { t: '23 Aug', required: 1170, present: 1100 },
    { t: '25 Aug', required: 1132, present: 1064 },
    { t: '27 Aug', required: 1128, present: 1060 },
    { t: '30 Aug', required: 1126, present: 1056 },
  ],
}

export const manpowerReportColumns = [
  { key: 'date', label: 'Date', width: '12%' },
  { key: 'stp', label: 'STP', width: '20%', sortable: true },
  { key: 'required', label: 'Required', width: '9%' },
  { key: 'total', label: 'Total Manpower', width: '12%' },
  { key: 'shortage', label: 'Shortage', width: '9%' },
  { key: 'present', label: 'Present', width: '8%' },
  { key: 'absent', label: 'Absent', width: '8%' },
  { key: 'leave', label: 'On Leave', width: '9%' },
  { key: 'attendance', label: 'Attendance', width: '13%' },
]

export const manpowerReportRows = [
  { id: 'r1', date: '19 May 2026', stp: '14 MLD STP, Sarai, Haridwar', required: 35, total: 33, shortage: 2, present: 30, absent: 3, leave: 3, attendance: '85.71%', spark: [28, 30, 29, 31, 30, 32, 30] },
  { id: 'r2', date: '19 May 2026', stp: '68 MLD STP, Sarai, Haridwar', required: 28, total: 28, shortage: 2, present: 24, absent: 4, leave: 4, attendance: '85.71%', spark: [22, 24, 23, 25, 24, 26, 24] },
  { id: 'r3', date: '19 May 2026', stp: '26 MLD STP Lakkar Ghat', required: 35, total: 33, shortage: 2, present: 30, absent: 3, leave: 3, attendance: '85.71%', spark: [29, 28, 30, 29, 31, 30, 30] },
  { id: 'r4', date: '19 May 2026', stp: '1.2 MLD Happy Valley, Dehradun', required: 12, total: 11, shortage: 1, present: 10, absent: 1, leave: 1, attendance: '90.90%', spark: [9, 10, 10, 9, 11, 10, 10] },
  { id: 'r5', date: '18 May 2026', stp: '14 MLD STP, Sarai, Haridwar', required: 35, total: 34, shortage: 1, present: 31, absent: 2, leave: 2, attendance: '88.57%', spark: [30, 31, 30, 32, 31, 31, 31] },
]

/* ---- CCTV report -------------------------------------------------------- */

export const cctvReportStats = [
  { key: 'total', label: 'Total Cameras', value: '576', note: 'Across all states', icon: 'camera', tone: 'brand' },
  { key: 'operational', label: 'Avg. Operational Cameras', value: '542 / day', note: '94.1%', icon: 'cameraOn', tone: 'ok' },
  { key: 'offline', label: 'Offline Camera', value: '47', note: 'Affected STP: 8 / 24', icon: 'cameraOff', tone: 'danger' },
  { key: 'maintenance', label: 'Under maintenance', value: '10', note: "Across all affected STP's", icon: 'maintenance', tone: 'warn' },
]

export const cctvReportColumns = [
  { key: 'stp', label: 'STP', width: '22%', sortable: true },
  { key: 'cameraId', label: 'Camera ID', width: '11%' },
  { key: 'availability', label: 'Recording Availability', width: '15%' },
  { key: 'interruptions', label: 'Interruptions', width: '11%' },
  { key: 'downtime', label: 'Total Downtime', width: '13%' },
  { key: 'timestamp', label: 'Timestamp', width: '16%' },
  { key: 'storage', label: 'Storage Status', width: '12%' },
]

export const cctvReportRows = [
  { id: 'c1', stp: '14 MLD STP, Sarai, Haridwar', cameraId: 'CAM-01', availability: '99.8%', interruptions: 1, downtime: '3h 12m', timestamp: '15/06/2026 ,10:30 AM', storage: '72%' },
  { id: 'c2', stp: '14 MLD STP, Sarai, Haridwar', cameraId: 'CAM-02', availability: '98.6%', interruptions: 1, downtime: '21h 35m', timestamp: '15/06/2026 ,10:30 AM', storage: '64%' },
  { id: 'c3', stp: '26 MLD STP Lakkar Ghat', cameraId: 'CAM-01', availability: '95.2%', interruptions: 3, downtime: '0', timestamp: '-', storage: '98%' },
  { id: 'c4', stp: '26 MLD STP Lakkar Ghat', cameraId: 'CAM-02', availability: '100%', interruptions: 0, downtime: '46h 10m', timestamp: '15/02/2026 ,10:30 AM', storage: '82%' },
  { id: 'c5', stp: '68 MLD STP, Sarai, Haridwar', cameraId: 'CAM-01', availability: '99.2%', interruptions: 2, downtime: '1 hr', timestamp: '15/02/2026 ,10:30 AM', storage: '60%' },
  { id: 'c6', stp: '1.2 MLD Happy Valley, Dehradun', cameraId: 'CAM-01', availability: '97.4%', interruptions: 4, downtime: '8h 05m', timestamp: '15/02/2026 ,10:30 AM', storage: '55%' },
]

/* ---- Inventory report --------------------------------------------------- */

export const inventoryReportFilterOptions = ['All Inventory', 'Coagulant', 'Disinfectant', 'Polymers', 'pH Adjusters', 'Others']

export const inventoryReportColumns = [
  { key: 'stp', label: 'STP', width: '22%', sortable: true },
  { key: 'opening', label: 'Opening Stock', width: '11%' },
  { key: 'received', label: 'Received', width: '10%' },
  { key: 'consumed', label: 'Consumed', width: '11%' },
  { key: 'closing', label: 'Closing Stock', width: '12%' },
  { key: 'lowStock', label: 'Low Stock', width: '10%' },
  { key: 'outOfStock', label: 'Out of Stock', width: '11%' },
  { key: 'updated', label: 'Last Updated', width: '15%' },
]

export const inventoryReportRows = [
  { id: 'i1', stp: '14 MLD STP, Sarai, Haridwar', category: 'Coagulant', opening: 48, received: 510, consumed: 120, closing: 438, lowStock: 4, outOfStock: 1, updated: '15/06/2026 ,10:30 AM' },
  { id: 'i2', stp: '68 MLD STP, Sarai, Haridwar', category: 'Disinfectant', opening: 52, received: 480, consumed: 90, closing: 442, lowStock: 8, outOfStock: 3, updated: '15/06/2026 ,10:45 AM' },
  { id: 'i3', stp: '26 MLD STP Lakkar Ghat', category: 'Polymers', opening: 45, received: 550, consumed: 100, closing: 495, lowStock: 2, outOfStock: 0, updated: '15/06/2026 ,10:45 AM' },
  { id: 'i4', stp: '1.2 MLD Happy Valley, Dehradun', category: 'pH Adjusters', opening: 30, received: 220, consumed: 75, closing: 175, lowStock: 5, outOfStock: 2, updated: '15/06/2026 ,11:05 AM' },
  { id: 'i5', stp: '14 MLD STP, Sarai, Haridwar', category: 'Others', opening: 18, received: 140, consumed: 60, closing: 98, lowStock: 3, outOfStock: 1, updated: '15/06/2026 ,11:20 AM' },
]

/* ==========================================================================
   9. REMOTE CALIBRATION
   ========================================================================== */

/** Sampling-point toggles above the calibration table. */
export const calibrationPoints = [
  { key: 'Influent', label: 'Influent', defaultChecked: true },
  { key: 'Effluent', label: 'Effluent', defaultChecked: false },
]

export const calibrationColumns = [
  { key: 'sno', label: 'S.No.', width: '6%' },
  { key: 'certificate', label: 'Certificate', width: '9%' },
  { key: 'performedBy', label: 'Performed By', width: '15%' },
  { key: 'calibrationDate', label: 'Calibration Date', width: '13%' },
  { key: 'status', label: 'Status', width: '11%', sortable: true },
  { key: 'analyzer', label: 'Analyzer', width: '11%' },
  { key: 'remarks', label: 'Remarks', width: '22%' },
  { key: 'nextCalibration', label: 'Next Calibration', width: '13%' },
]

export const calibrationRows = [
  { id: 'cal-1', sno: 1, certificate: '1', performedBy: 'Rahul Sharma', calibrationDate: '19 May 2026', status: 'Successful', analyzer: 'pH Analyzer', remarks: 'Technical standard violation + Plant downtime exceeded 4 hours', nextCalibration: '19 May 2026', point: 'Influent' },
  { id: 'cal-2', sno: 2, certificate: '1', performedBy: 'Rahul Sharma', calibrationDate: '19 May 2026', status: 'Successful', analyzer: 'BOD Analyzer', remarks: 'Technical standard violation + Plant downtime exceeded 4 hours', nextCalibration: '19 May 2026', point: 'Influent' },
  { id: 'cal-3', sno: 3, certificate: '2', performedBy: 'Priya Menon', calibrationDate: '12 May 2026', status: 'Successful', analyzer: 'COD Analyzer', remarks: 'Zero and span drift corrected against reference standard', nextCalibration: '12 Nov 2026', point: 'Effluent' },
  { id: 'cal-4', sno: 4, certificate: '2', performedBy: 'Imran Qureshi', calibrationDate: '08 May 2026', status: 'Failed', analyzer: 'TSS Analyzer', remarks: 'Sensor fouling detected — recalibration scheduled after cleaning', nextCalibration: '15 May 2026', point: 'Effluent' },
  { id: 'cal-5', sno: 5, certificate: '3', performedBy: 'Arjun Rawat', calibrationDate: '02 May 2026', status: 'Successful', analyzer: 'Flow Meter', remarks: 'Calibrated within permissible tolerance, no deviation observed', nextCalibration: '02 Nov 2026', point: 'Influent' },
]

/* ==========================================================================
   10. TRANSACTION LOGS
   ========================================================================== */

export const transactionLogColumns = [
  { key: 'id', label: 'ID', width: '30%' },
  { key: 'uniqueId', label: 'Unique ID', width: '26%' },
  { key: 'createdOn', label: 'Created on', width: '20%' },
  { key: 'status', label: 'Status', width: '14%' },
  { key: 'details', label: 'Details', width: '10%', align: 'right' },
]

/**
 * Transaction Logs section — the influent and effluent streams sit side by
 * side, and a row expands to the reading it carried. `params` reuses the tile
 * shape from `stpRealtime`, so both panels render through the same component.
 */
export const streamTransactionColumns = [
  { key: 'id', label: 'ID', width: '38%' },
  { key: 'status', label: 'Status', width: '22%' },
  { key: 'timestamp', label: 'Created At', width: '26%' },
  { key: 'details', label: 'Details', width: '14%', align: 'right' },
]

const influentReading = {
  at: '19 May 2026, 05:30 PM',
  flow: { value: '748.83', unit: 'm³/hr' },
  params: [
    { key: 'bod', label: 'BOD', icon: 'bod', value: '394.74 mg/L', tone: 'breach', note: 'Ideal: 0 – 10' },
    { key: 'ph', label: 'pH', icon: 'ph', value: '7.48 pH', tone: 'ok', note: 'Ideal: 5.5 – 9' },
    { key: 'totalizer', label: 'Totalizer', icon: 'totalizer', value: '7577.16 m³', tone: 'ink', note: '(54.12%)' },
    { key: 'tss', label: 'TSS', icon: 'tss', value: '114.34 mg/L', tone: 'breach', note: 'Ideal: 0 – 20' },
    { key: 'cod', label: 'COD', icon: 'cod', value: '852.44 mg/L', tone: 'breach', note: 'Ideal: 0 – 50' },
    { key: 'no3n', label: 'NO₃-N', icon: 'no3n', value: '6 mg/L', tone: 'ok', note: 'Ideal: 0 – 10' },
  ],
}

const effluentReading = {
  at: '19 May 2026, 05:30 PM',
  flow: { value: '748.83', unit: 'm³/hr' },
  params: [
    { key: 'bod', label: 'BOD', icon: 'bod', value: '4.51 mg/L', tone: 'ok', note: 'Ideal: 0 – 10' },
    { key: 'ph', label: 'pH', icon: 'ph', value: '7.6 pH', tone: 'ok', note: 'Ideal: 5.5 – 9' },
    { key: 'totalizer', label: 'Totalizer', icon: 'totalizer', value: '7577.16 m³', tone: 'ink', note: '(54.12%)' },
    { key: 'tss', label: 'TSS', icon: 'tss', value: '134 mg/L', tone: 'breach', note: 'Ideal: 0 – 20' },
    { key: 'cod', label: 'COD', icon: 'cod', value: '24.12 mg/L', tone: 'ok', note: 'Ideal: 0 – 50' },
    { key: 'no3n', label: 'NO₃-N', icon: 'no3n', value: '6 mg/L', tone: 'ok', note: 'Ideal: 0 – 10' },
  ],
}

export const streamTransactions = {
  influent: {
    uniqueId: '14mldt4njqin',
    rows: [
      { id: 'cc3fc334-1c94-42...', status: 'Pending', timestamp: '15/02/2026 ,10:45 AM', reading: influentReading },
      { id: 'cc3fc334-1c94-42...', status: 'Pending', timestamp: '15/02/2026 ,10:30 AM', reading: influentReading },
    ],
  },
  effluent: {
    uniqueId: '14mldt4njqout',
    rows: [
      { id: 'cc3fc334-1c94-42...', status: 'Pending', timestamp: '15/02/2026 ,11:45 AM', reading: effluentReading },
      { id: 'cc3fc334-1c94-42...', status: 'Pending', timestamp: '15/02/2026 ,11:30 AM', reading: effluentReading },
    ],
  },
}

export const transactionLogRows = [
  {
    id: 'cc3fc334-1c94-4208-abc5-76b3b3054e0f',
    uniqueId: '210MLD17555984235130475IN',
    createdOn: '15/02/2026 ,10:30 AM',
    status: 'Pending',
    payload: '{ "readings": [ { "bod": 23.78, "cod": 79.44, "tss": 24.53, "timestamp": "2026-07-28 15:38:00" } ] }',
  },
  {
    id: 'cc3fc334-1c94-4208-abc5-76b3b3054e0f',
    uniqueId: '210MLD17555984235130475OUT',
    createdOn: '15/02/2026 ,10:30 AM',
    status: 'Pending',
    payload: '{ "readings": [ { "bod": 8.12, "cod": 41.06, "tss": 11.94, "timestamp": "2026-07-28 15:38:00" } ] }',
  },
  {
    id: 'a17be902-55d1-4c73-9f0a-1de44c9b2e77',
    uniqueId: '210MLD17555984235130476IN',
    createdOn: '15/02/2026 ,11:00 AM',
    status: 'Successful',
    payload: '{ "readings": [ { "bod": 22.41, "cod": 76.88, "tss": 23.10, "timestamp": "2026-07-28 16:08:00" } ] }',
  },
  {
    id: 'a17be902-55d1-4c73-9f0a-1de44c9b2e77',
    uniqueId: '210MLD17555984235130476OUT',
    createdOn: '15/02/2026 ,11:00 AM',
    status: 'Successful',
    payload: '{ "readings": [ { "bod": 7.65, "cod": 39.72, "tss": 10.88, "timestamp": "2026-07-28 16:08:00" } ] }',
  },
  {
    id: 'd90ca114-7b3e-45aa-8c21-05f7de1b9c40',
    uniqueId: '210MLD17555984235130477IN',
    createdOn: '15/02/2026 ,11:30 AM',
    status: 'Failed',
    payload: '{ "error": "sensor timeout", "retries": 3, "timestamp": "2026-07-28 16:38:00" }',
  },
]

/* ==========================================================================
   11. SETTINGS
   ========================================================================== */

export const settingsSections = [
  { key: 'profile', label: 'Profile', icon: 'user', blurb: 'Your account details as they appear across the portal.' },
  { key: 'notifications', label: 'Notifications', icon: 'bell', blurb: 'Choose what you are alerted about and how it reaches you.' },
  { key: 'thresholds', label: 'Alert Thresholds', icon: 'gauge', blurb: 'Limits that decide when a reading counts as a breach.' },
  { key: 'preferences', label: 'Preferences', icon: 'sliders', blurb: 'Regional formats and what the portal shows you first.' },
  { key: 'security', label: 'Security', icon: 'shield', blurb: 'Password, two-factor authentication and active sessions.' },
  { key: 'team', label: 'Team & Roles', icon: 'users', blurb: 'People with access to this portal and what they can do.' },
]

export const settingsProfile = {
  name: 'Rajesh Nair',
  email: 'rajesh.nair@namamigange.gov.in',
  phone: '+91 98110 44120',
  designation: 'Super Admin',
  employeeId: 'NG-EMP-00412',
  office: 'Haridwar Regional Office',
}

export const notificationAlerts = [
  { key: 'parameter', label: 'Parameter breach', blurb: 'A monitored parameter crosses its configured limit.', enabled: true },
  { key: 'equipment', label: 'Equipment failure', blurb: 'An analyzer, blower or pump reports a fault.', enabled: true },
  { key: 'penalty', label: 'Penalty updates', blurb: 'A penalty is raised, recovered or falls due.', enabled: true },
  { key: 'stock', label: 'Low / out-of-stock chemicals', blurb: 'Inventory for any chemical drops below its reorder level.', enabled: true },
  { key: 'camera', label: 'Camera offline', blurb: 'A CCTV feed stops recording for more than 10 minutes.', enabled: false },
  { key: 'manpower', label: 'Manpower shortage', blurb: 'Present headcount falls below the contracted requirement.', enabled: false },
]

/** Accordion groups on the Settings page. */
export const settingsAlertGroups = [
  {
    id: 'stp',
    title: 'STP Operational Alerts',
    blurb: 'You will receive alerts for your assigned STP.',
    color: '#15803D',
    icon: 'building',
    items: [
      { key: 'stp-offline', label: 'STP Offline', blurb: 'STP operational status changes to offline', enabled: true },
      { key: 'parameter-breach', label: 'Parameter Breach', blurb: 'Water quality parameter exceeds permitted limit', enabled: true },
      { key: 'equipment-failure', label: 'Equipment Failure', blurb: 'Critical equipment reports a failure', enabled: true },
      { key: 'cctv-offline', label: 'CCTV Offline', blurb: 'Assigned STP camera goes offline', enabled: true },
      { key: 'calibration-due', label: 'Calibration Due', blurb: 'Equipment requires scheduled calibration.', enabled: true },
      { key: 'compliance-issue', label: 'Compliance Issue', blurb: 'Alerts when penalty get imposed', enabled: true },
      { key: 'inventory-low', label: 'Inventory Low', blurb: 'Inventory reaches minimum level.', enabled: true },
    ],
  },
  {
    id: 'support',
    title: 'Support Tickets',
    blurb: 'You will receive alerts for your assigned STP.',
    color: '#7C3AED',
    icon: 'support',
    items: [
      { key: 'ticket-updates', label: 'Ticket Updates', blurb: 'Notified when your support ticket status changes', enabled: true },
      { key: 'ticket-comments', label: 'Ticket Comments', blurb: 'Notified when admin adds a comment to your ticket.', enabled: true },
    ],
  },
  {
    id: 'billing',
    title: 'Billing Notification',
    blurb: 'Receive updates about bills, approvals, penalties and payment status.',
    color: '#EA580C',
    icon: 'billing',
    items: [
      { key: 'bill-generated', label: 'Bill Generated', blurb: 'Get notified when a new bill is generated', enabled: true },
      { key: 'bill-approved', label: 'Bill Approved', blurb: 'Get notified when a bill is approved', enabled: true },
      { key: 'penalty-imposed', label: 'Penalty Imposed', blurb: 'Get notified when a penalty is applied to a bill', enabled: true },
    ],
  },
]

export const notificationChannels = [
  { key: 'email', label: 'Email', blurb: settingsProfile.email, enabled: true },
  { key: 'sms', label: 'SMS', blurb: settingsProfile.phone, enabled: true },
  { key: 'push', label: 'In-app', blurb: 'Bell icon in the portal header.', enabled: true },
]

export type InboxNotificationKind = 'stp-offline' | 'ticket-update'

export type InboxNotification = {
  id: string
  kind: InboxNotificationKind
  title: string
  message: string
  time: string
  read: boolean
  action?: 'comment'
  href?: string
}

export const inboxNotifications: InboxNotification[] = [
  {
    id: 'n-stp-offline-1',
    kind: 'stp-offline',
    title: 'STP Offline',
    message: 'STP Haridwar-01 has stopped transmitting operational data.',
    time: 'Today at 9:42 AM',
    read: false,
    href: '/live-delay-offline',
  },
  {
    id: 'n-ticket-1048',
    kind: 'ticket-update',
    title: 'Support Ticket Updated',
    message: 'Ticket #TKT-1048 requires additional clarification from the vendor and has been on and off for a while.',
    time: 'Last Wednesday at 9:42 AM',
    read: true,
    action: 'comment',
    href: '/support-tickets',
  },
  {
    id: 'n-stp-offline-2',
    kind: 'stp-offline',
    title: 'STP Offline',
    message: 'STP Haridwar-01 has stopped transmitting operational data.',
    time: 'Today at 9:42 AM',
    read: false,
    href: '/live-delay-offline',
  },
]

export const digestTimeOptions = ['07:00 AM', '09:00 AM', '06:00 PM', '09:00 PM']

export const alertThresholds = [
  { key: 'ph', parameter: 'pH', unit: '—', min: '6.5', max: '8.5', warnAt: '90' },
  { key: 'bod', parameter: 'BOD', unit: 'mg/L', min: '0', max: '10', warnAt: '85' },
  { key: 'cod', parameter: 'COD', unit: 'mg/L', min: '0', max: '50', warnAt: '85' },
  { key: 'tss', parameter: 'TSS', unit: 'mg/L', min: '0', max: '20', warnAt: '90' },
  { key: 'flow', parameter: 'Flow', unit: 'MLD', min: '0', max: '14', warnAt: '95' },
  { key: 'temp', parameter: 'Temperature', unit: '°C', min: '15', max: '35', warnAt: '90' },
]

export const breachGraceOptions = ['5 minutes', '15 minutes', '30 minutes', '1 hour']

export const preferenceOptions = {
  language: ['English (India)', 'हिन्दी', 'বাংলা'],
  timezone: ['(GMT +05:30) India Standard Time', '(GMT +00:00) UTC'],
  dateFormat: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
  timeFormat: ['12-hour (10:30 AM)', '24-hour (10:30)'],
  landingPage: ['Dashboard', 'STP Management', 'Compliance', 'Data Reports'],
  defaultStp: ['All STP’s', '14 MLD STP, Sarai', '68 MLD STP, Jagjeetpur', '26 MLD STP Lakkar Ghat'],
  rowsPerPage: ['10 rows', '25 rows', '50 rows', '100 rows'],
}

export const sessionTimeoutOptions = ['15 minutes', '30 minutes', '1 hour', '4 hours']

export const activeSessions = [
  { key: 's1', device: 'Chrome on macOS', location: 'Haridwar, Uttarakhand', lastActive: 'Active now', current: true },
  { key: 's2', device: 'Safari on iPhone', location: 'Haridwar, Uttarakhand', lastActive: '2 hours ago', current: false },
  { key: 's3', device: 'Edge on Windows', location: 'Dehradun, Uttarakhand', lastActive: 'Yesterday, 6:40 PM', current: false },
]

export const teamMembers = [
  { key: 't1', name: 'Rajesh Nair', email: 'rajesh.nair@namamigange.gov.in', role: 'Super Admin', status: 'Active' },
  { key: 't2', name: 'Priya Menon', email: 'priya.menon@namamigange.gov.in', role: 'Compliance Officer', status: 'Active' },
  { key: 't3', name: 'Imran Qureshi', email: 'imran.qureshi@namamigange.gov.in', role: 'Site Engineer', status: 'Active' },
  { key: 't4', name: 'Sunita Devi', email: 'sunita.devi@namamigange.gov.in', role: 'Inventory Manager', status: 'Invited' },
  { key: 't5', name: 'Arjun Rawat', email: 'arjun.rawat@namamigange.gov.in', role: 'Viewer', status: 'Inactive' },
]

/* ==========================================================================
   12. SUPPORT TICKETS
   ========================================================================== */

export const supportTicketColumns = [
  { key: 'id', label: 'Ticket ID', width: '13%', sortable: true },
  { key: 'issue', label: 'Issue Raised', width: '28%' },
  { key: 'date', label: 'Date', width: '14%', sortable: true },
  { key: 'priority', label: 'Priority', width: '12%' },
  { key: 'status', label: 'Status', width: '15%' },
  { key: 'updatedOn', label: 'Last Updated On', width: '18%' },
]

/** Category and priority choices offered by the "Raise a Ticket" form. */
export const supportTicketCategories = [
  'Penalty',
  'Payment',
  'Plant Maintenance',
  'Compliance',
  'CCTV / Devices',
  'Manpower',
  'Other',
]

export const supportTicketSubCategories: Record<string, string[]> = {
  Penalty: ['Penalty clarification for STP', 'Incorrect penalty amount', 'Penalty waiver request'],
  Payment: ['Payment-related query', 'Invoice pending', 'Duplicate deduction'],
  'Plant Maintenance': ['Plant maintenance issue', 'Equipment failure', 'Blower tripping'],
  Compliance: ['Readings mismatch', 'Reopen closed violation', 'Unable to export report'],
  'CCTV / Devices': ['Camera offline', 'Recording storage full', 'Device malfunction'],
  Manpower: ['Attendance not recorded', 'Shortage against headcount', 'Add site engineer'],
  Other: ['General query', 'Portal access', 'Other issue'],
}

export const supportTicketPriorities = [
  { id: 'Low', label: 'Low' },
  { id: 'Mid', label: 'Medium' },
  { id: 'High', label: 'High' },
]

export const supportTicketRows = [
  { id: 'TKT-10245', category: 'Penalty', issue: 'Penalty clarification for STP', date: '19 May 2026', priority: 'Low', status: 'Action Required', updatedOn: '20 May 2026' },
  { id: 'TKT-10241', category: 'Penalty', issue: 'Incorrect penalty amount', date: '19 May 2026', priority: 'Mid', status: 'In Progress', updatedOn: '19 May 2026' },
  { id: 'TKT-10236', category: 'Payment', issue: 'Payment-related query', date: '19 May 2026', priority: 'High', status: 'Closed', updatedOn: '19 May 2026' },
  { id: 'TKT-10218', category: 'Plant Maintenance', issue: 'Plant maintenance issue', date: '19 May 2026', priority: 'High', status: 'Open', updatedOn: '19 May 2026' },
  { id: 'TKT-10204', category: 'CCTV / Devices', issue: 'Influent camera offline since morning', date: '18 May 2026', priority: 'High', status: 'In Progress', updatedOn: '19 May 2026' },
  { id: 'TKT-10199', category: 'Compliance', issue: 'BOD readings not matching lab report', date: '18 May 2026', priority: 'Mid', status: 'Action Required', updatedOn: '18 May 2026' },
  { id: 'TKT-10187', category: 'Manpower', issue: 'Night shift attendance not recorded', date: '17 May 2026', priority: 'Low', status: 'Closed', updatedOn: '18 May 2026' },
  { id: 'TKT-10175', category: 'Payment', issue: 'Invoice against contract CN-014 pending', date: '17 May 2026', priority: 'Mid', status: 'Open', updatedOn: '17 May 2026' },
  { id: 'TKT-10166', category: 'Plant Maintenance', issue: 'Blower tripping repeatedly at Kankhal', date: '16 May 2026', priority: 'High', status: 'In Progress', updatedOn: '17 May 2026' },
  { id: 'TKT-10154', category: 'Compliance', issue: 'Request to reopen closed violation', date: '16 May 2026', priority: 'Low', status: 'Closed', updatedOn: '16 May 2026' },
  { id: 'TKT-10142', category: 'CCTV / Devices', issue: 'Recording storage almost full', date: '15 May 2026', priority: 'Mid', status: 'Action Required', updatedOn: '16 May 2026' },
  { id: 'TKT-10133', category: 'Other', issue: 'Add new site engineer to the portal', date: '15 May 2026', priority: 'Low', status: 'Open', updatedOn: '15 May 2026' },
  { id: 'TKT-10121', category: 'Penalty', issue: 'Penalty waiver request for March', date: '14 May 2026', priority: 'High', status: 'Action Required', updatedOn: '15 May 2026' },
  { id: 'TKT-10118', category: 'Manpower', issue: 'Shortage against contracted headcount', date: '14 May 2026', priority: 'Mid', status: 'Closed', updatedOn: '14 May 2026' },
  { id: 'TKT-10106', category: 'Payment', issue: 'Duplicate deduction in April billing', date: '13 May 2026', priority: 'High', status: 'In Progress', updatedOn: '14 May 2026' },
  { id: 'TKT-10094', category: 'Other', issue: 'Unable to export compliance report', date: '13 May 2026', priority: 'Low', status: 'Closed', updatedOn: '13 May 2026' },
]

/** Summary cards above the table — counted off the rows so they stay in step. */
export const buildSupportTicketStats = (rows) => {
  const count = (status) => rows.filter((r) => r.status === status).length
  const share = (n) => (rows.length === 0 ? '0%' : `${((n / rows.length) * 100).toFixed(1)}%`)
  const open = count('Open')
  const progress = count('In Progress')
  const closed = count('Closed')
  const action = count('Action Required')

  return [
    { key: 'total', label: 'Total Tickets', value: rows.length, note: 'Across all location', icon: 'ticket', tone: 'brand' },
    { key: 'open', label: 'Open Tickets', value: open, note: share(open), icon: 'ticket', tone: 'dangerQuiet' },
    { key: 'progress', label: 'In Progress', value: progress, note: share(progress), icon: 'ticket', tone: 'warnQuiet' },
    { key: 'closed', label: 'Closed', value: closed, note: share(closed), icon: 'ticket', tone: 'okQuiet' },
    { key: 'action', label: 'Action Required', value: action, note: 'Out of In progress', icon: 'clock', tone: 'warnQuiet' },
  ]
}

/* ==========================================================================
   13. SUPPORT TICKETS — ADMIN
   ========================================================================== */

export const adminTicketColumns = [
  { key: 'id', label: 'Ticket ID', width: '11%', sortable: true },
  { key: 'createdOn', label: 'Created / Due Date', width: '17%' },
  { key: 'contractor', label: 'Contractor', width: '15%' },
  { key: 'category', label: 'Category', width: '11%' },
  { key: 'priority', label: 'Priority', width: '10%' },
  { key: 'status', label: 'Status', width: '12%' },
  { key: 'sla', label: 'SLA Status', width: '13%' },
  { key: 'assignee', label: 'Assigned To', width: '13%' },
  { key: 'details', label: 'Details', width: '8%' },
]

/**
 * `sla` is the countdown shown next to the clock glyph — null once the clock
 * has stopped (a ticket nobody has picked up yet, or one already closed).
 */
export const adminTicketRows = [
  { id: 'TKT-10245', createdOn: '15/02/2026 ,10:30 AM', dueOn: '16/02/2026 ,10:30 AM', contractor: 'ABC Infra Pvt. Ltd', category: 'Penalty', priority: 'Low', status: 'Pending', sla: '1hr 22m left', assignee: 'Arjun Verma' },
  { id: 'TKT-10241', createdOn: '15 May 2026 ,10:30 AM', dueOn: '16 May 2026 ,10:30 AM', contractor: 'XYZ Water Works', category: 'Penalty', priority: 'Mid', status: 'In Progress', sla: '1hr 00m left', assignee: 'Vishal Gupta' },
  { id: 'TKT-10236', createdOn: '15 May 2026 ,10:30 AM', dueOn: '16 May 2026 ,10:30 AM', contractor: 'GreenFlow Ltd.', category: 'Payment', priority: 'High', status: 'Closed', sla: '52m left', assignee: 'Neha Singh' },
  { id: 'TKT-10218', createdOn: '15 May 2026 ,10:30 AM', dueOn: '16 May 2026 ,10:30 AM', contractor: 'AquaTech Ltd.', category: 'Technical', priority: 'High', status: 'Open', sla: null, assignee: 'Neha Gupta' },
  { id: 'TKT-10204', createdOn: '14 May 2026 ,09:10 AM', dueOn: '15 May 2026 ,09:10 AM', contractor: 'AquaTech Ltd.', category: 'Technical', priority: 'High', status: 'In Progress', sla: '3hr 40m left', assignee: 'Imran Qureshi' },
  { id: 'TKT-10199', createdOn: '14 May 2026 ,08:05 AM', dueOn: '15 May 2026 ,08:05 AM', contractor: 'GreenFlow Ltd.', category: 'Compliance', priority: 'Mid', status: 'Pending', sla: '26m left', assignee: 'Priya Menon' },
  { id: 'TKT-10187', createdOn: '13 May 2026 ,06:45 PM', dueOn: '14 May 2026 ,06:45 PM', contractor: 'ABC Infra Pvt. Ltd', category: 'Manpower', priority: 'Low', status: 'Closed', sla: null, assignee: 'Arjun Verma' },
  { id: 'TKT-10175', createdOn: '13 May 2026 ,04:20 PM', dueOn: '14 May 2026 ,04:20 PM', contractor: 'XYZ Water Works', category: 'Payment', priority: 'Mid', status: 'Open', sla: null, assignee: 'Vishal Gupta' },
  { id: 'TKT-10166', createdOn: '12 May 2026 ,11:55 AM', dueOn: '13 May 2026 ,11:55 AM', contractor: 'Ganga Enviro Services', category: 'Technical', priority: 'High', status: 'In Progress', sla: '48m left', assignee: 'Imran Qureshi' },
  { id: 'TKT-10154', createdOn: '12 May 2026 ,10:15 AM', dueOn: '13 May 2026 ,10:15 AM', contractor: 'GreenFlow Ltd.', category: 'Compliance', priority: 'Low', status: 'Closed', sla: null, assignee: 'Priya Menon' },
  { id: 'TKT-10142', createdOn: '11 May 2026 ,05:30 PM', dueOn: '12 May 2026 ,05:30 PM', contractor: 'AquaTech Ltd.', category: 'Technical', priority: 'Mid', status: 'Pending', sla: '2hr 05m left', assignee: 'Neha Singh' },
  { id: 'TKT-10133', createdOn: '11 May 2026 ,02:40 PM', dueOn: '12 May 2026 ,02:40 PM', contractor: 'Ganga Enviro Services', category: 'Other', priority: 'Low', status: 'Open', sla: null, assignee: 'Neha Gupta' },
  { id: 'TKT-10121', createdOn: '10 May 2026 ,12:10 PM', dueOn: '11 May 2026 ,12:10 PM', contractor: 'ABC Infra Pvt. Ltd', category: 'Penalty', priority: 'High', status: 'Pending', sla: '15m left', assignee: 'Arjun Verma' },
  { id: 'TKT-10118', createdOn: '10 May 2026 ,09:25 AM', dueOn: '11 May 2026 ,09:25 AM', contractor: 'XYZ Water Works', category: 'Manpower', priority: 'Mid', status: 'Closed', sla: null, assignee: 'Vishal Gupta' },
  { id: 'TKT-10106', createdOn: '09 May 2026 ,07:50 PM', dueOn: '10 May 2026 ,07:50 PM', contractor: 'GreenFlow Ltd.', category: 'Payment', priority: 'High', status: 'In Progress', sla: '1hr 35m left', assignee: 'Priya Menon' },
  { id: 'TKT-10094', createdOn: '09 May 2026 ,03:05 PM', dueOn: '10 May 2026 ,03:05 PM', contractor: 'Ganga Enviro Services', category: 'Other', priority: 'Low', status: 'Closed', sla: null, assignee: 'Neha Gupta' },
]

/** Summary cards above the admin table — the notes carry each share of the total. */
export const buildAdminTicketStats = (rows) => {
  const count = (status) => rows.filter((r) => r.status === status).length
  const share = (n) => (rows.length === 0 ? '0%' : `${((n / rows.length) * 100).toFixed(1)}%`)
  const open = count('Open')
  const progress = count('In Progress')
  const closed = count('Closed')

  return [
    { key: 'total', label: 'Total Tickets', value: rows.length, note: "Across all STP's", icon: 'ticket', tone: 'brand' },
    { key: 'open', label: 'Open Tickets', value: open, note: share(open), icon: 'ticket', tone: 'okQuiet' },
    { key: 'progress', label: 'In Progress', value: progress, note: share(progress), icon: 'ticket', tone: 'warnQuiet' },
    { key: 'closed', label: 'Closed Tickets', value: closed, note: share(closed), icon: 'ticket', tone: 'dangerQuiet' },
    { key: 'action', label: 'Action Required', value: count('Pending'), note: 'Out of In progress', icon: 'clock', tone: 'violetQuiet' },
  ]
}

/* ==========================================================================
   14. TICKET DETAILS
   ========================================================================== */

const TICKET_TIMELINE = [
  { key: 'raised', label: 'Ticket Raised', time: '15/02/2026, 10:30 AM', icon: 'raised' },
  { key: 'assigned', label: 'Ticket Assigned', time: '15/02/2026, 10:30 AM', icon: 'assigned' },
  { key: 'reply', label: 'Support Team Reply', time: '15/02/2026, 10:30 AM', icon: 'reply' },
  { key: 'info', label: 'Additional Information Requested', time: '15/02/2026, 10:30 AM', icon: 'info' },
  { key: 'document', label: 'Document Submitted', time: '15/02/2026, 10:30 AM', icon: 'document' },
  { key: 'resolution', label: 'Resolution Provided', time: '15/02/2026, 10:30 AM', icon: 'resolution' },
  { key: 'confirmation', label: 'Pending Your Confirmation', time: '15/02/2026, 10:30 AM', icon: 'confirmation' },
]

const TICKET_CONVERSATION = [
  {
    id: 'm1',
    author: 'You',
    side: 'left',
    time: '15/02/2026, 10:30 AM',
    text: 'I need further clarification regarding the penalty applied to my STP with penalty calculation details',
    attachments: [{ name: 'CN-001_Contract.pdf', size: '200 MB' }],
  },
  {
    id: 'm2',
    author: 'Support Team',
    side: 'right',
    time: '15/02/2026, 10:30 AM',
    text: 'We have escalated this to the payments team. You will receive an update within 24 hours.',
  },
  {
    id: 'm3',
    author: 'You',
    side: 'left',
    time: '15/02/2026, 10:30 AM',
    text: 'Thank you please do the meaningful!',
  },
]

const TICKET_DESCRIPTION =
  'Lorem ipsum dolor sit amet consectetur. In nunc ultrices ultricies et non morbi. Augue praesent duis in lacus et mi pharetra velit cursus. Nibh ridiculus dui nam elit consequat sodales sodales tristique eget. Morbi diam velit orci vehicula.'

/** Issue category label per ticket category — shown beside the ticket ID. */
const CATEGORY_TITLES = {
  Penalty: 'Penalty Clarification',
  Payment: 'Payment Clarification',
  Compliance: 'Compliance Clarification',
  Technical: 'Technical Support',
  'Plant Maintenance': 'Maintenance Request',
  'CCTV / Devices': 'Device Support',
  Manpower: 'Manpower Request',
  Other: 'General Query',
}

/**
 * Detail view for a ticket, derived from its table row so every row in both
 * the vendor and the admin table opens onto a full page.
 */
export const buildTicketDetail = (row) => ({
  id: row.id,
  status: row.status,
  priority: row.priority,
  createdOn: row.createdOn ?? `${row.date} ,10:30 AM`,
  category: { title: CATEGORY_TITLES[row.category] ?? 'General Query', group: row.category },
  lastUpdate: {
    message: row.issue ?? 'Please provide the penalty calculation details for May',
    on: '15/02/2026 ,10:30 AM',
  },
  raisedBy: {
    userId: '#VND1456123',
    name: row.contractor ?? 'ABC Infra Pvt. Ltd',
    phone: '+91 9856452310',
  },
  assignedTo: {
    userId: '#ADM1456123',
    name: row.assignee ?? 'Arjun Verma',
    phone: '+91 9856452310',
  },
  description: row.description ?? TICKET_DESCRIPTION,
  attachments: [{ name: 'CN-001_Contract.pdf', size: '200 MB' }],
  violationId: 'VL123456',
  conversation: TICKET_CONVERSATION,
  timeline: TICKET_TIMELINE,
})

/* ==========================================================================
   15. LIVE DELAY / OFFLINE
   ========================================================================== */

export const liveDelayColumns = [
  { key: 'sno', label: 'S.No.', width: '9%' },
  { key: 'stp', label: 'STP', width: '31%', sortable: true },
  { key: 'statusFrom', label: 'Status From', width: '22%' },
  { key: 'statusTo', label: 'Status To', width: '18%' },
  { key: 'status', label: 'Current Status', width: '20%', sortable: true },
]

/** `statusTo` reads "Present" while the STP is still sitting in that state. */
export const liveDelayRows = [
  { id: 'ld-1', sno: 1, stp: '14 MLD STP, Sarai, Haridwar', statusFrom: '19 May 2026, 05:30 PM', statusTo: 'Present', status: 'Online' },
  { id: 'ld-2', sno: 2, stp: '68 MLD STP, Jagjeetpur, Haridwar', statusFrom: '19 May 2026, 05:30 PM', statusTo: 'Present', status: 'Offline' },
  { id: 'ld-3', sno: 3, stp: '26 MLD STP, Lakkar Ghat, Rishikesh', statusFrom: '19 May 2026, 05:30 PM', statusTo: 'Present', status: 'Delay' },
  { id: 'ld-4', sno: 4, stp: '18 MLD STP, Sarai, Haridwar', statusFrom: '19 May 2026, 02:10 PM', statusTo: '19 May 2026, 04:45 PM', status: 'Online' },
  { id: 'ld-5', sno: 5, stp: '27 MLD STP, Kankhal, Haridwar', statusFrom: '19 May 2026, 11:05 AM', statusTo: 'Present', status: 'Delay' },
  { id: 'ld-6', sno: 6, stp: '5 MLD STP, Bhagwanpur, Haridwar', statusFrom: '18 May 2026, 09:40 PM', statusTo: 'Present', status: 'Offline' },
  { id: 'ld-7', sno: 7, stp: '12 MLD STP, Jwalapur, Haridwar', statusFrom: '18 May 2026, 06:30 PM', statusTo: '19 May 2026, 08:00 AM', status: 'Online' },
  { id: 'ld-8', sno: 8, stp: '38 MLD STP, Bindukhatta, Nainital', statusFrom: '18 May 2026, 03:15 PM', statusTo: 'Present', status: 'Online' },
  { id: 'ld-9', sno: 9, stp: '20 MLD STP, Chandreshwar Nagar, Rishikesh', statusFrom: '18 May 2026, 10:50 AM', statusTo: 'Present', status: 'Delay' },
  { id: 'ld-10', sno: 10, stp: '7.5 MLD STP, Muni Ki Reti, Tehri', statusFrom: '17 May 2026, 08:25 PM', statusTo: 'Present', status: 'Online' },
  { id: 'ld-11', sno: 11, stp: '6 MLD STP, Swargashram, Pauri', statusFrom: '17 May 2026, 05:00 PM', statusTo: '18 May 2026, 09:30 AM', status: 'Offline' },
  { id: 'ld-12', sno: 12, stp: '9 MLD STP, Rasoolpur, Haridwar', statusFrom: '17 May 2026, 01:45 PM', statusTo: 'Present', status: 'Online' },
  { id: 'ld-13', sno: 13, stp: '3 MLD STP, Tapovan, Tehri', statusFrom: '16 May 2026, 07:20 PM', statusTo: 'Present', status: 'Delay' },
  { id: 'ld-14', sno: 14, stp: '15 MLD STP, Sarai Annex, Haridwar', statusFrom: '16 May 2026, 12:00 PM', statusTo: 'Present', status: 'Online' },
  { id: 'ld-15', sno: 15, stp: '11 MLD STP, Roorkee, Haridwar', statusFrom: '16 May 2026, 08:35 AM', statusTo: 'Present', status: 'Offline' },
  { id: 'ld-16', sno: 16, stp: '4 MLD STP, Laksar, Haridwar', statusFrom: '15 May 2026, 06:15 PM', statusTo: 'Present', status: 'Online' },
]

export const buildLiveDelayStats = (rows) => {
  const count = (status) => rows.filter((r) => r.status === status).length
  const note = "Across all STP's"

  return [
    { key: 'total', label: "Total STP's", value: rows.length, note, icon: 'building', tone: 'brand' },
    { key: 'online', label: 'Online', value: count('Online'), note, icon: 'building', tone: 'ok' },
    { key: 'offline', label: 'Offline', value: count('Offline'), note, icon: 'building', tone: 'slate' },
    { key: 'delay', label: 'Delay', value: count('Delay'), note, icon: 'building', tone: 'warn' },
  ]
}

/* ==========================================================================
   16. TEAM MANAGEMENT
   ========================================================================== */

export const teamTabs = ['User Management', 'Role Management', 'Audit Logs']

/** Roles double as the filter list and as the cards on the Role Management tab. */
export const teamRoleNames = ['Super Admin', 'Content Manager', 'Vendor', 'Field Volunteer', 'Viewer']

export const teamUserColumns = [
  { key: 'name', label: 'User', width: '19%' },
  { key: 'phone', label: 'Phone', width: '15%' },
  { key: 'email', label: 'Email', width: '22%' },
  { key: 'role', label: 'Role', width: '15%', sortable: true },
  { key: 'status', label: 'Status', width: '11%', sortable: true },
  { key: 'lastLogin', label: 'Last Login', width: '13%' },
  { key: 'actions', label: 'Actions', width: '10%' },
]

export const teamUsers = [
  { id: 'u-1', userId: '#1231456', name: 'Rajesh Nair', phone: '+91 9856452310', email: 'rajeshnair1234@gmail.com', role: 'Super Admin', status: 'Active', lastLogin: '15/02/2026 ,10:30 AM' },
  { id: 'u-2', userId: '#1231457', name: 'Priya Menon', phone: '+91 9856452311', email: 'priyamenon@gmail.com', role: 'Content Manager', status: 'Inactive', lastLogin: '15/02/2026 ,10:30 AM' },
  { id: 'u-3', userId: '#1231458', name: 'Imran Qureshi', phone: '+91 9856452312', email: 'imranqureshi@gmail.com', role: 'Vendor', status: 'Active', lastLogin: '15/02/2026 ,10:30 AM' },
  { id: 'u-4', userId: '#1231459', name: 'Sunita Devi', phone: '+91 9856452313', email: 'sunitadevi@gmail.com', role: 'Field Volunteer', status: 'Active', lastLogin: '14/02/2026 ,06:10 PM' },
  { id: 'u-5', userId: '#1231460', name: 'Arjun Rawat', phone: '+91 9856452314', email: 'arjunrawat@gmail.com', role: 'Viewer', status: 'Inactive', lastLogin: '14/02/2026 ,04:45 PM' },
  { id: 'u-6', userId: '#1231461', name: 'Neha Singh', phone: '+91 9856452315', email: 'nehasingh@gmail.com', role: 'Content Manager', status: 'Active', lastLogin: '14/02/2026 ,11:20 AM' },
  { id: 'u-7', userId: '#1231462', name: 'Vishal Gupta', phone: '+91 9856452316', email: 'vishalgupta@gmail.com', role: 'Vendor', status: 'Active', lastLogin: '13/02/2026 ,09:05 PM' },
  { id: 'u-8', userId: '#1231463', name: 'Ananya Sharma', phone: '+91 9856452317', email: 'ananyasharma@gmail.com', role: 'Super Admin', status: 'Active', lastLogin: '13/02/2026 ,08:30 AM' },
  { id: 'u-9', userId: '#1231464', name: 'Rahul Verma', phone: '+91 9856452318', email: 'rahulverma@gmail.com', role: 'Field Volunteer', status: 'Active', lastLogin: '12/02/2026 ,05:55 PM' },
  { id: 'u-10', userId: '#1231465', name: 'Kavita Joshi', phone: '+91 9856452319', email: 'kavitajoshi@gmail.com', role: 'Viewer', status: 'Active', lastLogin: '12/02/2026 ,02:40 PM' },
  { id: 'u-11', userId: '#1231466', name: 'Deepak Rana', phone: '+91 9856452320', email: 'deepakrana@gmail.com', role: 'Vendor', status: 'Inactive', lastLogin: '11/02/2026 ,07:15 PM' },
  { id: 'u-12', userId: '#1231467', name: 'Meera Pillai', phone: '+91 9856452321', email: 'meerapillai@gmail.com', role: 'Content Manager', status: 'Active', lastLogin: '11/02/2026 ,10:00 AM' },
]

export const buildTeamUserStats = (rows, roleCount) => {
  const count = (status) => rows.filter((r) => r.status === status).length
  const share = (n) => (rows.length === 0 ? '0%' : `${((n / rows.length) * 100).toFixed(1)}%`)
  const active = count('Active')
  const inactive = count('Inactive')

  return [
    { key: 'total', label: 'Total Users', value: rows.length, note: "Across all STP's", icon: 'peopleTeam', tone: 'brand' },
    { key: 'active', label: 'Active Users', value: active, note: share(active), icon: 'peopleTeam', tone: 'okQuiet' },
    { key: 'inactive', label: 'Inactive Users', value: inactive, note: share(inactive), icon: 'peopleTeam', tone: 'dangerQuiet' },
    { key: 'roles', label: 'Roles', value: roleCount, note: 'System Roles', icon: 'personRibbon', tone: 'violetQuiet' },
  ]
}

export const teamRoles = [
  {
    id: 'r-1',
    name: 'Super Admin',
    status: 'Active',
    description: 'Complete administrative access across STP, surveillance, and reporting modules',
    users: 10,
    permissions: 10,
    createdOn: '15/02/2026',
  },
  {
    id: 'r-2',
    name: 'Content Manager',
    status: 'Active',
    description: "Manages content, updates, and media across the platform's public-facing modules",
    users: 10,
    permissions: 10,
    createdOn: '15/02/2026',
  },
  {
    id: 'r-3',
    name: 'Vendor',
    status: 'Active',
    description: 'Restricted access to view and manage assigned services, tasks, or contracts',
    users: 10,
    permissions: 10,
    createdOn: '15/02/2026',
  },
  {
    id: 'r-4',
    name: 'Field Volunteer',
    status: 'Active',
    description: 'On-ground access to record observations, attendance, and site level updates',
    users: 6,
    permissions: 4,
    createdOn: '15/02/2026',
  },
  {
    id: 'r-5',
    name: 'Viewer',
    status: 'Inactive',
    description: 'Read-only access to dashboards and reports with no editing rights',
    users: 4,
    permissions: 2,
    createdOn: '15/02/2026',
  },
]

/** Modules and their sub-permissions offered by the Create Role form. */
export const rolePermissionModules = [
  { id: 'dashboard', label: 'Dashboard', blurb: 'Access to dashboard and overview', color: '#2563EB', icon: 'dashboard', permissions: [] },
  {
    id: 'stp',
    label: 'STP Management',
    blurb: 'Manage STPs, Sensors and Operational Data',
    color: '#15803D',
    icon: 'building',
    permissions: ['Manpower', 'Inventory', 'CCTV', 'Remote Calibration', 'Transaction Logs', 'Contracts', 'Compliance', 'Billing'],
  },
  { id: 'cctv', label: 'Live Camera Feed', blurb: 'View live and recorded camera feed', color: '#B45309', icon: 'camera', permissions: [] },
  {
    id: 'support',
    label: 'Support Tickets',
    blurb: 'View and manage support tickets',
    color: '#7C3AED',
    icon: 'support',
    permissions: ['View Tickets', 'Manage Tickets'],
  },
  {
    id: 'reports',
    label: 'Data Reports',
    blurb: 'Access and export data reports',
    color: '#DC2626',
    icon: 'reports',
    permissions: ['Manpower', 'Inventory', 'CCTV', 'Contracts', 'Compliance'],
  },
  {
    id: 'team',
    label: 'Team Management',
    blurb: 'Manage user roles and permission',
    color: '#EA580C',
    icon: 'team',
    permissions: ['User Management', 'Role Management', 'Audit Logs'],
  },
  { id: 'settings', label: 'Settings', blurb: 'Access to basic dashboard settings', color: '#15803D', icon: 'settings', permissions: [] },
]

export const roleStatusOptions = ['Active', 'Inactive']

export const permissionTemplates = ['Full Access', 'Read Only', 'Operations', 'Reporting']

const allModuleGrants = () =>
  Object.fromEntries(
    rolePermissionModules.map((m) => [m.id, m.permissions.length > 0 ? [...m.permissions] : [m.label]]),
  )

/** Starting grants shown when a stored role is opened in the edit modal. */
export const roleGrantedPresets = {
  'Super Admin': allModuleGrants(),
  'Content Manager': {
    dashboard: ['Dashboard'],
    reports: ['Manpower', 'Inventory', 'CCTV', 'Contracts', 'Compliance'],
    settings: ['Settings'],
  },
  Vendor: {
    stp: ['Inventory', 'Contracts', 'Billing'],
    support: ['View Tickets'],
    reports: ['Contracts', 'Compliance'],
  },
  'Field Volunteer': {
    dashboard: ['Dashboard'],
    stp: ['Manpower', 'CCTV'],
    cctv: ['Live Camera Feed'],
  },
  Viewer: {
    dashboard: ['Dashboard'],
    reports: ['Manpower'],
  },
}

export const grantsForRole = (role) => role?.granted ?? roleGrantedPresets[role?.name] ?? {}

/* --------------------------------------------------------------------------
   Audit logs
   -------------------------------------------------------------------------- */

export const auditLogColumns = [
  { key: 'id', label: 'Log ID', width: '9%' },
  { key: 'member', label: 'Team Member', width: '16%' },
  { key: 'action', label: 'Action', width: '13%', sortable: true },
  { key: 'change', label: 'Change', width: '15%' },
  { key: 'module', label: 'Module', width: '14%', sortable: true },
  { key: 'performedBy', label: 'Performed By', width: '16%' },
  { key: 'timestamp', label: 'Timestamp', width: '11%' },
  { key: 'details', label: 'Details', width: '6%' },
]

export const auditActions = ['Role Updated', 'User Removed', 'Status Change', 'Member Added']

/** `details` is the drawer that opens under a row. */
export const auditLogs = [
  {
    id: 'AL-1025',
    member: 'Rahul Verma',
    memberId: '#1231456',
    action: 'Role Updated',
    change: 'Super Admin → Content Manager',
    module: 'Team Management',
    performedBy: 'Ananya Sharma',
    performedById: '#1231452',
    timestamp: '15/02/2026 ,10:30 AM',
    details: [
      { label: 'Previous Role', value: 'Super Admin' },
      { label: 'Current Role', value: 'Content Manager' },
      { label: 'IP Address', value: '192.168.1.45' },
    ],
  },
  {
    id: 'AL-1024',
    member: 'Rahul Verma',
    memberId: '#1231456',
    action: 'User Removed',
    change: 'Removed from Team',
    module: 'Team Management',
    performedBy: 'Ananya Sharma',
    performedById: '#1231452',
    timestamp: '15/02/2026 ,10:30 AM',
    details: [
      { label: 'Previous Role', value: 'Vendor' },
      { label: 'Current Role', value: '—' },
      { label: 'IP Address', value: '192.168.1.45' },
    ],
  },
  {
    id: 'AL-1026',
    member: 'Rahul Verma',
    memberId: '#1231456',
    action: 'Status Change',
    change: 'Active → Inactive',
    module: 'Team Management',
    performedBy: 'Ananya Sharma',
    performedById: '#1231452',
    timestamp: '15/02/2026 ,10:30 AM',
    details: [
      { label: 'Previous Status', value: 'Active' },
      { label: 'Current Status', value: 'Inactive' },
      { label: 'IP Address', value: '192.168.1.45' },
    ],
  },
  {
    id: 'AL-1027',
    member: 'Rahul Verma',
    memberId: '#1231456',
    action: 'Member Added',
    change: 'Added as Field Volunteer',
    module: 'Team Management',
    performedBy: 'Ananya Sharma',
    performedById: '#1231452',
    timestamp: '15/02/2026 ,10:30 AM',
    details: [
      { label: 'Previous Role', value: '—' },
      { label: 'Current Role', value: 'Field Volunteer' },
      { label: 'IP Address', value: '192.168.1.45' },
    ],
  },
  {
    id: 'AL-1028',
    member: 'Kavita Joshi',
    memberId: '#1231465',
    action: 'Role Updated',
    change: 'Viewer → Content Manager',
    module: 'Role Management',
    performedBy: 'Rajesh Nair',
    performedById: '#1231456',
    timestamp: '14/02/2026 ,06:05 PM',
    details: [
      { label: 'Previous Role', value: 'Viewer' },
      { label: 'Current Role', value: 'Content Manager' },
      { label: 'IP Address', value: '192.168.1.62' },
    ],
  },
  {
    id: 'AL-1029',
    member: 'Deepak Rana',
    memberId: '#1231466',
    action: 'Status Change',
    change: 'Inactive → Active',
    module: 'User Management',
    performedBy: 'Rajesh Nair',
    performedById: '#1231456',
    timestamp: '14/02/2026 ,03:20 PM',
    details: [
      { label: 'Previous Status', value: 'Inactive' },
      { label: 'Current Status', value: 'Active' },
      { label: 'IP Address', value: '192.168.1.62' },
    ],
  },
  {
    id: 'AL-1030',
    member: 'Meera Pillai',
    memberId: '#1231467',
    action: 'Member Added',
    change: 'Added as Content Manager',
    module: 'User Management',
    performedBy: 'Ananya Sharma',
    performedById: '#1231452',
    timestamp: '13/02/2026 ,11:45 AM',
    details: [
      { label: 'Previous Role', value: '—' },
      { label: 'Current Role', value: 'Content Manager' },
      { label: 'IP Address', value: '192.168.1.31' },
    ],
  },
]

export const auditLogStats = [
  { key: 'activities', label: 'Total Activities', value: '1,248', note: '12% vs last month', icon: 'history', tone: 'brand' },
  { key: 'users', label: 'User Changes', value: '420', note: '8% vs last month', icon: 'peopleTeam', tone: 'okQuiet' },
  { key: 'roles', label: 'Role Changes', value: '186', note: '5% vs last month', icon: 'personRibbon', tone: 'violetQuiet' },
  { key: 'status', label: 'Status Changes', value: '8', note: '18 % vs last month', icon: 'settings', tone: 'warnQuiet' },
]

export type CurrentUser = typeof currentUser
export type StpOption = (typeof stpOptions)[number]
export type StpSummary = typeof stpSummary
export type TableColumnDef = { key: string; label: string; width?: string | number; sortable?: boolean }
export type ContractRow = (typeof contracts)[number]
export type ViolationRow = (typeof violations)[number]
export type SupportTicketRow = (typeof supportTicketRows)[number]
export type AdminTicketRow = (typeof adminTicketRows)[number]
export type TeamUser = (typeof teamUsers)[number]
export type TeamRole = (typeof teamRoles)[number]
export type AuditLog = (typeof auditLogs)[number]
export type CalibrationRow = (typeof calibrationRows)[number]
export type TransactionLogRow = (typeof transactionLogRows)[number]
export type LiveDelayRow = (typeof liveDelayRows)[number]
export type CameraFeed = (typeof cameraFeeds)[number]
export type CctvSite = (typeof cctvSites)[number]

