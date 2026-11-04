import { useEffect } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export type ToastFeedback = {
  id: number
  tone: 'success' | 'error'
  text: string
}

const AUTO_HIDE_MS = 3500

/** Bottom-right feedback popup that dismisses itself after a few seconds. */
export default function Toast({
  feedback,
  onClose,
}: {
  feedback: ToastFeedback | null
  onClose: () => void
}) {
  const id = feedback?.id

  useEffect(() => {
    if (id === undefined) return undefined
    const timer = window.setTimeout(onClose, AUTO_HIDE_MS)
    return () => window.clearTimeout(timer)
  }, [id, onClose])

  if (!feedback) return null

  const isError = feedback.tone === 'error'
  const Icon = isError ? AlertCircle : CheckCircle2

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`fixed bottom-[24px] right-[24px] z-[90] flex max-w-[360px] items-start gap-[10px] rounded-[12px] border bg-white px-[16px] py-[12px] shadow-pop ${
        isError ? 'border-[#F6C9CB]' : 'border-[#BFE5CF]'
      }`}
    >
      <Icon size={18} className={isError ? 'mt-[1px] text-danger' : 'mt-[1px] text-ok'} />
      <p className="text-[13px] font-medium leading-5 text-ink">{feedback.text}</p>
    </div>
  )
}
