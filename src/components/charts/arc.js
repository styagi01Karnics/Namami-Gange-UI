// Small SVG arc helpers shared by the gauge + nested donut.
// Angles are degrees, measured clockwise from 12 o'clock.

export const polar = (cx, cy, r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function arcPath(cx, cy, r, startDeg, endDeg) {
  const sweep = endDeg - startDeg
  if (Math.abs(sweep) < 0.01) return ''
  // a stroked circle can't be a single arc, so split anything >= 360 in half
  if (Math.abs(sweep) >= 359.99) {
    const mid = startDeg + sweep / 2
    return `${arcPath(cx, cy, r, startDeg, mid)} ${arcPath(cx, cy, r, mid, endDeg)}`
  }
  const start = polar(cx, cy, r, startDeg)
  const end = polar(cx, cy, r, endDeg)
  const largeArc = Math.abs(sweep) > 180 ? 1 : 0
  const dir = sweep > 0 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${dir} ${end.x} ${end.y}`
}
