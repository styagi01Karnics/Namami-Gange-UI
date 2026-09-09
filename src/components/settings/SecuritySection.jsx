import { useState } from 'react'
import { Monitor } from 'lucide-react'
import Button from '../ui/Button'
import Field from '../ui/Field'
import Select from '../ui/Select'
import { GroupTitle, PanelHeader, ToggleRow } from './parts'
import { activeSessions, sessionTimeoutOptions } from '../../data/mockData'

export default function SecuritySection({ section }) {
  const [twoFactor, setTwoFactor] = useState(true)
  const [timeout, setTimeoutValue] = useState(sessionTimeoutOptions[1])

  return (
    <>
      <PanelHeader title={section.label} blurb={section.blurb} />

      <div className="px-[22px] py-[20px]">
        <GroupTitle>Change password</GroupTitle>
        <div className="mt-[12px] grid grid-cols-3 gap-[14px]">
          <Field label="Current password" type="password" placeholder="••••••••" />
          <Field label="New password" type="password" placeholder="••••••••" />
          <Field label="Confirm new password" type="password" placeholder="••••••••" />
        </div>
        <p className="mt-[10px] text-[12px] leading-[17px] text-ink-muted">
          At least 12 characters, with one number and one symbol.
        </p>
        <Button className="mt-[13px]">Update password</Button>

        <GroupTitle className="mt-[24px]">Access</GroupTitle>
        <div className="mt-[12px] space-y-[10px]">
          <ToggleRow
            label="Two-factor authentication"
            blurb="Require a one-time code from SMS on every new sign-in."
            checked={twoFactor}
            onChange={setTwoFactor}
          />
          <div className="flex flex-wrap items-center justify-between gap-[14px] rounded-[10px] border border-line bg-[#FAFCFE] px-[15px] py-[13px]">
            <span className="min-w-0">
              <span className="block text-[13px] font-medium leading-[18px] text-ink">Sign out after inactivity</span>
              <span className="mt-[3px] block text-[12px] leading-[17px] text-ink-muted">
                Applies to this account on every device.
              </span>
            </span>
            <Select options={sessionTimeoutOptions} value={timeout} onChange={setTimeoutValue} className="w-[142px]" align="right" />
          </div>
        </div>

        <GroupTitle className="mt-[24px]">Active sessions</GroupTitle>
        <div className="mt-[12px] overflow-hidden rounded-[10px] border border-line">
          {activeSessions.map((s, i) => (
            <div
              key={s.key}
              className={`flex items-center gap-[13px] px-[15px] py-[13px] ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[9px] bg-brand-soft">
                <Monitor size={16} strokeWidth={2} className="text-brand" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-[8px]">
                  <span className="text-[13px] font-medium leading-[18px] text-ink">{s.device}</span>
                  {s.current && (
                    <span className="rounded-full bg-ok-soft px-[8px] py-[2px] text-[11px] font-semibold leading-4 text-ok">
                      This device
                    </span>
                  )}
                </span>
                <span className="mt-[2px] block text-[12px] leading-4 text-ink-muted">
                  {s.location} · {s.lastActive}
                </span>
              </span>
              {!s.current && (
                <Button variant="danger" className="h-[30px] px-[12px]">Sign out</Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
