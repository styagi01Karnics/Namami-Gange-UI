import { useMemo, useState } from 'react'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import IconToggle from '../ui/IconToggle'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { useTableExport } from '../export/useTableExport'
import { billingLogColumns, billingLogRows } from '../../data/mockData'

/** Each money column keeps its own accent so a row scans left to right. */
const AMOUNT_TONE = {
  raised: 'text-orange',
  approved: 'text-brand',
  penalty: 'text-danger',
  payable: 'text-ok',
}

function MoneyCell({ cell, tone }) {
  if (!cell) return <span className="text-[13px] leading-[18px] text-ink-muted">-</span>

  return (
    <>
      <p className={`text-[13px] font-semibold leading-[18px] ${tone}`}>{cell.amount}</p>
      <p className="mt-[4px] text-[11.5px] leading-4 text-ink-muted">{cell.date}</p>
    </>
  )
}

export default function BillingLogsCard() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Billing Logs',
    fileName: 'billing-logs',
    columns: billingLogColumns,
  })

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return billingLogRows
    return billingLogRows.filter((r) => [r.month, r.status].some((f) => f.toLowerCase().includes(q)))
  }, [query])

  return (
    <section className="flex min-w-0 flex-col rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex items-center justify-between p-[15px]">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">Billing Logs</h3>
        <IconToggle open={open} onClick={() => setOpen((v) => !v)} label="Toggle Billing Logs" />
      </div>

      {open && (
        <>
          <div className="flex items-center justify-end gap-[12px] px-[15px] pb-[15px]">
            <SearchInput value={query} onChange={setQuery} className="w-[268px]" />
            <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
            <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
          </div>
          {printNode}

          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed border-collapse">
              <colgroup>
                {billingLogColumns.map((c) => (
                  <col key={c.key} style={{ width: c.width }} />
                ))}
              </colgroup>

              <thead>
                <tr className="border-y border-line bg-canvas">
                  {billingLogColumns.map((c) => (
                    <th key={c.key} className="px-[16px] py-[15px] text-left text-[13px] font-semibold leading-4 text-ink-soft">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-[16px] py-[16px] text-[13px] leading-[18px] text-ink">{r.month}</td>
                    {['raised', 'approved', 'penalty', 'payable'].map((k) => (
                      <td key={k} className="px-[16px] py-[16px] align-top">
                        <MoneyCell cell={r[k]} tone={AMOUNT_TONE[k]} />
                      </td>
                    ))}
                    <td className="px-[16px] py-[16px]">
                      <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={billingLogColumns.length} className="px-[16px] py-[44px] text-center text-[13px] text-ink-muted">
                      No billing months match this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
