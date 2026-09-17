import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

/** Security camera glyph from Iconify (`at-icons:security-camera`). */
export default function CctvIcon({ size = 20, className = '' }: IconProps) {
  return <Icon icon="at-icons:security-camera" width={size} height={size} className={`shrink-0 ${className}`} />
}
