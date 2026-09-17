const SRC: Record<string, string> = {
  pdf: '/pdf.svg',
  csv: '/csv.svg',
  xls: '/csv.svg',
}

const RATIO: Record<string, number> = { pdf: 20 / 16, csv: 17 / 15, xls: 17 / 15 }

type FileBadgeIconProps = {
  kind?: string
  size?: number
}

export default function FileBadgeIcon({ kind = 'pdf', size = 16 }: FileBadgeIconProps) {
  const src = SRC[kind] ?? SRC.pdf
  const height = Math.round(size * (RATIO[kind] ?? RATIO.pdf))

  return <img src={src} alt="" width={size} height={height} className="shrink-0 object-contain" />
}
