import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '@/assets/shared/avatar.png'
import circleBg from '@/assets/shared/circle-btn-bg.svg'
import iconAlert from '@/assets/shared/icon-alert.svg'
import iconExit from '@/assets/shared/icon-exit.svg'
import iconChevronDown from '@/assets/shared/icon-chevron-down.svg'

export default function UserActions() {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!profileOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileOpen])

  const handleLogout = () => {
    setProfileOpen(false)
    navigate('/login')
  }

  const handleProfile = () => {
    setProfileOpen(false)
    navigate('/profile')
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="relative size-8"
        aria-label="Notifications"
      >
        <img src={circleBg} alt="" className="absolute inset-0 size-full" />
        <div className="absolute inset-0 flex items-center justify-center overflow-clip">
          <div className="relative h-[15.5px] w-[14px]">
            <img
              src={iconAlert}
              alt=""
              className="absolute inset-0 block size-full max-w-none"
            />
          </div>
        </div>
      </button>

      <div ref={profileRef} className="relative">
        <button
          type="button"
          className="flex items-center gap-2"
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          onClick={() => setProfileOpen((open) => !open)}
        >
          <img
            src={avatar}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-medium leading-normal text-[#10172a]">
              Rajesh Nair
            </span>
            <span className="text-[11px] font-medium leading-normal text-[#737373]">
              Super Admin
            </span>
          </div>
          <div className="relative size-[18px] overflow-clip">
            <div className="absolute left-1/2 top-[calc(50%+0.25px)] h-[5.5px] w-[10px] -translate-x-1/2 -translate-y-1/2">
              <img
                src={iconChevronDown}
                alt=""
                className="absolute inset-0 block size-full max-w-none"
              />
            </div>
          </div>
        </button>

        {profileOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[160px] overflow-hidden rounded-lg border border-[#eff0f6] bg-white py-1 shadow-[0px_4px_12px_rgba(7,104,210,0.12)]"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center px-4 py-2.5 text-left text-[14px] font-medium text-[#07121e] hover:bg-[#f4faff]"
              onClick={handleProfile}
            >
              Profile
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="relative size-8"
        aria-label="Logout"
        onClick={handleLogout}
      >
        <img src={circleBg} alt="" className="absolute inset-0 size-full" />
        <div className="absolute inset-0 flex items-center justify-center overflow-clip">
          <div className="relative h-[14px] w-[15px]">
            <img
              src={iconExit}
              alt=""
              className="absolute inset-0 block size-full max-w-none"
            />
          </div>
        </div>
      </button>
    </div>
  )
}
