import { ico } from '../ui/Ico'
import { statusTone } from '../ui/StatusPill'

const AlertIcon = ico('fluent:money-off-24-filled')
const CheckIcon = ico('fluent:checkmark-circle-32-filled')
const MoneyIcon = ico('fluent:money-24-filled')
const WalletIcon = ico('fluent:wallet-32-filled')
const CalendarIcon = ico('fluent:calendar-32-filled')

const CARD = {
  warn: { shell: 'bg-[#FFF8E8]', icon: 'bg-[#FFE8B8] text-[#E9A020]' },
  brand: { shell: 'bg-[#EEF5FE]', icon: 'bg-[#D6E8FC] text-brand' },
  danger: { shell: 'bg-[#FEF0F1]', icon: 'bg-[#F8D4D6] text-danger' },
  ok: { shell: 'bg-[#F0F9F3]', icon: 'bg-[#D4EEDD] text-ok' },
}

const PILL = {
  warn: 'bg-[#FFE8B8] text-[#C4890B]',
  brand: 'bg-[#D6E8FC] text-brand',
  danger: 'bg-[#F8D4D6] text-danger',
  ok: 'bg-[#D4EEDD] text-ok',
}

const ICONS = {
  money: MoneyIcon,
  check: CheckIcon,
  alert: AlertIcon,
  wallet: WalletIcon,
}

/** One step in the billing workflow — raised, approved, penalty, payable. */
export default function BillingStepCard({ step }) {
  const card = CARD[step.tone] ?? CARD.brand
  const Icon = ICONS[step.icon] ?? MoneyIcon
  const pillTone = statusTone(step.status)

  return (
    <div className={`flex min-w-0 flex-1 basis-0 flex-col rounded-[12px] p-[16px] ${card.shell}`}>
      <span className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] ${card.icon}`}>
        <Icon size={16} />
      </span>

      <p className="mt-[14px] text-[13px] font-medium leading-[18px] text-ink">{step.title}</p>
      <p className="mt-[8px] text-[20px] font-bold leading-7 text-ink">{step.amount}</p>

      <span
        className={`mt-[10px] inline-flex w-fit items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11.5px] font-semibold leading-[16px] ${
          PILL[pillTone] ?? PILL.brand
        }`}
      >
        {step.status}
      </span>

      <div className="mt-auto flex items-start gap-[6px] pt-[16px]">
        <CalendarIcon size={14} className="mt-[2px] shrink-0 text-ink-muted" />
        <p className="text-[12px] leading-[16px] text-ink-muted">
          {step.dateLabel}
          <br />
          <span className="font-medium text-ink-soft">{step.date}</span>
        </p>
      </div>
    </div>
  )
}
