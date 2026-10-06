import FigmaNavIcon from './FigmaNavIcon'
import type { IconProps } from '../../types'

/** Figma settings gear — Settings (sidebar). */
export default function SettingsIcon({ size = 20, className = '' }: IconProps) {
  return <FigmaNavIcon src="/dashboard/icons/nav-settings.svg" size={size} className={className} />
}
