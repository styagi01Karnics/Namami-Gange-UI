/**
 * Water-tank illustration used by the inlet / outlet flow cards.
 * `variant` swaps the pipe (inlet, pouring in from the left) for a tap (outlet).
 */
export default function FlowBeaker({ variant = 'inlet', percent = 78.5, id = 'beaker' }) {
  const W = 142
  const H = 168
  const boxX = 12
  const boxY = 36
  const boxW = 116
  const boxH = 130
  const level = boxY + boxH * (1 - Math.min(Math.max(percent, 0), 100) / 100)

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0">
      <defs>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#63C4F2" />
          <stop offset="100%" stopColor="#2E9BE0" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF5FE" />
          <stop offset="100%" stopColor="#DCEEFB" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2F6F9" />
          <stop offset="35%" stopColor="#C9D5DF" />
          <stop offset="60%" stopColor="#93A4B3" />
          <stop offset="100%" stopColor="#D7E1E9" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={boxX} y={boxY} width={boxW} height={boxH} rx="12" />
        </clipPath>
      </defs>

      {/* glass body */}
      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx="12" fill={`url(#${id}-glass)`} />

      {/* water */}
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={boxX} y={level} width={boxW} height={boxY + boxH - level} fill={`url(#${id}-water)`} />
        <path
          d={`M${boxX} ${level + 3} q 14 -7 29 0 t 29 0 t 29 0 t 29 0 v 12 H${boxX} Z`}
          fill="#7FD0F5"
          opacity="0.55"
        />
      </g>

      {variant === 'inlet' ? (
        <g>
          {/* pipe entering from the left */}
          <rect x="0" y="6" width="44" height="17" rx="5" fill={`url(#${id}-metal)`} />
          <rect x="36" y="3" width="11" height="23" rx="3" fill="#8C9DAC" />
          <rect x="37.5" y="4.5" width="8" height="20" rx="2" fill={`url(#${id}-metal)`} />
          {/* falling stream */}
          <path d="M40 24 q 6 16 4 30 q -1 10 -3 16 h -14 q 2 -22 3 -30 q 1 -10 -1 -16 Z" fill="#9BD9F7" />
          <path d="M36 24 q 4 14 2 26 q -1 9 -2 14 h -5 q 2 -20 2 -28 q 0 -7 -2 -12 Z" fill="#C6EBFD" opacity="0.85" />
        </g>
      ) : (
        <g>
          {/* tap above the tank */}
          <rect x="86" y="0" width="13" height="18" rx="4" fill={`url(#${id}-metal)`} />
          <path
            d="M92 4 h 24 a 7 7 0 0 1 7 7 v 7 a 5.5 5.5 0 0 1 -11 0 v -3 h -20 Z"
            fill={`url(#${id}-metal)`}
          />
          <rect x="111" y="16" width="12" height="8" rx="2.5" fill="#8C9DAC" />
          <ellipse cx="117" cy="25" rx="6" ry="2.6" fill="#B9C7D3" />
          {/* droplets falling toward the tank */}
          <path d="M117 29 c 3 4.5 5 6.5 5 9.5 a 5 5 0 0 1 -10 0 c 0 -3 2 -5 5 -9.5 Z" fill="#63C4F2" />
          <circle cx="117" cy="47" r="3.2" fill="#8ED4F5" />
        </g>
      )}

      <text
        x={boxX + boxW / 2}
        y={boxY + boxH - 12}
        textAnchor="middle"
        fontSize="13.5"
        fontWeight="700"
        fill="#FFFFFF"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {percent}%
      </text>
    </svg>
  )
}
