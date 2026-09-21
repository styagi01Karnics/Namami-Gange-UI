import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, ChevronRight, LogOut } from 'lucide-react'
import { ico } from '../components/ui/Ico'
import { useAuth } from '../auth/AuthContext'
import LogoutModal from '../components/auth/LogoutModal'
import NotificationsModal from '../components/notifications/NotificationsModal'
import ChangePasswordModal from '../components/settings/ChangePasswordModal'
import PasswordUpdatedModal from '../components/settings/PasswordUpdatedModal'
import ProfileModal from '../components/settings/ProfileModal'
import { currentUser, inboxNotifications } from '../data/mockData'
import type { PageTitle, TitleCrumb } from '../types'

const UserIcon = ico('fluent:person-32-filled')
const LockIcon = ico('fluent:lock-closed-24-filled')

function Avatar() {
  return (
    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#DCEAFB] ring-2 ring-white">
      <svg viewBox="0 0 36 36" className="h-9 w-9">
        <circle cx="18" cy="18" r="18" fill="#DCEAFB" />
        <circle cx="18" cy="14" r="5.4" fill="#F0C9A4" />
        <path d="M18 20.5c-5.2 0-9.2 3-9.6 7.4A18 18 0 0 0 18 36c3.7 0 7.1-1.1 9.6-3.1-.4-4.4-4.4-8.4-9.6-8.4Z" fill="#2F5D8C" />
        <path d="M12.4 12.2c0-3.1 2.5-5.6 5.6-5.6s5.6 2.5 5.6 5.6l-1.6.6c-.7-2-2.3-3-4-3s-3.3 1-4 3l-1.6-.6Z" fill="#2C3644" />
      </svg>
    </span>
  )
}

export default function Topbar({ title = 'Dashboard' }: { title?: PageTitle }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [updatedOpen, setUpdatedOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(
    () => inboxNotifications.filter((item) => !item.read).length,
  )

  useEffect(() => {
    if (!menuOpen) return undefined
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!notificationsOpen) return undefined
    const onDoc = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotificationsOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [notificationsOpen])

  const confirmLogout = () => {
    logout()
    setLogoutOpen(false)
    navigate('/login', { replace: true })
  }

  const openProfile = () => {
    setMenuOpen(false)
    setProfileOpen(true)
  }

  const openPassword = () => {
    setMenuOpen(false)
    setPasswordOpen(true)
  }

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between pr-1">
      <nav aria-label="Breadcrumb" className="flex items-center gap-[8px]">
        {(Array.isArray(title) ? title : [title]).map((crumb: TitleCrumb, i, all) => {
          const { label, to } = typeof crumb === 'string' ? { label: crumb, to: null } : crumb
          const style =
            i === all.length - 1
              ? 'text-[20px] font-semibold leading-7 text-ink'
              : 'text-[20px] font-normal leading-7 text-ink-muted'

          return (
            <span key={label} className="flex items-center gap-[8px]">
              {i > 0 && <ChevronRight size={17} className="text-[#9AA8B8]" />}
              {to ? (
                <button type="button" onClick={() => navigate(to)} className={`${style} transition-colors hover:text-brand`}>
                  {label}
                </button>
              ) : (
                <span className={style}>{label}</span>
              )}
            </span>
          )
        })}
        <span id="page-title-action" className="ml-[4px] flex items-center" />
      </nav>

      <div className="flex items-center gap-2">
        <div ref={notifRef} className="relative z-40">
          <button
            type="button"
            aria-label="Notifications"
            aria-haspopup="dialog"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setMenuOpen(false)
              setNotificationsOpen((v) => !v)
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4A5A6D] transition-colors hover:bg-white"
          >
            <Bell size={19} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute right-[9px] top-[8px] h-[6px] w-[6px] rounded-full bg-danger ring-2 ring-canvas" />
            )}
          </button>
          <NotificationsModal
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            onUnreadChange={setUnreadCount}
          />
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(false)
              setMenuOpen((v) => !v)
            }}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open account menu"
            className="flex items-center gap-[10px] rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-white"
          >
            <Avatar />
            <span className="text-left leading-tight">
              <span className="block text-[13.5px] font-semibold text-ink">{currentUser.name}</span>
              <span className="block text-[11.5px] text-ink-muted">{currentUser.role}</span>
            </span>
            <ChevronDown size={17} className={`ml-1 text-[#6B7A8C] transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-30 mt-[8px] w-[200px] overflow-hidden rounded-[10px] border border-line bg-white py-[6px] shadow-pop"
            >
              <button
                type="button"
                role="menuitem"
                onClick={openProfile}
                className="flex w-full items-center gap-[10px] px-[14px] py-[9px] text-left text-[13px] font-medium text-ink transition-colors hover:bg-[#EEF5FE] hover:text-brand"
              >
                <UserIcon size={16} />
                My Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={openPassword}
                className="flex w-full items-center gap-[10px] px-[14px] py-[9px] text-left text-[13px] font-medium text-ink transition-colors hover:bg-[#EEF5FE] hover:text-brand"
              >
                <LockIcon size={16} />
                Change Password
              </button>
            </div>
          )}
        </div>

        <div className="mx-1 h-6 w-px bg-line" />

        <button
          type="button"
          aria-label="Log out"
          onClick={() => setLogoutOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4A5A6D] transition-colors hover:bg-white hover:text-danger"
        >
          <LogOut size={19} strokeWidth={1.8} />
        </button>
      </div>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={confirmLogout} />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSuccess={() => {
          setPasswordOpen(false)
          setUpdatedOpen(true)
        }}
      />
      <PasswordUpdatedModal open={updatedOpen} onClose={() => setUpdatedOpen(false)} />
    </header>
  )
}
