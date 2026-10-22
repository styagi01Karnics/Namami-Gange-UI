import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import Card from '../ui/Card'
import { criticalStps } from '../../data/mockData'
import { stpCompliancePath } from '../../routes'
import { formatParameterName } from '../../lib/parameters'

const COLUMNS = [
  { key: 'number', label: '#' },
  { key: 'stp', label: 'STP' },
  { key: 'capacity', label: 'Capacity (MLD)' },
  { key: 'district', label: 'District' },
  { key: 'omDept', label: 'O&M Dept' },
  { key: 'param', label: 'Non-Complying Parameter (Outlet)' },
  { key: 'value', label: 'Exceeded Value' },
  { key: 'range', label: 'Limit' },
  { key: 'time', label: 'Time' },
] as const

function ParamBreachCell({ label, value }: { label: string; value?: string }) {
  return (
    <span
      className="inline-flex max-w-full items-center justify-center truncate rounded-[5px] bg-[#F4FAFF] px-[7px] py-1 text-[11px] font-semibold leading-4 text-[#0768D2]"
      title={value ? `${formatParameterName(label)}: ${value}` : formatParameterName(label)}
    >
      {formatParameterName(label)}
    </span>
  )
}

export default function NonPerformingStpsCard() {
  const rows = criticalStps['Parameter Breach']
  const today = new Date().toLocaleDateString('en-GB')

  return (
    <Card className="flex h-[400px] flex-col overflow-hidden rounded-[14px] pt-[12px] pb-[8px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)]">
      <div className="shrink-0 px-[12px]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold leading-5 text-[#DC2626]">Non Performing STPs</h3>
            <p className="mt-[2px] text-[11px] font-medium leading-4 text-[#64748B]">
              STP&rsquo;s with Parameter Breach
            </p>
          </div>
          <span className="inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-[8px] bg-[#F2F7FC] px-2.5 text-[11px] font-semibold text-[#0768D2]">
            <Calendar size={13} strokeWidth={2} />
            {today}
          </span>
        </div>

        <div className="mt-[8px] inline-flex h-[28px] items-center gap-1 rounded-[8px] bg-[#F2F7FC] p-[3px]">
          <span className="h-[24px] whitespace-nowrap rounded-[6px] bg-[#0768D2] px-[10px] text-[11px] font-semibold text-white shadow-sm inline-flex items-center">
            Parameter Breach ({rows.length})
          </span>
        </div>
      </div>

      <div className="mt-[10px] min-h-0 flex-1 overflow-auto scroll-thin px-[8px]">
        <table className="w-full min-w-[720px] table-fixed border-collapse">
          <thead className="sticky top-0 z-[1]">
            <tr className="h-[34px] border-y border-[#D8EDFF] bg-[#EFF7FF]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-[5px] py-[8px] text-left text-[11px] font-semibold leading-[14px] text-[#40536B] ${col.key === 'number' ? 'w-[24px]' : ''} ${col.key === 'capacity' ? 'w-[56px]' : ''} ${col.key === 'district' ? 'w-[72px]' : ''} ${col.key === 'omDept' ? 'w-[88px]' : ''} ${col.key === 'param' ? 'w-[130px]' : ''} ${col.key === 'value' ? 'w-[86px]' : ''} ${col.key === 'range' ? 'w-[54px]' : ''} ${col.key === 'time' ? 'w-[94px]' : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const params =
                'parameters' in row && Array.isArray(row.parameters) && row.parameters.length > 0
                  ? row.parameters
                  : [
                      {
                        label: row.param.label,
                        value: 'value' in row.param && row.param.value ? row.param.value : '—',
                        range: row.range,
                        time: row.time,
                      },
                    ]

              return (
                <tr key={row.id} className="border-b border-[#E2EBF5] bg-white transition-colors hover:bg-[#F8FAFC] last:border-0">
                  <td className="px-[5px] py-[8px] align-top pt-[10px] text-[11px] text-[#51647C]">{index + 1}</td>
                  <td className="px-[5px] py-[8px] align-top pt-[10px]">
                    <Link
                      to={stpCompliancePath(row.plantCode)}
                      className="block truncate text-[11px] font-semibold leading-[15px] text-[#0768D2] underline hover:opacity-80"
                      title={row.name}
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-[5px] py-[8px] align-top pt-[10px] text-[11px] font-medium text-[#07121E]">
                    {row.capacityMld}
                  </td>
                  <td className="px-[5px] py-[8px] align-top pt-[10px] text-[11px] font-medium text-[#07121E]">
                    {row.district}
                  </td>
                  <td className="truncate px-[5px] py-[8px] align-top pt-[10px] text-[11px] font-medium text-[#07121E]" title={row.omDept}>
                    {row.omDept}
                  </td>
                  <td className="px-[4px] py-[8px] align-top">
                    <div className="flex flex-col gap-[6px]">
                      {params.map((p, pIdx) => (
                        <div key={pIdx} className="flex min-h-[22px] items-center">
                          <ParamBreachCell label={p.label} value={p.value} />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-[5px] py-[8px] align-top">
                    <div className="flex flex-col gap-[6px]">
                      {params.map((p, pIdx) => (
                        <div key={pIdx} className="flex min-h-[22px] items-center text-[11px] font-bold text-[#DC2626]">
                          {p.value}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-[5px] py-[8px] align-top">
                    <div className="flex flex-col gap-[6px]">
                      {params.map((p, pIdx) => (
                        <div key={pIdx} className="flex min-h-[22px] items-center text-[11px] font-medium text-[#07121E]">
                          {p.range}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-[5px] py-[8px] align-top">
                    <div className="flex flex-col gap-[6px]">
                      {params.map((p, pIdx) => (
                        <div key={pIdx} className="flex min-h-[22px] items-center text-[10px] font-medium leading-[13px] text-[#07121E]">
                          {p.time || row.time}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}

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
