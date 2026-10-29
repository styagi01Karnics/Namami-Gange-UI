export type ChemicalReceipt = {
  /** Date the stock arrived (YYYY-MM-DD). */
  date: string
  /** Quantity received, e.g. "500 g". */
  qty: string
}

export type ChemicalInventoryItem = {
  name: string
  category: string
  currentQty: string
  requiredQty: string
  consumption: string
  daysLeft: string | number
  status: 'Adequate' | 'Low Stock' | 'Out of Stock'
  receivedOn?: string
  /** Every delivery of this chemical. When omitted, currentQty + receivedOn form one receipt. */
  receipts?: ChemicalReceipt[]
}

/** Default date the current stock was received (YYYY-MM-DD). */
export const STOCK_RECEIVED_ON = '2026-09-01'

const LOW_STOCK_RATIO = 0.2
const DAY_MS = 24 * 60 * 60 * 1000

/** Base-unit factors; kg and L both map to 1 so Chlorine (kg stock, L usage) compares 1:1. */
const UNIT_FACTORS: Record<string, number> = {
  g: 0.001,
  kg: 1,
  ml: 0.001,
  l: 1,
  lit: 1,
  pcs: 1,
  no: 1,
}

export type ChemicalStockPosition = {
  /** Date of the first receipt. */
  receivedOn: Date
  receipts: { date: Date; qty: string }[]
  unit: string
  totalQty: number
  consumedQty: number
  remainingQty: number
  availableTill: Date | null
  status: ChemicalInventoryItem['status']
}

function parseAmount(text: string) {
  const match = text.match(/^([\d,.]+)\s*([a-zA-Z]+)/)
  if (!match) return null
  const factor = UNIT_FACTORS[match[2].toLowerCase()]
  const amount = Number(match[1].replace(/,/g, ''))
  if (factor === undefined || Number.isNaN(amount)) return null
  return { amount, unit: match[2], factor }
}

/** Reads the period in parentheses, e.g. "(15 Days)", "(1 Month)", "(24 Hours)". */
function periodInDays(text: string) {
  const match = text.match(/\(\s*([\d.]+)\s*(hours?|days?|months?)\s*\)/i)
  if (!match) return null
  const count = Number(match[1])
  const unit = match[2].toLowerCase()
  if (unit.startsWith('hour')) return count / 24
  if (unit.startsWith('month')) return count * 30
  return count
}

function resolveReceipts(item: ChemicalInventoryItem): ChemicalReceipt[] {
  if (item.receipts?.length) return item.receipts
  return [{ date: item.receivedOn ?? STOCK_RECEIVED_ON, qty: item.currentQty }]
}

/**
 * Derives received total, consumed-to-date, remaining quantity, stock end date and status.
 * Each receipt adds stock on its date and usage is drawn from the pooled stock day by day,
 * so a delivery that arrives after the stock ran out restarts consumption from its date.
 */
export function getChemicalStockPosition(item: ChemicalInventoryItem, now = new Date()): ChemicalStockPosition {
  const receipts = resolveReceipts(item)
    .map((receipt) => ({
      date: new Date(`${receipt.date}T00:00:00`),
      qty: receipt.qty,
      amount: parseAmount(receipt.qty),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const unitSource = parseAmount(item.currentQty) ?? receipts.find((receipt) => receipt.amount)?.amount ?? null
  const stockFactor = unitSource?.factor ?? 1
  const usage = parseAmount(item.consumption)
  const periodDays = periodInDays(item.consumption)
  const dailyUseBase = usage && periodDays ? (usage.amount * usage.factor) / periodDays : 0
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const firstReceivedOn = receipts[0].date
  const elapsedDays = Math.max(0, Math.round((today.getTime() - firstReceivedOn.getTime()) / DAY_MS))
  const dayOffset = (date: Date) => Math.round((date.getTime() - firstReceivedOn.getTime()) / DAY_MS)

  let pool = 0
  let receivedBase = 0
  let consumedBase = 0
  let nextReceipt = 0
  for (let day = 0; day <= elapsedDays; day++) {
    if (day > 0) {
      const used = Math.min(pool, dailyUseBase)
      pool -= used
      consumedBase += used
    }
    while (nextReceipt < receipts.length && dayOffset(receipts[nextReceipt].date) === day) {
      const base = (receipts[nextReceipt].amount?.amount ?? 0) * (receipts[nextReceipt].amount?.factor ?? 1)
      pool += base
      receivedBase += base
      nextReceipt++
    }
  }
  const remainingBase = pool

  let availableTill: Date | null = null
  if (dailyUseBase > 0) {
    availableTill = new Date(today)
    availableTill.setDate(today.getDate() + Math.floor(remainingBase / dailyUseBase))
  }

  const status =
    remainingBase <= 0 ? 'Out of Stock' : remainingBase / receivedBase <= LOW_STOCK_RATIO ? 'Low Stock' : 'Adequate'

  return {
    receivedOn: firstReceivedOn,
    receipts: receipts.map((receipt) => ({ date: receipt.date, qty: receipt.qty })),
    unit: unitSource?.unit ?? '',
    totalQty: receivedBase / stockFactor,
    consumedQty: consumedBase / stockFactor,
    remainingQty: remainingBase / stockFactor,
    availableTill,
    status,
  }
}

/**
 * Official chemical inventory roster for 10 MLD STP, Bazpur as per the laboratory record sheet.
 */
export const BAZPUR_CHEMICAL_INVENTORY: ChemicalInventoryItem[] = [
  {
    name: 'Potassium Dichromate',
    category: 'Lab Reagents',
    currentQty: '500 g',
    requiredQty: '6.23 g (15 days)',
    consumption: '6.23 g (15 days)',
    daysLeft: 1200,
    status: 'Adequate',
  },
  {
    name: 'Sodium Hydroxide',
    category: 'pH Adjusters',
    currentQty: '500 g',
    requiredQty: '127.53 g (15 Days)',
    consumption: '127.53 g (15 Days)',
    daysLeft: 59,
    status: 'Adequate',
  },
  {
    name: 'Silver Sulphate',
    category: 'Lab Reagents',
    currentQty: '25 g',
    requiredQty: '3.4 g (15 Days)',
    consumption: '3.4 g (15 Days)',
    daysLeft: 110,
    status: 'Adequate',
  },
  {
    name: 'Mercuric Sulphate',
    category: 'Lab Reagents',
    currentQty: '250 g',
    requiredQty: '6.6 g (15 Days)',
    consumption: '6.6 g (15 Days)',
    daysLeft: 568,
    status: 'Adequate',
  },
  {
    name: 'Manganous Sulphate',
    category: 'Lab Reagents',
    currentQty: '1000 g',
    requiredQty: '109.5 g (15 Days)',
    consumption: '109.5 g (15 Days)',
    daysLeft: 68,
    status: 'Adequate',
    receipts: [
      { date: '2026-09-01', qty: '500 g' },
      { date: '2026-09-05', qty: '200 g' },
      { date: '2026-10-05', qty: '300 g' },
    ],
  },
  {
    name: 'Sodium Iodide',
    category: 'Lab Reagents',
    currentQty: '200 g',
    requiredQty: '34.7 g (15 Days)',
    consumption: '34.7 g (15 Days)',
    daysLeft: 86,
    status: 'Adequate',
  },
  {
    name: 'Sodium Azide',
    category: 'Lab Reagents',
    currentQty: '500 g',
    requiredQty: '4.6 g (15 Days)',
    consumption: '4.6 g (15 Days)',
    daysLeft: 1630,
    status: 'Adequate',
  },
  {
    name: 'Ferrous Ammonium Sulphate',
    category: 'Lab Reagents',
    currentQty: '500 g',
    requiredQty: '39.6 g (15 Days)',
    consumption: '39.6 g (15 Days)',
    daysLeft: 189,
    status: 'Adequate',
  },
  {
    name: 'Calcium Chloride',
    category: 'Coagulant',
    currentQty: '500 g',
    requiredQty: '1.378 g (15 Days)',
    consumption: '1.378 g (15 Days)',
    daysLeft: 5442,
    status: 'Adequate',
  },
  {
    name: 'Magnesium Sulphate',
    category: 'Nutrients / Salt',
    currentQty: '500 g',
    requiredQty: '13.76 g (15 Days)',
    consumption: '13.76 g (15 Days)',
    daysLeft: 545,
    status: 'Adequate',
  },
  {
    name: 'Ferric Chloride',
    category: 'Coagulant',
    currentQty: '500 g',
    requiredQty: '0.075 g (15 Days)',
    consumption: '0.075 g (15 Days)',
    daysLeft: 9999,
    status: 'Adequate',
  },
  {
    name: 'Potassium Hydrogen Phosphate',
    category: 'Buffer / Nutrient',
    currentQty: '500 g',
    requiredQty: '0.66 g (15 Days)',
    consumption: '0.66 g (15 Days)',
    daysLeft: 9999,
    status: 'Adequate',
  },
  {
    name: 'Di Potassium Hydrogen Phosphate',
    category: 'Buffer / Nutrient',
    currentQty: '500 g',
    requiredQty: '1.16 g (15 Days)',
    consumption: '1.16 g (15 Days)',
    daysLeft: 6465,
    status: 'Adequate',
  },
  {
    name: 'Di Sodium Hydrogen Phosphate',
    category: 'Buffer / Nutrient',
    currentQty: '500 g',
    requiredQty: '2.35 g (15 Days)',
    consumption: '2.35 g (15 Days)',
    daysLeft: 3191,
    status: 'Adequate',
  },
  {
    name: 'Ammonium Chloride',
    category: 'Nutrients / Reagent',
    currentQty: '500 g',
    requiredQty: '0.18 g (15 Days)',
    consumption: '0.18 g (15 Days)',
    daysLeft: 9999,
    status: 'Adequate',
  },
  {
    name: 'Sodium Thiosulphate',
    category: 'Lab Reagents',
    currentQty: '500 g',
    requiredQty: '6.28 g (15 Days)',
    consumption: '6.28 g (15 Days)',
    daysLeft: 1194,
    status: 'Adequate',
  },
  {
    name: 'Starch',
    category: 'Indicator / Reagent',
    currentQty: '500 g',
    requiredQty: '1.5 g (15 Days)',
    consumption: '1.5 g (15 Days)',
    daysLeft: 5000,
    status: 'Adequate',
  },
  {
    name: 'Ferroin',
    category: 'Indicator / Reagent',
    currentQty: '100 ml',
    requiredQty: '31 ml (15 Days)',
    consumption: '31 ml (15 Days)',
    daysLeft: 48,
    status: 'Adequate',
  },
  {
    name: 'Chlorotex',
    category: 'Testing Reagent',
    currentQty: '250 ml',
    requiredQty: '15 ml (15 Days)',
    consumption: '15 ml (15 Days)',
    daysLeft: 250,
    status: 'Adequate',
  },
  {
    name: 'Lebalone',
    category: 'Cleaning Agent',
    currentQty: '5 Lit',
    requiredQty: '1 Lit (1 Month)',
    consumption: '1 Lit (1 Month)',
    daysLeft: 150,
    status: 'Adequate',
  },
  {
    name: 'Filter Paper (47 mm)',
    category: 'Consumables',
    currentQty: '100 Pcs',
    requiredQty: '62 Pcs (1 month)',
    consumption: '62 Pcs (1 month)',
    daysLeft: 48,
    status: 'Adequate',
  },
  {
    name: 'Filter Paper (41 No)',
    category: 'Consumables',
    currentQty: '100 Pcs',
    requiredQty: '62 Pcs (1 month)',
    consumption: '62 Pcs (1 month)',
    daysLeft: 48,
    status: 'Adequate',
  },
  {
    name: 'Sulfuric Acid',
    category: 'pH Adjusters',
    currentQty: '5 Lit',
    requiredQty: '3 Lit (1 Month)',
    consumption: '3 Lit (1 Month)',
    daysLeft: 50,
    status: 'Adequate',
  },
  {
    name: 'Chlorine',
    category: 'Disinfectant',
    currentQty: '900 Kg',
    requiredQty: '21 Lit (24 Hours)',
    consumption: '21 Lit (24 Hours)',
    daysLeft: 43,
    status: 'Adequate',
  },
]

/**
 * Returns the standardized chemical inventory for any STP plant,
 * scaling bulk disinfectant (Chlorine) according to plant capacity while keeping
 * standardized laboratory test packaging and consumption rates.
 */
export function getChemicalInventoryForPlant(plantNameOrCode?: string): ChemicalInventoryItem[] {
  const seed = (plantNameOrCode ?? '').trim()
  const match = seed.match(/(\d+(?:\.\d+)?)\s*mld/i)
  const capacity = match ? parseFloat(match[1]) : 10
  const scale = capacity > 0 ? capacity / 10 : 1

  return BAZPUR_CHEMICAL_INVENTORY.map((item) => {
    const scaled: ChemicalInventoryItem =
      item.name.toLowerCase() === 'chlorine'
        ? {
            ...item,
            currentQty: `${Math.round(900 * scale).toLocaleString('en-IN')} Kg`,
            requiredQty: `${Math.round(21 * scale)} Lit (24 Hours)`,
            consumption: `${Math.round(21 * scale)} Lit (24 Hours)`,
          }
        : { ...item }
    // Status is derived from remaining stock, not the static roster value.
    return { ...scaled, status: getChemicalStockPosition(scaled).status }
  })
}
