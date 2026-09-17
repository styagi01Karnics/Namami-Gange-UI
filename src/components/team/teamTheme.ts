import { ico } from '../ui/Ico'
import TeamIcon from '../ui/TeamIcon'

/**
 * One accent colour per Team Management tab, driving the tab pill and the
 * heading tile beneath it — same idea as STP Management's section theme.
 */
export const TEAM_THEME = {
  'User Management': {
    color: '#2563EB',
    icon: TeamIcon,
    blurb: 'Manage user accounts, roles, access, and verification details',
  },
  'Role Management': {
    color: '#7C3AED',
    icon: ico('fluent:person-board-32-filled'),
    blurb: 'Define roles, permissions, and access levels for different users.',
  },
  'Audit Logs': {
    color: '#EA580C',
    icon: ico('fluent:history-24-filled'),
    blurb: 'Track all team management activities, role changes, and member updates for complete accountability',
  },
}

export const teamTheme = (tab: string) => TEAM_THEME[tab] ?? TEAM_THEME['User Management']

/** Accent at a given opacity, as an 8-digit hex suffix. */
export const tint = (color: string, alpha: number) =>
  `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase()}`

/** Role and action labels carry a pill tone of their own. */
export const ROLE_TONE = {
  'Super Admin': 'ok',
  'Content Manager': 'violet',
  Vendor: 'warn',
  'Field Volunteer': 'brand',
  Viewer: 'slate',
}

export const ACTION_TONE = {
  'Role Updated': 'violet',
  'User Removed': 'danger',
  'Status Change': 'warn',
  'Member Added': 'ok',
}
