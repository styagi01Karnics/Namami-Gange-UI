import { stpDetails, stpOptions } from '../data/mockData'

const DASHBOARD_API = import.meta.env.VITE_DASHBOARD_API_URL ?? '/dashboard-api'

export type DashboardPlant = {
  plantName: string
  plantCode: string
  tables?: Record<string, string>
}

/** Maps API plant codes to existing mock STP detail keys used by CCTV and headers. */
const PLANT_CODE_TO_STP_ID: Record<string, string> = {
  '68mldjag': 'jagjeetpur-68',
  '68mldkargi': 'kargi-68',
  '18mldjag': 'sarai-18',
  '33mldsali': 'saliar-33',
  '14mldsarai': 'sarai-14',
  '20mldmothorowala': 'mothorowala-20',
  '20mldmoth_2': 'mothorowala-20-2',
  '27mldknh4': 'kankhal-27',
  '5mldbgp6': 'bhagwanpur-5',
  '26mldlkgt2': 'lakkar-ghat-26',
}

export type PlantOption = {
  id: string
  label: string
  plantCode: string
  stpId: string
}

/** Used before `/dashboard/plants` loads (and if that call fails). */
export const FALLBACK_PLANT_OPTIONS: PlantOption[] = [
  { id: '68mldjag', label: '68 MLD Jagjeetpur', plantCode: '68mldjag', stpId: 'jagjeetpur-68' },
  { id: '68mldkargi', label: '68 MLD Kargi', plantCode: '68mldkargi', stpId: 'kargi-68' },
  { id: '18mldjag', label: '18 MLD Jagjeetpur', plantCode: '18mldjag', stpId: 'sarai-18' },
  { id: '33mldsali', label: '33 MLD Saliar', plantCode: '33mldsali', stpId: 'saliar-33' },
  { id: '14mldsarai', label: '14 MLD Sarai', plantCode: '14mldsarai', stpId: 'sarai-14' },
  { id: '20mldmothorowala', label: '20 MLD Mothorowala', plantCode: '20mldmothorowala', stpId: 'mothorowala-20' },
  { id: '20mldmoth_2', label: '20 MLD Mothorowala 2', plantCode: '20mldmoth_2', stpId: 'mothorowala-20-2' },
  { id: '27mldknh4', label: '27 MLD Kankhal', plantCode: '27mldknh4', stpId: 'kankhal-27' },
  { id: '5mldbgp6', label: '5 MLD Bhagwanpur', plantCode: '5mldbgp6', stpId: 'bhagwanpur-5' },
  { id: '26mldlkgt2', label: '26 MLD Lakkar Ghat', plantCode: '26mldlkgt2', stpId: 'lakkar-ghat-26' },
]

export const ALL_STP_FILTER_OPTION = { id: 'all', label: "All STP's" } as const

/** Dropdown options for Data Reports / Live Camera Feed: All STP's + plantName. */
export function toFilterPlantOptions(
  plants: DashboardPlant[],
): Array<{ id: string; label: string; plantCode?: string; stpId?: string }> {
  const options = plants.length > 0 ? toPlantOptions(plants) : FALLBACK_PLANT_OPTIONS
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

function sortPlants(plants: DashboardPlant[]) {
  return [...plants].sort((a, b) => a.plantName.localeCompare(b.plantName, undefined, { numeric: true }))
}

function matchStpId(plant: DashboardPlant) {
  if (PLANT_CODE_TO_STP_ID[plant.plantCode]) return PLANT_CODE_TO_STP_ID[plant.plantCode]

  const name = plant.plantName.toLowerCase()
  const match = Object.entries(stpDetails).find(([, detail]) => {
    const detailName = detail.name.toLowerCase()
    return detailName.includes(name) || name.includes(detailName.replace(/\s*stp,?\s*/i, ' ').trim())
  })

  return match?.[0] ?? plant.plantCode
}

/** One dropdown option per API plant — label is `plantName` from /dashboard/plants. */
export function toPlantOptions(plants: DashboardPlant[]): PlantOption[] {
  const seen = new Set<string>()

  return sortPlants(plants)
    .filter((plant) => Boolean(plant?.plantCode && plant?.plantName))
    .filter((plant) => {
      if (seen.has(plant.plantCode)) return false
      seen.add(plant.plantCode)
      return true
    })
    .map((plant) => ({
      id: plant.plantCode,
      label: String(plant.plantName).trim(),
      plantCode: plant.plantCode,
      stpId: matchStpId(plant),
    }))
}

export function resolveStpDetail(option: PlantOption | undefined) {
  const fallback = stpDetails[stpOptions[0].id]

  if (!option) return fallback

  const base = stpDetails[option.stpId]
  if (base) {
    return { ...base, name: option.label }
  }

  return {
    ...fallback,
    name: option.label,
    address: '—',
    status: 'Online',
    createdOn: '—',
    lastSeen: '—',
    penalty: { amount: '₹0', reason: 'No active penalty' },
  }
}

export function toPlantNameByCode(plants: DashboardPlant[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const plant of plants.length > 0 ? plants : FALLBACK_PLANT_OPTIONS.map((p) => ({
    plantCode: p.plantCode,
    plantName: p.label,
  }))) {
    map[plant.plantCode] = plant.plantName
  }
  // Fallbacks always available even when API succeeds for a subset.
  for (const plant of FALLBACK_PLANT_OPTIONS) {
    if (!map[plant.plantCode]) map[plant.plantCode] = plant.label
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
  return plants.length > 0 ? toPlantOptions(plants) : FALLBACK_PLANT_OPTIONS
}
