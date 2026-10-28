import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ExportButton from '../components/ui/ExportButton'
import { PrintDocumentBody } from '../components/export/PrintDocument'
import { useTableExport } from '../components/export/useTableExport'
import { STAFF_COLUMNS } from '../components/manpower/StaffAvailabilityCard'
import { buildTodayManpower } from '../components/manpower/todayManpower'
import { parseManpowerReportLink } from '../lib/manpowerReportQr'

/** Public page a staff-availability QR opens: the same table as the Manpower tab, with PDF/CSV. */
export default function ManpowerStaffReport() {
  const [searchParams] = useSearchParams()
  const link = useMemo(() => parseManpowerReportLink(searchParams), [searchParams])
  const rows = useMemo(() => (link ? buildTodayManpower(link.seed, link.stpName).rows : []), [link])
  const rangeLabel = link ? `Today, ${link.dateLabel}` : ''
  const title = link ? `Staff Availability — ${link.dateLabel}` : ''

  const { exportPdf, exportCsv, printNode } = useTableExport({
    title,
    fileName: `${link?.stpName ?? 'staff-availability'}-staff-availability`,
    columns: STAFF_COLUMNS,
    metaOverride: link ? { ...link.meta, rangeLabel } : undefined,
  })

  return (
    <div className="fixed inset-0 flex items-start justify-center overflow-y-auto bg-[#EEF8FC] p-[16px] sm:p-[32px]">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-[12px] border border-[#C7DDFB] bg-white shadow-sm">
        <div className="bg-[#0B3B6F] px-[20px] py-[14px] text-white">
          <p className="text-[12px] font-semibold uppercase tracking-wide opacity-80">Namami Gange</p>
          <h1 className="text-[18px] font-semibold">Staff Availability Report</h1>
        </div>

        {!link ? (
          <div className="p-[24px] text-[14px] text-[#646464]">
            This report link is invalid or incomplete. Please scan the QR code again.
          </div>
        ) : (
          <div className="flex flex-col gap-[16px] p-[20px]">
            <div className="flex flex-wrap items-center justify-between gap-[12px]">
              <h2 className="text-[15px] font-semibold text-[#07121E]">
                {link.stpName} — Staff Availability ({rows.length})
              </h2>
              <div className="flex items-center gap-[10px]">
                <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
                <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
              </div>
            </div>

            <div className="rounded-[10px] border border-[#D8EDFF] p-[16px]">
              <PrintDocumentBody
                title={title}
                badge={link.meta.badge}
                badgeTone={link.meta.badgeTone}
                address={link.meta.address}
                rangeLabel={rangeLabel}
                columns={STAFF_COLUMNS}
                rows={rows}
              />
            </div>
          </div>
        )}
        {printNode}
      </div>
    </div>
  )
}
