import type { IconProps } from '../../types'

/** Figma sidebar glyph — inherits text color via currentColor fill. */
export default function FigmaNavIcon({
  src,
  size = 20,
  className = '',
}: IconProps & { src: string }) {
  return (
    <span
      role="img"
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}
