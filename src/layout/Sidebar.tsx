import { NavLink, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Logo from '../components/ui/Logo'
import SettingsIcon from '../components/ui/SettingsIcon'
import { MENU_ITEMS, REPORT_ITEMS, type MenuItem } from '../routes'

const NAV_ITEMS: MenuItem[] = [
  ...MENU_ITEMS,
  ...REPORT_ITEMS,
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
]

const ICON_SIZE = 24

const itemClass = (isActive: boolean, collapsed: boolean) =>
  [
    'group ml-3 mr-0 flex shrink-0 items-center gap-[13px] rounded-l-[10px] rounded-r-none py-[11px] transition-colors',
    collapsed ? 'justify-center px-0' : 'px-3',
    isActive
      ? 'bg-[#003C7A] text-white'
      : 'text-[#003C7A] hover:bg-white/75',
  ].join(' ')

const labelClass = 'min-w-0 flex-1 truncate text-left text-[15px] font-semibold leading-5'

/**
 * A section stays lit for its own sub-pages too — `match` widens that to a
 * whole path prefix, for entries whose sections are tabs on other routes.
 */
const isItemActive = (item: MenuItem, pathname: string) =>
  item.match ? pathname.startsWith(item.match) : pathname === item.path || pathname.startsWith(`${item.path}/`)

function NavItem({ item, collapsed, pathname }: { item: MenuItem; collapsed: boolean; pathname: string }) {
  const Icon = item.icon
  const active = isItemActive(item, pathname)

  return (
    <NavLink to={item.path} title={collapsed ? item.label : undefined} className={itemClass(active, collapsed)}>
      <Icon
        size={ICON_SIZE}
        strokeWidth={active ? 2.2 : 1.9}
        className={active ? 'text-white' : 'text-[#003C7A]'}
      />
      {!collapsed && <span className={labelClass}>{item.label}</span>}
    </NavLink>
  )
}

export default function Sidebar({ collapsed, onToggleCollapse }: { collapsed: boolean; onToggleCollapse: () => void }) {
  const { pathname } = useLocation()

  return (
    <aside
      className={`relative z-20 flex h-full min-h-0 shrink-0 flex-col bg-canvas transition-[width] duration-200 ${
        collapsed ? 'w-[82px]' : 'w-[280px]'
      }`}
    >
      {/* Pin the river art to the bottom so short Windows viewports keep the
          nav on the pale sky instead of cropping onto the illustration. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-canvas">
        <img
          src="/sidebarbg.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full max-w-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-45"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F3FAFD 36.91%, #9EE2FF 100%)',
          }}
        />
      </div>

      <div className={`relative flex items-center justify-center ${collapsed ? 'px-2 pb-5 pt-6' : 'px-4 pb-6 pt-6'}`}>
        <Logo compact={collapsed} sidebar={!collapsed} />
      </div>

      <div className="relative mx-6 border-t border-white/70" />

      <nav className="scroll-thin relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-4 pt-4">
        <div className="space-y-[3px]">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.id} item={item} pathname={pathname} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute right-[-13px] top-[42px] flex h-[26px] w-[26px] items-center justify-center rounded-full border border-line bg-white text-[#5B6B7F] shadow-card transition-colors hover:text-brand"
      >
        <ChevronLeft size={15} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  )
}
