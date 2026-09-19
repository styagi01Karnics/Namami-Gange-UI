import { Fragment } from 'react'
import { ico } from '../ui/Ico'
import { stpBillingSummary } from '../../data/mockData'

const ReceiptIcon = ico('fluent:receipt-32-filled')
const CheckIcon = ico('fluent:checkmark-circle-32-filled')

const VALUE_TONE = { ink: 'text-ink', danger: 'text-danger', ok: 'text-ok' }

/** How the payable figure falls out of the approved amount and the penalty. */
export default function CalculationSummaryCard() {
  const { terms, paymentStatus } = stpBillingSummary

  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px] shadow-card">
      <div className="flex items-center gap-[10px]">
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-brand-soft">
          <ReceiptIcon size={17} className="text-brand" />
        </span>
        <h3 className="text-[15px] font-semibold leading-5 text-ink">Calculation Summary</h3>
      </div>

      <div className="mt-[14px] flex w-full items-center">
          {terms.map((t) => (
            <Fragment key={t.key}>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-medium leading-4 text-ink-soft">{t.label}</p>
                <p className={`mt-[7px] text-[17px] font-bold leading-6 ${VALUE_TONE[t.tone]}`}>{t.value}</p>
              </div>

              {t.operator && (
                <div className="flex flex-1 items-center justify-center">
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold leading-none text-white">
                    {t.operator}
                  </span>
                </div>
              )}
            </Fragment>
          ))}

          <div className="flex flex-1 items-center justify-center">
            <span className="h-[44px] w-px bg-line" />
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-[10px]">
            <CheckIcon size={22} className="shrink-0 text-ok" />
            <div>
              <p className="text-[12.5px] font-medium leading-4 text-ink-soft">Payment Status</p>
              <p className="mt-[6px] inline-flex items-center rounded-full bg-ok-soft px-[11px] py-[3px] text-[11.5px] font-semibold leading-4 text-ok">
                {paymentStatus}
              </p>
            </div>
          </div>
      </div>
    </section>
  )
}
