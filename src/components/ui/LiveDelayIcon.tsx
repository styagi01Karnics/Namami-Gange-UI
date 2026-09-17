import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

/** Live delay glyph from Iconify (`fluent:live-16-regular`). */
export default function LiveDelayIcon({ size = 20, className = '' }: IconProps) {
  return <Icon icon="fluent:live-16-regular" width={size} height={size} className={`shrink-0 ${className}`} />
}
