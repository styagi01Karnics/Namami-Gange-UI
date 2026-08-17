import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import logo from '@/assets/dashboard/logo.png'
import gridIcon from '@/assets/dashboard/grid.svg'
import chevronIcon from '@/assets/dashboard/sidebar-chevron.svg'
import chevronDown from '@/assets/dashboard/chevron-down.svg'
import docListIcon from '@/assets/dashboard/icon-doc-list.svg'
import manpowerIcon from '@/assets/dashboard/icon-manpower.svg'
import cameraIcon from '@/assets/dashboard/icon-camera.svg'
import boxIcon from '@/assets/dashboard/icon-box.svg'
import liveIcon from '@/assets/dashboard/icon-live.svg'
import documentIcon from '@/assets/dashboard/icon-document.svg'
import documentActiveIcon from '@/assets/shared/icon-document-active.svg'
import personIcon from '@/assets/dashboard/icon-person.svg'
import personActiveIcon from '@/assets/remote-calibration/icon-person-active.svg'
import historyIcon from '@/assets/dashboard/icon-history.svg'
import historyActiveIcon from '@/assets/transaction-logs/icon-history-active.svg'
import settingsIcon from '@/assets/dashboard/icon-settings.svg'
import settingsActiveIcon from '@/assets/settings/icon-settings-active.svg'
import collapseIcon from '@/assets/dashboard/collapse-chevron.svg'

type SidebarProps = {
  collapsed?: boolean
  onToggle?: () => void
}

const stpChildren = [
  { label: 'Summary', to: '/summary' },
  { label: 'Current Parameters', to: '/current-parameter' },
  { label: 'STP Listing', to: '/stp-listing' },
  { label: 'Geographical View', to: '/geographical-view' },
]

const contractChildren = [
  { label: 'Contracts', to: '/contracts' },
  { label: 'Penalty Engine', to: '/penalty-engine' },
  { label: 'Compliance Status', to: '/compliance-status' },
  { label: 'Violation Tracking', to: '/violation-tracking' },
  { label: 'Compliance Report', to: '/compliance-report' },
]

const dataReportChildren = [
  { label: 'Readings', to: '/data-reports/readings' },
  { label: 'Monthly, Quarterly, Yearly', to: '/data-reports/periodic' },
  { label: 'Exceedance', to: '/data-reports/exceedance' },
  { label: 'Data Availability', to: '/data-reports/availability' },
  { label: 'Totalized', to: '/data-reports/totalized' },
]

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation()
  const stpActive = stpChildren.some((c) => location.pathname.startsWith(c.to))
  const contractActive = contractChildren.some((c) => location.pathname.startsWith(c.to))
  const dataReportsActive = dataReportChildren.some((c) =>
    location.pathname.startsWith(c.to),
  )
  const settingsActive = location.pathname.startsWith('/settings')

  if (collapsed) {
    return (
      <aside className="relative flex h-full w-[92px] flex-col items-start gap-[24px] border-r border-[rgba(0,0,0,0.1)] bg-white px-[24px] py-[16px]">
        <div className="h-[48px] w-[44px] overflow-hidden">
          <img alt="Namami Gange" className="size-full object-contain" src={logo} />
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-[34px] right-[-15px] rounded-[8px] border border-[#f6f6f6] bg-white p-[6px]"
        >
          <img alt="" className="size-[16px] rotate-[-90deg]" src={collapseIcon} />
        </button>
      </aside>
    )
  }

  return (
    <aside
      className="relative flex h-full w-[256px] shrink-0 flex-col items-start gap-[24px] overflow-y-auto border-r border-[rgba(0,0,0,0.1)] bg-white px-[24px] py-[16px]"
      data-node-id="273:2830"
    >
      <div className="relative h-[88px] w-[174px] shrink-0">
        <img
          alt="Namami Gange"
          className="absolute inset-0 size-full max-w-none object-cover"
          src={logo}
        />
      </div>
      <div className="h-[2px] w-full rounded-[2px] bg-[#f6f6f6]" />

      <nav className="flex w-full flex-1 flex-col items-start gap-[12px]">
        <div className="w-full px-[12px]">
          <p className="text-[12px] font-[590] tracking-[0.4px] text-[#f7941d] uppercase">
            MENU
          </p>
        </div>

        <DropdownNav
          label="STP Monitoring"
          icon={gridIcon}
          active={stpActive}
          childrenItems={stpChildren}
          pathname={location.pathname}
        />

        <DropdownNav
          label="Contract & Compliance"
          icon={docListIcon}
          active={contractActive}
          childrenItems={contractChildren}
          pathname={location.pathname}
        />
        <NavItem to="/manpower" icon={manpowerIcon} label="Manpower" />
        <NavItem to="/cctv" icon={cameraIcon} label="CCTV Monitoring" />
        <NavItem to="/inventory" icon={boxIcon} label="Inventory" />

        <div className="w-full px-[12px]">
          <p className="text-[12px] font-[590] tracking-[0.4px] text-[#f7941d] uppercase">
            Reports
          </p>
        </div>

        <NavItem to="/live-status" icon={liveIcon} label="Live Status" />

        <DropdownNav
          label="Data Reports"
          icon={dataReportsActive ? documentActiveIcon : documentIcon}
          active={dataReportsActive}
          childrenItems={dataReportChildren}
          pathname={location.pathname}
        />

        <NavItem
          to="/remote-calibration"
          icon={
            location.pathname.startsWith('/remote-calibration')
              ? personActiveIcon
              : personIcon
          }
          label="Remote Calibration"
          forceActive={location.pathname.startsWith('/remote-calibration')}
        />
        <NavItem
          to="/transaction-logs"
          icon={
            location.pathname.startsWith('/transaction-logs')
              ? historyActiveIcon
              : historyIcon
          }
          label="Transaction Logs"
          forceActive={location.pathname.startsWith('/transaction-logs')}
        />
      </nav>

      <div className="h-[2px] w-full rounded-[2px] bg-[#f6f6f6]" />
      <NavItem
        to="/settings/users"
        icon={settingsActive ? settingsActiveIcon : settingsIcon}
        label="Settings"
        forceActive={settingsActive}
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute top-[34px] right-[-15px] cursor-pointer rounded-[8px] border border-[#f6f6f6] bg-white p-[6px]"
      >
        <img alt="" className="size-[16px] rotate-90" src={collapseIcon} />
      </button>
    </aside>
  )
}

function DropdownNav({
  label,
  icon,
  active,
  childrenItems,
  pathname,
}: {
  label: string
  icon: string
  active: boolean
  childrenItems: { label: string; to: string }[]
  pathname: string
}) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(active)

  useEffect(() => {
    if (active) setOpen(true)
  }, [active])

  const handleParentClick = () => {
    if (!open) {
      setOpen(true)
      navigate(childrenItems[0].to)
      return
    }
    setOpen(false)
  }

  return (
    <div className="flex w-full flex-col items-end gap-[12px]">
      <button
        type="button"
        onClick={handleParentClick}
        className={clsx(
          'flex w-full cursor-pointer items-center gap-[12px] rounded-[8px] border-0 px-[12px] py-[10px] text-left',
          active ? 'bg-[#0768d2]' : 'bg-transparent',
        )}
      >
        <div className="relative size-[20px] overflow-hidden">
          <img
            alt=""
            className="absolute top-1/2 left-1/2 h-[16px] w-[12px] -translate-x-1/2 -translate-y-1/2"
            src={icon}
          />
        </div>
        <p
          className={clsx(
            'flex-1 text-[14px] font-[590] tracking-[-0.28px]',
            active ? 'text-white' : 'text-[#0768d2]',
          )}
        >
          {label}
        </p>
        <img
          alt=""
          className={clsx('size-[16px]', open && 'rotate-180')}
          src={active ? chevronIcon : chevronDown}
        />
      </button>

      {open ? (
        <div className="relative flex w-[172px] flex-col items-start gap-[4px]">
          <div className="absolute top-0 bottom-[10%] left-[-13px] w-[2px] bg-[#f7f8fa]" />
          {childrenItems.map((item) => {
            const itemActive = pathname === item.to
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={clsx(
                  'relative flex w-[172px] items-center gap-[12px] rounded-[8px] px-[12px] py-[8px]',
                  itemActive ? 'bg-[#edf3fd]' : '',
                )}
              >
                <span
                  className={clsx(
                    'flex-1 text-[12px] tracking-[-0.24px]',
                    itemActive
                      ? 'font-[590] text-[#07121e]'
                      : 'font-[510] text-[#646464]',
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function NavItem({
  to,
  icon,
  label,
  chevron,
  forceActive,
}: {
  to: string
  icon: string
  label: string
  chevron?: boolean
  forceActive?: boolean
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex w-full items-center gap-[12px] rounded-[8px] px-[12px] py-[10px] text-left',
          isActive || forceActive ? 'bg-[#0768d2]' : 'bg-white',
        )
      }
    >
      {({ isActive }) => {
        const on = isActive || !!forceActive
        return (
          <>
            <div className="relative size-[20px] overflow-hidden">
              <img
                alt=""
                className="absolute top-1/2 left-1/2 max-h-[16px] max-w-[16px] -translate-x-1/2 -translate-y-1/2"
                src={icon}
              />
            </div>
            <span
              className={clsx(
                'flex-1 text-[14px] tracking-[-0.28px]',
                on ? 'font-[590] text-white' : 'font-[510] text-[#0768d2]',
              )}
            >
              {label}
            </span>
            {chevron ? <img alt="" className="size-[16px]" src={chevronDown} /> : null}
          </>
        )
      }}
    </NavLink>
  )
}
