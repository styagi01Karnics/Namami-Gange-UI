import FigmaNavIcon from './FigmaNavIcon'
import type { IconProps } from '../../types'

/** Figma people icon — Team Management. */
export default function TeamIcon({ size = 20, className = '' }: IconProps) {
  return <FigmaNavIcon src="/dashboard/icons/nav-team.svg" size={size} className={className} />
}
