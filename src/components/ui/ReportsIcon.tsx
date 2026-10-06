import FigmaNavIcon from './FigmaNavIcon'
import type { IconProps } from '../../types'

/** Figma document icon — Data Reports. */
export default function ReportsIcon({ size = 20, className = '' }: IconProps) {
  return <FigmaNavIcon src="/dashboard/icons/nav-reports.svg" size={size} className={className} />
}
