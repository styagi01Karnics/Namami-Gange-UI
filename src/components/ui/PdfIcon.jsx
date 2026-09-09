export default function PdfIcon({ size = 16 }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 16 19" className="shrink-0">
      <path d="M1.5 1.6A1.1 1.1 0 0 1 2.6.5h6.6l5 5v11.9a1.1 1.1 0 0 1-1.1 1.1H2.6a1.1 1.1 0 0 1-1.1-1.1V1.6Z" fill="#F3F5F8" />
      <path d="M9.2.5l5 5h-3.9a1.1 1.1 0 0 1-1.1-1.1V.5Z" fill="#D9DFE7" />
      <rect x="0" y="8.4" width="16" height="6.6" rx="1.4" fill="#E5484D" />
      <text x="8" y="13.3" textAnchor="middle" fontSize="4.6" fontWeight="700" fill="#fff" style={{ fontFamily: 'Inter, sans-serif' }}>
        PDF
      </text>
    </svg>
  )
}
