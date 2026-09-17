/**
 * Drawn stand-in for a camera still, used whenever a feed has no `image`.
 * Evokes the plant interior in the Figma without pretending to be a photo.
 */
export default function PlantScene({ id = 'scene' }) {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCE9F4" />
          <stop offset="100%" stopColor="#B6CBDB" />
        </linearGradient>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#74C3EA" />
          <stop offset="100%" stopColor="#2A79B2" />
        </linearGradient>
        <linearGradient id={`${id}-pipe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9CC2DE" />
          <stop offset="30%" stopColor="#3C7BA8" />
          <stop offset="70%" stopColor="#1F4F78" />
          <stop offset="100%" stopColor="#2B6390" />
        </linearGradient>
        <linearGradient id={`${id}-tank`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9FB9CD" />
          <stop offset="40%" stopColor="#BACDDC" />
          <stop offset="100%" stopColor="#8EA9BF" />
        </linearGradient>
      </defs>

      {/* wall + window band */}
      <rect width="300" height="180" fill={`url(#${id}-wall)`} />
      <rect x="4" y="10" width="112" height="60" rx="2" fill="#EBF4FB" opacity="0.9" />
      <g stroke="#A3BACB" strokeWidth="2">
        <line x1="41" y1="10" x2="41" y2="70" />
        <line x1="78" y1="10" x2="78" y2="70" />
        <line x1="4" y1="40" x2="116" y2="40" />
      </g>

      {/* cylindrical tanks behind the walkway */}
      <g>
        <rect x="150" y="34" width="40" height="52" rx="3" fill={`url(#${id}-tank)`} />
        <ellipse cx="170" cy="34" rx="20" ry="5.5" fill="#CFDDE8" />
        <rect x="204" y="26" width="34" height="60" rx="3" fill={`url(#${id}-tank)`} />
        <ellipse cx="221" cy="26" rx="17" ry="5" fill="#CFDDE8" />
        <rect x="252" y="40" width="38" height="46" rx="3" fill={`url(#${id}-tank)`} />
        <ellipse cx="271" cy="40" rx="19" ry="5" fill="#CFDDE8" />
      </g>

      {/* water channel */}
      <path d="M0 100 L300 86 L300 180 L0 180 Z" fill={`url(#${id}-water)`} />
      <g fill="#A9DDF4" opacity="0.5">
        <ellipse cx="64" cy="138" rx="44" ry="7" />
        <ellipse cx="186" cy="156" rx="54" ry="8" />
        <ellipse cx="256" cy="122" rx="34" ry="6" />
      </g>

      {/* foreground pipe run with flanges */}
      <g transform="rotate(-2.6 150 82)">
        <rect x="-8" y="70" width="316" height="24" rx="12" fill={`url(#${id}-pipe)`} />
        <rect x="-8" y="73" width="316" height="4" rx="2" fill="#C6DCEC" opacity="0.5" />
        <g fill="#1B4468">
          <rect x="46" y="66" width="9" height="32" rx="2" />
          <rect x="150" y="66" width="9" height="32" rx="2" />
          <rect x="250" y="66" width="9" height="32" rx="2" />
        </g>
      </g>
      <g transform="rotate(-2.6 150 106)">
        <rect x="-8" y="100" width="316" height="13" rx="6.5" fill="#2D6893" />
        <rect x="-8" y="102" width="316" height="3" rx="1.5" fill="#B9D3E6" opacity="0.45" />
      </g>

      {/* vertical risers into the channel */}
      <g fill="#25567F">
        <rect x="60" y="92" width="11" height="34" rx="3" />
        <rect x="196" y="90" width="11" height="40" rx="3" />
      </g>

      {/* discharge into the water */}
      <path d="M108 96 q 7 24 3 42 q -1 8 -3 13 h -14 q 3 -25 4 -35 q 1 -12 -1 -20 Z" fill="#EDF9FE" opacity="0.92" />
      <ellipse cx="101" cy="153" rx="21" ry="6" fill="#DDF1FC" opacity="0.8" />
    </svg>
  )
}
