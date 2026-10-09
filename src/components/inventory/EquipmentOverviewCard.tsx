import { useState } from 'react'
import { Boxes, Cog, Fan, Gauge, Waves, Wind } from 'lucide-react'

const EQUIPMENT = {
  total: 48,
  operational: 40,
  nonOperational: 8,
  categories: [
    { id: 'pumps', label: 'Pumps', working: 12, total: 14, color: '#1677F2', Icon: Waves },
    { id: 'blowers', label: 'Blowers', working: 7, total: 8, color: '#9B4DE0', Icon: Wind },
    { id: 'motors', label: 'Motors', working: 9, total: 11, color: '#F04475', Icon: Cog },
    { id: 'aerators', label: 'Aerators', working: 5, total: 7, color: '#F5A400', Icon: Fan },
    { id: 'others', label: 'Others', working: 7, total: 8, color: '#12B8B0', Icon: Boxes },
  ],
}

const OPERATIONAL_PERCENT = (EQUIPMENT.operational / EQUIPMENT.total) * 100
const NON_OPERATIONAL_PERCENT = (EQUIPMENT.nonOperational / EQUIPMENT.total) * 100
const CATEGORY_TOTAL = EQUIPMENT.categories.reduce((sum, category) => sum + category.working, 0)
const DONUT_CIRCUMFERENCE = 2 * Math.PI * 66

function EquipmentAvailabilityGauge() {
  return (
    <section className="rounded-[12px] border border-[#DDEBFA] bg-white p-[16px] shadow-[0_2px_9px_rgba(13,85,151,0.05)]">
      <h3 className="text-[14px] font-bold text-[#16345B]">Equipment Availability</h3>

      <div className="mt-[10px] flex flex-col items-center sm:flex-row sm:justify-between sm:gap-2">
        <div className="order-2 mt-2 flex w-full items-center justify-between sm:order-1 sm:mt-0 sm:w-auto sm:flex-col sm:items-start sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="size-[9px] rounded-full bg-[#F0444F]" />
            <div>
              <p className="text-[16px] font-bold leading-5 text-[#19355B]">{EQUIPMENT.nonOperational}</p>
              <p className="text-[10px] text-[#71829A]">Non-Operational</p>
              <span className="mt-1 inline-flex rounded-full bg-[#FFF0F0] px-2 py-1 text-[10px] font-semibold text-[#DC3545]">
                {NON_OPERATIONAL_PERCENT.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:mt-2">
            <span className="size-[9px] rounded-full bg-[#159447]" />
            <div>
              <p className="text-[16px] font-bold leading-5 text-[#19355B]">{EQUIPMENT.operational}</p>
              <p className="text-[10px] text-[#71829A]">Operational</p>
              <span className="mt-1 inline-flex rounded-full bg-[#E5F8EC] px-2 py-1 text-[10px] font-semibold text-[#168849]">
                {OPERATIONAL_PERCENT.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="order-1 w-full max-w-[280px] sm:order-2 sm:flex-1">
          <svg viewBox="0 0 280 160" className="h-auto w-full" role="img" aria-label={`${OPERATIONAL_PERCENT.toFixed(2)} percent operational, ${NON_OPERATIONAL_PERCENT.toFixed(2)} percent non-operational`}>
            <path d="M 34 136 A 106 106 0 0 1 246 136" fill="none" stroke="#E9EFF5" strokeWidth="22" strokeLinecap="round" />
            <path
              d="M 34 136 A 106 106 0 0 1 246 136"
              pathLength="100"
              fill="none"
              stroke="#F0444F"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={`${NON_OPERATIONAL_PERCENT} ${OPERATIONAL_PERCENT}`}
            ><title>{`Non-Operational: ${EQUIPMENT.nonOperational} of ${EQUIPMENT.total} (${NON_OPERATIONAL_PERCENT.toFixed(2)}%)`}</title></path>
            <path
              d="M 34 136 A 106 106 0 0 1 246 136"
              pathLength="100"
              fill="none"
              stroke="#159447"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={`${OPERATIONAL_PERCENT} ${NON_OPERATIONAL_PERCENT}`}
              strokeDashoffset={-NON_OPERATIONAL_PERCENT}
            ><title>{`Operational: ${EQUIPMENT.operational} of ${EQUIPMENT.total} (${OPERATIONAL_PERCENT.toFixed(2)}%)`}</title></path>
            <text x="140" y="105" textAnchor="middle" className="fill-[#18345B] text-[23px] font-bold">{OPERATIONAL_PERCENT.toFixed(2)}%</text>
            <text x="140" y="125" textAnchor="middle" className="fill-[#71829A] text-[12px]">Operational</text>
          </svg>
        </div>
      </div>
    </section>
  )
}

function EquipmentCategoryDetails() {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null)
  let offset = 0
  const slices = EQUIPMENT.categories.map((category) => {
    const fraction = category.working / CATEGORY_TOTAL
    const slice = { ...category, fraction, offset }
    offset += fraction * DONUT_CIRCUMFERENCE
    return slice
  })
  const hoveredCategory = EQUIPMENT.categories.find((category) => category.id === hoveredCategoryId)
  const hoveredPercent = hoveredCategory
    ? (hoveredCategory.working / hoveredCategory.total) * 100
    : 0

  return (
    <section className="min-w-0 overflow-hidden rounded-[12px] border border-[#DDEBFA] bg-white shadow-[0_2px_9px_rgba(13,85,151,0.05)]">
      <header className="flex items-center gap-2 border-b border-[#E8F0F8] px-[16px] py-[14px]">
        <span className="h-[20px] w-[3px] rounded-full bg-[#1677F2]" />
        <h3 className="text-[14px] font-bold text-[#16345B]">Equipment Status Details</h3>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-[14px] p-[14px] lg:grid-cols-[minmax(175px,0.8fr)_minmax(0,1.5fr)] lg:items-center">
        <div className="flex flex-col items-center">
          <div className="relative size-[190px] shrink-0">
            <svg viewBox="0 0 180 180" className="size-full -rotate-90" role="img" aria-label={`Equipment category distribution for ${CATEGORY_TOTAL} working equipment`}>
              <circle cx="90" cy="90" r="66" fill="none" stroke="#EEF3F8" strokeWidth="27" />
              {slices.map((slice) => (
                <circle
                  key={slice.id}
                  cx="90"
                  cy="90"
                  r="66"
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={hoveredCategoryId === slice.id ? 31 : 27}
                  strokeDasharray={`${Math.max(0, slice.fraction * DONUT_CIRCUMFERENCE - 1.5)} ${DONUT_CIRCUMFERENCE}`}
                  strokeDashoffset={-slice.offset}
                  className="cursor-pointer transition-[opacity,stroke-width] hover:opacity-90"
                  onMouseEnter={() => setHoveredCategoryId(slice.id)}
                  onMouseLeave={() => setHoveredCategoryId(null)}
                  onFocus={() => setHoveredCategoryId(slice.id)}
                  onBlur={() => setHoveredCategoryId(null)}
                  tabIndex={0}
                >
                  <title>{`${slice.label}: ${slice.working} working of ${slice.total}, ${((slice.working / slice.total) * 100).toFixed(1)}% available`}</title>
                </circle>
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {hoveredCategory ? (
                <>
                  <span className="text-[13px] font-semibold leading-4" style={{ color: hoveredCategory.color }}>{hoveredCategory.label}</span>
                  <span className="mt-0.5 text-[19px] font-bold leading-6 text-[#19355B]">{hoveredCategory.working} / {hoveredCategory.total}</span>
                  <span className="text-[10px] text-[#71829A]">working · {hoveredPercent.toFixed(1)}% available</span>
                </>
              ) : (
                <>
                  <span className="text-[22px] font-bold leading-6 text-[#19355B]">{EQUIPMENT.total}</span>
                  <span className="text-[11px] text-[#71829A]">Total equipment</span>
                </>
              )}
            </div>
          </div>
          <div className="mt-1 grid w-full grid-cols-2 gap-x-3 gap-y-2 text-[10px] text-[#526783]">
            {EQUIPMENT.categories.map((category) => (
              <span
                key={category.id}
                className="inline-flex cursor-default items-center gap-1.5"
                onMouseEnter={() => setHoveredCategoryId(category.id)}
                onMouseLeave={() => setHoveredCategoryId(null)}
                title={`${category.label}: ${category.working} working of ${category.total}`}
              >
                <span className="size-[7px] rounded-full" style={{ backgroundColor: category.color }} />
                {category.label}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[390px] border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#F4F8FD] text-left text-[#536987]">
                <th className="px-2 py-2 font-semibold">Category</th>
                <th className="px-2 py-2 text-center font-semibold">Working / Total</th>
                <th className="px-2 py-2 font-semibold">Availability</th>
                <th className="px-2 py-2 text-right font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {EQUIPMENT.categories.map(({ id, label, working, total, color, Icon }) => {
                const percent = (working / total) * 100
                return (
                  <tr
                    key={id}
                    className={`border-b border-[#EDF2F8] last:border-0 transition-colors ${hoveredCategoryId === id ? 'bg-[#F5F9FF]' : ''}`}
                    onMouseEnter={() => setHoveredCategoryId(id)}
                    onMouseLeave={() => setHoveredCategoryId(null)}
                    title={`${label}: ${working} working of ${total}, ${percent.toFixed(1)}% available`}
                  >
                    <td className="px-2 py-[10px]">
                      <span className="flex items-center gap-2 font-semibold text-[#254064]">
                        <span className="grid size-[24px] shrink-0 place-items-center rounded-[7px]" style={{ color, backgroundColor: `${color}14` }}>
                          <Icon size={14} />
                        </span>
                        {label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-[10px] text-center font-medium text-[#526783]">
                      <strong className="text-[#19355B]">{working} / {total}</strong> working
                    </td>
                    <td className="min-w-[90px] px-2 py-[10px]">
                      <div className="h-[6px] overflow-hidden rounded-full bg-[#E8EDF3]">
                        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                      </div>
                    </td>
                    <td className="px-2 py-[10px] text-right font-bold" style={{ color }}>{percent.toFixed(0)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default function EquipmentOverviewCard() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-[14px] lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.5fr)]">
      <div className="flex min-w-0 flex-col gap-[12px]">
        <section className="flex items-center gap-[14px] rounded-[12px] border border-[#DDEBFA] bg-gradient-to-r from-[#F4F9FF] to-white p-[15px] shadow-[0_2px_9px_rgba(13,85,151,0.05)]">
          <span className="grid size-[42px] shrink-0 place-items-center rounded-[11px] bg-[#EAF3FF] text-[#1677F2]">
            <Gauge size={22} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[13px] font-semibold text-[#526783]">Total Equipment</h3>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-[24px] font-bold leading-7 text-[#1677F2]">{EQUIPMENT.total}</span>
              <span className="text-[11px] text-[#71829A]">Total installed equipment</span>
            </div>
          </div>
        </section>
        <EquipmentAvailabilityGauge />
      </div>
      <EquipmentCategoryDetails />
    </div>
  )
}
