import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, TrendingUp } from 'lucide-react'
import Card from '../ui/Card'
import { criticalStps } from '../../data/mockData'

type CriticalTab = (typeof criticalStps.tabs)[number]

export default function CriticalStpCard() {
  const [tab, setTab] = useState<CriticalTab>(criticalStps.tabs[0])
  const rows = criticalStps[tab]
  const breachHeading = tab === 'Parameter Breach' ? 'Parameter Breach' : 'Equipment Failure'

  return (
    <Card className="flex flex-col overflow-hidden pb-[4px] pt-[18px]">
      <div className="px-[18px]">
        <h3 className="text-[16px] font-semibold leading-5 text-danger">Critical STP&rsquo;s</h3>
        <p className="mt-[4px] text-[12.5px] font-medium leading-4 text-ink-muted">
          STP&rsquo;s with Parameter Breach &amp; Equipment Failure
        </p>

        <div className="mt-[14px] flex items-center gap-[8px]">
          {criticalStps.tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-[4px] px-[16px] py-[8px] text-[12.5px] font-semibold leading-4 transition-colors ${
                tab === t ? 'bg-brand text-white' : 'bg-transparent text-ink hover:bg-[#F3F7FC]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[14px] w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[20%]" />
            <col className="w-[22%]" />
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="border-y border-line bg-canvas">
              <th className="px-[28px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                STP Name
              </th>
              <th className="px-[28px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                <span className="inline-flex items-center gap-[4px]">
                  Category
                  <ChevronDown size={14} />
                </span>
              </th>
              <th className="px-[28px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                {breachHeading}
              </th>
              <th className="px-[28px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                Parameter
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-line bg-white odd:bg-white even:bg-[#F8F8F8E5] last:border-0"
              >
                <td className="px-[28px] py-[12px]">
                  <Link
                    to={row.href}
                    className="block truncate text-[12.5px] font-semibold leading-4 text-brand-link hover:underline"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-[28px] py-[12px] text-[12.5px] leading-4 text-ink">{row.category}</td>
                <td className="px-[28px] py-[12px]">
                  <span className="inline-flex rounded-full bg-[#FDECEE] px-[11px] py-[5px] text-[11.5px] font-semibold text-danger">
                    {row.breachLabel}
                  </span>
                </td>
                <td className="px-[28px] py-[12px]">
                  <div className="flex flex-wrap gap-[10px]">
                    {row.parameters.map((param) => (
                      <div key={`${row.id}-${param.key}`} className="flex flex-col items-center gap-[5px]">
                        <span className="rounded-[8px] border border-line bg-[#F7FBFF] px-[14px] py-[5px] text-[12px] font-semibold text-ink-soft">
                          {param.label}
                        </span>
                        <span className="inline-flex items-center gap-[3px] rounded-full bg-[#FDECEE] px-[8px] py-[3px] text-[11px] font-semibold text-danger">
                          <TrendingUp size={11} strokeWidth={2.4} />
                          {param.delta}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-[28px] py-[36px] text-center text-[12.5px] text-ink-muted">
                  No critical STP&rsquo;s in this category
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
