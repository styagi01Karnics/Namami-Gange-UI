import { useEffect, useMemo, useState } from 'react'
import { Beaker, Droplet, FlaskConical, Search, X } from 'lucide-react'
import { stpDetails } from '../../data/mockData'
import {
  getChemicalInventoryForPlant,
  getChemicalStockPosition,
  type ChemicalInventoryItem,
} from '../../data/bazpurChemicalData'

const DONUT_CIRCUMFERENCE = 2 * Math.PI * 66
const CATEGORY_COLORS = ['#1677F2', '#9651E5', '#F04475', '#F59E0B', '#12B8B0', '#159447', '#EF3838', '#64748B']

type UnitFamily = 'mass' | 'volume' | 'count'

const UNIT_FAMILIES: Record<UnitFamily, { label: string; unit: string }> = {
  mass: { label: 'Mass', unit: 'kg' },
  volume: { label: 'Volume', unit: 'L' },
  count: { label: 'Count', unit: 'Pcs' },
}

const UNIT_TO_BASE: Record<string, { family: UnitFamily; factor: number }> = {
  g: { family: 'mass', factor: 0.001 },
  kg: { family: 'mass', factor: 1 },
  ml: { family: 'volume', factor: 0.001 },
  l: { family: 'volume', factor: 1 },
  lit: { family: 'volume', factor: 1 },
  pcs: { family: 'count', factor: 1 },
  no: { family: 'count', factor: 1 },
}

function parseQuantity(text: string | undefined): { family: UnitFamily; value: number } | null {
  const match = text?.match(/^([\d,.]+)\s*([a-zA-Z]+)/)
  if (!match) return null
  const unit = UNIT_TO_BASE[match[2].toLowerCase()]
  const amount = Number(match[1].replace(/,/g, ''))
  if (!unit || Number.isNaN(amount)) return null
  return { family: unit.family, value: amount * unit.factor }
}

function summarizeStock(chemicals: ChemicalInventoryItem[], family: UnitFamily) {
  let total = 0
  let used = 0
  chemicals.forEach((item) => {
    const stock = parseQuantity(item.currentQty)
    if (stock?.family !== family) return
    total += stock.value
    const consumed = parseQuantity(item.consumption)
    if (consumed?.family === family) used += consumed.value
  })
  used = Math.min(used, total)
  const usedPercent = total > 0 ? (used / total) * 100 : 0
  return { total, used, remaining: total - used, usedPercent, remainingPercent: 100 - usedPercent }
}

const formatQuantity = (value: number, unit: string) =>
  `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ${unit}`

const formatPercent = (value: number) => `${Number(value.toFixed(1))}%`

const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

type StockSummary = ReturnType<typeof summarizeStock>

type CategoryUsage = { label: string; amount: number; percent: number; color: string }

function summarizeCategoryUsage(chemicals: ChemicalInventoryItem[], family: UnitFamily): CategoryUsage[] {
  const totals = new Map<string, number>()
  chemicals.forEach((item) => {
    if (parseQuantity(item.currentQty)?.family !== family) return
    const consumed = parseQuantity(item.consumption)
    if (consumed?.family !== family) return
    totals.set(item.category, (totals.get(item.category) ?? 0) + consumed.value)
  })
  const grandTotal = Array.from(totals.values()).reduce((sum, value) => sum + value, 0)
  return Array.from(totals, ([label, amount]) => ({
    label,
    amount,
    percent: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
  }))
    .sort((a, b) => b.amount - a.amount)
    .map((category, index) => ({ ...category, color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }))
}

interface ChemicalListModalProps {
  onClose: () => void
  stpName?: string
  chemicals: ChemicalInventoryItem[]
}

function ChemicalListModal({ onClose, stpName, chemicals }: ChemicalListModalProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const rawList = chemicals

  const categories = useMemo(() => {
    const set = new Set<string>()
    rawList.forEach((item) => {
      if (item.category) set.add(item.category)
    })
    return ['All', ...Array.from(set)]
  }, [rawList])

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rawList.filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        String(item.currentQty).toLowerCase().includes(q) ||
        String(item.consumption ?? '').toLowerCase().includes(q)
      const matchesCat = categoryFilter === 'All' || item.category === categoryFilter
      return matchesSearch && matchesCat
    })
  }, [rawList, search, categoryFilter])

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#10233E]/55 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="chemical-list-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[min(82vh,720px)] w-full max-w-[1080px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_20px_60px_rgba(9,35,71,0.3)]"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5EEF8] px-5 py-4">
          <div>
            <h2 id="chemical-list-title" className="text-[17px] font-bold text-[#16345B]">
              Chemical Inventory List {stpName ? `— ${stpName}` : ''}
            </h2>
            <p className="mt-1 text-[12px] text-[#71829A]">
              {rawList.length} chemical records available · Low Stock when 20% or less remains
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8292A6]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chemicals..."
                className="h-8 w-44 rounded-md border border-[#D5E2F1] bg-[#F8FAFD] pl-8 pr-2.5 text-[12px] text-[#1E3A5F] placeholder-[#8EA0B6] transition-colors focus:border-[#1677F2] focus:bg-white focus:outline-none"
              />
            </div>
            {categories.length > 2 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-8 rounded-md border border-[#D5E2F1] bg-[#F8FAFD] px-2 text-[12px] text-[#1E3A5F] focus:border-[#1677F2] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chemical inventory list"
              className="grid size-8 shrink-0 place-items-center rounded-[8px] text-[#526783] hover:bg-[#F2F7FC]"
            >
              <X size={18} />
            </button>
          </div>
        </header>
        <div className="min-h-0 overflow-auto p-4">
          <table className="w-full min-w-[960px] border-collapse text-left text-[12px]">
            <thead className="sticky top-0 bg-[#F2F7FC] text-[#536987]">
              <tr>
                <th className="px-3 py-3 font-semibold">Chemical Name</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Stock Received</th>
                <th className="px-3 py-3 font-semibold">Usage Rate</th>
                <th className="px-3 py-3 font-semibold">Consumed Till Date</th>
                <th className="px-3 py-3 font-semibold">Remaining</th>
                <th className="px-3 py-3 font-semibold">Stock Available Till</th>
                <th className="px-3 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((chemical, idx) => {
                const position = getChemicalStockPosition(chemical)

                return (
                  <tr
                    key={`${chemical.name}-${idx}`}
                    className="border-b border-[#EAF0F6] last:border-0 hover:bg-[#F8FBFF]"
                  >
                    <td className="px-3 py-3 font-semibold text-[#254064]">{chemical.name}</td>
                    <td className="px-3 py-3 text-[#526783]">{chemical.category}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-[#1677F2]">{chemical.currentQty}</p>
                      <p className="mt-0.5 text-[11px] text-[#71829A]">from {formatDate(position.receivedOn)}</p>
                    </td>
                    <td className="px-3 py-3 text-[#254064]">{chemical.consumption}</td>
                    <td className="px-3 py-3 font-medium text-[#254064]">
                      {formatQuantity(position.consumedQty, position.unit)}
                    </td>
                    <td className="px-3 py-3 font-bold text-[#254064]">
                      {formatQuantity(position.remainingQty, position.unit)}
                    </td>
                    <td className="px-3 py-3 text-[#254064]">
                      {position.availableTill ? formatDate(position.availableTill) : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          position.status === 'Adequate'
                            ? 'bg-[#E8F8EF] text-[#168849]'
                            : position.status === 'Low Stock'
                            ? 'bg-[#FFF5E5] text-[#B66A00]'
                            : 'bg-[#FFF0F0] text-[#D6333F]'
                        }`}
                      >
                        {position.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-[13px] text-[#71829A]">
                    No chemicals match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

interface StockOverviewProps {
  families: UnitFamily[]
  family: UnitFamily
  onFamilyChange: (family: UnitFamily) => void
  stock: StockSummary
  unit: string
}

function ChemicalStockOverview({ families, family, onFamilyChange, stock, unit }: StockOverviewProps) {
  const fmt = (value: number) => formatQuantity(value, unit)

  return (
    <section className="rounded-[12px] border border-[#DDEBFA] bg-white p-[16px] shadow-[0_2px_9px_rgba(13,85,151,0.05)]">
      <h3 className="text-[15px] font-bold text-[#16345B]">Chemical Stock Overview</h3>
      <p className="mt-1 text-[12px] text-[#71829A]">Used vs remaining stock for the selected period</p>

      <div className="mt-[12px] rounded-[12px] bg-[#EEF7FF] px-[14px] pb-[12px] pt-[14px]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12px] font-semibold text-[#254064]">Total Stock This Month</p>
          {families.length > 1 && (
            <div className="inline-flex rounded-[8px] bg-white p-[3px] shadow-sm">
              {families.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onFamilyChange(f)}
                  aria-pressed={f === family}
                  className={`rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    f === family ? 'bg-[#1677F2] text-white' : 'text-[#526783] hover:bg-[#F2F7FC]'
                  }`}
                >
                  {UNIT_FAMILIES[f].label} ({UNIT_FAMILIES[f].unit})
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative mx-auto mt-1 w-full max-w-[360px]">
          <svg viewBox="0 0 280 165" className="h-auto w-full" role="img" aria-label={`${formatPercent(stock.usedPercent)} used and ${formatPercent(stock.remainingPercent)} remaining from ${fmt(stock.total)}`}>
            <path d="M 34 135 A 106 106 0 0 1 246 135" fill="none" stroke="#E3ECF4" strokeWidth="22" strokeLinecap="round" />
            <path
              d="M 34 135 A 106 106 0 0 1 246 135"
              pathLength="100"
              fill="none"
              stroke="#EF3838"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={`${stock.usedPercent} ${stock.remainingPercent}`}
            >
              <title>{`Chemical used: ${fmt(stock.used)} (${formatPercent(stock.usedPercent)})`}</title>
            </path>
            <path
              d="M 34 135 A 106 106 0 0 1 246 135"
              pathLength="100"
              fill="none"
              stroke="#159447"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={`${stock.remainingPercent} ${stock.usedPercent}`}
              strokeDashoffset={-stock.usedPercent}
            >
              <title>{`Chemical remaining: ${fmt(stock.remaining)} (${formatPercent(stock.remainingPercent)})`}</title>
            </path>
            <text x="140" y="96" textAnchor="middle" className="fill-[#102653] text-[21px] font-bold">{fmt(stock.total)}</text>
            <text x="140" y="116" textAnchor="middle" className="fill-[#71829A] text-[11px]">Total Stock</text>
          </svg>
          <span className="absolute left-[2%] top-[53%] rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#10233E] shadow-sm">{formatPercent(stock.usedPercent)} Used</span>
          <span className="absolute right-[2%] top-[53%] rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#10233E] shadow-sm">{formatPercent(stock.remainingPercent)} Remaining</span>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-[10px]">
          <div className="rounded-[10px] border border-[#FFE0E0] bg-white p-[11px]">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#526783]"><FlaskConical size={15} className="text-[#EF3838]" />Chemical Used</div>
            <p className="mt-1 text-[17px] font-bold leading-5 text-[#E52626]">{fmt(stock.used)}</p>
            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#E8EDF3]"><div className="h-full rounded-full bg-[#EF3838]" style={{ width: `${stock.usedPercent}%` }} /></div>
            <p className="mt-1 text-[10px] text-[#71829A]">{formatPercent(stock.usedPercent)} of total stock</p>
          </div>
          <div className="rounded-[10px] border border-[#D9F3E4] bg-white p-[11px]">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#526783]"><Beaker size={15} className="text-[#159447]" />Chemical Left</div>
            <p className="mt-1 text-[17px] font-bold leading-5 text-[#159447]">{fmt(stock.remaining)}</p>
            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#E8EDF3]"><div className="h-full rounded-full bg-[#159447]" style={{ width: `${stock.remainingPercent}%` }} /></div>
            <p className="mt-1 text-[10px] text-[#71829A]">{formatPercent(stock.remainingPercent)} of total stock</p>
          </div>
        </div>
      </div>
    </section>
  )
}

interface UsageDetailsProps {
  stock: StockSummary
  categories: CategoryUsage[]
  unit: string
}

function ChemicalUsageDetails({ stock, categories, unit }: UsageDetailsProps) {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null)
  const fmt = (value: number) => formatQuantity(value, unit)
  let offset = 0
  const segments = categories.map((category) => {
    const fraction = category.percent / 100
    const segment = { ...category, fraction, offset }
    offset += fraction * DONUT_CIRCUMFERENCE
    return segment
  })
  const hoveredCategory = categories.find((category) => category.label === hoveredCategoryId)

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-[#DDEBFA] bg-white shadow-[0_2px_9px_rgba(13,85,151,0.05)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8F0F8] px-[16px] py-[14px]">
        <div>
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#16345B]"><span className="h-[20px] w-[3px] rounded-full bg-[#1677F2]" />Chemical Usage Details</h3>
          <p className="ml-[11px] mt-1 text-[11px] text-[#71829A]">Breakdown of chemical consumption for the selected period</p>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] border border-[#E1EDFA] bg-[#F8FBFF] px-3 py-2">
          <span className="grid size-[32px] place-items-center rounded-[9px] bg-[#E8F3FF] text-[#1677F2]"><Droplet size={17} /></span>
          <div>
            <p className="text-[10px] text-[#71829A]">Total Used</p>
            <p className="text-[16px] font-bold leading-5 text-[#102653]">{fmt(stock.used)}</p>
            <p className="text-[9px] text-[#71829A]">of {fmt(stock.total)}</p>
          </div>
        </div>
      </header>

      <div className="flex justify-center p-[14px]">
          <div className="relative size-[220px] shrink-0">
            <svg viewBox="0 0 180 180" className="size-full -rotate-90" role="img" aria-label={`Chemical category usage totaling ${fmt(stock.used)}`}>
              <circle cx="90" cy="90" r="66" fill="none" stroke="#EEF3F8" strokeWidth="27" />
              {segments.map((segment) => (
                <circle
                  key={segment.label}
                  cx="90"
                  cy="90"
                  r="66"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={hoveredCategoryId === segment.label ? 31 : 27}
                  strokeDasharray={`${Math.max(0, segment.fraction * DONUT_CIRCUMFERENCE - 1.5)} ${DONUT_CIRCUMFERENCE}`}
                  strokeDashoffset={-segment.offset}
                  className="cursor-pointer transition-[stroke-width,opacity] hover:opacity-90"
                  onMouseEnter={() => setHoveredCategoryId(segment.label)}
                  onMouseLeave={() => setHoveredCategoryId(null)}
                  onFocus={() => setHoveredCategoryId(segment.label)}
                  onBlur={() => setHoveredCategoryId(null)}
                  tabIndex={0}
                >
                  <title>{`${segment.label}: ${fmt(segment.amount)} (${formatPercent(segment.percent)})`}</title>
                </circle>
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              {hoveredCategory ? (
                <>
                  <span className="text-[12px] font-semibold leading-4" style={{ color: hoveredCategory.color }}>{hoveredCategory.label}</span>
                  <span className="mt-0.5 text-[17px] font-bold leading-5 text-[#102653]">{fmt(hoveredCategory.amount)}</span>
                  <span className="text-[10px] text-[#71829A]">{formatPercent(hoveredCategory.percent)} of usage</span>
                </>
              ) : (
                <>
                  <span className="text-[20px] font-bold leading-6 text-[#102653]">{fmt(stock.used)}</span>
                  <span className="text-[10px] text-[#71829A]">Total Used</span>
                </>
              )}
            </div>
          </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-[#E8F0F8] p-[14px] pt-[11px]">
        <h4 className="mb-2 flex shrink-0 items-center gap-2 text-[12px] font-bold text-[#16345B]"><span className="h-[16px] w-[3px] rounded-full bg-[#1677F2]" />Category-wise Usage</h4>
        <div className="max-h-[320px] min-h-0 flex-1 overflow-auto lg:max-h-none">
          <table className="w-full min-w-[440px] border-collapse text-[10px]">
            <thead className="sticky top-0 bg-[#F4F8FD]">
              <tr className="text-left text-[#536987]">
                <th className="rounded-l-[6px] px-2 py-[7px] font-semibold">Chemical Category</th>
                <th className="px-2 py-[7px] font-semibold">Used Quantity ({unit})</th>
                <th className="px-2 py-[7px] font-semibold">Usage</th>
                <th className="rounded-r-[6px] px-2 py-[7px] text-right font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-2 py-6 text-center text-[11px] text-[#71829A]">No usage recorded for this unit</td>
                </tr>
              )}
              {categories.map((category) => (
                <tr
                  key={category.label}
                  className={`border-b border-[#EDF2F8] transition-colors ${hoveredCategoryId === category.label ? 'bg-[#F5F9FF]' : ''}`}
                  onMouseEnter={() => setHoveredCategoryId(category.label)}
                  onMouseLeave={() => setHoveredCategoryId(null)}
                >
                  <td className="px-2 py-[7px] font-semibold text-[#254064]">{category.label}</td>
                  <td className="whitespace-nowrap px-2 py-[7px] font-medium text-[#19355B]">{fmt(category.amount)}</td>
                  <td className="min-w-[90px] px-2 py-[7px]">
                    <div className="h-[6px] overflow-hidden rounded-full bg-[#E8EDF3]">
                      <div className="h-full rounded-full" style={{ width: `${category.percent}%`, backgroundColor: category.color }} />
                    </div>
                  </td>
                  <td className="px-2 py-[7px] text-right font-bold" style={{ color: category.color }}>{formatPercent(category.percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default function ChemicalOverviewCard({
  stpId,
  plantCode,
}: {
  stpId?: string
  plantCode?: string
} = {}) {
  const [chemicalListOpen, setChemicalListOpen] = useState(false)

  const plantName = useMemo(() => {
    const key = stpId ?? plantCode
    if (key && stpDetails[key]?.name) return stpDetails[key].name
    return plantCode ?? stpId ?? ''
  }, [stpId, plantCode])

  const chemicals = useMemo(() => {
    return getChemicalInventoryForPlant(plantName || stpId || plantCode)
  }, [plantName, stpId, plantCode])

  const stpDisplayName = plantName || 'STP Inventory'

  const [selectedFamily, setSelectedFamily] = useState<UnitFamily>('mass')
  const families = useMemo(
    () => (Object.keys(UNIT_FAMILIES) as UnitFamily[]).filter((f) => summarizeStock(chemicals, f).total > 0),
    [chemicals],
  )
  const family = families.includes(selectedFamily) ? selectedFamily : (families[0] ?? 'mass')
  const unit = UNIT_FAMILIES[family].unit
  const stock = useMemo(() => summarizeStock(chemicals, family), [chemicals, family])
  const categories = useMemo(() => summarizeCategoryUsage(chemicals, family), [chemicals, family])

  return (
    <div className="grid grid-cols-1 items-stretch gap-[14px] lg:grid-cols-[minmax(300px,0.95fr)_minmax(0,1.45fr)]">
      <div className="flex min-w-0 flex-col gap-[12px]">
        <section className="flex items-center gap-[14px] rounded-[12px] border border-[#DDEBFA] bg-gradient-to-r from-[#F4F9FF] to-white p-[15px] shadow-[0_2px_9px_rgba(13,85,151,0.05)]">
          <span className="grid size-[42px] shrink-0 place-items-center rounded-[11px] bg-[#EAF3FF] text-[#1677F2]"><FlaskConical size={22} /></span>
          <div className="min-w-0">
            <h3 className="text-[13px] font-semibold text-[#526783]">Total Chemicals</h3>
            <div className="mt-0.5 flex items-baseline gap-2">
              <button
                type="button"
                onClick={() => setChemicalListOpen(true)}
                aria-label="View chemical inventory list"
                className="text-[24px] font-bold leading-7 text-[#1677F2] underline decoration-2 underline-offset-2 hover:text-[#0055B8] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677F2]"
              >
                {chemicals.length}
              </button>
              <span className="text-[11px] text-[#71829A]">Types of chemicals in inventory</span>
            </div>
          </div>
        </section>
        <ChemicalStockOverview
          families={families}
          family={family}
          onFamilyChange={setSelectedFamily}
          stock={stock}
          unit={unit}
        />
      </div>
      <div className="relative">
        <div className="flex min-h-0 flex-col lg:absolute lg:inset-0">
          <ChemicalUsageDetails stock={stock} categories={categories} unit={unit} />
        </div>
      </div>
      {chemicalListOpen && (
        <ChemicalListModal
          onClose={() => setChemicalListOpen(false)}
          stpName={stpDisplayName}
          chemicals={chemicals}
        />
      )}
    </div>
  )
}
