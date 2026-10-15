export type ChemicalInventoryItem = {
  name: string
  category: string
  currentQty: string
  requiredQty: string
  consumption: string
  daysLeft: string | number
  status: 'Adequate' | 'Low Stock' | 'Out of Stock'
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
    currentQty: '500 g',
    requiredQty: '109.5 g (15 Days)',
    consumption: '109.5 g (15 Days)',
    daysLeft: 68,
    status: 'Adequate',
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
    if (item.name.toLowerCase() === 'chlorine') {
      const qtyKg = Math.round(900 * scale)
      const consLit = Math.round(21 * scale)
      return {
        ...item,
        currentQty: `${qtyKg.toLocaleString('en-IN')} Kg`,
        requiredQty: `${consLit} Lit (24 Hours)`,
        consumption: `${consLit} Lit (24 Hours)`,
      }
    }
    return { ...item }
  })
}
