import { ico } from '../ui/Ico'
import TeamIcon from '../ui/TeamIcon'
import StatusPill, { statusTone } from '../ui/StatusPill'

const PencilIcon = ico('fluent:edit-24-filled')
const TrashIcon = ico('fluent:delete-24-filled')
const LockIcon = ico('fluent:lock-closed-24-filled')
const CalendarIcon = ico('fluent:calendar-32-filled')

export default function RoleCard({ role, onEdit, onDelete, onViewUsers }: any) {
  return (
    <div className="rounded-[12px] border border-line bg-white p-[16px] shadow-card">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex min-w-0 items-center gap-[9px]">
          <h4 className="truncate text-[14.5px] font-bold leading-5 text-ink">{role.name}</h4>
          <StatusPill tone={statusTone(role.status)}>{role.status}</StatusPill>
        </div>

        <div className="flex shrink-0 items-center gap-[10px]">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${role.name}`}
            className="text-brand transition-colors hover:text-[#1259C7]"
          >
            <PencilIcon size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${role.name}`}
            className="text-danger transition-colors hover:text-[#C8353A]"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      </div>

      <p className="mt-[10px] text-[13px] leading-[19px] text-ink-soft">{role.description}</p>

      <div className="mt-[13px] flex items-center gap-[18px] text-[12.5px] leading-4 text-ink-soft">
        <span className="flex items-center gap-[6px]">
          <TeamIcon size={15} className="text-ink-muted" />
          {role.users} users
        </span>
        <span className="flex items-center gap-[6px]">
          <LockIcon size={14} className="text-ink-muted" />
          {role.permissions} permissions
        </span>
      </div>

      <div className="mt-[14px] flex items-center justify-between gap-[12px] border-t border-line pt-[12px]">
        <span className="flex items-center gap-[6px] text-[12px] leading-4 text-ink-soft">
          <CalendarIcon size={13} className="text-ink-muted" />
          Created on : <span className="font-medium text-ink">{role.createdOn}</span>
        </span>
        <button
          type="button"
          onClick={onViewUsers}
          className="text-[12.5px] font-semibold leading-4 text-brand-link underline underline-offset-[3px] hover:text-brand"
        >
          View Users
        </button>
      </div>
    </div>
  )
}
