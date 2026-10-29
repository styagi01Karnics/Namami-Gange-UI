import { useState } from 'react'
import { useReportFilters } from './ReportShell'
import { useTableExport } from '../export/useTableExport'
import { downloadCsv } from '../../lib/csv'
import Select from '../ui/Select'
import DateRangeField from '../ui/DateRangeField'
import Ico from '../ui/Ico'
import ReportQrModal from '../export/ReportQrModal'
import { useExportMeta } from '../export/exportMeta'
import { buildTableReportUrl, type TableReportTone } from '../../lib/tableReportQr'

type ReportDownloadScreenProps = {
  moduleKey: 'parameters' | 'cctv' | 'manpower' | 'inventory' | 'contracts' | 'violation'
  title: string
  description: string
  columns: { key: string; label: string; width?: string; align?: string }[]
  rows: any[]
  renderCell?: (row: any, col: any, index?: number) => any
  getValue?: (row: any, col: any) => any
  exportTitle?: string
  exportFileName?: string
  topContent?: React.ReactNode
  withTimeRange?: boolean
  /** Shows a QR button that opens this table (as in the PDF) on a public page. */
  qrEnabled?: boolean
  /** Colours cells the way renderCell does (red/green/amber), so the QR page matches the PDF. */
  cellTone?: (row: any, col: any) => TableReportTone | null
  categoryFilter?: {
    label: string
    value: string
    options: { id: string; label: string }[]
    onChange: (value: string) => void
  }
}

export default function ReportDownloadScreen({
  title,
  description,
  columns,
  rows,
  renderCell,
  getValue,
  exportTitle,
  exportFileName,
  topContent,
  categoryFilter,
  withTimeRange = false,
  qrEnabled = false,
  cellTone,
}: ReportDownloadScreenProps) {
  const { stpId, setStpId, stpOptions, plantLabel, range, setRange } = useReportFilters()
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf')
  const [showPreview, setShowPreview] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState('rajesh.nair@example.com')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null)
  const [qrUrl, setQrUrl] = useState<string | null>(null)

  const effectiveTitle = exportTitle || `${title} - ${plantLabel || 'STP'}`
  const effectiveFileName = exportFileName || `${title.toLowerCase().replace(/\s+/g, '-')}-${plantLabel?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'stp'}`

  const resolveValue = (row: any, col: any) => {
    if (col.key === 'sn') {
      const idx = rows.indexOf(row)
      return idx >= 0 ? idx + 1 : 1
    }
    if (getValue) {
      const custom = getValue(row, col)
      if (custom !== undefined) return custom
    }
    return row[col.key]
  }

  const resolveCell = (row: any, col: any, index: number) => {
    if (col.key === 'sn') {
      return index + 1
    }
    if (renderCell) {
      const custom = renderCell(row, col, index)
      if (custom !== undefined) return custom
    }
    return resolveValue(row, col) ?? '—'
  }

  const exportMeta = useExportMeta()

  const { exportPdf, printNode } = useTableExport({
    title: effectiveTitle,
    fileName: effectiveFileName,
    columns,
    getValue: resolveValue,
    renderPdfCell: (row, col) => {
      const idx = rows.indexOf(row)
      return resolveCell(row, col, idx >= 0 ? idx : 0)
    },
    rangeLabel: range,
  })

  const handleDownload = () => {
    if (format === 'pdf') {
      exportPdf(rows)
      triggerDownloadNotice('PDF report generated. Please check print/download dialog.')
    } else {
      downloadCsv(effectiveFileName, columns, rows, resolveValue)
      triggerDownloadNotice('Excel spreadsheet (.csv) downloaded successfully.')
    }
  }

  const handleQr = async () => {
    const payloadColumns = columns.map((col) => ({ key: col.key, label: col.label, align: col.align }))
    const payloadRows = rows.map((row, index) => {
      const cells: Record<string, string> = {}
      columns.forEach((col) => {
        cells[col.key] = col.key === 'sn' ? String(index + 1) : String(resolveValue(row, col) ?? '—')
      })
      const tones: Record<string, TableReportTone> = {}
      columns.forEach((col) => {
        const tone = cellTone?.(row, col)
        if (tone) tones[col.key] = tone
      })
      return { cells, tones }
    })
    const url = await buildTableReportUrl({
      title: effectiveTitle,
      meta: { stpName: exportMeta.stpName, rangeLabel: exportMeta.rangeLabel, address: exportMeta.address, badge: exportMeta.badge, badgeTone: exportMeta.badgeTone },
      columns: payloadColumns,
      rows: payloadRows,
    })
    if (url) {
      setQrUrl(url)
    } else {
      triggerDownloadNotice('This table is too large for a QR code. Please use Download instead.')
    }
  }

  const triggerDownloadNotice = (msg: string) => {
    setDownloadNotice(msg)
    setTimeout(() => {
      setDownloadNotice(null)
    }, 4000)
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailStatus('sending')
    setTimeout(() => {
      setEmailStatus('sent')
      setTimeout(() => {
        setShowEmailModal(false)
        setEmailStatus('idle')
        triggerDownloadNotice(`Report has been sent to ${email}`)
      }, 1400)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {printNode}

      {/* Top Content (e.g. Sub-tabs / KPI stat cards) */}
      {topContent && <div>{topContent}</div>}

      {/* Main Download Card */}
      <div className="relative rounded-[16px] border border-[#D8EDFF] bg-white p-[24px] sm:p-[28px] shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] border-b border-[#EFF7FF] pb-[20px]">
          <div className="flex items-start gap-[16px]">
            <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] bg-[#EFF7FF] text-[#0768D2]">
              <svg className="h-[24px] w-[24px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#07121E]">{title}</h2>
              <p className="mt-[2px] text-[13.5px] text-[#646464]">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-[10px]">
            <span className="inline-flex items-center rounded-full bg-[#EBF5FF] px-[12px] py-[5px] text-[12.5px] font-semibold text-[#0768D2]">
              {rows.length} Records Found
            </span>
          </div>
        </div>

        {/* Notice Banner */}
        {downloadNotice && (
          <div className="mt-[16px] flex items-center justify-between rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] px-[16px] py-[10px] text-[13.5px] font-medium text-[#15803D]">
            <div className="flex items-center gap-[8px]">
              <svg className="h-[18px] w-[18px] text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{downloadNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setDownloadNotice(null)}
              className="text-[#16A34A] hover:text-[#15803D]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scope Dropdowns Row: Target STP, Category Filter (optional), Date Range, Selected Format */}
        <div className={`my-[24px] grid gap-[16px] ${categoryFilter ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          {/* Box 1: Target STP Dropdown */}
          <div className="flex flex-col justify-between rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] p-[16px]">
            <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Target STP
            </span>
            <div className="mt-[6px]">
              <Select
                options={stpOptions}
                value={stpId}
                onChange={setStpId}
                className="w-full bg-white"
              />
            </div>
          </div>

          {/* Optional Category Filter Dropdown (e.g. Chemical / Equipment) */}
          {categoryFilter && (
            <div className="flex flex-col justify-between rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] p-[16px]">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                {categoryFilter.label}
              </span>
              <div className="mt-[6px]">
                <Select
                  options={categoryFilter.options}
                  value={categoryFilter.value}
                  onChange={categoryFilter.onChange}
                  className="w-full bg-white"
                />
              </div>
            </div>
          )}

          {/* Box 2: Date Range Picker */}
          <div className="flex flex-col justify-between rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] p-[16px]">
            <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Date Range
            </span>
            <div className="mt-[6px]">
              <DateRangeField
                value={range}
                onChange={setRange}
                withTime={withTimeRange}
                className="w-full bg-white"
              />
            </div>
          </div>

          {/* Box 3: Export Format Dropdown */}
          <div className="flex flex-col justify-between rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] p-[16px]">
            <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Selected Format
            </span>
            <div className="mt-[6px]">
              <Select
                options={[
                  { id: 'pdf', label: 'PDF Document (.pdf)' },
                  { id: 'excel', label: 'Excel Spreadsheet (.xlsx / .csv)' },
                ]}
                value={format}
                onChange={(val) => setFormat(val as 'pdf' | 'excel')}
                className="w-full bg-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: View, Email Me, Download */}
        <div className="flex items-center justify-end gap-[12px] border-t border-[#EFF7FF] pt-[20px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            {/* QR Button (icon only) */}
            {qrEnabled && (
              <button
                type="button"
                onClick={handleQr}
                aria-label="QR Code"
                title="QR Code"
                className="flex items-center justify-center rounded-[10px] border border-[#CBD5E1] bg-white p-[10px] text-[#0768D2] shadow-sm transition hover:bg-[#F8FAFC]"
              >
                <Ico icon="mdi:qrcode-scan" size={20} />
              </button>
            )}

            {/* View Button */}
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-[8px] rounded-[10px] border border-[#0768D2] bg-white px-[18px] py-[10px] text-[13.5px] font-bold text-[#0768D2] shadow-sm transition hover:bg-[#EFF7FF]"
            >
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </button>

            {/* Email Me Button */}
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-[8px] rounded-[10px] border border-[#CBD5E1] bg-white px-[18px] py-[10px] text-[13.5px] font-bold text-[#334155] shadow-sm transition hover:bg-[#F8FAFC]"
            >
              <svg className="h-[18px] w-[18px] text-[#0768D2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Me
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-[8px] rounded-[10px] bg-[#0768D2] px-[22px] py-[10px] text-[13.5px] font-bold text-white shadow-md transition hover:bg-[#0658B3]"
            >
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download {format === 'pdf' ? 'PDF' : 'Excel'}
            </button>
          </div>
        </div>
      </div>

      {qrUrl && (
        <ReportQrModal
          url={qrUrl}
          heading={`Scan to view ${title}`}
          title={plantLabel || effectiveTitle}
          fileName={`${effectiveFileName}-qr`}
          onClose={() => setQrUrl(null)}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px] backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-[1040px] flex-col rounded-[16px] bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-[24px] py-[18px]">
              <div>
                <h3 className="text-[17px] font-bold text-[#111827]">
                  Preview: {title}
                </h3>
                <p className="mt-[2px] text-[13px] text-[#6B7280]">
                  {plantLabel || '68 MLD Jagjeetpur'} • {range} • {rows.length} Records
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Scrollable Table Preview */}
            <div className="scroll-thin flex-1 overflow-auto p-[24px]">
              <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB]">
                <table className="w-full min-w-[760px] border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[#D8EDFF] bg-[#EFF7FF]">
                      {columns.map((c) => (
                        <th
                          key={c.key}
                          className="px-[14px] py-[12px] font-bold text-[#363636]"
                        >
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr
                        key={r.id || i}
                        className={`border-b border-[#F3F4F6] transition-colors hover:bg-[#F9FAFB] ${
                          i % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white'
                        }`}
                      >
                        {columns.map((c) => (
                          <td key={c.key} className="px-[14px] py-[12px] text-[#1F2937]">
                            {resolveCell(r, c, i)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB] px-[24px] py-[16px] rounded-b-[16px]">
              <div className="text-[13px] text-[#6B7280]">
                Viewing live preview of {rows.length} records
              </div>
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    exportPdf(rows)
                    setShowPreview(false)
                    triggerDownloadNotice('PDF downloaded.')
                  }}
                  className="rounded-[8px] border border-[#DC2626] bg-white px-[14px] py-[8px] text-[13px] font-bold text-[#DC2626] transition hover:bg-[#FEF2F2]"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadCsv(effectiveFileName, columns, rows, resolveValue)
                    setShowPreview(false)
                    triggerDownloadNotice('Excel downloaded.')
                  }}
                  className="rounded-[8px] border border-[#16A34A] bg-white px-[14px] py-[8px] text-[13px] font-bold text-[#16A34A] transition hover:bg-[#F0FDF4]"
                >
                  Download Excel
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="rounded-[8px] bg-[#E5E7EB] px-[14px] py-[8px] text-[13px] font-bold text-[#374151] transition hover:bg-[#D1D5DB]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px] backdrop-blur-sm">
          <div className="relative w-full max-w-[460px] rounded-[16px] bg-white p-[24px] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-[14px]">
              <h3 className="text-[16px] font-bold text-[#111827]">Email Report</h3>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="mt-[16px] flex flex-col gap-[14px]">
              <div>
                <label className="block text-[13px] font-semibold text-[#374151]">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-[6px] w-full rounded-[8px] border border-[#D1D5DB] px-[12px] py-[9px] text-[13.5px] focus:border-[#0768D2] focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>

              <div className="rounded-[8px] bg-[#F9FAFB] p-[12px] text-[12.5px] text-[#6B7280]">
                <div><strong>Report:</strong> {title}</div>
                <div><strong>STP:</strong> {plantLabel || '68 MLD Jagjeetpur'}</div>
                <div><strong>Period:</strong> {range}</div>
                <div><strong>Format:</strong> {format.toUpperCase()}</div>
              </div>

              <div className="mt-[6px] flex items-center justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="rounded-[8px] px-[14px] py-[8px] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailStatus !== 'idle'}
                  className="flex items-center gap-[6px] rounded-[8px] bg-[#0768D2] px-[18px] py-[8px] text-[13px] font-bold text-white hover:bg-[#0658B3] disabled:opacity-50"
                >
                  {emailStatus === 'sending' ? 'Sending…' : emailStatus === 'sent' ? 'Sent!' : 'Send Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
