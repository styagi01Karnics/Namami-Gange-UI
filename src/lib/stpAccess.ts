/**
 * Maps dashboard plant codes (mock + plant API, including `map-*` variants) to the real
 * STP labels that role-service stores and returns in the login response `stps`.
 */
const ROLE_STP_LABEL_BY_PLANT_CODE: Record<string, string> = {
  '10mldbazpur': '10 MLD STP Bazpur',
  'map-bazpur-10': '10 MLD STP Bazpur',
  '10mldkashipur': '10 MLD STP Kashipur',
  'map-kashipur-10': '10 MLD STP Kashipur',
  '14mldsarai': '14 MLD STP Sarai',
  '18mldsarai_upg': '18 MLD STP Sarai',
  'map-sarai-upgrade-18': '18 MLD STP Sarai',
  '18mldjag': '18 MLD STP Jagjeetpur',
  'map-jagjeetpur-18': '18 MLD STP Jagjeetpur',
  '27mldjag_upg': '27 MLD STP Jagjeetpur',
  'map-jagjeetpur-upgrade-27': '27 MLD STP Jagjeetpur',
  '68mldjag': '68 MLD STP Jagjeetpur',
  '20mldmothorowala': '20 MLD STP Mothorowala-1',
  '20mldmoth_2': '20 MLD STP Mothorowala-2',
  '26mldlkgt2': '26 MLD STP Lakkar Ghat',
  '28mldindira': '28 MLD STP Indra Nagar',
  'map-haldwani-28': '28 MLD STP Indra Nagar',
  '33mldsali': '33 MLD STP Saliyar',
  '68mldkargi': '68 MLD STP Kargi Chowk',
}

export const NO_STP_ACCESS_MESSAGE = 'You do not have access to this STP'

export function roleStpLabelForPlant(plantCode?: string | null): string | undefined {
  if (!plantCode) return undefined
  return ROLE_STP_LABEL_BY_PLANT_CODE[plantCode.trim().toLowerCase()]
}

export function canAccessStp(allowedStps: string[], plantCode?: string | null): boolean {
  const label = roleStpLabelForPlant(plantCode)
  return Boolean(label) && allowedStps.includes(label as string)
}
