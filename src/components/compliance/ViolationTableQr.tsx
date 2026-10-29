import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import type { StpMonthlyViolation } from '../../data/mockData'
import {
  buildViolationReportLinkUrl,
  buildViolationTableUrl,
  type ViolationReportLink,
} from '../../lib/violationTableQr'

export default function ViolationTableQr({
  rows,
  reportLink,
  title,
  fileName,
  onClose,
}: {
  rows: StpMonthlyViolation[]
  reportLink: ViolationReportLink
  title: string
  fileName: string
  onClose: () => void
}) {
  const [url, setUrl] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    buildViolationTableUrl(rows, title, reportLink.meta).then((embedded) => {
      if (cancelled) return
      // Small tables are embedded (exact snapshot); large ones link to the report page, which reloads the rows.
      setUrl(embedded ?? buildViolationReportLinkUrl(reportLink))
    })
    return () => {
      cancelled = true
    }
  }, [rows, reportLink, title])

  const downloadPng = () => {
    const canvas = wrapRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${fileName}.png`
    link.click()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[16px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Table QR code"
    >
      <div
        className="flex w-full max-w-[360px] flex-col items-center gap-[14px] rounded-[12px] bg-white p-[20px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[15px] font-semibold text-[#07121E]">Scan to view Non-complying Parameters</h3>

        {!url && <p className="py-[60px] text-[13px] text-[#646464]">Generating QR code…</p>}

        {url && (
          <>
            <div ref={wrapRef} className="rounded-[8px] border border-[#D8EDFF] bg-white p-[8px]">
              <QRCodeCanvas value={url} size={240} level="M" marginSize={0} />
            </div>
            <p className="text-center text-[13px] font-semibold text-[#07121E]">{rows[0]?.stpName || title}</p>
            <button
              type="button"
              onClick={downloadPng}
              className="h-[34px] rounded-[8px] border border-[#BFD8F8] bg-white px-[14px] text-[13px] font-semibold text-brand hover:bg-brand-soft"
            >
              Download QR (PNG)
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="text-[13px] font-semibold text-[#646464] hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  )
}
