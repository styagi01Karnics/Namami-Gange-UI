type BoxIconProps = {
  size?: number
}

export default function BoxIcon({ size = 20 }: BoxIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <g stroke="#EFF6FE" strokeWidth="0.7" strokeLinejoin="round">
        <path d="M12 2.6 3.2 7.2 12 11.8Z" fill="#3D8AEC" />
        <path d="M12 2.6l8.8 4.6L12 11.8Z" fill="#5099F3" />
        <path d="M3.2 7.2 12 11.8v9.6l-8.8-4.6Z" fill="#1668E3" />
        <path d="M20.8 7.2 12 11.8v9.6l8.8-4.6Z" fill="#0F53BE" />
      </g>
    </svg>
  )
}
