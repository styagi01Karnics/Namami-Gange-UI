import { Icon } from '@iconify/react'
import type { IconProps } from '../../types'

type IcoProps = IconProps & { icon: string }

/** Iconify glyph with the same `size` / `className` API as the lucide icons. */
export default function Ico({ icon, size = 20, className = '' }: IcoProps) {
  return <Icon icon={icon} width={size} height={size} className={`shrink-0 ${className}`} />
}

/** Bind an Iconify name so it can be passed around as a component. */
export function ico(name: string) {
  function Bound({ size = 20, className = '' }: IconProps) {
    return <Ico icon={name} size={size} className={className} />
  }
  Bound.displayName = name
  return Bound
}
