import { stpDetails, stpOptions } from '../data/mockData'

const DASHBOARD_API = import.meta.env.VITE_DASHBOARD_API_URL ?? '/dashboard-api'

export type DashboardPlant = {
  plantName: string
  plantCode: string
  tables?: Record<string, string>
}

export const PLANT_CODE_TO_STP_ID: Record<string, string> = {
  '14mldsarai': 'sarai-14',
  '68mldjag': 'jagjeetpur-68',
  '27mldjag_upg': 'jagjeetpur-27-upg',
  '18mldsarai_upg': 'sarai-18-upg',
  '18mldjag': 'jagjeetpur-18',
  '26mldlkgt2': 'lakkar-ghat-26',
  '26mldlakkar': 'lakkar-ghat-26',
  '26mld': 'lakkar-ghat-26',
  '26mldrishikesh': 'lakkar-ghat-26',
  'rishikesh': 'lakkar-ghat-26',
  '28mldindira': 'indira-nagar-28',
  '20mldmothorowala': 'mothorowala-20',
  '68mldkargi': 'kargi-68',
  '20mldmoth_2': 'mothorowala-20-2',
  '33mldsali': 'saliar-33',
  '10mldbazpur': 'bazpur-10',
  'bazpur': 'bazpur-10',
  '10mld': 'bazpur-10',
  '10mldkashipur': 'kashipur-10',
}

export type PlantOption = {
  id: string
  label: string
  plantCode: string
  stpId: string
}

/** Official 13 STPs strictly aligned with master details. */
export const FALLBACK_PLANT_OPTIONS: PlantOption[] = [
  { id: '10mldbazpur', label: '10 MLD STP, Bazpur', plantCode: '10mldbazpur', stpId: 'bazpur-10' },
  { id: '14mldsarai', label: '14 MLD STP, Sarai, Haridwar', plantCode: '14mldsarai', stpId: 'sarai-14' },
  { id: '68mldjag', label: '68 MLD STP, Jagjeetpur, Haridwar', plantCode: '68mldjag', stpId: 'jagjeetpur-68' },
  { id: '27mldjag_upg', label: '27 MLD STP, Jagjeetpur', plantCode: '27mldjag_upg', stpId: 'jagjeetpur-27-upg' },
  { id: '18mldsarai_upg', label: '18 MLD STP, Sarai', plantCode: '18mldsarai_upg', stpId: 'sarai-18-upg' },
  { id: '18mldjag', label: '18 MLD STP, Jagjeetpur, Haridwar', plantCode: '18mldjag', stpId: 'jagjeetpur-18' },
  { id: '26mldlkgt2', label: '26 MLD STP, Lakkarghat, Rishikesh', plantCode: '26mldlkgt2', stpId: 'lakkar-ghat-26' },
  { id: '28mldindira', label: '28 MLD STP, Indira Nagar, Haldwani', plantCode: '28mldindira', stpId: 'indira-nagar-28' },
  { id: '20mldmothorowala', label: '20 MLD STP, Mothorowala-1, Dehradun', plantCode: '20mldmothorowala', stpId: 'mothorowala-20' },
  { id: '68mldkargi', label: '68 MLD STP, Kargi Chowk, Dehradun', plantCode: '68mldkargi', stpId: 'kargi-68' },
  { id: '20mldmoth_2', label: '20 MLD STP, Mothorowala-2, Dehradun', plantCode: '20mldmoth_2', stpId: 'mothorowala-20-2' },
  { id: '33mldsali', label: '33 MLD STP, Saliyar, Roorkee', plantCode: '33mldsali', stpId: 'saliar-33' },
  { id: '10mldkashipur', label: '10 MLD STP, Kashipur', plantCode: '10mldkashipur', stpId: 'kashipur-10' },
]

export const ALL_STP_FILTER_OPTION = { id: 'all', label: "All STP's" } as const

const OFFICIAL_ORDER = [
  '10mldbazpur',
  '14mldsarai',
  '68mldjag',
  '27mldjag_upg',
  '18mldsarai_upg',
  '18mldjag',
  '26mldlkgt2',
  '28mldindira',
  '20mldmothorowala',
  '68mldkargi',
  '20mldmoth_2',
  '33mldsali',
  '10mldkashipur',
]

/** Dropdown options for Data Reports / Live Camera Feed: All STP's + 13 official plants. */
export function toFilterPlantOptions(
  plants: DashboardPlant[],
): Array<{ id: string; label: string; plantCode?: string; stpId?: string }> {
  const options = toPlantOptions(plants)
  return [
    ALL_STP_FILTER_OPTION,
    ...options.map((plant) => ({
      id: plant.plantCode,
      label: plant.label,
      plantCode: plant.plantCode,
      stpId: plant.stpId,
    })),
  ]
}

function matchStpId(plantCode: string, plantName?: string) {
  if (PLANT_CODE_TO_STP_ID[plantCode]) return PLANT_CODE_TO_STP_ID[plantCode]

  const name = (plantName ?? '').toLowerCase()
  const match = Object.entries(stpDetails).find(([, detail]) => {
    const detailName = detail.name.toLowerCase()
    return detailName.includes(name) || (name && detailName.replace(/\s*stp,?\s*/i, ' ').trim().includes(name))
  })

  return match?.[0] ?? plantCode
}

/**
 * Returns all 13 official STPs in strictly canonical order.
 * Merges any live API data (e.g. tables) from /dashboard/plants, while guaranteeing
 * the exact 13 names and ordering from the official master list.
 */
export function toPlantOptions(plants: DashboardPlant[]): PlantOption[] {
  const byCode = new Map<string, DashboardPlant>()
  for (const plant of plants || []) {
    if (plant?.plantCode) {
      byCode.set(plant.plantCode.toLowerCase().trim(), plant)
    }
  }

  return FALLBACK_PLANT_OPTIONS.map((canonical) => {
    const apiPlant = byCode.get(canonical.plantCode.toLowerCase())
    return {
      id: canonical.plantCode,
      label: canonical.label,
      plantCode: canonical.plantCode,
      stpId: canonical.stpId,
      ...(apiPlant?.tables ? { tables: apiPlant.tables } : {}),
    }
  })
}

export function resolveStpDetail(option: PlantOption | undefined) {
  const fallback = stpDetails[stpOptions[0].id]

  if (!option) return fallback

  const stpKey = option.stpId || PLANT_CODE_TO_STP_ID[option.plantCode] || PLANT_CODE_TO_STP_ID[option.id] || option.id
  const base = stpDetails[stpKey] || stpDetails[PLANT_CODE_TO_STP_ID[option.plantCode]] || stpDetails[PLANT_CODE_TO_STP_ID[option.id]]
  if (base) {
    return base
  }

  return {
    ...fallback,
    name: option.label,
    address: '—',
    status: '—',
    createdOn: '—',
    lastSeen: '—',
    inCharge: { name: '—', phone: '—', email: '—', role: '—' },
    vendor: { name: '—', prefixId: option.plantCode },
    site: { state: '—', city: '—', zip: '—', lat: '—', lng: '—' },
    penalty: { amount: '₹0', reason: 'No active penalty' },
  }
}

export function toPlantNameByCode(plants: DashboardPlant[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const plant of FALLBACK_PLANT_OPTIONS) {
    map[plant.plantCode] = plant.label
    map[plant.stpId] = plant.label
  }
  return map
}

export async function fetchDashboardPlants(): Promise<DashboardPlant[]> {
  try {
    const response = await fetch(`${DASHBOARD_API}/dashboard/plants`)
    if (!response.ok) throw new Error('Failed to load plants')

    const payload = await response.json()
    const plants = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
    return plants.filter((plant): plant is DashboardPlant => Boolean(plant?.plantName && plant?.plantCode))
  } catch {
    return []
  }
}

/** Live / inlet / outlet paths for whichever plantCode was selected from /dashboard/plants. */
export function dashboardResourceUrl(plantCode: string, resource: 'live' | 'inlet' | 'outlet') {
  return `${DASHBOARD_API}/dashboard/${encodeURIComponent(plantCode)}/${resource}`
}

export async function loadPlantPickerOptions(): Promise<PlantOption[]> {
  const plants = await fetchDashboardPlants()
  return toPlantOptions(plants)
}

export type StpActiveStatusItem = {
  plantCode: string
  plantName: string
  active: boolean
  status: 'ACTIVE' | 'NON_ACTIVE'
  reason: string
  lastActive: string | null
  inletFlow: number | null
  outletFlow: number | null
}

export type StpActiveStatusData = {
  thresholdHours: number
  totalCount: number
  activeCount: number
  nonActiveCount: number
  activeStps: StpActiveStatusItem[]
  nonActiveStps: StpActiveStatusItem[]
  plants: StpActiveStatusItem[]
}

export async function fetchStpActiveStatus(hours = 4): Promise<StpActiveStatusData | null> {
  try {
    const response = await fetch(`${DASHBOARD_API}/dashboard/active-status?hours=${hours}`)
    if (!response.ok) throw new Error('Failed to load active status')
    const payload = await response.json()
    return payload?.data ?? null
  } catch {
    return null
  }
}

