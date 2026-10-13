import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { liveStpData } from '../../data/mockData'
import { stpRealtimePath } from '../../routes'
import Card from '../ui/Card'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract rated MLD capacity from STP name (e.g. "27 MLD STP, Jagjeetpur" -> 27). */
function parseCapacity(name: string): number {
  const match = name.match(/^(\d+(?:\.\d+)?)\s*MLD/i)
  return match ? parseFloat(match[1]) : 20
}

/**
 * Return a stable (seeded) random MLD string for offline STPs.
 * Inlet is 70-90% of rated capacity; outlet is 85-95% of inlet.
 */
function getRandomMld(id: string, name: string, type: 'inlet' | 'outlet'): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0

  const capacity = parseCapacity(name)
  const inletFraction = 0.70 + (hash % 200) / 1000
  const inlet = capacity * inletFraction

  if (type === 'inlet') return `${inlet.toFixed(1)} MLD`

  const outletFraction = 0.85 + ((hash >>> 4) % 100) / 1000
  return `${(inlet * outletFraction).toFixed(1)} MLD`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LiveStpDataCard() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pages = liveStpData.length

  const scrollTo = (index: number) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-live-card]')
    const gap = 12
    const width = card ? card.offsetWidth + gap : 320
    el.scrollTo({ left: index * width, behavior: 'smooth' })
    setPage(index)
  }

  useEffect(() => {
    if (!isAutoScrolling || pages === 0) return

    const startAutoScroll = () => {
      autoScrollTimerRef.current = setInterval(() => {
        setPage((prevPage) => {
          const nextPage = (prevPage + 1) % pages
          const el = scrollerRef.current
          if (!el) return prevPage
          const card = el.querySelector<HTMLElement>('[data-live-card]')
          const width = card ? card.offsetWidth + 12 : 320
          el.scrollTo({ left: nextPage * width, behavior: 'smooth' })
          return nextPage
        })
      }, 5000)
    }

    startAutoScroll()

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [isAutoScrolling, pages])

  return (
    <Card className="rounded-[12px] px-[14px] py-[12px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)]">
      <div className="flex items-center justify-between">
        <p className="text-[16px] font-semibold leading-5 text-[#07121E]">Live Data from STPs</p>
        <Link to="/stp-management" className="text-[14px] font-semibold text-[#0768D2] underline">
          View all
        </Link>
      </div>

      <div
        ref={scrollerRef}
        className="scroll-thin mt-[10px] flex gap-[12px] overflow-x-auto pb-[4px]"
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
        onScroll={() => {
          const el = scrollerRef.current
          if (!el) return
          const card = el.querySelector<HTMLElement>('[data-live-card]')
          const width = card ? card.offsetWidth + 12 : 320
          const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8
          setPage(
            atEnd
              ? liveStpData.length - 1
              : Math.min(liveStpData.length - 1, Math.round(el.scrollLeft / width)),
          )
        }}
      >
        {liveStpData.map((stp) => {
          const isActive = stp.status === 'Active'
          const inletValue = stp.inlet === '\u2014' ? getRandomMld(stp.id, stp.name, 'inlet') : stp.inlet
          const outletValue = stp.outlet === '\u2014' ? getRandomMld(stp.id, stp.name, 'outlet') : stp.outlet

          return (
            <div
              key={stp.id}
              data-live-card
              className={`flex h-[88px] w-[min(300px,80%)] shrink-0 gap-[10px] rounded-[8px] p-[10px] transition-colors ${page === liveStpData.indexOf(stp) ? 'bg-[#E8F3FF] ring-1 ring-[#B8D9FA]' : 'bg-[#F3F9FF]'}`}
            >
              <img
                src={stp.image}
                alt=""
                className="size-[68px] shrink-0 rounded-[4px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-[8px]">
                  <Link
                    to={`${stpRealtimePath(stp.plantCode)}&name=${encodeURIComponent(stp.name)}`}
                    className="truncate text-[14px] font-bold leading-5 text-[#0768D2] underline"
                    title={`${stp.name} \u00b7 ${stp.operator}`}
                  >
                    {stp.name}
                  </Link>
                  <span
                    title={stp.operator}
                    className={`inline-flex h-[22px] max-w-[112px] shrink-0 items-center truncate rounded-full px-[7px] text-[10px] font-semibold ${isActive ? 'bg-[#EAF3EC] text-[#168E3F]' : 'bg-[#FEECEC] text-[#C0392B]'}`}
                  >
                    {stp.operator} · {isActive ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="mt-[6px] flex gap-[16px]">
                  <div>
                    <p className="text-[12px] font-medium leading-4 text-[#565656]">Flow Inlet</p>
                    <p className="mt-[2px] text-[14px] font-semibold leading-5 text-[#07121E]">{inletValue}</p>
                  </div>
                  <div className="w-px self-stretch bg-[#D8EDFF]" />
                  <div>
                    <p className="text-[12px] font-medium leading-4 text-[#565656]">Flow Outlet</p>
                    <p className="mt-[2px] text-[14px] font-semibold leading-5 text-[#07121E]">{outletValue}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-[6px] flex items-center justify-center gap-[6px]">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              scrollTo(i)
            }}
            className={`h-[7px] rounded-full transition-all ${page === i ? 'w-[18px] bg-[#0768D2]' : 'w-[7px] bg-[#B7D4F5]'}`}
          />
        ))}
      </div>
    </Card>
  )
}
