import FigmaNavIcon from './FigmaNavIcon'
import type { IconProps } from '../../types'

/** Figma camera icon — Live Camera Feed. */
export default function CctvIcon({ size = 20, className = '' }: IconProps) {
  return <FigmaNavIcon src="/dashboard/icons/nav-cctv.svg" size={size} className={className} />
}
