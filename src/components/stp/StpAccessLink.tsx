import { useCallback, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { NO_STP_ACCESS_MESSAGE } from '../../lib/stpAccess'
import Toast, { type ToastFeedback } from '../ui/Toast'

type StpAccessLinkProps = {
  plantCode?: string | null
  to: string
  className?: string
  title?: string
  onClick?: () => void
  children: ReactNode
}

/**
 * STP name link that only navigates when the user's role includes the STP.
 * Otherwise it renders disabled and shows the standard bottom-right error toast.
 */
export default function StpAccessLink({ plantCode, to, className = '', title, onClick, children }: StpAccessLinkProps) {
  const { hasStpAccess } = useAuth()
  const [feedback, setFeedback] = useState<ToastFeedback | null>(null)
  const dismissFeedback = useCallback(() => setFeedback(null), [])

  if (hasStpAccess(plantCode)) {
    return (
      <Link to={to} className={className} title={title} onClick={onClick}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-disabled="true"
        title={title}
        onClick={() => setFeedback({ id: Date.now(), tone: 'error', text: NO_STP_ACCESS_MESSAGE })}
        className={`${className} cursor-not-allowed text-left opacity-50 no-underline`}
      >
        {children}
      </button>
      {feedback && createPortal(<Toast feedback={feedback} onClose={dismissFeedback} />, document.body)}
    </>
  )
}
