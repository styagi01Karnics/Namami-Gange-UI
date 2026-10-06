import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react'
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
const BellIcon = ico('fluent:alert-20-filled')

function Avatar({ size = 48, photo }: { size?: number; photo?: boolean }) {
  if (photo) {
    return (
      <span
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DCEAFB] ring-2 ring-white"
        style={{ width: size, height: size }}
      >
        <img src="/dashboard/avatar-user.png" alt="" className="h-full w-full object-cover" />
      </span>
    )
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DCEAFB] ring-2 ring-white"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 36 36" className="h-full w-full">
        <circle cx="18" cy="18" r="18" fill="#DCEAFB" />
        <circle cx="18" cy="14" r="5.4" fill="#F0C9A4" />
        <path
          d="M18 20.5c-5.2 0-9.2 3-9.6 7.4A18 18 0 0 0 18 36c3.7 0 7.1-1.1 9.6-3.1-.4-4.4-4.4-8.4-9.6-8.4Z"
          fill="#2F5D8C"
        />
        <path
          d="M12.4 12.2c0-3.1 2.5-5.6 5.6-5.6s5.6 2.5 5.6 5.6l-1.6.6c-.7-2-2.3-3-4-3s-3.3 1-4 3l-1.6-.6Z"
          fill="#2C3644"
        />
      </svg>
    </span>
  )
}

function Divider({ tall = false }: { tall?: boolean }) {
  return (
    <span
      aria-hidden
      className={`mx-[6px] w-px shrink-0 bg-[#B8C9DC] ${tall ? 'h-[40px]' : 'h-[32px]'}`}
    />
  )
}

export default function Topbar({
  title = 'Dashboard',
  variant = 'default',
}: {
  title?: PageTitle
  variant?: 'default' | 'dashboard'
}) {
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

  const accountMenu = menuOpen && (
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
  )

  const modals = (
    <>
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
    </>
  )

  if (variant === 'dashboard') {
    return (
      <>
        {/* Logos + controls — tightened so dashboard first fold shows bottom cards. */}
        <header className="relative z-20 flex h-[112px] shrink-0 items-start justify-between px-[40px] pt-[6px] pr-[28px]">
          <div className="flex min-w-0 flex-1 items-start gap-[28px]">
            <img
              src="/dashboard/logo-uttarakhand.png"
              alt="Uttarakhand Gange — Real-Time STP Monitoring Platform"
              className="h-[100px] w-[120px] shrink-0 object-contain object-top"
            />
            <img
              src="/dashboard/logo-kartavya.png"
              alt="Kartavya Ganga — नहीं रुकेंगे, स्वच्छ करेंगे"
              className="mt-[2px] h-[94px] w-auto max-w-[min(340px,40vw)] object-contain object-left"
            />
          </div>

          <div className="mt-[14px] flex shrink-0 items-center gap-[8px]">
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
                className="relative flex size-[48px] items-center justify-center rounded-full bg-[#003C7A] text-white transition-colors hover:bg-[#0648A8]"
              >
                <BellIcon size={22} />
                {unreadCount > 0 && (
                  <span className="absolute right-[11px] top-[11px] h-[8px] w-[8px] rounded-full bg-[#DC2626] ring-2 ring-[#003C7A]" />
                )}
              </button>
              <NotificationsModal
                open={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                onUnreadChange={setUnreadCount}
              />
            </div>

            <Divider tall />

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
                className="flex items-center gap-[10px] rounded-[12px] py-1 pl-1 pr-1 transition-colors hover:bg-white/50"
              >
                <Avatar size={48} photo />
                <span className="text-left leading-tight">
                  <span className="block text-[14px] font-medium text-[#07121E]">{currentUser.name}</span>
                  <span className="mt-[2px] block text-[11px] font-medium text-[#646464]">
                    {currentUser.role}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`ml-[2px] text-[#6B7A8C] transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {accountMenu}
            </div>

            <Divider tall />

            <button
              type="button"
              aria-label="Log out"
              onClick={() => setLogoutOpen(true)}
              className="flex size-[48px] items-center justify-center rounded-full bg-[#003C7A] text-white transition-colors hover:bg-[#0648A8] hover:text-white"
            >
              <LogOut size={20} strokeWidth={2} />
            </button>
          </div>
        </header>
        {modals}
      </>
    )
  }

  return (
    <>
      <header className="relative z-[2] flex h-[68px] shrink-0 items-center justify-between pr-1">
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
                  <button
                    type="button"
                    onClick={() => navigate(to)}
                    className={`${style} transition-colors hover:text-brand`}
                  >
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

        <div className="flex shrink-0 items-center gap-2">
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
              <BellIcon size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-[9px] top-[8px] h-[6px] w-[6px] rounded-full bg-danger ring-2 ring-white" />
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
              <Avatar size={36} />
              <span className="text-left leading-tight">
                <span className="block text-[13.5px] font-semibold text-ink">{currentUser.name}</span>
                <span className="block text-[11.5px] text-ink-muted">{currentUser.role}</span>
              </span>
              <ChevronDown
                size={17}
                className={`ml-1 text-[#6B7A8C] transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {accountMenu}
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
      </header>
      {modals}
    </>
  )
}
