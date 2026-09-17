import FileBadgeIcon from './FileBadgeIcon'
import { ico } from './Ico'

const DownloadIcon = ico('fluent:arrow-download-16-filled')

type ExportButtonProps = {
  label: string
  onClick: () => void
}

export default function ExportButton({ label, onClick }: ExportButtonProps) {
  const kind = label.toLowerCase()

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Export ${label}`}
      title={`Export ${label}`}
      className="flex h-[34px] shrink-0 items-center gap-[7px] rounded-[8px] border border-[#BFD8F8] bg-white px-[11px] text-brand transition-colors hover:bg-brand-soft"
    >
      <FileBadgeIcon kind={kind} size={15} />
      <DownloadIcon size={14} className="text-brand" />
    </button>
  )
}
