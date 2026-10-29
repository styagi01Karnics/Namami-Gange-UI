import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Download } from 'lucide-react'
import { findContractByFile } from '../components/contracts/ContractsTab'
import PdfPagesViewer from '../components/export/PdfPagesViewer'

/** Downloads the PDF as a file. Fetching as a blob makes mobile browsers save it instead of opening it. */
async function saveContractPdf(url: string, fileName: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed: ${response.status}`)
  const blob = new Blob([await response.blob()], { type: 'application/pdf' })
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

/** Public page a contract QR opens: shows the STP's contract PDF with a download option. */
export default function ContractReport() {
  const [searchParams] = useSearchParams()
  const stpName = searchParams.get('stp') ?? ''
  const contract = useMemo(() => findContractByFile(searchParams.get('file') ?? ''), [searchParams])
  const [downloadError, setDownloadError] = useState(false)

  const contractUrl = contract ? `${import.meta.env.BASE_URL}contracts/${contract.file}` : ''
  const downloadName = `${stpName}.pdf`

  const handleDownload = async () => {
    setDownloadError(false)
    try {
      await saveContractPdf(contractUrl, downloadName)
    } catch {
      setDownloadError(true)
    }
  }

  return (
    <div className="fixed inset-0 flex items-start justify-center overflow-y-auto bg-[#EEF8FC] p-[16px] sm:p-[32px]">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-[12px] border border-[#C7DDFB] bg-white shadow-sm">
        <div className="bg-[#0B3B6F] px-[20px] py-[14px] text-white">
          <p className="text-[12px] font-semibold uppercase tracking-wide opacity-80">Namami Gange</p>
          <h1 className="text-[18px] font-semibold">Contract Report</h1>
        </div>

        {!stpName || !contract ? (
          <div className="p-[24px] text-[14px] text-[#646464]">
            This contract link is invalid or incomplete. Please scan the QR code again.
          </div>
        ) : (
          <div className="flex flex-col gap-[16px] p-[20px]">
            <div className="flex flex-wrap items-center justify-between gap-[12px]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-[#07121E]">{stpName}</h2>
                <p className="text-[13px] text-[#646464]">Contract document · PDF</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-[6px]">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex h-[36px] shrink-0 items-center gap-[7px] rounded-[8px] bg-[#0768D2] px-[14px] text-[14px] font-semibold text-white hover:opacity-90"
                >
                  <Download size={16} />
                  Download
                </button>
                {downloadError && <p className="text-[12px] text-[#DC2626]">Download failed. Please try again.</p>}
              </div>
            </div>
            <PdfPagesViewer url={contractUrl} />
          </div>
        )}

        <div className="px-[20px] pb-[20px]">
          <Link to="/dashboard" className="text-[13px] font-semibold text-[#0768D2] hover:underline">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
