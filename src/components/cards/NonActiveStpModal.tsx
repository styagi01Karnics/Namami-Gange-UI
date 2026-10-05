import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { nonActiveStpRows } from '../../data/mockData'

type Props = {
  open: boolean
  onClose: () => void
}

export default function NonActiveStpModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

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
        className="w-full max-w-[720px] overflow-hidden rounded-[14px] bg-white shadow-pop"
      >
        <div className="flex items-center justify-between px-[22px] py-[16px]">
          <h2 id="non-active-stp-title" className="text-[16px] font-bold leading-5 text-danger">
            Non-Active STP&rsquo;S
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] text-ink-muted transition-colors hover:bg-[#F3F7FC] hover:text-ink"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="scroll-thin table-scroll pb-[8px]">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[18%]" />
              <col className="w-[34%]" />
              <col className="w-[22%]" />
            </colgroup>
            <thead>
              <tr className="border-y border-line bg-canvas">
                <th className="px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  STP
                </th>
                <th className="px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Last Active
                </th>
                <th className="px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Non-Active Reason
                </th>
                <th className="px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Vendor
                </th>
              </tr>
            </thead>
            <tbody>
              {nonActiveStpRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-line bg-white odd:bg-white even:bg-[#F8F8F8E5] last:border-0"
                >
                  <td className="px-[16px] py-[40px]">
                    <Link
                      to={row.href}
                      onClick={onClose}
                      className="block truncate text-[12.5px] font-semibold leading-4 text-brand-link hover:underline"
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-[16px] py-[20px] text-[12.5px] leading-4 text-ink">
                    <p>{row.lastActiveDate}</p>
                    <p className="text-ink-soft">{row.lastActiveTime}</p>
                  </td>
                  <td className="px-[16px] py-[16px]">
                    <span className="inline-flex w-[206px] h-[96px] rounded-[6px] bg-[#FFF4F4] px-[10px] py-[17px] text-[12px] font-medium leading-4 text-[#07121E] border border-[#F5E7E7]">
                      {row.reason}
                    </span>
                  </td>
                  <td className="px-[16px] py-[20px] text-[12.5px] leading-4 text-ink">{row.vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
