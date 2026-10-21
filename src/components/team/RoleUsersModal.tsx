import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Button from '../ui/Button'
import StatusPill, { statusTone } from '../ui/StatusPill'
import TeamIcon from '../ui/TeamIcon'
import { fetchRoleUsers, type RoleUser } from '../../api/roles'

type RoleUsersModalProps = {
  open: boolean
  role: { id: string; name: string } | null
  onClose: () => void
  onNavigateToUserManagement?: (roleName: string) => void
}

export default function RoleUsersModal({
  open,
  role,
  onClose,
  onNavigateToUserManagement,
}: RoleUsersModalProps) {
  const [users, setUsers] = useState<RoleUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !role?.id) {
      setUsers([])
      setError('')
      return
    }

    setLoading(true)
    setError('')
    fetchRoleUsers(role.id)
      .then((res) => {
        setUsers(res.users || [])
      })
      .catch((err) => {
        console.warn('Could not fetch users for role:', err)
        setError(err?.message || 'Failed to load users for this role.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [open, role?.id])

  if (!open || !role) return null

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 p-[20px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-users-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white shadow-pop"
      >
        <div className="flex items-center justify-between border-b border-line px-[22px] py-[18px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-brand-soft text-brand">
              <TeamIcon size={17} />
            </span>
            <div>
              <h2 id="role-users-title" className="text-[16px] font-extrabold leading-6 text-ink">
                Users with &ldquo;{role.name}&rdquo; Role
              </h2>
              <p className="text-[12px] text-ink-muted">
                {users.length} {users.length === 1 ? 'user' : 'users'} assigned
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] border border-line text-ink-soft hover:text-brand"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-[22px]">
          {loading ? (
            <div className="flex items-center justify-center py-[36px] text-[13px] text-ink-soft">
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Loading users...
            </div>
          ) : error ? (
            <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-[13px] text-red-600">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="py-[36px] text-center text-[13.5px] text-ink-muted">
              No users are currently assigned to this role.
            </div>
          ) : (
            <div className="divide-y divide-line overflow-hidden rounded-[10px] border border-line">
              {users.map((u) => (
                <div key={u.id || u.userId || u.email} className="flex items-center justify-between p-[12px]">
                  <div>
                    <div className="text-[13.5px] font-semibold text-ink">{u.name}</div>
                    <div className="text-[12px] text-ink-soft">{u.email}</div>
                  </div>
                  {u.status && <StatusPill tone={statusTone(u.status)}>{u.status}</StatusPill>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line bg-[#FAFBFD] px-[22px] py-[14px]">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {onNavigateToUserManagement && (
            <Button
              onClick={() => {
                onNavigateToUserManagement(role.name)
                onClose()
              }}
            >
              Filter in User Management
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
