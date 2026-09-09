import { Bell, ChevronDown, ChevronRight, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { currentUser } from '../data/mockData'

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

export default function Topbar({ title = 'Dashboard' }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('ng-auth')
    navigate('/login')
  }

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between pr-1">
      <nav aria-label="Breadcrumb" className="flex items-center gap-[8px]">
        {(Array.isArray(title) ? title : [title]).map((crumb, i, all) => (
          <span key={crumb} className="flex items-center gap-[8px]">
            {i > 0 && <ChevronRight size={17} className="text-[#9AA8B8]" />}
            <span
              className={
                i === all.length - 1
                  ? 'text-[20px] font-semibold leading-7 text-ink'
                  : 'text-[20px] font-normal leading-7 text-ink-muted'
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#4A5A6D] transition-colors hover:bg-white"
        >
          <Bell size={19} strokeWidth={1.8} />
          <span className="absolute right-[9px] top-[8px] h-[6px] w-[6px] rounded-full bg-danger ring-2 ring-canvas" />
        </button>

        <button
          type="button"
          className="flex items-center gap-[10px] rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-white"
        >
          <Avatar />
          <span className="text-left leading-tight">
            <span className="block text-[13.5px] font-semibold text-ink">{currentUser.name}</span>
            <span className="block text-[11.5px] text-ink-muted">{currentUser.role}</span>
          </span>
          <ChevronDown size={17} className="ml-1 text-[#6B7A8C]" />
        </button>

        <div className="mx-1 h-6 w-px bg-line" />

        <button
          type="button"
          aria-label="Log out"
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#4A5A6D] transition-colors hover:bg-white hover:text-danger"
        >
          <LogOut size={19} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}
