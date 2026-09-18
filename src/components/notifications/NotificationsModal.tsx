import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import { inboxNotifications, type InboxNotification } from '../../data/mockData'

const FactoryIcon = ico('fluent:building-factory-24-filled')

type Tab = 'all' | 'unread'

type NotificationsModalProps = {
  open: boolean
  onClose: () => void
  onUnreadChange?: (count: number) => void
}

type KindStyle = {
  iconWrap: string
  title: string
  Icon: ReturnType<typeof ico> | null
}

const KIND: Record<InboxNotification['kind'], KindStyle> = {
  'stp-offline': {
    iconWrap: 'bg-[#E8EEF4] text-[#6B7A8C]',
    title: 'text-danger',
    Icon: FactoryIcon,
  },
  'ticket-update': {
    iconWrap: 'bg-[#FBE7E2] text-[#E0A399]',
    title: 'text-ink',
    Icon: null,
  },
}

export default function NotificationsModal({ open, onClose, onUnreadChange }: NotificationsModalProps) {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('all')
  const [items, setItems] = useState<InboxNotification[]>(inboxNotifications)
  const [composingId, setComposingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [commented, setCommented] = useState<Record<string, boolean>>({})

  const close = useCallback(() => {
    setComposingId(null)
    setDraft('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  const unreadCount = items.filter((item) => !item.read).length

  useEffect(() => {
    onUnreadChange?.(unreadCount)
  }, [unreadCount, onUnreadChange])

  const visible = useMemo(
    () => (tab === 'unread' ? items.filter((item) => !item.read) : items),
    [items, tab],
  )

  if (!open) return null

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    if (composingId === id) {
      setComposingId(null)
      setDraft('')
    }
  }

  const markRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const openItem = (item: InboxNotification) => {
    markRead(item.id)
    if (!item.href) return
    close()
    navigate(item.href)
  }

  const sendComment = (id: string) => {
    if (!draft.trim()) return
    setCommented((prev) => ({ ...prev, [id]: true }))
    setComposingId(null)
    setDraft('')
    markRead(id)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-title"
      className="absolute right-0 top-[calc(100%+8px)] z-40 flex h-[min(calc(100vh-88px),640px)] w-[460px] flex-col overflow-hidden rounded-[16px] border border-line bg-white shadow-pop"
    >
        <div className="flex items-center justify-between px-[20px] pb-[12px] pt-[18px]">
          <h2 id="notifications-title" className="text-[16px] font-extrabold leading-6 text-ink">
            Notifications
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close notifications"
            className="flex h-[28px] w-[28px] items-center justify-center text-ink-muted transition-colors hover:text-ink"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="flex gap-[8px] px-[20px] pb-[14px]">
          <TabButton active={tab === 'all'} onClick={() => setTab('all')}>
            All
          </TabButton>
          <TabButton active={tab === 'unread'} onClick={() => setTab('unread')}>
            Unread
          </TabButton>
        </div>

        <ul className="scroll-thin flex-1 overflow-y-auto px-[10px] pb-[14px]">
          {visible.length === 0 && (
            <li className="px-[10px] py-[28px] text-center text-[13px] text-ink-muted">
              {tab === 'unread' ? 'No unread notifications' : 'You are all caught up'}
            </li>
          )}

          {visible.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              composing={composingId === item.id}
              commented={Boolean(commented[item.id])}
              draft={composingId === item.id ? draft : ''}
              onDraftChange={setDraft}
              onDismiss={() => dismiss(item.id)}
              onOpen={() => openItem(item)}
              onAddComment={() => {
                markRead(item.id)
                setComposingId(item.id)
                setDraft('')
              }}
              onCancelComment={() => {
                setComposingId(null)
                setDraft('')
              }}
              onSendComment={() => sendComment(item.id)}
            />
          ))}
        </ul>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-[32px] rounded-[8px] px-[16px] text-[13px] font-semibold leading-4 transition-colors ${
        active ? 'bg-brand text-white' : 'bg-[#EAF3FE] text-ink hover:bg-brand-soft'
      }`}
    >
      {children}
    </button>
  )
}

function NotificationRow({
  item,
  composing,
  commented,
  draft,
  onDraftChange,
  onDismiss,
  onOpen,
  onAddComment,
  onCancelComment,
  onSendComment,
}: {
  item: InboxNotification
  composing: boolean
  commented: boolean
  draft: string
  onDraftChange: (value: string) => void
  onDismiss: () => void
  onOpen: () => void
  onAddComment: () => void
  onCancelComment: () => void
  onSendComment: () => void
}) {
  const style = KIND[item.kind]
  const Icon = style.Icon

  return (
    <li
      className={`relative rounded-[12px] px-[10px] py-[12px] ${item.read ? 'bg-white' : 'bg-[#F3F8FE]'}`}
    >
      <div className="flex items-start gap-[10px]">
        <span
          className={`mt-[2px] flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full ${style.iconWrap}`}
        >
          {Icon ? <Icon size={16} /> : null}
        </span>

        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className={`text-[13.5px] font-semibold leading-5 ${style.title}`}>{item.title}</p>
          <p className="mt-[2px] text-[12.5px] leading-[18px] text-ink-soft">{item.message}</p>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          aria-label={`Dismiss ${item.title}`}
          className="mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center text-ink-muted transition-colors hover:text-ink"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>

      {item.action === 'comment' && !commented && !composing && (
        <div className="ml-[46px] mt-[10px]">
          <Button variant="outline" className="h-[30px] px-[12px] text-[12px]" onClick={onAddComment}>
            Add Comment
          </Button>
        </div>
      )}

      {item.action === 'comment' && composing && (
        <div className="ml-[46px] mt-[10px]">
          <textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSendComment()
              }
            }}
            rows={2}
            autoFocus
            placeholder="Write a comment"
            aria-label="Write a comment"
            className="scroll-thin w-full resize-none rounded-[9px] border border-line px-[11px] py-[8px] text-[12.5px] leading-[18px] text-ink outline-none placeholder:text-ink-muted focus:border-brand"
          />
          <div className="mt-[8px] flex gap-[8px]">
            <Button
              variant="ghost"
              className="h-[30px] px-[12px] text-[12px]"
              onClick={onCancelComment}
            >
              Cancel
            </Button>
            <Button className="h-[30px] px-[12px] text-[12px]" onClick={onSendComment} disabled={!draft.trim()}>
              Send
            </Button>
          </div>
        </div>
      )}

      {item.action === 'comment' && commented && (
        <p className="ml-[46px] mt-[8px] text-[12px] font-medium text-ok">Comment added</p>
      )}

      <p className="ml-[46px] mt-[8px] text-[11.5px] leading-4 text-ink-muted">{item.time}</p>
    </li>
  )
}
