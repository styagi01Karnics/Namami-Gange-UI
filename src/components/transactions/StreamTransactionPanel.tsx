import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import StatusPill, { statusTone } from '../ui/StatusPill'
import ParamTile from '../stp/ParamTile'
import { streamTransactionColumns } from '../../data/mockData'

const TONE = {
  brand: {
    title: 'text-[#0768D2]',
    id: 'text-[#0768D2]',
    panel: 'bg-[#F4F8FE]',
  },
  ok: {
    title: 'text-[#168E3F]',
    id: 'text-[#168E3F]',
    panel: 'bg-[#F8FCF9]',
  },
}

/**
 * One stream's transaction feed. A row expands to the reading it carried, so
 * the flow headline and parameter tiles match the realtime panel above.
 */
export default function StreamTransactionPanel({
  stream,
  data,
  expandedKey,
  onToggleExpanded,
  onRegisterScroll,
  onScrollSync,
}) {
  const tone = TONE[stream.tone] ?? TONE.brand
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onRegisterScroll?.(stream.key, scrollRef.current)
    return () => onRegisterScroll?.(stream.key, null)
  }, [onRegisterScroll, stream.key])

  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-[8px] bg-white shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)]">
      <div className="px-[16px] pb-[16px] pt-[16px]">
        <p className={`text-[16px] font-semibold leading-[22px] ${tone.title}`}>{stream.title}</p>
        <p className="mt-[4px] text-[14px] font-medium leading-[22px] text-[#646464]">
          Unique ID: <span className={tone.id}>{data.uniqueId}</span>
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={(event) => onScrollSync?.(stream.key, event.currentTarget.scrollTop)}
        className={`scroll-thin overflow-auto ${expandedKey ? 'max-h-[min(720px,70vh)]' : 'max-h-[480px]'}`}
      >
        <table className="w-full min-w-[420px] table-fixed border-collapse">
          <colgroup>
            {streamTransactionColumns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-[1]">
            <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF]">
              {streamTransactionColumns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[16px] py-[16px] text-[14px] font-semibold leading-[22px] text-[#363636] ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          {data.rows.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={streamTransactionColumns.length}
                  className="px-[16px] py-[18px] text-[14px] text-[#646464]"
                >
                  No transactions found.
                </td>
              </tr>
            </tbody>
          ) : (
            data.rows.map((row, i) => {
              const rowKey = row.syncKey || row.id
              const isExpanded = expandedKey === rowKey
              const zebra = i % 2 === 1

              return (
                <tbody
                  key={`${stream.key}-${rowKey}-${i}`}
                  data-txn-key={rowKey}
                  className={zebra || isExpanded ? 'bg-[rgba(248,248,248,0.9)]' : 'bg-white'}
                >
                  <tr className="border border-[#D8EDFF]">
                    <td className="truncate px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {row.id}
                    </td>
                    <td className="px-[16px] py-[18px]">
                      <StatusPill
                        tone={statusTone(row.status)}
                        className="h-[32px] min-w-[77px] justify-center px-[6px] text-[14px] leading-4"
                      >
                        {row.status}
                      </StatusPill>
                    </td>
                    <td className="whitespace-nowrap px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {row.timestamp}
                    </td>
                    <td className="px-[16px] py-[18px] text-right">
                      <button
                        type="button"
                        onClick={() => onToggleExpanded(rowKey)}
                        aria-label={`${isExpanded ? 'Hide' : 'Show'} reading for ${row.timestamp}`}
                        aria-expanded={isExpanded}
                        className="inline-flex items-center justify-center rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#D7EDFF] p-[6px] text-[#0768D2] transition-opacity hover:opacity-90"
                      >
                        <ChevronDown
                          size={20}
                          strokeWidth={2}
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="border border-[#D8EDFF]">
                      <td colSpan={streamTransactionColumns.length} className="px-[16px] py-[16px]">
                        <div
                          data-txn-details
                          tabIndex={-1}
                          className={`rounded-[16px] p-[12px] outline-none shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)] ${tone.panel}`}
                        >
                          <p className="text-[16px] font-semibold leading-[22px] text-[#565656]">Flow</p>
                          <p className="mt-[13px] text-[18px] font-bold leading-[22px] text-[#07121E]">
                            {row.reading.flow.value} {row.reading.flow.unit}
                          </p>

                          <div className="mt-[18px] grid grid-cols-3 gap-[8px]">
                            {row.reading.params.map((p) => (
                              <ParamTile key={p.key} param={p} />
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              )
            })
          )}
        </table>
      </div>
    </section>
  )
}
