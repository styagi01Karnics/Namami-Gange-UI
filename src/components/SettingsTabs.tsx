import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const tabs = [
  { label: 'User Management', to: '/settings/users' },
  { label: 'Role Management', to: '/settings/roles' },
  { label: 'System Preference', to: '/settings/system' },
]

export default function SettingsTabs() {
  return (
    <div className="flex items-center gap-[24px] px-[16px] pt-[22px]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            clsx(
              'rounded-[8px] px-[20px] py-[8px] text-[14px] text-center leading-[24px]',
              isActive ? 'bg-[#0768d2] font-[590] text-white' : 'bg-transparent font-[510] text-[#0768d2]',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  )
}
