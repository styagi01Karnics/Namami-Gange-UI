import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import Card from '../ui/Card'
import { criticalStps } from '../../data/mockData'
import { stpCompliancePath } from '../../routes'

type CriticalTab = (typeof criticalStps.tabs)[number]

const COLUMNS = [
  { key: 'stp', label: 'STP' },
  { key: 'capacity', label: 'Capacity (MLD)' },
  { key: 'district', label: 'District' },
  { key: 'omDept', label: 'O&M Dept' },
  { key: 'param', label: 'Non-Complying Param' },
  { key: 'range', label: 'Range' },
  { key: 'time', label: 'Time' },
] as const

export default function CriticalStpCard() {
  const [tab, setTab] = useState<CriticalTab>(criticalStps.tabs[0])
  const rows = criticalStps[tab]

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

      <div className="scroll-thin table-scroll mt-[24px] w-full overflow-auto">
        <table className="w-full min-w-[760px] table-fixed border-collapse">
          <thead>
            <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-[12px] py-[16px] text-left text-[13px] font-semibold leading-[22px] text-[#363636]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#D8EDFF] bg-white odd:bg-white even:bg-[rgba(248,248,248,0.9)] last:border-0"
              >
                <td className="px-[12px] py-[16px]">
                  <Link
                    to={stpCompliancePath(row.plantCode)}
                    className="block truncate text-[13px] font-medium leading-[20px] text-[#0768D2] hover:underline"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-[12px] py-[16px] text-[13px] font-medium text-[#07121E]">{row.capacityMld}</td>
                <td className="px-[12px] py-[16px] text-[13px] font-medium text-[#07121E]">{row.district}</td>
                <td className="px-[12px] py-[16px] text-[13px] font-medium text-[#07121E]">{row.omDept}</td>
                <td className="px-[12px] py-[16px]">
                  <div className="flex flex-col items-start gap-[6px]">
                    <span className="inline-flex h-[28px] min-w-[72px] items-center justify-center rounded-[4px] bg-[#F4FAFF] px-[8px] text-[12px] font-semibold leading-4 text-[#0768D2]">
                      {row.param.label}
                    </span>
                    <span className="inline-flex h-[20px] items-center gap-[2px] rounded-full bg-[#F5E7E7] px-[6px] text-[10px] font-medium leading-[14px] text-[#DC2626]">
                      <TrendingUp size={12} strokeWidth={2.4} />
                      {row.param.delta}
                    </span>
                  </div>
                </td>
                <td className="px-[12px] py-[16px] text-[13px] font-medium text-[#07121E]">{row.range}</td>
                <td className="px-[12px] py-[16px] text-[13px] font-medium text-[#07121E]">{row.time}</td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-[16px] py-[36px] text-center text-[14px] text-[#646464]">
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
