import FigmaNavIcon from './FigmaNavIcon'
import type { IconProps } from '../../types'

/** Figma support person icon — Support Tickets. */
export default function SupportIcon({ size = 20, className = '' }: IconProps) {
  return <FigmaNavIcon src="/dashboard/icons/nav-support.svg" size={size} className={className} />
}
