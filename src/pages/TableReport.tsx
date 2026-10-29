import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ExportButton from '../components/ui/ExportButton'
import { PrintDocumentBody } from '../components/export/PrintDocument'
import { useTableExport } from '../components/export/useTableExport'
import { parseTableReportPayload, type TableReportColumn, type TableReportRow, type TableReportTone } from '../lib/tableReportQr'

const TONE_CLASS: Record<TableReportTone, string> = {
  red: 'font-bold text-[#DC2626]',
  green: 'font-semibold text-[#16A34A]',
  amber: 'font-bold text-[#D97706]',
}

type ReportState =
  | { status: 'loading' }
  | { status: 'invalid' }
  | { status: 'ready'; title: string; meta: { rangeLabel: string; address: string | null; badge: string | null; badgeTone: string }; columns: TableReportColumn[]; rows: TableReportRow[] }

/** Public page a table QR opens: the same table as the PDF, with PDF/CSV download. */
export default function TableReport() {
  const [searchParams] = useSearchParams()
  const encoded = searchParams.get('d')
  const [state, setState] = useState<ReportState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    parseTableReportPayload(encoded).then((data) => {
      if (cancelled) return
      setState(data ? { status: 'ready', ...data } : { status: 'invalid' })
    })
    return () => {
      cancelled = true
    }
  }, [encoded])

  return (
    <div className="fixed inset-0 flex items-start justify-center overflow-y-auto bg-[#EEF8FC] p-[16px] sm:p-[32px]">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-[12px] border border-[#C7DDFB] bg-white shadow-sm">
        <div className="bg-[#0B3B6F] px-[20px] py-[14px] text-white">
          <p className="text-[12px] font-semibold uppercase tracking-wide opacity-80">Namami Gange</p>
          <h1 className="text-[18px] font-semibold">{state.status === 'ready' ? state.title : 'Report'}</h1>
        </div>

        {state.status === 'loading' && <div className="p-[24px] text-[14px] text-[#646464]">Loading report…</div>}

        {state.status === 'invalid' && (
          <div className="p-[24px] text-[14px] text-[#646464]">
            This report link is invalid or incomplete. Please scan the QR code again.
          </div>
        )}

        {state.status === 'ready' && <TableReportView state={state} />}
      </div>
    </div>
  )
}

function TableReportView({ state }: { state: Extract<ReportState, { status: 'ready' }> }) {
  const { title, meta, columns, rows } = state
  const fileName = useMemo(() => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'report', [title])
  const renderCell = (row: TableReportRow, col: TableReportColumn) => {
    const value = row.cells[col.key] ?? '—'
    const tone = row.tones[col.key]
    return tone ? <span className={TONE_CLASS[tone]}>{value}</span> : value
  }

  const { exportPdf, exportCsv, printNode } = useTableExport({
    title,
    fileName,
    columns,
    metaOverride: meta,
    getValue: (row: TableReportRow, col) => row.cells[col.key],
    renderPdfCell: renderCell,
    rangeLabel: meta.rangeLabel,
  })

  return (
    <div className="flex flex-col gap-[16px] p-[20px]">
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <h2 className="text-[15px] font-semibold text-[#07121E]">
          {title} ({rows.length})
        </h2>
        <div className="flex items-center gap-[10px]">
          <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
          <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
        </div>
      </div>

      <div className="rounded-[10px] border border-[#D8EDFF] p-[16px]">
        <PrintDocumentBody
          title={title}
          badge={meta.badge}
          badgeTone={meta.badgeTone}
          address={meta.address}
          rangeLabel={meta.rangeLabel}
          columns={columns}
          rows={rows}
          renderCell={renderCell}
        />
      </div>
      {printNode}
    </div>
  )
}
