import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { ico } from '../ui/Ico'
import StatusPill, { statusTone } from '../ui/StatusPill'
import ParamTile from '../stp/ParamTile'
import { streamTransactionColumns } from '../../data/mockData'

const ClockIcon = ico('fluent:clock-32-filled')

const TONE = {
  brand: {
    box: 'bg-brand',
    title: 'text-brand',
    id: 'text-brand-link',
    panel: 'bg-[#F7FAFF]',
    time: 'text-brand',
    Icon: ico('akar-icons:arrow-forward'),
  },
  ok: {
    box: 'bg-ok',
    title: 'text-ok',
    id: 'text-ok',
    panel: 'bg-[#F4FBF6]',
    time: 'text-ok',
    Icon: ico('akar-icons:arrow-back'),
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
  const tone = TONE[stream.tone]
  const { Icon } = tone
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onRegisterScroll?.(stream.key, scrollRef.current)
    return () => onRegisterScroll?.(stream.key, null)
  }, [onRegisterScroll, stream.key])

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
            <tr className="border-y border-line bg-canvas">
              {streamTransactionColumns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[10px] py-[13px] text-[12.5px] font-semibold leading-4 text-ink-soft ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  } ${c.key === 'id' || c.key === 'status' ? 'px-[8px]' : ''}`}
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
                  className="px-[14px] py-[18px] text-[13px] text-ink-soft"
                >
                  No transactions found.
                </td>
              </tr>
            </tbody>
          ) : (
            data.rows.map((row, i) => {
              const rowKey = row.syncKey || row.id
              const isExpanded = expandedKey === rowKey

              return (
                <tbody
                  key={`${stream.key}-${rowKey}-${i}`}
                  data-txn-key={rowKey}
                  className={isExpanded ? 'bg-[#F8FBFF]' : undefined}
                >
                  <tr className="border-b border-line">
                    <td className="px-[8px] py-[15px] text-[12.5px] leading-[18px] text-ink">{row.id}</td>
                    <td className="px-[8px] py-[15px]">
                      <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
                    </td>
                    <td className="whitespace-nowrap px-[10px] py-[15px] text-[12.5px] leading-[18px] text-ink">
                      {row.timestamp}
                    </td>
                    <td className="px-[10px] py-[15px] text-right">
                      <button
                        type="button"
                        onClick={() => onToggleExpanded(rowKey)}
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
                      <td colSpan={streamTransactionColumns.length} className="px-[14px] pb-[16px] pt-[16px]">
                        <div
                          data-txn-details
                          tabIndex={-1}
                          className={`rounded-[10px] border border-line p-[13px] outline-none ${tone.panel}`}
                        >
                          <div className="flex items-start justify-between gap-[12px]">
                            <div>
                              <p className="text-[13px] leading-[18px] text-ink-soft">Flow</p>
                              <p className="mt-[3px] text-[19px] font-bold leading-6 text-ink">
                                {row.reading.flow.value}
                                <span className="ml-[4px] text-[14px] font-semibold">{row.reading.flow.unit}</span>
                              </p>
                            </div>
                            <span className={`flex shrink-0 items-center gap-[6px] text-[12.5px] font-medium leading-4 ${tone.time}`}>
                              <ClockIcon size={15} />
                              {row.reading.at}
                            </span>
                          </div>

                          <div className="mt-[12px] grid grid-cols-3 gap-[10px]">
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
