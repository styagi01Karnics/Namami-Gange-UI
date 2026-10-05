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
    <Card className="flex flex-col overflow-hidden rounded-[10px] pb-[4px] pt-[18px]">
      <div className="px-[14px]">
        <h3 className="text-[18px] font-semibold leading-5 text-[#DC2626]">Critical STP&rsquo;s</h3>
        <p className="mt-[12px] text-[16px] font-medium leading-5 text-[#646464]">
          STP&rsquo;s with Parameter Breach &amp; Equipment Failure
        </p>

        <div className="mt-[24px] inline-flex h-[32px] items-center rounded-[8px] bg-white p-[2px]">
          {criticalStps.tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-[28px] rounded-[6px] px-[14px] transition-colors ${
                tab === t
                  ? 'bg-[#0768D2] text-[14px] font-semibold leading-5 text-white'
                  : 'bg-transparent text-[15px] font-medium leading-5 tracking-[-0.24px] text-[#10172A] hover:bg-[#F3F7FC]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-thin table-scroll mt-[24px] w-full">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[20%]" />
            <col className="w-[22%]" />
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF]">
              <th className="px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                STP Name
              </th>
              <th className="px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                <span className="inline-flex items-center gap-[4px]">
                  Category
                  <ChevronDown size={16} />
                </span>
              </th>
              <th className="px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                {breachHeading}
              </th>
              <th className="px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                Parameter
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#D8EDFF] bg-white odd:bg-white even:bg-[rgba(248,248,248,0.9)] last:border-0"
              >
                <td className="px-[16px] py-[20px]">
                  <Link
                    to={row.href}
                    className="block truncate text-[14px] font-medium leading-[22px] text-[#0768D2] hover:underline"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-[16px] py-[20px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                  {row.category}
                </td>
                <td className="px-[16px] py-[20px]">
                  <span className="inline-flex h-[32px] items-center rounded-full bg-[#F5E7E7] px-[8px] text-[14px] font-semibold leading-4 text-[#DC2626]">
                    {row.breachLabel}
                  </span>
                </td>
                <td className="px-[16px] py-[20px]">
                  <div className="flex flex-wrap gap-[8px]">
                    {row.parameters.map((param) => (
                      <div key={`${row.id}-${param.key}`} className="flex flex-col items-center gap-[6px]">
                        <span className="inline-flex h-[32px] min-w-[54px] items-center justify-center rounded-[4px] bg-[#F4FAFF] px-[6px] text-[12px] font-semibold leading-4 text-[#07121E]">
                          {param.label}
                        </span>
                        <span className="inline-flex h-[20px] items-center gap-[0px] rounded-full bg-[#F5E7E7] px-[4px] text-[10px] font-medium leading-[14px] text-[#DC2626]">
                          <TrendingUp size={12} strokeWidth={2.4} />
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
                <td colSpan={4} className="px-[16px] py-[36px] text-center text-[14px] text-[#646464]">
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
