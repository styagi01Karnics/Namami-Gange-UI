/**
 * Water-tank illustration for inlet / outlet flow cards.
 * Uses Figma tank artwork; pipe/tap icons overlap the tank edges at the water line.
 */
export default function FlowBeaker({ variant = 'inlet', percent = 78.5, id = 'beaker' }) {
  const tankSrc = variant === 'inlet' ? '/inlet-tank.png' : '/outlet-tank.png'
  const iconSrc = variant === 'inlet' ? '/inlet-flow.png' : '/outlet-flow.png'

  // Measured water surface in tank PNGs (from top of artwork).
  const waterLinePct = variant === 'inlet' ? 29.5 : 35.8

  return (
    <div className="relative h-[168px] w-[148px] shrink-0" data-beaker={id}>
      {/* Tank sits centered with side gutters so icons can overlap the rim */}
      <img
        src={tankSrc}
        alt=""
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[112px] -translate-x-1/2 object-contain"
        draggable={false}
      />

      {variant === 'inlet' ? (
        /* Pipe overlaps left tank rim; raised and larger so the stream pours from above the water line */
        <img
          src={iconSrc}
          alt=""
          className="pointer-events-none absolute left-0 w-[74px]"
          style={{
            top: `${waterLinePct}%`,
            transform: 'translateY(-42%)',
          }}
          draggable={false}
        />
      ) : (
        /* Tap sits on the right rim so the spout touches the cylinder */
        <img
          src={iconSrc}
          alt=""
          className="pointer-events-none absolute right-[-24px] w-[50px]"
          style={{
            top: `${waterLinePct}%`,
            transform: 'translateY(-52%)',
          }}
          draggable={false}
        />
      )}

      <span className="pointer-events-none absolute bottom-[30px] left-1/2 -translate-x-1/2 text-[13.5px] font-bold leading-none text-white">
        {percent}%
      </span>
    </div>
  )
}
