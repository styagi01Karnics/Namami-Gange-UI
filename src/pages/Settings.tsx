import { useState } from 'react'
import SettingsIcon from '../components/ui/SettingsIcon'
import AlertGroup from '../components/settings/AlertGroup'
import { tint } from '../components/team/teamTheme'
import { settingsAlertGroups } from '../data/mockData'

const ACCENT = '#2563EB'

const INITIAL = Object.fromEntries(settingsAlertGroups.flatMap((g) => g.items.map((i) => [i.key, i.enabled])))

export default function Settings() {
  const [alerts, setAlerts] = useState(INITIAL)

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <div className="flex items-center gap-[11px]">
        <span
          className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: tint(ACCENT, 0.12), color: ACCENT }}
        >
          <SettingsIcon size={22} className="text-[#2563EB]" />
        </span>
        <div>
          <h2 className="text-[14.5px] font-bold leading-[19px] text-brand">Settings</h2>
          <p className="mt-[2px] text-[11.5px] leading-[15px] text-[#5E5E5E]">
            Manage your preferences and notification settings
          </p>
        </div>
      </div>

      <div className="space-y-[14px]">
        {settingsAlertGroups.map((group) => (
          <AlertGroup
            key={group.id}
            group={group}
            values={alerts}
            onToggle={(key, next) => setAlerts((prev) => ({ ...prev, [key]: next }))}
          />
        ))}
      </div>
    </div>
  )
}
