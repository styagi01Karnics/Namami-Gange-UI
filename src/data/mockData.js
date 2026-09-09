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
    { key: 'operational', label: "Operational STP's", value: 35, tone: 'ok' },
    { key: 'nonOperational', label: "Non-Operational STP's", value: 4, tone: 'slate' },
    { key: 'maintenance', label: 'Under Maintenance', value: 6, tone: 'warn' },
    { key: 'critical', label: "Critical STP's", value: 5, tone: 'danger' },
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
  penaltyExposure: { display: '₹1 L', percent: 100 },
  recovery: [
    { label: 'Recovered', value: '₹85 k', tone: 'ok' },
    { label: 'Pending', value: '₹15 k', tone: 'warn' },
  ],
}

export const manpower = {
  stats: [
    { label: 'Required', value: 320 },
    { label: 'Total Manpower', value: 300 },
    { label: 'Shortage', value: 20 },
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

export const chemicals = {
  total: 1254,
  rows: [
    { key: 'adequate', label: 'Adequate Stock', value: 1516, percent: '92.1%', fill: 92.1, tone: 'ok' },
    { key: 'low', label: 'Low Stock', value: 24, percent: '1.9%', fill: 100, tone: 'danger' },
    { key: 'out', label: 'Out of Stock', value: 8, percent: '0.6%', fill: 100, tone: 'warn' },
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
    createdOn: '03/09/2026 ,09:15 AM',
    lastSeen: '15/04/2026 ,10:30 AM',
    penalty: { amount: '₹0', reason: 'No active penalty' },
    // revealed by the "Details" toggle
    details: [
      { label: 'Capacity', value: '14 MLD' },
      { label: 'Technology', value: 'SBR' },
      { label: 'Commissioned', value: '12/08/2023' },
      { label: 'Operator', value: 'UP Jal Nigam' },
      { label: 'Contract ID', value: 'NG/UK/HDR/2023/014' },
      { label: 'Site Engineer', value: 'A. Bhattacharya' },
      { label: 'Contact', value: '+91 98110 42207' },
      { label: 'Zone', value: 'Upper Ganga' },
    ],
  },
  'jagjeetpur-68': {
    name: '68 MLD STP, Jagjeetpur',
    status: 'Online',
    address: 'Jagjeetpur, Haridwar, Uttarakhand, 249408, India',
    createdOn: '03/09/2026 ,09:15 AM',
    lastSeen: '15/04/2026 ,10:28 AM',
    penalty: { amount: '₹0', reason: 'No active penalty' },
    details: [
      { label: 'Capacity', value: '68 MLD' },
      { label: 'Technology', value: 'ASP' },
      { label: 'Commissioned', value: '04/03/2021' },
      { label: 'Operator', value: 'UP Jal Nigam' },
      { label: 'Contract ID', value: 'NG/UK/HDR/2021/068' },
      { label: 'Site Engineer', value: 'M. Iyer' },
      { label: 'Contact', value: '+91 98110 55310' },
      { label: 'Zone', value: 'Upper Ganga' },
    ],
  },
  'sarai-18': {
    name: '18 MLD STP, Sarai',
    status: 'Under Maintenance',
    address: 'Sarai, Haridwar, Uttarakhand, 249401, India',
    createdOn: '03/09/2026 ,09:15 AM',
    lastSeen: '14/04/2026 ,06:05 PM',
    penalty: { amount: '₹3,200', reason: 'Parameter Breach' },
    details: [
      { label: 'Capacity', value: '18 MLD' },
      { label: 'Technology', value: 'MBBR' },
      { label: 'Commissioned', value: '19/11/2022' },
      { label: 'Operator', value: 'Uttarakhand Peyjal' },
      { label: 'Contract ID', value: 'NG/UK/HDR/2022/018' },
      { label: 'Site Engineer', value: 'S. Rawat' },
      { label: 'Contact', value: '+91 98110 77841' },
      { label: 'Zone', value: 'Upper Ganga' },
    ],
  },
  'kankhal-27': {
    name: '27 MLD STP, Kankhal',
    status: 'Online',
    address: 'Kankhal, Haridwar, Uttarakhand, 249408, India',
    createdOn: '03/09/2026 ,09:15 AM',
    lastSeen: '15/04/2026 ,10:31 AM',
    penalty: { amount: '₹0', reason: 'No active penalty' },
    details: [
      { label: 'Capacity', value: '27 MLD' },
      { label: 'Technology', value: 'SBR' },
      { label: 'Commissioned', value: '07/06/2020' },
      { label: 'Operator', value: 'UP Jal Nigam' },
      { label: 'Contract ID', value: 'NG/UK/HDR/2020/027' },
      { label: 'Site Engineer', value: 'D. Chauhan' },
      { label: 'Contact', value: '+91 98110 90222' },
      { label: 'Zone', value: 'Upper Ganga' },
    ],
  },
  'bhagwanpur-5': {
    name: '5 MLD STP, Bhagwanpur',
    status: 'Offline',
    address: 'Bhagwanpur, Haridwar, Uttarakhand, 247661, India',
    createdOn: '03/09/2026 ,09:15 AM',
    lastSeen: '10/04/2026 ,04:45 PM',
    penalty: { amount: '₹18,000', reason: 'Equipment Failure' },
    details: [
      { label: 'Capacity', value: '5 MLD' },
      { label: 'Technology', value: 'FAB' },
      { label: 'Commissioned', value: '23/09/2019' },
      { label: 'Operator', value: 'Uttarakhand Peyjal' },
      { label: 'Contract ID', value: 'NG/UK/HDR/2019/005' },
      { label: 'Site Engineer', value: 'P. Negi' },
      { label: 'Contact', value: '+91 98110 61093' },
      { label: 'Zone', value: 'Upper Ganga' },
    ],
  },
}

/**
 * "Realtime Parameter Values" accordion — influent (left) / effluent (right).
 * Live values come from /api/v1/stp/{device}/realtime; this mock is the fallback.
 */
export const realtimeParameters = {
  isLive: true,
  influent: {
    title: 'Influent',
    subtitle: 'Incoming (Raw Water)',
    timestamp: '19 May 2026, 05:30 PM',
    flow: '748.83',
    flowUnit: 'm³/hr',
    params: [
      { key: 'bod', label: 'BOD', icon: 'bod', value: '394.74', unit: 'mg/L', alert: true, ideal: 'Ideal: 0 – 10' },
      { key: 'ph', label: 'pH', icon: 'ph', value: '7.48', unit: 'pH', alert: true, ideal: 'Ideal: 5.5 – 9' },
      { key: 'totalizer', label: 'Totalizer', icon: 'totalizer', value: '7,577.16', unit: 'm³', percent: '54.12%' },
      { key: 'tss', label: 'TSS', icon: 'tss', value: '114.34', unit: 'mg/L', alert: true, ideal: 'Ideal: 0 – 20' },
      { key: 'cod', label: 'COD', icon: 'cod', value: '852.44', unit: 'mg/L', alert: true, ideal: 'Ideal: 0 – 50' },
      { key: 'no3', label: 'NO₃-N', icon: 'no3', value: '6', unit: 'mg/L', alert: false, ideal: 'Ideal: 0 – 10' },
    ],
  },
  effluent: {
    title: 'Effluent',
    subtitle: 'Treated (Outgoing Water)',
    timestamp: '19 May 2026, 05:30 PM',
    flow: '6,492.05',
    flowUnit: 'm³/hr',
    params: [
      { key: 'bod', label: 'BOD', icon: 'bod', value: '4.51', unit: 'mg/L', alert: false, ideal: 'Ideal: 0 – 10' },
      { key: 'ph', label: 'pH', icon: 'ph', value: '7.6', unit: 'pH', alert: false, ideal: 'Ideal: 5.5 – 9' },
      { key: 'totalizer', label: 'Totalizer', icon: 'totalizer', value: '7,577.16', unit: 'm³', percent: '54.12%' },
      { key: 'tss', label: 'TSS', icon: 'tss', value: '134', unit: 'mg/L', alert: true, ideal: 'Ideal: 0 – 20' },
      { key: 'cod', label: 'COD', icon: 'cod', value: '24.12', unit: 'mg/L', alert: false, ideal: 'Ideal: 0 – 50' },
      { key: 'no3', label: 'NO₃-N', icon: 'no3', value: '6', unit: 'mg/L', alert: false, ideal: 'Ideal: 0 – 10' },
    ],
  },
}

/**
 * "Parameter Trend Analysis" accordion — influent (left) / effluent (right).
 * Current values overlay from the realtime API; sparklines stay static.
 */
const TREND_RANGES = ['7D', '24H', '3M']

function spark(values) {
  return values.map((v) => ({ v }))
}

export const parameterTrendAnalysis = {
  ranges: TREND_RANGES,
  defaultRange: '3M',
  influent: {
    title: 'Influent',
    subtitle: 'Incoming (Raw Water)',
    rows: [
      {
        key: 'ph',
        label: 'pH',
        unit: 'pH',
        value: '7.48',
        timestamp: '19 May 2026, 05:30 PM',
        alert: false,
        color: '#1668E3',
        spark: {
          '24H': spark([7.1, 7.3, 7.2, 7.5, 7.4, 7.48]),
          '7D': spark([7.0, 7.2, 7.1, 7.4, 7.3, 7.5, 7.48]),
          '3M': spark([6.9, 7.1, 7.0, 7.3, 7.2, 7.4, 7.35, 7.48]),
        },
      },
      {
        key: 'bod',
        label: 'BOD',
        unit: 'mg/L',
        value: '394.74',
        timestamp: '19 May 2026, 05:30 PM',
        alert: true,
        color: '#7C5CBF',
        spark: {
          '24H': spark([320, 360, 340, 380, 370, 394.74]),
          '7D': spark([280, 310, 300, 350, 330, 380, 394.74]),
          '3M': spark([240, 280, 260, 320, 300, 360, 340, 394.74]),
        },
      },
      {
        key: 'cod',
        label: 'COD',
        unit: 'mg/L',
        value: '852.44',
        timestamp: '19 May 2026, 05:30 PM',
        alert: true,
        color: '#2E9E5B',
        spark: {
          '24H': spark([700, 780, 740, 820, 800, 852.44]),
          '7D': spark([640, 720, 680, 800, 760, 830, 852.44]),
          '3M': spark([580, 660, 620, 740, 700, 820, 780, 852.44]),
        },
      },
      {
        key: 'tss',
        label: 'TSS',
        unit: 'mg/L',
        value: '114.34',
        timestamp: '19 May 2026, 05:30 PM',
        alert: true,
        color: '#EE9B2C',
        spark: {
          '24H': spark([90, 102, 96, 110, 108, 114.34]),
          '7D': spark([80, 95, 88, 108, 100, 112, 114.34]),
          '3M': spark([70, 88, 78, 100, 92, 110, 104, 114.34]),
        },
      },
      {
        key: 'no3',
        label: 'NO₃-N',
        unit: 'mg/L',
        value: '6',
        timestamp: '19 May 2026, 05:30 PM',
        alert: false,
        color: '#E5484D',
        spark: {
          '24H': spark([5.2, 5.6, 5.4, 5.9, 5.8, 6]),
          '7D': spark([4.8, 5.3, 5.1, 5.7, 5.5, 5.9, 6]),
          '3M': spark([4.4, 5.0, 4.7, 5.5, 5.2, 5.8, 5.6, 6]),
        },
      },
      {
        key: 'flow',
        label: 'Flow Rate',
        unit: 'm³/hr',
        value: '748.83',
        timestamp: '19 May 2026, 05:30 PM',
        tone: 'plain',
        color: '#1668E3',
        spark: {
          '24H': spark([680, 720, 700, 740, 730, 748.83]),
          '7D': spark([640, 690, 660, 730, 700, 745, 748.83]),
          '3M': spark([600, 660, 620, 710, 670, 740, 720, 748.83]),
        },
      },
      {
        key: 'totalizer',
        label: 'Totalizer',
        unit: 'm³',
        value: '7,577.16',
        timestamp: '19 May 2026, 05:30 PM',
        tone: 'plain',
        color: '#7C5CBF',
        spark: {
          '24H': spark([7200, 7350, 7280, 7480, 7420, 7577.16]),
          '7D': spark([7000, 7220, 7100, 7400, 7300, 7520, 7577.16]),
          '3M': spark([6800, 7100, 6950, 7350, 7200, 7500, 7400, 7577.16]),
        },
      },
    ],
  },
  effluent: {
    title: 'Effluent',
    subtitle: 'Treated (Outgoing Water)',
    rows: [
      {
        key: 'ph',
        label: 'pH',
        unit: 'pH',
        value: '7.6',
        timestamp: '19 May 2026, 05:30 PM',
        alert: false,
        color: '#1668E3',
        spark: {
          '24H': spark([7.2, 7.4, 7.3, 7.55, 7.5, 7.6]),
          '7D': spark([7.1, 7.3, 7.2, 7.5, 7.4, 7.58, 7.6]),
          '3M': spark([7.0, 7.25, 7.1, 7.45, 7.3, 7.55, 7.48, 7.6]),
        },
      },
      {
        key: 'bod',
        label: 'BOD',
        unit: 'mg/L',
        value: '4.51',
        timestamp: '19 May 2026, 05:30 PM',
        alert: false,
        color: '#7C5CBF',
        spark: {
          '24H': spark([5.2, 4.8, 5.0, 4.6, 4.7, 4.51]),
          '7D': spark([5.8, 5.2, 5.5, 4.9, 5.1, 4.6, 4.51]),
          '3M': spark([6.2, 5.5, 5.8, 5.0, 5.3, 4.7, 4.9, 4.51]),
        },
      },
      {
        key: 'cod',
        label: 'COD',
        unit: 'mg/L',
        value: '24.12',
        timestamp: '19 May 2026, 05:30 PM',
        alert: false,
        color: '#2E9E5B',
        spark: {
          '24H': spark([28, 26, 27, 24.8, 25.2, 24.12]),
          '7D': spark([32, 28, 30, 25.5, 27, 24.5, 24.12]),
          '3M': spark([36, 30, 33, 26, 29, 24.8, 25.5, 24.12]),
        },
      },
      {
        key: 'tss',
        label: 'TSS',
        unit: 'mg/L',
        value: '134',
        timestamp: '19 May 2026, 05:30 PM',
        alert: true,
        color: '#EE9B2C',
        spark: {
          '24H': spark([118, 126, 122, 132, 128, 134]),
          '7D': spark([110, 122, 116, 130, 124, 133, 134]),
          '3M': spark([100, 118, 108, 128, 120, 132, 126, 134]),
        },
      },
      {
        key: 'no3',
        label: 'NO₃-N',
        unit: 'mg/L',
        value: '6',
        timestamp: '19 May 2026, 05:30 PM',
        alert: false,
        color: '#E5484D',
        spark: {
          '24H': spark([5.4, 5.7, 5.5, 5.9, 5.8, 6]),
          '7D': spark([5.0, 5.5, 5.2, 5.8, 5.6, 5.95, 6]),
          '3M': spark([4.6, 5.2, 4.9, 5.7, 5.4, 5.9, 5.7, 6]),
        },
      },
      {
        key: 'flow',
        label: 'Flow Rate',
        unit: 'm³/hr',
        value: '6,492.05',
        timestamp: '19 May 2026, 05:30 PM',
        tone: 'plain',
        color: '#1668E3',
        spark: {
          '24H': spark([6100, 6300, 6200, 6420, 6360, 6492.05]),
          '7D': spark([5800, 6150, 5950, 6380, 6200, 6460, 6492.05]),
          '3M': spark([5400, 5900, 5600, 6300, 6000, 6450, 6250, 6492.05]),
        },
      },
      {
        key: 'totalizer',
        label: 'Totalizer',
        unit: 'm³',
        value: '7,577.16',
        timestamp: '19 May 2026, 05:30 PM',
        tone: 'plain',
        color: '#7C5CBF',
        spark: {
          '24H': spark([7200, 7350, 7280, 7480, 7420, 7577.16]),
          '7D': spark([7000, 7220, 7100, 7400, 7300, 7520, 7577.16]),
          '3M': spark([6800, 7100, 6950, 7350, 7200, 7500, 7400, 7577.16]),
        },
      },
    ],
  },
}

export const stpSectionTabs = [
  'Manpower',
  'Inventory',
  'CCTV Monitoring',
  'Remote Calibration',
  'Transaction Logs',
  'Contracts',
  'Compliance',
]

/* ---- Manpower ----------------------------------------------------------
   Shared by the standalone /manpower page AND the Manpower tab inside
   STP Management — both render components/manpower/ManpowerTab.
   ------------------------------------------------------------------------ */

export const stpManpower = {
  totalEmployees: 98,
  scopeLabel: 'Across all states',
  // drives both the gauge segments and the legend
  breakdown: [
    { key: 'present', label: 'Present', value: 82, percent: '83.7%', color: '#2E9E5B' },
    { key: 'absent', label: 'Absent', value: 8, percent: '8.2%', color: '#F5B417' },
    { key: 'leave', label: 'On leave', value: 5, percent: '5.1%', color: '#E5484D' },
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
  columns: ['ID', 'Employee', 'Date', 'Punch Time', 'Status'],
  rows: [
    { id: '#1231456', name: 'Rahul Sharma', date: '19 May 2026', punchTime: '10:30 AM', status: 'Active' },
    { id: '#1231457', name: 'Rahul Sharma', date: '19 May 2026', punchTime: '10:30 AM', status: 'On Leave' },
    { id: '#1231458', name: 'Rahul Sharma', date: '19 May 2026', punchTime: '10:30 AM', status: 'Absent' },
    { id: '#1231459', name: 'Priya Menon', date: '19 May 2026', punchTime: '09:55 AM', status: 'Active' },
    { id: '#1231460', name: 'Imran Qureshi', date: '19 May 2026', punchTime: '10:05 AM', status: 'Active' },
    { id: '#1231461', name: 'Sunita Devi', date: '19 May 2026', punchTime: '—', status: 'Absent' },
    { id: '#1231462', name: 'Arjun Rawat', date: '19 May 2026', punchTime: '10:12 AM', status: 'Active' },
    { id: '#1231463', name: 'Neha Kulkarni', date: '19 May 2026', punchTime: '—', status: 'On Leave' },
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

const DEPARTMENT_14 = departmentManpower.map((d) => ({
  ...d,
  total: 5,
  required: 3,
  shortage: 1,
}))

/** Per-STP numbers used when the STP Management dropdown changes. */
export const stpPageMetrics = {
  'sarai-14': {
    manpower: {
      totalEmployees: 42,
      scopeLabel: '14 MLD STP, Sarai',
      breakdown: [
        { key: 'present', label: 'Present', value: 36, percent: '85.7%', color: '#2E9E5B' },
        { key: 'absent', label: 'Absent', value: 4, percent: '9.5%', color: '#F5B417' },
        { key: 'leave', label: 'On leave', value: 2, percent: '4.8%', color: '#E5484D' },
      ],
    },
    attendanceFactor: 0.42,
    departments: DEPARTMENT_14,
    inventorySummary: {
      label: 'Total Chemical',
      total: 36,
      scopeLabel: '14 MLD STP, Sarai',
      breakdown: [
        { key: 'adequate', label: 'Adequate', value: 28, percent: '77.8%', color: '#2E9E5B' },
        { key: 'low', label: 'Low Stock', value: 5, percent: '13.9%', color: '#F5B417' },
        { key: 'out', label: 'Out of Stock', value: 3, percent: '8.3%', color: '#E5484D' },
      ],
    },
    inventoryStats: [
      { key: 'value', label: 'Total Inventory Value', value: '₹2,450', note: '14 MLD STP, Sarai', icon: 'money', tone: 'warn' },
      { key: 'required', label: 'Required inventory', value: '210 L', note: '14 MLD STP, Sarai', icon: 'boxes', tone: 'brand' },
      { key: 'consumption', label: 'Total Consumption', value: '340 L', note: '14 MLD STP, Sarai', icon: 'package', tone: 'okQuiet' },
      { key: 'daysLeft', label: 'Days of inventory left', value: '11', note: '14 MLD STP, Sarai', icon: 'days', tone: 'dangerQuiet' },
    ],
    inventoryCategory: [
      { key: 'coagulant', label: 'Coagulant', value: 28, share: 22, percent: '22%', color: '#3E63DD' },
      { key: 'disinfectant', label: 'Disinfectant', value: 24, share: 19, percent: '19%', color: '#8B5CF6' },
      { key: 'polymers', label: 'Polymers', value: 31, share: 24, percent: '24%', color: '#2AB3A6' },
      { key: 'ph', label: 'pH Adjusters', value: 18, share: 14, percent: '14%', color: '#F5A524' },
      { key: 'others', label: 'Others', value: 27, share: 21, percent: '21%', color: '#CBD5E1' },
    ],
    contractsSummary: [
      { key: 'total', label: 'Total Contracts', value: '3', note: '14 MLD STP, Sarai', icon: 'file', tone: 'brand' },
      { key: 'active', label: 'Active Contracts', value: '2', note: '14 MLD STP, Sarai', icon: 'check', tone: 'ok' },
      { key: 'inactive', label: 'Inactive Contracts', value: '1', note: '14 MLD STP, Sarai', icon: 'cross', tone: 'danger' },
      { key: 'value', label: 'Total Contract Value', value: '₹4.31 L', note: '14 MLD STP, Sarai', icon: 'money', tone: 'warn' },
    ],
    complianceSummary: [
      { key: 'violations', label: 'Violations', value: '1', note: '14 MLD STP, Sarai', icon: 'file', tone: 'brand' },
      { key: 'penalty', label: 'Total Penalty Amount', value: '₹0', note: '14 MLD STP, Sarai', icon: 'money', tone: 'warn' },
      { key: 'recovered', label: 'Penalties Recovered', value: '₹0', note: '14 MLD STP, Sarai', icon: 'check', tone: 'ok' },
      { key: 'pending', label: 'Pending Penalties', value: '₹0', note: '14 MLD STP, Sarai', icon: 'cross', tone: 'danger' },
    ],
  },
  'jagjeetpur-68': {
    manpower: {
      totalEmployees: 98,
      scopeLabel: '68 MLD STP, Jagjeetpur',
      breakdown: [
        { key: 'present', label: 'Present', value: 82, percent: '83.7%', color: '#2E9E5B' },
        { key: 'absent', label: 'Absent', value: 8, percent: '8.2%', color: '#F5B417' },
        { key: 'leave', label: 'On leave', value: 8, percent: '8.2%', color: '#E5484D' },
      ],
    },
    attendanceFactor: 1,
    departments: departmentManpower,
    inventorySummary: {
      label: 'Total Chemical',
      total: 98,
      scopeLabel: '68 MLD STP, Jagjeetpur',
      breakdown: [
        { key: 'adequate', label: 'Adequate', value: 82, percent: '83.7%', color: '#2E9E5B' },
        { key: 'low', label: 'Low Stock', value: 8, percent: '8.2%', color: '#F5B417' },
        { key: 'out', label: 'Out of Stock', value: 5, percent: '5.1%', color: '#E5484D' },
      ],
    },
    inventoryStats: [
      { key: 'value', label: 'Total Inventory Value', value: '₹7,000', note: '68 MLD STP, Jagjeetpur', icon: 'money', tone: 'warn' },
      { key: 'required', label: 'Required inventory', value: '730 L', note: '68 MLD STP, Jagjeetpur', icon: 'boxes', tone: 'brand' },
      { key: 'consumption', label: 'Total Consumption', value: '1230 L', note: '68 MLD STP, Jagjeetpur', icon: 'package', tone: 'okQuiet' },
      { key: 'daysLeft', label: 'Days of inventory left', value: '18', note: '68 MLD STP, Jagjeetpur', icon: 'days', tone: 'dangerQuiet' },
    ],
    inventoryCategory: [
      { key: 'coagulant', label: 'Coagulant', value: 82, share: 20, percent: '20%', color: '#3E63DD' },
      { key: 'disinfectant', label: 'Disinfectant', value: 82, share: 20, percent: '20%', color: '#8B5CF6' },
      { key: 'polymers', label: 'Polymers', value: 82, share: 20, percent: '20%', color: '#2AB3A6' },
      { key: 'ph', label: 'pH Adjusters', value: 82, share: 20, percent: '20%', color: '#F5A524' },
      { key: 'others', label: 'Others', value: 82, share: 20, percent: '20%', color: '#CBD5E1' },
    ],
    contractsSummary: [
      { key: 'total', label: 'Total Contracts', value: '3', note: '68 MLD STP, Jagjeetpur', icon: 'file', tone: 'brand' },
      { key: 'active', label: 'Active Contracts', value: '2', note: '68 MLD STP, Jagjeetpur', icon: 'check', tone: 'ok' },
      { key: 'inactive', label: 'Inactive Contracts', value: '1', note: '68 MLD STP, Jagjeetpur', icon: 'cross', tone: 'danger' },
      { key: 'value', label: 'Total Contract Value', value: '₹13.54 L', note: '68 MLD STP, Jagjeetpur', icon: 'money', tone: 'warn' },
    ],
    complianceSummary: [
      { key: 'violations', label: 'Violations', value: '2', note: '68 MLD STP, Jagjeetpur', icon: 'file', tone: 'brand' },
      { key: 'penalty', label: 'Total Penalty Amount', value: '₹0', note: '68 MLD STP, Jagjeetpur', icon: 'money', tone: 'warn' },
      { key: 'recovered', label: 'Penalties Recovered', value: '₹5,000', note: '68 MLD STP, Jagjeetpur', icon: 'check', tone: 'ok' },
      { key: 'pending', label: 'Pending Penalties', value: '₹12,000', note: '68 MLD STP, Jagjeetpur', icon: 'cross', tone: 'danger' },
    ],
  },
}

export function getStpPageMetrics(stpId) {
  return stpPageMetrics[stpId] ?? null
}

/* ==========================================================================
   4. CONTRACTS
   ========================================================================== */

export const contractsSummary = [
  { key: 'total', label: 'Total Contracts', value: '26', note: 'Across all states', icon: 'file', tone: 'brand' },
  { key: 'active', label: 'Active Contracts', value: '26', note: 'Across all states', icon: 'check', tone: 'ok' },
  { key: 'inactive', label: 'Inactive Contracts', value: '26', note: 'Across all states', icon: 'cross', tone: 'danger' },
  { key: 'value', label: 'Total Contract Value', value: '₹1245.80 CR', note: 'Across all contracts', icon: 'money', tone: 'warn' },
]

export const contractColumns = [
  { key: 'sno', label: 'S.No.', width: '6%' },
  { key: 'id', label: 'Contract No.', width: '13%', sortable: true },
  { key: 'name', label: 'Contract Name', width: '18%', sortable: true },
  { key: 'vendor', label: 'Vendor', width: '22%', sortable: true },
  { key: 'status', label: 'Status', width: '11%', sortable: true },
  { key: 'duration', label: 'Duration', width: '16%' },
  { key: 'details', label: 'Details', width: '8%', align: 'right' },
]

/**
 * `detail` is rendered as-is by ContractDetailPanel: one column per group,
 * one row per { label, value }. `type: 'file'` renders a PDF chip.
 */
export const contracts = [
  {
    sno: 1,
    id: 'CN-001',
    stpId: 'sarai-14',
    name: 'Haridwar STP Project',
    vendor: 'Eco Smart Solutions Pvt .Ltd.',
    status: 'Active',
    startDate: '19 May 2026',
    endDate: '19 May 2026',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹1,24,500' },
          { label: 'Security Deposit', value: '₹24,500 (5%)' },
          { label: 'Contract Document', value: 'CN-001_Contract.pdf', type: 'file' },
          { label: 'Agreement Regulation', value: 'CN-001_Regulation.pdf', type: 'file' },
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
    stpId: 'jagjeetpur-68',
    name: 'Jagjeetpur O&M',
    vendor: 'Ganga Enviro Systems Pvt. Ltd.',
    status: 'Active',
    startDate: '01 Apr 2026',
    endDate: '31 Mar 2029',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹8,64,000' },
          { label: 'Security Deposit', value: '₹86,400 (10%)' },
          { label: 'Contract Document', value: 'CN-002_Contract.pdf', type: 'file' },
          { label: 'Agreement Regulation', value: 'CN-002_Regulation.pdf', type: 'file' },
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
    stpId: 'jagjeetpur-68',
    name: 'Sludge Handling Upgrade',
    vendor: 'Nirmal Infratech Pvt. Ltd.',
    status: 'Inactive',
    startDate: '12 Jan 2025',
    endDate: '11 Jan 2026',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹3,42,750' },
          { label: 'Security Deposit', value: '₹17,140 (5%)' },
          { label: 'Contract Document', value: 'CN-003_Contract.pdf', type: 'file' },
          { label: 'Agreement Regulation', value: 'CN-003_Regulation.pdf', type: 'file' },
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
    stpId: 'sarai-14',
    name: 'SCADA & Instrumentation AMC',
    vendor: 'Aqua Controls India Pvt. Ltd.',
    status: 'Active',
    startDate: '05 Jun 2026',
    endDate: '04 Jun 2028',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹2,10,000' },
          { label: 'Security Deposit', value: '₹21,000 (10%)' },
          { label: 'Contract Document', value: 'CN-004_Contract.pdf', type: 'file' },
          { label: 'Agreement Regulation', value: 'CN-004_Regulation.pdf', type: 'file' },
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
    stpId: 'sarai-14',
    name: 'Chemical Supply — Annual',
    vendor: 'Bharat Chem Distributors',
    status: 'Inactive',
    startDate: '20 Feb 2025',
    endDate: '19 Feb 2026',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹96,300' },
          { label: 'Security Deposit', value: '₹4,815 (5%)' },
          { label: 'Contract Document', value: 'CN-005_Contract.pdf', type: 'file' },
          { label: 'Agreement Regulation', value: 'CN-005_Regulation.pdf', type: 'file' },
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
    stpId: 'jagjeetpur-68',
    name: 'Housekeeping & Security',
    vendor: 'Shakti Facility Services',
    status: 'Active',
    startDate: '01 Jul 2026',
    endDate: '30 Jun 2027',
    detail: [
      {
        title: 'Agreement Details',
        rows: [
          { label: 'Contract Value', value: '₹1,48,200' },
          { label: 'Security Deposit', value: '₹7,410 (5%)' },
          { label: 'Contract Document', value: 'CN-006_Contract.pdf', type: 'file' },
          { label: 'Agreement Regulation', value: 'CN-006_Regulation.pdf', type: 'file' },
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
  { key: 'violations', label: 'Violations', value: '10', note: 'Across all states', icon: 'file', tone: 'brand' },
  { key: 'penalty', label: 'Total Penalty Amount', value: '₹0', note: 'Across all contracts', icon: 'money', tone: 'warn' },
  { key: 'recovered', label: 'Penalties Recovered', value: '₹25,000', note: 'Across all states', icon: 'check', tone: 'ok' },
  { key: 'pending', label: 'Pending Penalties', value: '₹20,000', note: 'Across all states', icon: 'cross', tone: 'danger' },
]

export const complianceBasisOptions = ['Based On Parameter Breach', 'Based On Equipment Failure']

export const complianceParameters = ['pH', 'BOD', 'COD', 'TSS', 'Flow', 'Temperature']

export const violationColumns = [
  { key: 'id', label: 'Violation ID', width: '12%' },
  { key: 'type', label: 'Type', width: '14%' },
  { key: 'parameter', label: 'Parameter', width: '11%' },
  { key: 'location', label: 'Location', width: '11%' },
  { key: 'downtime', label: 'Downtime Duration', width: '15%' },
  { key: 'detectedOn', label: 'Detected On', width: '17%' },
  { key: 'status', label: 'Status', width: '12%', sortable: true },
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
    stpId: 'sarai-14',
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
      { label: 'Status', value: 'Recovered', tone: 'ok' },
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
    stpId: 'jagjeetpur-68',
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
      { label: 'Status', value: 'Recovered', tone: 'ok' },
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
    stpId: 'jagjeetpur-68',
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
      { label: 'Status', value: 'Pending', tone: 'warn' },
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
  scopeLabel: 'Across all area',
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
    id: 'CAM-IN-01',
    location: 'Influent',
    lastSeen: '15/02/2026 ,10:30 AM',
    status: 'Live',
    timecode: '9:03:36:20',
    image: null,
    stream: null,
  },
  {
    key: 'effluent',
    id: 'CAM-EF-01',
    location: 'Effluent',
    lastSeen: '15/02/2026 ,10:30 AM',
    status: 'Offline',
    timecode: null,
    image: null,
    stream: null,
  },
]

/* ==========================================================================
   7. INVENTORY
   ========================================================================== */

export const inventorySummary = {
  label: 'Total Chemical',
  total: 98,
  scopeLabel: 'Across all states',
  breakdown: [
    { key: 'adequate', label: 'Adequate', value: 82, percent: '83.7%', color: '#2E9E5B' },
    { key: 'low', label: 'Low Stock', value: 8, percent: '8.2%', color: '#F5B417' },
    { key: 'out', label: 'Out of Stock', value: 5, percent: '5.1%', color: '#E5484D' },
  ],
}

export const inventoryStats = [
  { key: 'value', label: 'Total Inventory Value', value: '₹7,000', note: 'Across all locations', icon: 'money', tone: 'warn' },
  { key: 'required', label: 'Required inventory', value: '730 L', note: 'Across all locations', icon: 'boxes', tone: 'brand' },
  { key: 'consumption', label: 'Total Consumption', value: '1230 L', note: 'Across all locations', icon: 'package', tone: 'okQuiet' },
  { key: 'daysLeft', label: 'Days of inventory left', value: '18', note: 'Across all locations', icon: 'days', tone: 'dangerQuiet' },
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
    { name: 'Alum (Liquid)', category: 'Coagulant', currentQty: '12.5', requiredQty: '-', daysLeft: '21', status: 'Adequate', stpIds: ['sarai-14', 'jagjeetpur-68'] },
    { name: 'PAC', category: 'Disinfectant', currentQty: '12.5', requiredQty: '10.5', daysLeft: '8', status: 'Low Stock', stpIds: ['jagjeetpur-68'] },
    { name: 'Sodium Hypochlorite', category: 'Disinfectant', currentQty: '-', requiredQty: '12.5', daysLeft: '0', status: 'Out of Stock', stpIds: ['sarai-14'] },
    { name: 'Polyelectrolyte', category: 'Polymers', currentQty: '48.0', requiredQty: '-', daysLeft: '34', status: 'Adequate', stpIds: ['jagjeetpur-68'] },
    { name: 'Caustic Soda', category: 'pH Adjusters', currentQty: '9.2', requiredQty: '15.0', daysLeft: '6', status: 'Low Stock', stpIds: ['sarai-14'] },
    { name: 'Ferric Chloride', category: 'Coagulant', currentQty: '31.4', requiredQty: '-', daysLeft: '27', status: 'Adequate', stpIds: ['jagjeetpur-68'] },
    { name: 'Antifoam Agent', category: 'Others', currentQty: '-', requiredQty: '5.0', daysLeft: '0', status: 'Out of Stock', stpIds: ['sarai-14'] },
    { name: 'Lime', category: 'pH Adjusters', currentQty: '18.0', requiredQty: '-', daysLeft: '16', status: 'Adequate', stpIds: ['sarai-14'] },
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
  { id: 'cal-1', sno: 1, certificate: '1', performedBy: 'Rahul Sharma', calibrationDate: '19 May 2026', status: 'Successful', analyzer: 'pH Analyzer', remarks: 'Technical standard violation + Plant downtime exceeded 4 hours', nextCalibration: '19 May 2026', point: 'Influent', stpId: 'jagjeetpur-68' },
  { id: 'cal-2', sno: 2, certificate: '1', performedBy: 'Rahul Sharma', calibrationDate: '19 May 2026', status: 'Successful', analyzer: 'BOD Analyzer', remarks: 'Technical standard violation + Plant downtime exceeded 4 hours', nextCalibration: '19 May 2026', point: 'Influent', stpId: 'jagjeetpur-68' },
  { id: 'cal-3', sno: 3, certificate: '2', performedBy: 'Priya Menon', calibrationDate: '12 May 2026', status: 'Successful', analyzer: 'COD Analyzer', remarks: 'Zero and span drift corrected against reference standard', nextCalibration: '12 Nov 2026', point: 'Effluent', stpId: 'sarai-14' },
  { id: 'cal-4', sno: 4, certificate: '2', performedBy: 'Imran Qureshi', calibrationDate: '08 May 2026', status: 'Failed', analyzer: 'TSS Analyzer', remarks: 'Sensor fouling detected — recalibration scheduled after cleaning', nextCalibration: '15 May 2026', point: 'Effluent', stpId: 'sarai-14' },
  { id: 'cal-5', sno: 5, certificate: '3', performedBy: 'Arjun Rawat', calibrationDate: '02 May 2026', status: 'Successful', analyzer: 'Flow Meter', remarks: 'Calibrated within permissible tolerance, no deviation observed', nextCalibration: '02 Nov 2026', point: 'Influent', stpId: 'jagjeetpur-68' },
  { id: 'cal-6', sno: 6, certificate: '4', performedBy: 'Neha Kulkarni', calibrationDate: '21 Apr 2026', status: 'Successful', analyzer: 'pH Analyzer', remarks: 'Two-point calibration completed against buffer 4.0 and 9.2', nextCalibration: '21 Oct 2026', point: 'Influent', stpId: 'sarai-14' },
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

export const transactionLogRows = [
  {
    id: '14mld-cc3fc334-1c94-4208-abc5',
    uniqueId: '14MLD17555984235130475IN',
    createdOn: '15/02/2026 ,10:30 AM',
    status: 'Pending',
    stpId: 'sarai-14',
    payload: '{ "readings": [ { "bod": 206.30, "cod": 447.77, "tss": 129.34, "timestamp": "2026-07-28 15:38:00" } ] }',
  },
  {
    id: '14mld-cc3fc334-1c94-4208-abc5',
    uniqueId: '14MLD17555984235130475OUT',
    createdOn: '15/02/2026 ,10:30 AM',
    status: 'Pending',
    stpId: 'sarai-14',
    payload: '{ "readings": [ { "bod": 3.44, "cod": 24.10, "tss": 8.12, "timestamp": "2026-07-28 15:38:00" } ] }',
  },
  {
    id: '68mld-a17be902-55d1-4c73-9f0a',
    uniqueId: '68MLD17555984235130476IN',
    createdOn: '15/02/2026 ,11:00 AM',
    status: 'Successful',
    stpId: 'jagjeetpur-68',
    payload: '{ "readings": [ { "bod": 394.74, "cod": 852.44, "tss": 114.34, "timestamp": "2026-07-28 16:08:00" } ] }',
  },
  {
    id: '68mld-a17be902-55d1-4c73-9f0a',
    uniqueId: '68MLD17555984235130476OUT',
    createdOn: '15/02/2026 ,11:00 AM',
    status: 'Successful',
    stpId: 'jagjeetpur-68',
    payload: '{ "readings": [ { "bod": 4.51, "cod": 24.12, "tss": 134, "timestamp": "2026-07-28 16:08:00" } ] }',
  },
  {
    id: '68mld-d90ca114-7b3e-45aa-8c21',
    uniqueId: '68MLD17555984235130477IN',
    createdOn: '15/02/2026 ,11:30 AM',
    status: 'Failed',
    stpId: 'jagjeetpur-68',
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

export const notificationChannels = [
  { key: 'email', label: 'Email', blurb: settingsProfile.email, enabled: true },
  { key: 'sms', label: 'SMS', blurb: settingsProfile.phone, enabled: true },
  { key: 'push', label: 'In-app', blurb: 'Bell icon in the portal header.', enabled: true },
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
