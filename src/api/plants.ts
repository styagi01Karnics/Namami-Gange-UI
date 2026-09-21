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
  '18mldjag': 'sarai-18',
  '33mldsali': 'saliar-33',
  '14mldsarai': 'sarai-14',
}

export type PlantOption = {
  id: string
  label: string
  plantCode: string
  stpId: string
}

/** Used before `/dashboard/plants` loads (and if that call fails). */
export const FALLBACK_PLANT_OPTIONS: PlantOption[] = [
  { id: '68mldjag', label: '68 MLD STP Jagjeetpur, Haridwar', plantCode: '68mldjag', stpId: 'jagjeetpur-68' },
  { id: '18mldjag', label: '18 MLD STP Jagjeetpur, Haridwar', plantCode: '18mldjag', stpId: 'sarai-18' },
  { id: '33mldsali', label: '33 MLD STP Saliar, Roorkee', plantCode: '33mldsali', stpId: 'saliar-33' },
  { id: '14mldsarai', label: '14 MLD STP Sarai, Haridwar', plantCode: '14mldsarai', stpId: 'sarai-14' },
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
      id: plant.stpId,
      label: plant.label,
      plantCode: plant.plantCode,
      stpId: plant.stpId,
    })),
  ]
}

function sortPlants(plants: DashboardPlant[]) {
  return [...plants].sort((a, b) => {
    const a68 = /68\s*mld/i.test(a.plantName) ? 0 : 1
    const b68 = /68\s*mld/i.test(b.plantName) ? 0 : 1
    if (a68 !== b68) return a68 - b68
    return a.plantName.localeCompare(b.plantName)
  })
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

export function toPlantOptions(plants: DashboardPlant[]): PlantOption[] {
  return sortPlants(plants).map((plant) => ({
    id: plant.plantCode,
    label: plant.plantName,
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
