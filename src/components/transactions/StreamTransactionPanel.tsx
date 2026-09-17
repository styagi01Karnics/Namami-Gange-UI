import { Fragment, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ico } from '../ui/Ico'
import StatusPill, { statusTone } from '../ui/StatusPill'
import ParamTile from '../stp/ParamTile'
import { streamTransactionColumns } from '../../data/mockData'

const TONE = {
  brand: { box: 'bg-brand', title: 'text-brand', id: 'text-brand-link', Icon: ico('akar-icons:arrow-forward') },
  ok: { box: 'bg-ok', title: 'text-ok', id: 'text-ok', Icon: ico('akar-icons:arrow-back') },
}

/**
 * One stream's transaction feed. A row expands to the reading it carried, so
 * the flow headline and parameter tiles match the realtime panel above.
 */
export default function StreamTransactionPanel({ stream, data, defaultExpanded = 1 }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const tone = TONE[stream.tone]
  const { Icon } = tone

  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex items-center gap-[10px] p-[15px]">
        <span className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[9px] ${tone.box}`}>
          <Icon size={18} className="text-white" />
        </span>
        <div className="min-w-0">
          <p className={`text-[14.5px] font-bold leading-5 ${tone.title}`}>{stream.title}</p>
          <p className="mt-[2px] text-[12px] leading-4 text-ink-soft">
            Unique ID: <span className={`font-semibold ${tone.id}`}>{data.uniqueId}</span>
          </p>
        </div>
      </div>

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[380px] table-fixed border-collapse">
          <colgroup>
            {streamTransactionColumns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-y border-line bg-[#F7F9FC]">
              {streamTransactionColumns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[14px] py-[13px] text-[12.5px] font-medium leading-4 text-ink-soft ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.rows.map((row, i) => {
              const isExpanded = expanded === i

              return (
                <Fragment key={`${row.id}-${row.timestamp}`}>
                  <tr className="border-b border-line">
                    <td className="px-[14px] py-[15px] text-[12.5px] leading-[18px] text-ink">{row.id}</td>
                    <td className="px-[14px] py-[15px]">
                      <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
                    </td>
                    <td className="px-[14px] py-[15px] text-[12.5px] leading-[18px] text-ink">{row.timestamp}</td>
                    <td className="px-[14px] py-[15px] text-right">
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : i)}
                        aria-label={`${isExpanded ? 'Hide' : 'Show'} reading for ${row.timestamp}`}
                        aria-expanded={isExpanded}
                        className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[8px] border border-line bg-[#F5F7FA] text-[#5B6B7F] transition-colors hover:border-brand hover:text-brand"
                      >
                        <ChevronDown
                          size={16}
                          strokeWidth={2.1}
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="border-b border-line last:border-0">
                      <td colSpan={streamTransactionColumns.length} className="px-[14px] pb-[15px] pt-[13px]">
                        <div className="rounded-[10px] border border-line bg-[#F7FAFF] p-[13px]">
                          <p className="text-[13px] leading-[18px] text-ink-soft">Flow</p>
                          <p className="mt-[3px] text-[19px] font-bold leading-6 text-ink">
                            {row.reading.flow.value}
                            <span className="ml-[4px] text-[14px] font-semibold">{row.reading.flow.unit}</span>
                          </p>

                          <div className="mt-[12px] grid grid-cols-3 gap-[10px]">
                            {row.reading.params.map((p) => (
                              <ParamTile key={p.key} param={p} />
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
