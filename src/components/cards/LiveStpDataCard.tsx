import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { liveStpData } from '../../data/mockData'
import { stpRealtimePath } from '../../routes'
import Card from '../ui/Card'

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

  // Auto-scroll logic
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
      }, 5000) // Change STP every five seconds
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
          setPage(atEnd ? liveStpData.length - 1 : Math.min(liveStpData.length - 1, Math.round(el.scrollLeft / width)))
        }}
      >
        {liveStpData.map((stp) => (
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
                  title={`${stp.name} · ${stp.operator}`}
                >
                  {stp.name}
                </Link>
                <span
                  title={stp.operator}
                  className={`inline-flex h-[22px] max-w-[112px] shrink-0 items-center truncate rounded-full px-[7px] text-[10px] font-semibold ${stp.status === 'Active' ? 'bg-[#EAF3EC] text-[#168E3F]' : 'bg-[#F1F4F7] text-[#667085]'}`}
                >
                  {stp.operator} · {stp.status}
                </span>
              </div>
              <div className="mt-[6px] flex gap-[16px]">
                <div>
                  <p className="text-[12px] font-medium leading-4 text-[#565656]">Flow Inlet</p>
                  <p className="mt-[2px] text-[14px] font-semibold leading-5 text-[#07121E]">{stp.inlet}</p>
                </div>
                <div className="w-px self-stretch bg-[#D8EDFF]" />
                <div>
                  <p className="text-[12px] font-medium leading-4 text-[#565656]">Flow Outlet</p>
                  <p className="mt-[2px] text-[14px] font-semibold leading-5 text-[#07121E]">{stp.outlet}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
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
            className={`h-[7px] rounded-full transition-all ${
              page === i ? 'w-[18px] bg-[#0768D2]' : 'w-[7px] bg-[#B7D4F5]'
            }`}
          />
        ))}
      </div>
    </Card>
  )
}
