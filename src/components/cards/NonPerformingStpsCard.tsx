import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import Card from '../ui/Card'
import { criticalStps } from '../../data/mockData'
import { stpCompliancePath } from '../../routes'

type CriticalTab = (typeof criticalStps.tabs)[number]

export default function NonPerformingStpsCard() {
  const [tab, setTab] = useState<CriticalTab>(criticalStps.tabs[0])
  const rows = criticalStps[tab]
  const breachHeading = tab === 'Parameter Breach' ? 'Parameter Breach' : 'Equipment Failure'

  return (
    <Card className="flex h-[400px] flex-col overflow-hidden rounded-[16px] pt-[14px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)]">
      <div className="shrink-0 px-[16px]">
        <h3 className="text-[16px] font-semibold leading-5 text-[#DC2626]">Non Performing STP&rsquo;s</h3>
        <p className="mt-[4px] text-[13px] font-medium leading-5 text-[#646464]">
          STP&rsquo;s with Parameter Breach &amp; Equipment Failure
        </p>

        <div className="mt-[10px] inline-flex h-[28px] items-center rounded-[8px] bg-white p-[2px]">
          {criticalStps.tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-[24px] rounded-[6px] px-[12px] transition-colors ${
                tab === t
                  ? 'bg-[#0768D2] text-[13px] font-semibold leading-5 text-white'
                  : 'bg-transparent text-[13px] font-medium leading-5 tracking-[-0.24px] text-[#10172A] hover:bg-[#F3F7FC]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-thin mt-[16px] min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[480px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[40%]" />
            <col className="w-[28%]" />
          </colgroup>
          <thead className="sticky top-0 z-[1]">
            <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF]">
              <th className="px-[16px] py-[14px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                STP
              </th>
              <th className="px-[16px] py-[14px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                {breachHeading}
              </th>
              <th className="px-[16px] py-[14px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                Non-compliance time
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#D8EDFF] bg-white last:border-0">
                <td className="px-[16px] py-[18px] align-middle">
                  <Link
                    to={stpCompliancePath(row.plantCode)}
                    className="block text-[14px] font-medium leading-[22px] text-[#0768D2] underline hover:opacity-80"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-[16px] py-[18px] align-middle">
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
                <td className="px-[16px] py-[18px] align-middle text-[14px] font-medium leading-[22px] text-[#07121E]">
                  {row.nonComplianceTime}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-[16px] py-[36px] text-center text-[14px] text-[#646464]">
                  No non-performing STP&rsquo;s in this category
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
