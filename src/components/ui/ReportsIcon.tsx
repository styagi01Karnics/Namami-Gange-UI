import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

/** Data reports glyph from Iconify (`famicons:document-sharp`). */
export default function ReportsIcon({ size = 20, className = '' }: IconProps) {
  return <Icon icon="famicons:document-sharp" width={size} height={size} className={`shrink-0 ${className}`} />
}
