import { UserPlus } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { PanelHeader } from './parts'
import { teamMembers } from '../../data/mockData'

export default function TeamSection({ section }) {
  return (
    <>
      <PanelHeader title={section.label} blurb={section.blurb} />

      <div className="px-[22px] py-[20px]">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] leading-[18px] text-ink-soft">
            {teamMembers.length} people have access to this portal.
          </p>
          <Button>
            <UserPlus size={15} strokeWidth={2.2} />
            Invite member
          </Button>
        </div>

        <div className="mt-[14px] overflow-hidden rounded-[10px] border border-line">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '38%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '21%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-line bg-[#F7F9FC]">
                {['Member', 'Role', 'Status', ''].map((h, i) => (
                  <th
                    key={h || i}
                    className={`px-[14px] py-[12px] text-[12.5px] font-medium leading-4 text-ink-soft ${
                      i === 3 ? 'text-right' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m.key} className="border-b border-line last:border-0">
                  <td className="px-[14px] py-[12px]">
                    <span className="flex items-center gap-[11px]">
                      <Avatar size={32} />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium leading-[18px] text-ink">{m.name}</span>
                        <span className="block truncate text-[12px] leading-4 text-ink-muted">{m.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-[14px] py-[12px] text-[13px] leading-[18px] text-ink">{m.role}</td>
                  <td className="px-[14px] py-[12px]">
                    <StatusPill tone={statusTone(m.status)}>{m.status}</StatusPill>
                  </td>
                  <td className="px-[14px] py-[12px] text-right">
                    <button type="button" className="text-[12.5px] font-semibold leading-4 text-brand-link hover:underline">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
