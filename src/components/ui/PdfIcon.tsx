import FileBadgeIcon from './FileBadgeIcon'

type PdfIconProps = {
  size?: number
}

export default function PdfIcon({ size = 16 }: PdfIconProps) {
  return <FileBadgeIcon kind="pdf" size={size} />
}
