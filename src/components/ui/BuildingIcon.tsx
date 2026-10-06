import FigmaNavIcon from './FigmaNavIcon'
import type { IconProps } from '../../types'

/** Figma Building icon — STP Management. */
export default function BuildingIcon({ size = 20, className = '' }: IconProps) {
  return <FigmaNavIcon src="/dashboard/icons/nav-stp.svg" size={size} className={className} />
}
