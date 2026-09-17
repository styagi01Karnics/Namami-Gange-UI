import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

/** Settings glyph from Iconify (`famicons:settings-sharp`). */
export default function SettingsIcon({ size = 20, className = '' }: IconProps) {
  return <Icon icon="famicons:settings-sharp" width={size} height={size} className={`shrink-0 ${className}`} />
}
