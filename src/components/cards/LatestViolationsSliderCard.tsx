import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
} from 'lucide-react'
import Card from '../ui/Card'
import { monthlyViolations, type StpMonthlyViolation } from '../../data/mockData'
import { FALLBACK_PLANT_OPTIONS, fetchLatestViolations } from '../../api/plants'
import { stpCompliancePath } from '../../routes'
import { formatParameterName } from '../../lib/parameters'

/**
 * Official 13 monitored STPs in Uttarakhand.
 */
const APPROVED_PLANT_KEYS = new Set(
  FALLBACK_PLANT_OPTIONS.map((p) =>
    p.plantCode
      .toLowerCase()
      .replace(/^map-/, '')
      .replace(/-upg$/, '')
      .replace(/[^a-z0-9]/g, ''),
  ),
)

/**
 * Parses date strings in formats like "DD/MM/YYYY" or "YYYY-MM-DD" into a numeric timestamp.
 */
function parseViolationDate(dateStr: string): number {
  if (!dateStr) return 0
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const day = Number(parts[0])
      const month = Number(parts[1]) - 1
      const year = Number(parts[2])
      return new Date(year, month, day).getTime()
    }
  }
  const timestamp = Date.parse(dateStr)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

/**
 * Normalizes STP name/code to identify duplicates reliably.
 */
function normalizeStpKey(item: StpMonthlyViolation): string {
  const code = (item.plantCode || '').trim().toLowerCase()
  if (code && code !== 'unknown') {
    return code
      .replace(/^map-/, '')
      .replace(/-upg$/, '')
      .replace(/[^a-z0-9]/g, '')
  }
  const name = (item.stpName || '').trim().toLowerCase()
  return name.replace(/[^a-z0-9]/g, '')
}

/**
 * De-duplicates violations so each of the 13 official STPs appears ONLY once with its latest violation.
 */
export function getLatestUniqueStpViolations(items: StpMonthlyViolation[]): StpMonthlyViolation[] {
  // Sort by date descending
  const sorted = [...items].sort((a, b) => {
    const timeA = parseViolationDate(a.date)
    const timeB = parseViolationDate(b.date)
    return timeB - timeA
  })

  const seen = new Set<string>()
  const uniqueList: StpMonthlyViolation[] = []

  for (const item of sorted) {
    const key = normalizeStpKey(item)
    // Only include the 13 official approved STPs
    if (APPROVED_PLANT_KEYS.size > 0 && !APPROVED_PLANT_KEYS.has(key)) {
      continue
    }
    if (!seen.has(key)) {
      seen.add(key)
      uniqueList.push(item)
    }
  }

  return uniqueList
}

export default function LatestViolationsSliderCard({
  violations,
  className = '',
}: {
  violations?: StpMonthlyViolation[]
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [dbViolations, setDbViolations] = useState<StpMonthlyViolation[] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    fetchLatestViolations()
      .then((data) => {
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setDbViolations(data as StpMonthlyViolation[])
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  // Get strictly unique latest violation per STP without duplicates (only showing STPs with actual non-complying parameters)
  const slides = useMemo(() => {
    const base =
      violations && violations.length > 0
        ? violations
        : dbViolations && dbViolations.length > 0
          ? dbViolations
          : monthlyViolations
    const unique = getLatestUniqueStpViolations(base)
    const withViolations = unique.filter((item) => item.parameters && item.parameters.length > 0)
    return withViolations.length > 0 ? withViolations : unique
  }, [violations, dbViolations])

  const total = slides.length

  // Auto-advance slider every 5 seconds unless paused
  useEffect(() => {
    if (total <= 1 || isPaused) return undefined

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, 5000)

    return () => clearInterval(timer)
  }, [total, isPaused])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total)
  }

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }
    setTouchStart(null)
  }

  if (total === 0) {
    return null
  }

  const currentItem = slides[currentIndex] || slides[0]
  const plantCode = currentItem.plantCode || currentItem.stpName || ''
  const detailsUrl = stpCompliancePath(plantCode)

  return (
    <Card
      className={`flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#FCA5A5]/60 bg-gradient-to-br from-white via-white to-[#FFF8F8] p-4 shadow-[0_5px_20px_rgba(220,38,38,0.08)] sm:p-5 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Card Header: Title + Status Badge + Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FEE2E2] pb-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#FEE2E2] text-[#DC2626]">
            <AlertTriangle size={16} strokeWidth={2.2} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14.5px] font-bold leading-5 tracking-[-0.01em] text-[#102653] sm:text-[15.5px]">
                Latest STP Violations
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FCA5A5]/60 bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-bold text-[#DC2626]">
                <span className="size-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                {total} STPs
              </span>
            </div>
            <p className="text-[11px] font-medium leading-4 text-[#7085A2]">
              Non-complying parameters by latest occurrence
            </p>
          </div>
        </div>

        {/* Controls: Counter, Prev, Next, View All */}
        <div className="flex items-center gap-1.5">
          <span className="rounded-md bg-[#F1F5F9] px-2 py-1 text-[11px] font-bold text-[#475569]">
            {currentIndex + 1} / {total}
          </span>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous STP violation"
            className="grid size-7 place-items-center rounded-full border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition-colors hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
          >
            <ChevronLeft size={15} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next STP violation"
            className="grid size-7 place-items-center rounded-full border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition-colors hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
          >
            <ChevronRight size={15} strokeWidth={2.2} />
          </button>

          <Link
            to="/stp-management/violation"
            title="Open all violations in STP Management"
            className="grid size-7 place-items-center rounded-full border border-[#DCE9F7] bg-[#EFF6FF] text-[#1268E8] shadow-sm transition-colors hover:bg-[#DBEAFE]"
            aria-label="View all violations in STP Management"
          >
            <ExternalLink size={13} strokeWidth={2.2} />
          </Link>
        </div>
      </div>

      {/* Slide Content: Smooth sliding view */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative my-3 flex-1 overflow-hidden"
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((item, idx) => {
            const plantLink = stpCompliancePath(item.plantCode || item.stpName || '')
            return (
              <div
                key={item.id || item.plantCode || idx}
                className="w-full shrink-0 flex flex-col justify-between"
              >
                {/* STP Name & Capacity row */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={plantLink}
                      className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-[#102653] hover:text-[#0768D2] sm:text-[15px]"
                    >
                      <span className="truncate">{item.stpName}</span>
                      <ArrowUpRight
                        size={15}
                        className="shrink-0 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0768D2]"
                      />
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#64748B]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-[#94A3B8]" />
                        {item.district}
                      </span>
                      <span className="h-2.5 w-px bg-[#CBD5E1]" />
                      <span className="inline-flex items-center gap-1">
                        <Building2 size={12} className="text-[#94A3B8]" />
                        {item.omDepartment}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-bold text-[#1D4ED8]">
                    {item.capacity} MLD
                  </span>
                </div>

                {/* Non-Complying Parameters Box */}
                {item.parameters && item.parameters.length > 0 ? (
                  <div className="mt-2.5 rounded-[12px] border border-[#FEE2E2] bg-gradient-to-r from-[#FFF5F5] to-[#FFF9F9] p-2.5 sm:p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#991B1B]">
                        Non-complying Parameters ({item.parameters.length})
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.parameters.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center gap-2 rounded-lg border border-[#FCA5A5]/60 bg-white px-2.5 py-1.5 shadow-xs"
                        >
                          <div className="text-[12px] font-bold text-[#1E293B]">
                            <span>{formatParameterName(p.name)}: </span>
                            <span className="text-[#DC2626] font-extrabold">{p.observedValue}</span>
                          </div>
                          <span className="text-[11px] font-medium text-[#64748B]">
                            (Range: {p.range})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2.5 rounded-[12px] border border-[#BBF7D0] bg-gradient-to-r from-[#F0FDF4] to-[#F7FEE7] p-2.5 sm:p-3">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#15803D]">
                      <span className="grid size-4 place-items-center rounded-full bg-[#DCFCE7] text-[#16A34A] text-[10px]">✓</span>
                      <span>All Parameters Within Permissible Limits (Compliant)</span>
                    </div>
                  </div>
                )}

                {/* Date & Non-Compliance Time Bar */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex flex-wrap items-center gap-3 text-[#475569]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0768D2]">
                      <Calendar size={12} />
                      {item.date}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-[#64748B]">
                      <Clock size={12} />
                      {item.nonComplianceTime}
                    </span>
                  </div>

                  <Link
                    to={plantLink}
                    className="inline-flex items-center gap-1 font-semibold text-[#0768D2] hover:underline"
                  >
                    View in STP Management &rarr;
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Navigation Dots */}
      <div className="flex items-center justify-center gap-1.5 border-t border-[#FEE2E2]/70 pt-2.5">
        {slides.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setCurrentIndex(dotIdx)}
            aria-label={`Go to slide ${dotIdx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              dotIdx === currentIndex
                ? 'w-5 bg-[#DC2626]'
                : 'w-1.5 bg-[#E2E8F0] hover:bg-[#CBD5E1]'
            }`}
          />
        ))}
      </div>
    </Card>
  )
}
