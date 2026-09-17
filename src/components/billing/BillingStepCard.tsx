import { ico } from '../ui/Ico'

const AlertIcon = ico('clarity:warning-standard-solid')
const CheckIcon = ico('fluent:checkmark-circle-32-filled')
const FileIcon = ico('famicons:document-sharp')
const WalletIcon = ico('fluent:wallet-32-filled')
import StatusPill, { statusTone } from '../ui/StatusPill'

const CARD = {
  warn: { shell: 'bg-[#FFF8E8] border-[#F5E3B8]', icon: 'bg-warn-soft text-warn' },
  brand: { shell: 'bg-[#EEF5FE] border-[#C8DCF8]', icon: 'bg-brand-soft text-brand' },
  danger: { shell: 'bg-[#FEF0F1] border-[#F6C9CB]', icon: 'bg-danger-soft text-danger' },
  violet: { shell: 'bg-[#F4F0FF] border-[#DDD1FA]', icon: 'bg-[#EDE6FF] text-[#7C5CFC]' },
}

const ICONS = {
  file: FileIcon,
  check: CheckIcon,
  alert: AlertIcon,
  wallet: WalletIcon,
}

/** One step in the billing workflow — raised, approved, penalty, payable. */
export default function BillingStepCard({ step }) {
  const card = CARD[step.tone] ?? CARD.brand
  const Icon = ICONS[step.icon] ?? FileIcon
  const pillTone = statusTone(step.status)

  return (
    <div className={`flex min-w-[200px] flex-1 flex-col rounded-[12px] border p-[14px] shadow-card ${card.shell}`}>
      <div className="flex items-start justify-between gap-[10px]">
        <span className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${card.icon}`}>
          <Icon size={17} />
        </span>
        <p className="min-w-0 text-right text-[11.5px] font-medium leading-[16px] text-ink-soft">{step.title}</p>
      </div>

      <p className="mt-[18px] text-[22px] font-bold leading-7 text-ink">{step.amount}</p>

      <div className="mt-[10px]">
        <StatusPill tone={pillTone}>{step.status}</StatusPill>
      </div>

      <p className="mt-auto pt-[16px] text-[11.5px] leading-4 text-ink-muted">
        {step.dateLabel}: <span className="font-semibold text-ink-soft">{step.date}</span>
      </p>
    </div>
  )
}
