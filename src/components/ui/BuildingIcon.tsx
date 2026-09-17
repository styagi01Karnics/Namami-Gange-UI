import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

/** Building glyph from Iconify (`fluent:building-32-filled`). */
export default function BuildingIcon({ size = 18, className = '' }: IconProps) {
  return <Icon icon="fluent:building-32-filled" width={size} height={size} className={`shrink-0 ${className}`} />
}
