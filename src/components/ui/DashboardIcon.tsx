import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

/** Dashboard grid glyph from Iconify (`bi:grid-fill`). */
export default function DashboardIcon({ size = 20, className = '' }: IconProps) {
  return <Icon icon="bi:grid-fill" width={size} height={size} className={`shrink-0 ${className}`} />
}
