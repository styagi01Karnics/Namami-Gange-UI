import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import IconToggle from '../ui/IconToggle'
import { useTableExport } from '../export/useTableExport'
import { cctvLogColumns, cctvLogs } from '../../data/mockData'

/** Recording state reads as coloured text rather than a pill. */
const STATUS_TONE = {
  'Recording Stopped': 'text-danger',
  'Recording Resumed': 'text-ok',
  'Storage near full': 'text-orange',
}

export default function CctvLogsCard() {
  const [open, setOpen] = useState(true)
  const [camera, setCamera] = useState(cctvLogs.tabs[0])
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: `CCTV Logs — ${camera}`,
    fileName: `cctv-logs-${camera.toLowerCase()}`,
    columns: cctvLogColumns,
  })

  const toggleSort = (key) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = cctvLogs.rows[camera].filter(
      (r) => !q || [r.timestamp, r.status, r.reason].some((f) => f.toLowerCase().includes(q)),
    )

    if (!sort.key) return list
    return [...list].sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [camera, query, sort])

  return (
    <section className="flex min-w-0 flex-col rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex items-center justify-between p-[15px]">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">CCTV Logs</h3>
        <IconToggle open={open} onClick={() => setOpen((v) => !v)} label="Toggle CCTV Logs" />
      </div>

      {open && (
        <>
          <div className="flex items-center gap-[8px] px-[15px]">
            {cctvLogs.tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCamera(t)}
                className={`rounded-[8px] px-[15px] py-[8px] text-[12.5px] font-semibold leading-4 transition-colors ${
                  camera === t ? 'bg-brand text-white' : 'bg-[#F1F4F8] text-ink hover:bg-brand-soft'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-[12px] px-[15px] py-[15px]">
            <SearchInput value={query} onChange={setQuery} className="w-[268px]" />
            <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
            <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
          </div>
          {printNode}

          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed border-collapse">
              <colgroup>
                {cctvLogColumns.map((c) => (
                  <col key={c.key} style={{ width: c.width }} />
                ))}
              </colgroup>

              <thead>
                <tr className="border-y border-line bg-[#F7F9FC]">
                  {cctvLogColumns.map((c) => (
                    <th key={c.key} className="px-[16px] py-[15px] text-left text-[13px] font-medium leading-4 text-ink-soft">
                      {c.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c.key)}
                          className="flex items-center gap-[5px] transition-colors hover:text-brand"
                        >
                          {c.label}
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${
                              sort.key === c.key && sort.dir === 'desc' ? 'rotate-180' : ''
                            } ${sort.key === c.key ? 'text-brand' : ''}`}
                          />
                        </button>
                      ) : (
                        c.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-[16px] py-[18px] text-[13px] leading-[18px] text-ink">{r.timestamp}</td>
                    <td className={`px-[16px] py-[18px] text-[13px] font-medium leading-[18px] ${STATUS_TONE[r.status] ?? 'text-ink'}`}>
                      {r.status}
                    </td>
                    <td className={`px-[16px] py-[18px] text-[13px] leading-[18px] ${r.downtime === '-' ? 'text-ink' : 'text-orange'}`}>
                      {r.downtime}
                    </td>
                    <td className="px-[16px] py-[18px] text-[13px] leading-[18px] text-ink">{r.reason}</td>
                    <td className="px-[16px] py-[18px] text-[13px] leading-[18px] text-ink">{r.storage}</td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={cctvLogColumns.length} className="px-[16px] py-[44px] text-center text-[13px] text-ink-muted">
                      No log entries match this search.
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
