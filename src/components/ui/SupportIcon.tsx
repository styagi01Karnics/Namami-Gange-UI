import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

/** Support glyph from Iconify (`fluent:person-support-16-filled`). */
export default function SupportIcon({ size = 20, className = '' }: IconProps) {
  return <Icon icon="fluent:person-support-16-filled" width={size} height={size} className={`shrink-0 ${className}`} />
}
