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

const isItemActive = (item: MenuItem, pathname: string) =>
  item.match ? pathname.startsWith(item.match) : pathname === item.path || pathname.startsWith(`${item.path}/`)

function NavItem({
  item,
  collapsed,
  pathname,
  dashboard,
}: {
  item: MenuItem
  collapsed: boolean
  pathname: string
  dashboard: boolean
}) {
  const Icon = item.icon
  const active = isItemActive(item, pathname)

  if (dashboard) {
    return (
      <NavLink
        to={item.path}
        title={collapsed ? item.label : undefined}
        className={[
          'flex shrink-0 items-center gap-[12px] rounded-[8px] px-[8px] py-[10px] transition-colors',
          collapsed ? 'justify-center' : '',
          active ? 'bg-[#0648A8] text-white' : 'text-white hover:bg-white/10',
        ].join(' ')}
      >
        <Icon size={20} strokeWidth={active ? 2.2 : 1.9} className="shrink-0 text-white" />
        {!collapsed && (
          <span
            className={`min-w-0 flex-1 truncate text-left text-[16px] leading-5 ${
              active ? 'font-semibold' : 'font-medium'
            }`}
          >
            {item.label}
          </span>
        )}
      </NavLink>
    )
  }

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={[
        'group ml-3 mr-0 flex shrink-0 items-center gap-[13px] rounded-l-[10px] rounded-r-none py-[11px] transition-colors',
        collapsed ? 'justify-center px-0' : 'px-3',
        active ? 'bg-[#003C7A] text-white' : 'text-[#003C7A] hover:bg-white/75',
      ].join(' ')}
    >
      <Icon
        size={24}
        strokeWidth={active ? 2.2 : 1.9}
        className={active ? 'text-white' : 'text-[#003C7A]'}
      />
      {!collapsed && (
        <span className="min-w-0 flex-1 truncate text-left text-[15px] font-semibold leading-5">{item.label}</span>
      )}
    </NavLink>
  )
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  variant = 'default',
}: {
  collapsed: boolean
  onToggleCollapse: () => void
  variant?: 'default' | 'dashboard'
}) {
  const { pathname } = useLocation()
  const dashboard = variant === 'dashboard'

  if (dashboard) {
    return (
      <aside
        className={`relative z-10 flex h-full min-h-0 shrink-0 flex-col overflow-hidden rounded-tr-[12px] transition-[width] duration-200 ${
          collapsed ? 'w-[82px]' : 'w-[256px]'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-tr-[12px]">
          <img
            src="/dashboard/sidebar-mountains.png"
            alt=""
            aria-hidden="true"
            className="absolute left-[-17%] top-[-4%] h-[126%] w-[134%] max-w-none object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-tr-[12px]"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,23,51,0.6) 0%, rgba(11,44,77,0.6) 58.6%, rgba(255,255,255,0.55) 100%)',
            }}
          />
        </div>

        <nav
          className={`scroll-thin relative z-[1] min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-6 pt-[24px] ${
            collapsed ? 'px-2' : 'px-3'
          }`}
        >
          <div className="flex flex-col gap-[12px]">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.id} item={item} pathname={pathname} collapsed={collapsed} dashboard />
            ))}
          </div>
        </nav>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute right-[-13px] top-[24px] z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-line bg-white text-[#5B6B7F] shadow-card transition-colors hover:text-brand"
        >
          <ChevronLeft size={15} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>
    )
  }

  return (
    <aside
      className={`relative z-20 flex h-full min-h-0 shrink-0 flex-col bg-canvas transition-[width] duration-200 ${
        collapsed ? 'w-[82px]' : 'w-[280px]'
      }`}
    >
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
            <NavItem key={item.id} item={item} pathname={pathname} collapsed={collapsed} dashboard={false} />
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
