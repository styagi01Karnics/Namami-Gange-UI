import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { active12StpDetails, dashboardKpis, official13StpDetails } from '../../data/mockData'
import { fetchStpActiveStatus, type StpActiveStatusData } from '../../api/plants'
import NonActiveStpModal from './NonActiveStpModal'

const TONE = {
  brand: {
    border: 'border-[rgba(7,104,210,0.2)]',
    value: 'text-[#0768D2]',
    badge: 'bg-[#E5F3FF] text-[#0768D2]',
    gradient:
      'linear-gradient(111.73deg, rgba(7,104,210,0.05) 0.16%, rgba(7,104,210,0) 100%), linear-gradient(90deg, #fff, #fff)',
  },
  ok: {
    border: 'border-[rgba(22,142,63,0.2)]',
    value: 'text-[#168E3F]',
    badge: 'bg-[#EAF3EC] text-[#168E3F]',
    gradient:
      'linear-gradient(111.73deg, rgba(22,142,63,0.05) 0.16%, rgba(22,142,63,0) 100%), linear-gradient(90deg, #fff, #fff)',
  },
  danger: {
    border: 'border-[rgba(197,15,31,0.2)]',
    value: 'text-[#DC2626]',
    badge: 'bg-[#F5E7E7] text-[#DC2626]',
    gradient:
      'linear-gradient(111.73deg, rgba(220,38,38,0.05) 0.16%, rgba(220,38,38,0) 100%), linear-gradient(90deg, #fff, #fff)',
  },
  violet: {
    border: 'border-[rgba(124,58,237,0.2)]',
    value: 'text-[#7C3AED]',
    badge: 'bg-[#E9DAFF] text-[#7C3AED]',
    gradient:
      'linear-gradient(111.73deg, rgba(124,58,237,0.05) 0.16%, rgba(124,58,237,0) 100%), linear-gradient(90deg, #fff, #fff)',
  },
}

export default function DashboardKpiRow() {
  const [nonActiveOpen, setNonActiveOpen] = useState(false)
  const [totalDropdownOpen, setTotalDropdownOpen] = useState(false)
  const [activeDropdownOpen, setActiveDropdownOpen] = useState(false)
  const [statusData, setStatusData] = useState<StpActiveStatusData | null>(null)

  const totalDropdownRef = useRef<HTMLDivElement>(null)
  const totalTriggerRef = useRef<HTMLButtonElement>(null)
  const activeDropdownRef = useRef<HTMLDivElement>(null)
  const activeTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let cancelled = false
    const loadStatus = () => {
      fetchStpActiveStatus(4).then((data) => {
        if (!cancelled && data) {
          setStatusData(data)
        }
      })
    }
    loadStatus()
    const interval = setInterval(loadStatus, 5000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!totalDropdownOpen && !activeDropdownOpen) return undefined
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (
        totalDropdownRef.current &&
        !totalDropdownRef.current.contains(target) &&
        totalTriggerRef.current &&
        !totalTriggerRef.current.contains(target)
      ) {
        setTotalDropdownOpen(false)
      }
      if (
        activeDropdownRef.current &&
        !activeDropdownRef.current.contains(target) &&
        activeTriggerRef.current &&
        !activeTriggerRef.current.contains(target)
      ) {
        setActiveDropdownOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setTotalDropdownOpen(false)
        setActiveDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [totalDropdownOpen, activeDropdownOpen])

  const activeList =
    statusData?.activeStps && statusData.activeStps.length > 0
      ? statusData.activeStps.map((s) => ({
          plantCode: s.plantCode,
          stpId: s.plantCode,
          name: s.plantName,
        }))
      : active12StpDetails

  return (
    <>
      <div className="grid grid-cols-4 gap-[10px]">
        {dashboardKpis.map((kpi) => {
          const tone = TONE[kpi.tone]
          const isClickable =
            'href' in kpi || 'openNonActive' in kpi || 'openTotalStp' in kpi || 'openActiveStp' in kpi
          const valueClass = `text-[20px] font-bold leading-[26px] ${tone.value} ${
            isClickable ? 'underline underline-offset-[3px] cursor-pointer' : ''
          }`

          const displayValue =
            kpi.key === 'total' && statusData?.totalCount != null
              ? String(statusData.totalCount)
              : kpi.key === 'active' && statusData?.activeCount != null
                ? String(statusData.activeCount)
                : kpi.key === 'nonActive' && statusData?.nonActiveCount != null
                  ? String(statusData.nonActiveCount)
                  : kpi.value

          return (
            <div
              key={kpi.key}
              className={`relative flex flex-col justify-between gap-[6px] rounded-[10px] border border-solid px-[14px] py-[10px] ${tone.border}`}
              style={{ backgroundImage: tone.gradient }}
            >
              <div className="flex flex-col gap-[4px]">
                <p className="text-[13px] font-semibold leading-normal text-[#07121E]">{kpi.label}</p>
                {'openTotalStp' in kpi && kpi.openTotalStp ? (
                  <button
                    ref={totalTriggerRef}
                    type="button"
                    onClick={() => {
                      setTotalDropdownOpen((prev) => !prev)
                      setActiveDropdownOpen(false)
                    }}
                    className="inline-flex items-center gap-1.5 w-fit text-left text-[20px] font-bold leading-[26px] text-[#0768D2] underline underline-offset-[3px] cursor-pointer"
                    title="Click to view all 13 STPs"
                    aria-expanded={totalDropdownOpen}
                  >
                    <span>{displayValue}</span>
                    <ChevronDown
                      size={15}
                      className={`text-[#0768D2] transition-transform duration-200 ${
                        totalDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : 'openActiveStp' in kpi && kpi.openActiveStp ? (
                  <button
                    ref={activeTriggerRef}
                    type="button"
                    onClick={() => {
                      setActiveDropdownOpen((prev) => !prev)
                      setTotalDropdownOpen(false)
                    }}
                    className="inline-flex items-center gap-1.5 w-fit text-left text-[20px] font-bold leading-[26px] text-[#168E3F] underline underline-offset-[3px] cursor-pointer"
                    title={`Click to view ${displayValue} Active STPs`}
                    aria-expanded={activeDropdownOpen}
                  >
                    <span>{displayValue}</span>
                    <ChevronDown
                      size={15}
                      className={`text-[#168E3F] transition-transform duration-200 ${
                        activeDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : 'openNonActive' in kpi && kpi.openNonActive ? (
                  <button
                    type="button"
                    onClick={() => setNonActiveOpen(true)}
                    className={`w-fit text-left ${valueClass}`}
                    title="View Non-Active STPs"
                  >
                    {displayValue}
                  </button>
                ) : 'href' in kpi && kpi.href ? (
                  <Link to={kpi.href} className={`w-fit ${valueClass}`}>
                    {displayValue}
                  </Link>
                ) : (
                  <p className={valueClass}>{displayValue}</p>
                )}
              </div>
              {'badge' in kpi && kpi.badge ? (
                <span
                  className={`inline-flex h-[20px] w-fit items-center gap-[2px] rounded-full px-[4px] text-[12px] font-semibold leading-[14px] opacity-80 ${tone.badge}`}
                >
                  {'trend' in kpi && kpi.trend === 'up' && <TrendingUp size={12} strokeWidth={2.4} />}
                  {kpi.badge}
                </span>
              ) : null}

              {/* 13 STPs Dropdown (showing only STP names) */}
              {'openTotalStp' in kpi && kpi.openTotalStp && totalDropdownOpen && (
                <div
                  ref={totalDropdownRef}
                  className="absolute left-0 top-[calc(100%+6px)] z-50 w-[320px] max-w-[90vw] overflow-hidden rounded-[10px] border border-[#CDE0F5] bg-white shadow-[0_12px_28px_rgba(7,104,210,0.18)]"
                >
                  <div className="max-h-[320px] overflow-y-auto py-1 divide-y divide-[#F1F5F9]">
                    {official13StpDetails.map((stp) => (
                      <Link
                        key={stp.stpId}
                        to={`/stp-management?plant=${encodeURIComponent(stp.plantCode || stp.stpId)}&name=${encodeURIComponent(stp.name)}`}
                        onClick={() => setTotalDropdownOpen(false)}
                        className="block truncate px-3.5 py-2.5 text-[12.5px] font-medium text-[#1E293B] transition-colors hover:bg-[#F0F7FF] hover:text-[#0768D2]"
                        title={stp.name}
                      >
                        {stp.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Active STPs Dropdown (showing only STP names) */}
              {'openActiveStp' in kpi && kpi.openActiveStp && activeDropdownOpen && (
                <div
                  ref={activeDropdownRef}
                  className="absolute left-0 top-[calc(100%+6px)] z-50 w-[320px] max-w-[90vw] overflow-hidden rounded-[10px] border border-[#CDE0F5] bg-white shadow-[0_12px_28px_rgba(22,142,63,0.18)]"
                >
                  <div className="max-h-[320px] overflow-y-auto py-1 divide-y divide-[#F1F5F9]">
                    {activeList.map((stp) => (
                      <Link
                        key={stp.plantCode || stp.stpId}
                        to={`/stp-management?plant=${encodeURIComponent(stp.plantCode || stp.stpId)}&name=${encodeURIComponent(stp.name)}`}
                        onClick={() => setActiveDropdownOpen(false)}
                        className="block truncate px-3.5 py-2.5 text-[12.5px] font-medium text-[#1E293B] transition-colors hover:bg-[#F0FDF4] hover:text-[#168E3F]"
                        title={stp.name}
                      >
                        {stp.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <NonActiveStpModal
        open={nonActiveOpen}
        onClose={() => setNonActiveOpen(false)}
        items={statusData?.nonActiveStps}
      />
    </>
  )
}

