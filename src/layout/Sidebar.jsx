import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Settings, ChevronLeft, ChevronDown } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { MENU_ITEMS, REPORT_ITEMS } from '../routes'

function SectionLabel({ children }) {
  return (
    <p className="px-6 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.09em] text-label">
      {children}
    </p>
  )
}

const itemClass = (isActive, collapsed) =>
  [
    'group mx-3 flex w-[calc(100%-24px)] items-center gap-3 rounded-[9px] py-[10px] transition-colors',
    collapsed ? 'justify-center px-0' : 'px-3',
    isActive
      ? 'bg-brand text-white shadow-[0_2px_8px_rgba(22,104,227,0.28)]'
      : 'text-ink-soft hover:bg-brand-soft/70 hover:text-brand',
  ].join(' ')

function NavItem({ item, collapsed, expanded, onToggle, pathname }) {
  const Icon = item.icon

  if (item.children) {
    const childActive = item.children.some((c) => c.path === pathname)
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggle(item.id)}
          title={collapsed ? item.label : undefined}
          className={itemClass(childActive, collapsed)}
        >
          <Icon size={18} strokeWidth={childActive ? 2.2 : 1.9} className={childActive ? 'text-white' : 'text-[#5B6B7F] group-hover:text-brand'} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left text-[14px] font-medium leading-5">{item.label}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${expanded ? 'rotate-180' : ''} ${childActive ? 'text-white' : 'text-[#8B99AA]'}`}
              />
            </>
          )}
        </button>

        {expanded && !collapsed && (
          <div className="relative mb-1 mt-[6px] space-y-[2px] pl-[26px] pr-3">
            <span className="absolute bottom-[6px] left-[21px] top-[4px] w-px bg-line" />
            {item.children.map((child) => (
              <NavLink
                key={child.id}
                to={child.path}
                className={({ isActive }) =>
                  `block w-full rounded-[8px] px-[14px] py-[9px] text-left text-[13px] leading-4 transition-colors ${
                    isActive
                      ? 'bg-[#EEF2F8] font-semibold text-ink'
                      : 'text-ink-soft hover:bg-[#F4F7FB] hover:text-brand'
                  }`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink to={item.path} title={collapsed ? item.label : undefined} className={({ isActive }) => itemClass(isActive, collapsed)}>
      {({ isActive }) => (
        <>
          <Icon size={18} strokeWidth={isActive ? 2.2 : 1.9} className={isActive ? 'text-white' : 'text-[#5B6B7F] group-hover:text-brand'} />
          {!collapsed && <span className="flex-1 text-left text-[14px] font-medium leading-5">{item.label}</span>}
        </>
      )}
    </NavLink>
  )
}

const groupOwning = (pathname) =>
  REPORT_ITEMS.find((i) => i.children?.some((c) => c.path === pathname))?.id ?? null

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { pathname } = useLocation()
  const [openGroup, setOpenGroup] = useState(() => groupOwning(pathname))
  const toggleGroup = (id) => setOpenGroup((prev) => (prev === id ? null : id))

  // follow navigation into a group (e.g. via a link elsewhere in the app)
  const owning = groupOwning(pathname)
  const [lastOwning, setLastOwning] = useState(owning)
  if (owning && owning !== lastOwning) {
    setLastOwning(owning)
    setOpenGroup(owning)
  }

  return (
    <aside
      className={`relative z-20 flex h-full shrink-0 flex-col bg-white transition-[width] duration-200 ${
        collapsed ? 'w-[82px]' : 'w-[250px]'
      }`}
    >
      <div className={`flex items-center justify-center ${collapsed ? 'px-3 pb-5 pt-6' : 'px-6 pb-6 pt-6'}`}>
        <Logo compact={collapsed} />
      </div>

      <div className="mx-6 border-t border-line" />

      <nav className="scroll-thin flex-1 overflow-y-auto pb-4">
        {collapsed ? <div className="h-4" /> : <SectionLabel>Menu</SectionLabel>}
        <div className="space-y-[3px]">
          {MENU_ITEMS.map((item) => (
            <NavItem key={item.id} item={item} pathname={pathname} collapsed={collapsed} expanded={openGroup === item.id} onToggle={toggleGroup} />
          ))}
        </div>

        {collapsed ? <div className="mx-4 my-4 border-t border-line" /> : <SectionLabel>Reports</SectionLabel>}
        <div className="space-y-[3px]">
          {REPORT_ITEMS.map((item) => (
            <NavItem key={item.id} item={item} pathname={pathname} collapsed={collapsed} expanded={openGroup === item.id} onToggle={toggleGroup} />
          ))}
        </div>

        <div className={`my-4 border-t border-line ${collapsed ? 'mx-4' : 'mx-6'}`} />

        <NavItem
          item={{ id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }}
          pathname={pathname}
          collapsed={collapsed}
          expanded={false}
          onToggle={() => {}}
        />
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
