import { Download } from 'lucide-react'

export default function ExportButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[34px] shrink-0 items-center gap-[8px] rounded-[8px] border border-[#BFD8F8] bg-white px-[13px] text-[12.5px] font-semibold leading-4 text-brand transition-colors hover:bg-brand-soft"
    >
      {label}
      <Download size={14} strokeWidth={2.2} />
    </button>
  )
}
