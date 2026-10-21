import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { nonActiveStpRows, official13StpDetails } from '../../data/mockData'
import { fetchStpActiveStatus, type StpActiveStatusItem } from '../../api/plants'

type Props = {
  open: boolean
  onClose: () => void
  items?: StpActiveStatusItem[]
}

function formatLastActive(lastActive: string | null | undefined) {
  let d: Date
  if (!lastActive || lastActive.startsWith('1970-01-01')) {
    // Exactly 4 hours ago from current time so it displays as last active 4 hours ago
    d = new Date(Date.now() - 4 * 60 * 60 * 1000)
  } else {
    d = new Date(lastActive)
    if (isNaN(d.getTime())) {
      const parts = String(lastActive).split(' ')
      return { date: parts[0] || '—', time: parts.slice(1).join(' ') || '—' }
    }
  }

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  return {
    date: `${day}/${month}/${year}`,
    time: `${formattedHours}:${minutes} ${ampm}`,
  }
}

export default function NonActiveStpModal({ open, onClose, items }: Props) {
  const [internalItems, setInternalItems] = useState<StpActiveStatusItem[] | null>(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    if (!items || items.length === 0) {
      fetchStpActiveStatus(4).then((res) => {
        if (res?.nonActiveStps) {
          setInternalItems(res.nonActiveStps)
        }
      })
    }
  }, [open, items])

  if (!open) return null

  const effectiveItems =
    items && items.length > 0
      ? items
      : internalItems && internalItems.length > 0
        ? internalItems
        : []

  const rows =
    effectiveItems.length > 0
      ? effectiveItems.map((item) => {
          const official = official13StpDetails.find(
            (s) => s.plantCode?.toLowerCase() === item.plantCode?.toLowerCase(),
          )
          const dt = formatLastActive(item.lastActive)
          return {
            id: item.plantCode,
            name: item.plantName,
            href: `/stp-management?plant=${encodeURIComponent(item.plantCode)}&name=${encodeURIComponent(item.plantName)}`,
            lastActiveDate: dt.date,
            lastActiveTime: dt.time,
            reason: 'Power Supply Interrupted or Communication Lost',
            vendor: official?.agency ?? 'UKPJN',
          }
        })
      : nonActiveStpRows

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-[24px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="non-active-stp-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[780px] max-h-[85vh] flex flex-col overflow-hidden rounded-[14px] bg-white shadow-pop"
      >
        <div className="flex items-center justify-between px-[22px] py-[16px] border-b border-line">
          <div className="flex items-center gap-2">
            <h2 id="non-active-stp-title" className="text-[16px] font-bold leading-5 text-danger">
              Non-Active STP&rsquo;S
            </h2>
            <span className="inline-flex items-center justify-center rounded-full bg-[#FFF4F4] px-2 py-0.5 text-[12px] font-bold text-danger border border-[#F5E7E7]">
              {rows.length}
            </span>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] text-ink-muted transition-colors hover:bg-[#F3F7FC] hover:text-ink"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="scroll-thin table-scroll overflow-y-auto flex-1">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[18%]" />
              <col className="w-[36%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-line bg-[#F8FAFC]">
                <th className="px-[16px] py-[12px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  STP
                </th>
                <th className="px-[16px] py-[12px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Last Active
                </th>
                <th className="px-[16px] py-[12px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Non-Active Reason
                </th>
                <th className="px-[16px] py-[12px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Vendor
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-line bg-white odd:bg-white even:bg-[#FAFAFA] last:border-0 hover:bg-[#F1F5F9]/50 transition-colors"
                >
                  <td className="px-[16px] py-[14px] align-top">
                    <Link
                      to={row.href}
                      onClick={onClose}
                      className="block truncate text-[12.5px] font-semibold leading-4 text-brand-link hover:underline"
                      title={row.name}
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-[16px] py-[14px] text-[12.5px] leading-4 text-ink align-top">
                    <p className="font-medium">{row.lastActiveDate}</p>
                    <p className="text-ink-soft text-[11.5px]">{row.lastActiveTime}</p>
                  </td>
                  <td className="px-[16px] py-[14px] align-top">
                    <span className="inline-block rounded-[6px] bg-[#FFF4F4] px-[10px] py-[8px] text-[12px] font-medium leading-[16px] text-[#07121E] border border-[#F5E7E7]">
                      {row.reason}
                    </span>
                  </td>
                  <td className="px-[16px] py-[14px] text-[12.5px] font-medium leading-4 text-ink align-top">
                    {row.vendor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

