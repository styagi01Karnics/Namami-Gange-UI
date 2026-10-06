import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { dashboardKpis } from '../../data/mockData'
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

  return (
    <>
      <div className="grid grid-cols-4 gap-[10px]">
        {dashboardKpis.map((kpi) => {
          const tone = TONE[kpi.tone]
          const valueClass = `text-[20px] font-bold leading-[26px] ${tone.value} ${
            'href' in kpi || 'openNonActive' in kpi ? 'underline underline-offset-[3px]' : ''
          }`

          return (
            <div
              key={kpi.key}
              className={`flex flex-col gap-[6px] rounded-[10px] border border-solid px-[14px] py-[10px] ${tone.border}`}
              style={{ backgroundImage: tone.gradient }}
            >
              <div className="flex flex-col gap-[4px]">
                <p className="text-[13px] font-semibold leading-normal text-[#07121E]">{kpi.label}</p>
                {'openNonActive' in kpi && kpi.openNonActive ? (
                  <button type="button" onClick={() => setNonActiveOpen(true)} className={`w-fit ${valueClass}`}>
                    {kpi.value}
                  </button>
                ) : 'href' in kpi && kpi.href ? (
                  <Link to={kpi.href} className={`w-fit ${valueClass}`}>
                    {kpi.value}
                  </Link>
                ) : (
                  <p className={valueClass}>{kpi.value}</p>
                )}
              </div>
              <span
                className={`inline-flex h-[20px] w-fit items-center gap-[2px] rounded-full px-[4px] text-[12px] font-semibold leading-[14px] opacity-80 ${tone.badge}`}
              >
                {'trend' in kpi && kpi.trend === 'up' && <TrendingUp size={12} strokeWidth={2.4} />}
                {kpi.badge}
              </span>
            </div>
          )
        })}
      </div>

      <NonActiveStpModal open={nonActiveOpen} onClose={() => setNonActiveOpen(false)} />
    </>
  )
}
