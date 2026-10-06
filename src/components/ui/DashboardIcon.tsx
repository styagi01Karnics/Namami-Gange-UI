import FigmaNavIcon from './FigmaNavIcon'
import type { IconProps } from '../../types'

/** Figma Grid icon — Dashboard. */
export default function DashboardIcon({ size = 20, className = '' }: IconProps) {
  return <FigmaNavIcon src="/dashboard/icons/nav-dashboard.svg" size={size} className={className} />
}
