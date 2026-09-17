import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

/** Team management glyph from Iconify (`heroicons:users-solid`). */
export default function TeamIcon({ size = 20, className = '' }: IconProps) {
  return <Icon icon="heroicons:users-solid" width={size} height={size} className={`shrink-0 ${className}`} />
}
