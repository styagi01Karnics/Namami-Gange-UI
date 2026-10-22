import { useEffect, useState } from 'react'
import { Download, Eye, FileText, X } from 'lucide-react'

const CONTRACTS = [
  { mld: '27', file: '27-MLD-STP-JAGJEEPUR.pdf', meta: ['PDF', '7 pages', '3.45 MB'] },
  { mld: '18', file: '18-MLD-STP-JAGJEEPUR.pdf', meta: ['PDF'] },
  { mld: '10', file: '10-MLD-KASHIPUR-BAZPUR.pdf', meta: ['PDF'] },
  { mld: '26', file: '26-MLD-LAKKARGHAT-RISHIKESH.pdf', meta: ['PDF'] },
  { mld: '68', file: '68-MLD-JAGJEETPUR-HARIDWAR.pdf', meta: ['PDF'] },
  { mld: '14', file: '14-MLD-SARAI-HARIDWAR.pdf', meta: ['PDF'] },
]

/** Picks the contract by the plant's MLD capacity; defaults to the 27 MLD contract. */
function resolveContract(stpName: string) {
  const mld = stpName.match(/(\d+)\s*MLD/i)?.[1]
  return CONTRACTS.find((c) => c.mld === mld) ?? CONTRACTS[0]
}

const actionBase =
  'inline-flex h-[36px] shrink-0 items-center gap-[7px] rounded-[8px] px-[14px] text-[14px] font-semibold leading-[20px] transition-opacity hover:opacity-90'

/** Shared by the Contracts page and the Contracts tab in STP Management. */
export default function ContractsTab({ stpName = '27 MLD STP Jagjeepur' }: { stpName?: string }) {
  const [viewing, setViewing] = useState(false)
  const contract = resolveContract(stpName)
  const CONTRACT_URL = `${import.meta.env.BASE_URL}contracts/${contract.file}`
  const downloadName = `${stpName}.pdf`

  useEffect(() => {
    if (!viewing) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setViewing(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewing])

  return (
    <>
      <div className="overflow-hidden rounded-[10px] border border-[#C7DDFB] bg-white/80">
        <div className="flex flex-wrap items-center justify-between gap-[12px] border-b border-[#D8EDFF] bg-[#EFF7FF] px-[16px] py-[14px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[8px] bg-white text-[#0768D2]">
              <FileText size={20} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[16px] font-semibold leading-[22px] text-[#07121E]">
                {stpName}
              </h3>
              <p className="text-[13px] leading-[18px] text-[#646464]">
                Contract document &middot; {contract.meta.join(' \u00B7 ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => setViewing(true)}
              className={`${actionBase} border border-[rgba(7,104,210,0.4)] bg-white text-[#0768D2]`}
            >
              <Eye size={16} />
              View
            </button>
            <a
              href={CONTRACT_URL}
              download={downloadName}
              className={`${actionBase} bg-[#0768D2] text-white`}
            >
              <Download size={16} />
              Download
            </a>
          </div>
        </div>
      </div>

      {viewing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${stpName} contract`}
          className="fixed inset-0 z-50 flex flex-col gap-[10px] bg-[#07121E]/80 p-[16px]"
        >
          <div className="flex shrink-0 items-center justify-between rounded-[10px] bg-white px-[16px] py-[10px]">
            <span className="text-[15px] font-semibold text-[#07121E]">{stpName}</span>
            <div className="flex items-center gap-[8px]">
              <a
                href={CONTRACT_URL}
                download={downloadName}
                className={`${actionBase} bg-[#0768D2] text-white`}
              >
                <Download size={16} />
                Download
              </a>
              <button
                type="button"
                onClick={() => setViewing(false)}
                aria-label="Close contract"
                className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[#BFD8F8] text-[#0768D2] hover:bg-[#EFF7FF]"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <iframe
            src={`${CONTRACT_URL}#view=FitH`}
            title={`${stpName} contract`}
            className="min-h-0 w-full flex-1 rounded-[10px] bg-white"
          />
        </div>
      )}
    </>
  )
}
