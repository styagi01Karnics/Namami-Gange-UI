import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import { criticalStps } from '../../data/mockData'
import { stpCompliancePath } from '../../routes'

type CriticalTab = (typeof criticalStps.tabs)[number]

const COLUMNS = [
  { key: 'number', label: '#' },
  { key: 'stp', label: 'STP' },
  { key: 'capacity', label: 'Capacity (MLD)' },
  { key: 'district', label: 'District' },
  { key: 'omDept', label: 'O&M Dept' },
  { key: 'param', label: 'Non-Complying Parameter' },
  { key: 'range', label: 'Limit' },
  { key: 'time', label: 'Time' },
] as const

function ParamBreachCell({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-full items-center justify-center truncate rounded-[5px] bg-[#F4FAFF] px-[7px] py-1 text-[11px] font-semibold leading-4 text-[#0768D2]">
      {label.replaceAll('_', ' ').toUpperCase()}
    </span>
  )
}

export default function NonPerformingStpsCard() {
  const [tab, setTab] = useState<CriticalTab>(criticalStps.tabs[0])
  const rows = criticalStps[tab].slice(0, tab === 'Parameter Breach' ? 5 : 3)
  const counts = { 'Parameter Breach': 5, 'Equipment Failure': 3 }

  return (
    <Card className="flex h-[400px] flex-col overflow-hidden rounded-[14px] pt-[12px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)]">
      <div className="shrink-0 px-[12px]">
        <h3 className="text-[15px] font-bold leading-5 text-[#DC2626]">Non Performing STPs</h3>
        <p className="mt-[2px] text-[11px] font-medium leading-4 text-[#64748B]">
          STP&rsquo;s with Parameter Breach &amp; 
        </p>

        <div className="mt-[8px] inline-flex h-[28px] items-center gap-1 rounded-[8px] bg-[#F2F7FC] p-[3px]">
          {criticalStps.tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-[24px] whitespace-nowrap rounded-[6px] px-[10px] text-[11px] transition-colors ${
                tab === t
                  ? 'bg-[#0768D2] font-semibold text-white shadow-sm'
                  : 'bg-transparent font-medium text-[#344256] hover:bg-white'
              }`}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[10px] min-h-0 flex-1 overflow-hidden px-[8px]">
        <table className="w-full table-fixed border-collapse">
          <thead className="sticky top-0 z-[1]">
            <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-[5px] py-[8px] text-left text-[11px] font-semibold leading-[14px] text-[#40536B] ${col.key === 'number' ? 'w-[28px]' : ''} ${col.key === 'capacity' ? 'w-[64px]' : ''} ${col.key === 'district' ? 'w-[78px]' : ''} ${col.key === 'omDept' ? 'w-[96px]' : ''} ${col.key === 'param' ? 'w-[126px]' : ''} ${col.key === 'range' ? 'w-[60px]' : ''} ${col.key === 'time' ? 'w-[104px]' : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="h-[42px] border-b border-[#E2EBF5] bg-white last:border-0">
                <td className="px-[5px] py-[6px] align-middle text-[11px] text-[#51647C]">{index + 1}</td>
                <td className="px-[5px] py-[6px] align-middle">
                  <Link
                    to={stpCompliancePath(row.plantCode)}
                    className="block truncate text-[11px] font-semibold leading-[15px] text-[#0768D2] underline hover:opacity-80"
                    title={row.name}
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-[5px] py-[6px] align-middle text-[11px] font-medium text-[#07121E]">
                  {row.capacityMld}
                </td>
                <td className="px-[5px] py-[6px] align-middle text-[11px] font-medium text-[#07121E]">
                  {row.district}
                </td>
                <td className="truncate px-[5px] py-[6px] align-middle text-[11px] font-medium text-[#07121E]" title={row.omDept}>
                  {row.omDept}
                </td>
                <td className="px-[4px] py-[5px] align-middle">
                  <ParamBreachCell label={row.param.label} />
                </td>
                <td className="px-[5px] py-[6px] align-middle text-[11px] font-medium text-[#07121E]">
                  {row.range}
                </td>
                <td className="px-[5px] py-[6px] align-middle text-[10px] font-medium leading-[13px] text-[#07121E]">
                  {row.time}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-[8px] py-[36px] text-center text-[12px] text-[#646464]">
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
