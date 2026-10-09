import { useEffect, useState } from 'react'
import { Beaker, Droplet, FlaskConical, X } from 'lucide-react'
import { chemicalInventory } from '../../data/mockData'

const STOCK = {
  total: 10000,
  used: 6000,
  categories: [
    { id: 'coagulant', label: 'Coagulant', amount: 1500, percent: 25, color: '#1677F2' },
    { id: 'disinfectant', label: 'Disinfectant', amount: 1200, percent: 20, color: '#9651E5' },
    { id: 'polymers', label: 'Polymers', amount: 1100, percent: 18.33, color: '#F04475' },
    { id: 'ph', label: 'pH Adjusters', amount: 1300, percent: 21.67, color: '#F59E0B' },
    { id: 'others', label: 'Others', amount: 900, percent: 15, color: '#12B8B0' },
  ],
}

const REMAINING = STOCK.total - STOCK.used
const USED_PERCENT = (STOCK.used / STOCK.total) * 100
const REMAINING_PERCENT = 100 - USED_PERCENT
const CATEGORY_TOTAL = STOCK.categories.reduce((sum, item) => sum + item.amount, 0)
const DONUT_CIRCUMFERENCE = 2 * Math.PI * 66
const formatLitres = (value: number) => `${value.toLocaleString('en-IN')} L`

function ChemicalListModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

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
        className="flex max-h-[min(80vh,680px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_20px_60px_rgba(9,35,71,0.3)]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-[#E5EEF8] px-5 py-4">
          <div>
            <h2 id="chemical-list-title" className="text-[17px] font-bold text-[#16345B]">Chemical Inventory List</h2>
            <p className="mt-1 text-[12px] text-[#71829A]">{chemicalInventory.rows.length} chemical records available</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chemical inventory list"
            className="grid size-9 shrink-0 place-items-center rounded-[8px] text-[#526783] hover:bg-[#F2F7FC]"
          >
            <X size={18} />
          </button>
        </header>
        <div className="min-h-0 overflow-auto p-4">
          <table className="w-full min-w-[620px] border-collapse text-left text-[12px]">
            <thead className="sticky top-0 bg-[#F2F7FC] text-[#536987]">
              <tr>
                <th className="px-3 py-3 font-semibold">Chemical Name</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Current Qty</th>
                <th className="px-3 py-3 font-semibold">Required Qty</th>
                <th className="px-3 py-3 font-semibold">Days Left</th>
                <th className="px-3 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {chemicalInventory.rows.map((chemical) => (
                <tr key={chemical.name} className="border-b border-[#EAF0F6] last:border-0 hover:bg-[#F8FBFF]">
                  <td className="px-3 py-3 font-semibold text-[#254064]">{chemical.name}</td>
                  <td className="px-3 py-3 text-[#526783]">{chemical.category}</td>
                  <td className="px-3 py-3 text-[#254064]">{chemical.currentQty}</td>
                  <td className="px-3 py-3 text-[#254064]">{chemical.requiredQty}</td>
                  <td className="px-3 py-3 text-[#254064]">{chemical.daysLeft} days</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${chemical.status === 'Adequate' ? 'bg-[#E8F8EF] text-[#168849]' : chemical.status === 'Low Stock' ? 'bg-[#FFF5E5] text-[#B66A00]' : 'bg-[#FFF0F0] text-[#D6333F]'}`}>
                      {chemical.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function ChemicalStockOverview() {
  return (
    <section className="rounded-[12px] border border-[#DDEBFA] bg-white p-[16px] shadow-[0_2px_9px_rgba(13,85,151,0.05)]">
      <h3 className="text-[15px] font-bold text-[#16345B]">Chemical Stock Overview</h3>
      <p className="mt-1 text-[12px] text-[#71829A]">Used vs remaining stock for the selected period</p>

      <div className="mt-[12px] rounded-[12px] bg-[#EEF7FF] px-[14px] pb-[12px] pt-[14px]">
        <p className="text-center text-[12px] font-semibold text-[#254064]">Total Stock This Month</p>
        <div className="relative mx-auto mt-1 w-full max-w-[360px]">
          <svg viewBox="0 0 280 165" className="h-auto w-full" role="img" aria-label={`${USED_PERCENT}% used and ${REMAINING_PERCENT}% remaining from ${formatLitres(STOCK.total)}`}>
            <path d="M 34 135 A 106 106 0 0 1 246 135" fill="none" stroke="#E3ECF4" strokeWidth="22" strokeLinecap="round" />
            <path
              d="M 34 135 A 106 106 0 0 1 246 135"
              pathLength="100"
              fill="none"
              stroke="#EF3838"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={`${USED_PERCENT} ${REMAINING_PERCENT}`}
            >
              <title>{`Chemical used: ${formatLitres(STOCK.used)} (${USED_PERCENT}%)`}</title>
            </path>
            <path
              d="M 34 135 A 106 106 0 0 1 246 135"
              pathLength="100"
              fill="none"
              stroke="#159447"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={`${REMAINING_PERCENT} ${USED_PERCENT}`}
              strokeDashoffset={-USED_PERCENT}
            >
              <title>{`Chemical remaining: ${formatLitres(REMAINING)} (${REMAINING_PERCENT}%)`}</title>
            </path>
            <text x="140" y="96" textAnchor="middle" className="fill-[#102653] text-[21px] font-bold">{formatLitres(STOCK.total)}</text>
            <text x="140" y="116" textAnchor="middle" className="fill-[#71829A] text-[11px]">Total Stock</text>
          </svg>
          <span className="absolute left-[2%] top-[53%] rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#10233E] shadow-sm">{USED_PERCENT}% Used</span>
          <span className="absolute right-[2%] top-[53%] rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#10233E] shadow-sm">{REMAINING_PERCENT}% Remaining</span>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-[10px]">
          <div className="rounded-[10px] border border-[#FFE0E0] bg-white p-[11px]">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#526783]"><FlaskConical size={15} className="text-[#EF3838]" />Chemical Used</div>
            <p className="mt-1 text-[17px] font-bold leading-5 text-[#E52626]">{formatLitres(STOCK.used)}</p>
            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#E8EDF3]"><div className="h-full rounded-full bg-[#EF3838]" style={{ width: `${USED_PERCENT}%` }} /></div>
            <p className="mt-1 text-[10px] text-[#71829A]">{USED_PERCENT}% of total stock</p>
          </div>
          <div className="rounded-[10px] border border-[#D9F3E4] bg-white p-[11px]">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#526783]"><Beaker size={15} className="text-[#159447]" />Chemical Left</div>
            <p className="mt-1 text-[17px] font-bold leading-5 text-[#159447]">{formatLitres(REMAINING)}</p>
            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#E8EDF3]"><div className="h-full rounded-full bg-[#159447]" style={{ width: `${REMAINING_PERCENT}%` }} /></div>
            <p className="mt-1 text-[10px] text-[#71829A]">{REMAINING_PERCENT}% of total stock</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChemicalUsageDetails() {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null)
  let offset = 0
  const segments = STOCK.categories.map((category) => {
    const fraction = category.amount / CATEGORY_TOTAL
    const segment = { ...category, fraction, offset }
    offset += fraction * DONUT_CIRCUMFERENCE
    return segment
  })
  const hoveredCategory = STOCK.categories.find((category) => category.id === hoveredCategoryId)

  return (
    <section className="min-w-0 overflow-hidden rounded-[12px] border border-[#DDEBFA] bg-white shadow-[0_2px_9px_rgba(13,85,151,0.05)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8F0F8] px-[16px] py-[14px]">
        <div>
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#16345B]"><span className="h-[20px] w-[3px] rounded-full bg-[#1677F2]" />Chemical Usage Details</h3>
          <p className="ml-[11px] mt-1 text-[11px] text-[#71829A]">Breakdown of chemical consumption for the selected period</p>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] border border-[#E1EDFA] bg-[#F8FBFF] px-3 py-2">
          <span className="grid size-[32px] place-items-center rounded-[9px] bg-[#E8F3FF] text-[#1677F2]"><Droplet size={17} /></span>
          <div>
            <p className="text-[10px] text-[#71829A]">Total Used</p>
            <p className="text-[16px] font-bold leading-5 text-[#102653]">{formatLitres(STOCK.used)}</p>
            <p className="text-[9px] text-[#71829A]">of {formatLitres(STOCK.total)}</p>
          </div>
        </div>
      </header>

      <div className="flex justify-center p-[14px]">
          <div className="relative size-[220px] shrink-0">
            <svg viewBox="0 0 180 180" className="size-full -rotate-90" role="img" aria-label={`Chemical category usage totaling ${formatLitres(CATEGORY_TOTAL)}`}>
              <circle cx="90" cy="90" r="66" fill="none" stroke="#EEF3F8" strokeWidth="27" />
              {segments.map((segment) => (
                <circle
                  key={segment.id}
                  cx="90"
                  cy="90"
                  r="66"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={hoveredCategoryId === segment.id ? 31 : 27}
                  strokeDasharray={`${Math.max(0, segment.fraction * DONUT_CIRCUMFERENCE - 1.5)} ${DONUT_CIRCUMFERENCE}`}
                  strokeDashoffset={-segment.offset}
                  className="cursor-pointer transition-[stroke-width,opacity] hover:opacity-90"
                  onMouseEnter={() => setHoveredCategoryId(segment.id)}
                  onMouseLeave={() => setHoveredCategoryId(null)}
                  onFocus={() => setHoveredCategoryId(segment.id)}
                  onBlur={() => setHoveredCategoryId(null)}
                  tabIndex={0}
                >
                  <title>{`${segment.label}: ${formatLitres(segment.amount)} (${segment.percent}%)`}</title>
                </circle>
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              {hoveredCategory ? (
                <>
                  <span className="text-[12px] font-semibold leading-4" style={{ color: hoveredCategory.color }}>{hoveredCategory.label}</span>
                  <span className="mt-0.5 text-[17px] font-bold leading-5 text-[#102653]">{formatLitres(hoveredCategory.amount)}</span>
                  <span className="text-[10px] text-[#71829A]">{hoveredCategory.percent}% of usage</span>
                </>
              ) : (
                <>
                  <span className="text-[20px] font-bold leading-6 text-[#102653]">{formatLitres(STOCK.used)}</span>
                  <span className="text-[10px] text-[#71829A]">Total Used</span>
                </>
              )}
            </div>
          </div>
      </div>

      <div className="border-t border-[#E8F0F8] p-[14px] pt-[11px]">
        <h4 className="mb-2 flex items-center gap-2 text-[12px] font-bold text-[#16345B]"><span className="h-[16px] w-[3px] rounded-full bg-[#1677F2]" />Category-wise Usage</h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#F4F8FD] text-left text-[#536987]">
                <th className="rounded-l-[6px] px-2 py-[7px] font-semibold">Chemical Category</th>
                <th className="px-2 py-[7px] font-semibold">Used Quantity (L)</th>
                <th className="px-2 py-[7px] font-semibold">Usage</th>
                <th className="rounded-r-[6px] px-2 py-[7px] text-right font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {STOCK.categories.map((category) => (
                <tr
                  key={category.id}
                  className={`border-b border-[#EDF2F8] transition-colors ${hoveredCategoryId === category.id ? 'bg-[#F5F9FF]' : ''}`}
                  onMouseEnter={() => setHoveredCategoryId(category.id)}
                  onMouseLeave={() => setHoveredCategoryId(null)}
                >
                  <td className="px-2 py-[7px] font-semibold text-[#254064]">{category.label}</td>
                  <td className="whitespace-nowrap px-2 py-[7px] font-medium text-[#19355B]">{formatLitres(category.amount)}</td>
                  <td className="min-w-[90px] px-2 py-[7px]">
                    <div className="h-[6px] overflow-hidden rounded-full bg-[#E8EDF3]">
                      <div className="h-full rounded-full" style={{ width: `${(category.amount / CATEGORY_TOTAL) * 100}%`, backgroundColor: category.color }} />
                    </div>
                  </td>
                  <td className="px-2 py-[7px] text-right font-bold" style={{ color: category.color }}>{category.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default function ChemicalOverviewCard() {
  const [chemicalListOpen, setChemicalListOpen] = useState(false)

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
                98
              </button>
              <span className="text-[11px] text-[#71829A]">Types of chemicals in inventory</span>
            </div>
          </div>
        </section>
        <ChemicalStockOverview />
      </div>
      <ChemicalUsageDetails />
      {chemicalListOpen && <ChemicalListModal onClose={() => setChemicalListOpen(false)} />}
    </div>
  )
}
