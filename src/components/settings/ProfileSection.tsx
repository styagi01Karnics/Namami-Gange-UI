import { useState } from 'react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Field from '../ui/Field'
import { PanelFooter, PanelHeader } from './parts'
import { settingsProfile } from '../../data/mockData'

export default function ProfileSection({ section }) {
  const [form, setForm] = useState(settingsProfile)
  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <>
      <PanelHeader title={section.label} blurb={section.blurb} />

      <div className="px-[22px] py-[20px]">
        <div className="flex items-center gap-[16px]">
          <Avatar size={64} />
          <div>
            <p className="text-[13.5px] font-semibold leading-5 text-ink">Profile photo</p>
            <p className="mt-[3px] text-[12px] leading-4 text-ink-muted">PNG or JPG, up to 2 MB.</p>
            <div className="mt-[10px] flex gap-[8px]">
              <Button variant="outline" className="h-[32px] px-[13px]">Change photo</Button>
              <Button variant="ghost" className="h-[32px] px-[13px]">Remove</Button>
            </div>
          </div>
        </div>

        <div className="mt-[22px] grid grid-cols-2 gap-x-[18px] gap-y-[16px]">
          <Field label="Full name" value={form.name} onChange={set('name')} />
          <Field label="Designation" value={form.designation} onChange={set('designation')} />
          <Field label="Email address" type="email" value={form.email} onChange={set('email')} />
          <Field label="Phone number" value={form.phone} onChange={set('phone')} />
          <Field label="Employee ID" value={form.employeeId} onChange={set('employeeId')} hint="Issued by the regional office; read-only in production." />
          <Field label="Reporting office" value={form.office} onChange={set('office')} />
        </div>
      </div>

      <PanelFooter>
        <Button variant="ghost" onClick={() => setForm(settingsProfile)}>Cancel</Button>
        <Button>Save changes</Button>
      </PanelFooter>
    </>
  )
}
