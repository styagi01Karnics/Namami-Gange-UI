import { useState } from 'react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Toggle from '../ui/Toggle'
import { GroupTitle, PanelFooter, PanelHeader, ToggleRow } from './parts'
import { digestTimeOptions, notificationAlerts, notificationChannels } from '../../data/mockData'

const asMap = (list) => Object.fromEntries(list.map((i) => [i.key, i.enabled]))

export default function NotificationsSection({ section }) {
  const [alerts, setAlerts] = useState(() => asMap(notificationAlerts))
  const [channels, setChannels] = useState(() => asMap(notificationChannels))
  const [digest, setDigest] = useState(true)
  const [digestTime, setDigestTime] = useState(digestTimeOptions[0])

  return (
    <>
      <PanelHeader title={section.label} blurb={section.blurb} />

      <div className="px-[22px] py-[20px]">
        <GroupTitle>Alert types</GroupTitle>
        <div className="mt-[12px] space-y-[10px]">
          {notificationAlerts.map((a) => (
            <ToggleRow
              key={a.key}
              label={a.label}
              blurb={a.blurb}
              checked={alerts[a.key]}
              onChange={(next) => setAlerts((prev) => ({ ...prev, [a.key]: next }))}
            />
          ))}
        </div>

        <GroupTitle className="mt-[24px]">Delivery channels</GroupTitle>
        <div className="mt-[12px] grid grid-cols-3 gap-[10px]">
          {notificationChannels.map((c) => (
            <div key={c.key} className="rounded-[10px] border border-line bg-[#FAFCFE] px-[15px] py-[13px]">
              <div className="flex items-center justify-between gap-[10px]">
                <span className="text-[13px] font-medium leading-[18px] text-ink">{c.label}</span>
                <Toggle
                  checked={channels[c.key]}
                  onChange={(next) => setChannels((prev) => ({ ...prev, [c.key]: next }))}
                  label={c.label}
                />
              </div>
              <p className="mt-[5px] truncate text-[12px] leading-4 text-ink-muted">{c.blurb}</p>
            </div>
          ))}
        </div>

        <GroupTitle className="mt-[24px]">Daily digest</GroupTitle>
        <div className="mt-[12px] flex flex-wrap items-center justify-between gap-[14px] rounded-[10px] border border-line bg-[#FAFCFE] px-[15px] py-[13px]">
          <span className="min-w-0">
            <span className="block text-[13px] font-medium leading-[18px] text-ink">Send a daily summary email</span>
            <span className="mt-[3px] block text-[12px] leading-[17px] text-ink-muted">
              Compliance, penalties, manpower and stock across all STP&rsquo;s.
            </span>
          </span>
          <div className="flex items-center gap-[12px]">
            <Select options={digestTimeOptions} value={digestTime} onChange={setDigestTime} className="w-[142px]" align="right" />
            <Toggle checked={digest} onChange={setDigest} label="Daily digest" />
          </div>
        </div>
      </div>

      <PanelFooter>
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </PanelFooter>
    </>
  )
}
