type SoftTone = 'brand' | 'ok' | 'warn' | 'danger' | 'violet'

export type SoftStatItem = {
  key: string
  label: string
  value: number | string
  tone?: SoftTone
  note?: string
  /** Pill badge (default) vs plain tone-colored text under the value. */
  noteAsPill?: boolean
}

const TONES: Record<
  SoftTone,
  { value: string; border: string; background: string; note: string; pillBg: string; pillText: string }
> = {
  brand: {
    value: 'text-[#0768D2]',
    border: 'rgba(7, 104, 210, 0.2)',
    background:
      'linear-gradient(116.08deg, rgba(7, 104, 210, 0.05) 0.16%, rgba(7, 104, 210, 0) 100%), #FFFFFF',
    note: 'text-[#0768D2]',
    pillBg: 'bg-[#EEF6FD]',
    pillText: 'text-[#0768D2]',
  },
  ok: {
    value: 'text-[#168E3F]',
    border: 'rgba(22, 142, 63, 0.2)',
    background:
      'linear-gradient(116.08deg, rgba(22, 142, 63, 0.05) 0.16%, rgba(22, 142, 63, 0) 100%), #FFFFFF',
    note: 'text-[#168E3F]',
    pillBg: 'bg-[#E8F7EE]',
    pillText: 'text-[#168E3F]',
  },
  warn: {
    value: 'text-[#E89802]',
    border: 'rgba(232, 152, 2, 0.2)',
    background:
      'linear-gradient(116.08deg, rgba(232, 152, 2, 0.05) 0.16%, rgba(232, 152, 2, 0) 100%), #FFFFFF',
    note: 'text-[#E89802]',
    pillBg: 'bg-[#FFF4E5]',
    pillText: 'text-[#D97706]',
  },
  danger: {
    value: 'text-[#DC2626]',
    border: 'rgba(197, 15, 31, 0.2)',
    background:
      'linear-gradient(116.08deg, rgba(220, 38, 38, 0.05) 0.16%, rgba(220, 38, 38, 0) 100%), #FFFFFF',
    note: 'text-[#DC2626]',
    pillBg: 'bg-[#FDECEC]',
    pillText: 'text-[#DC2626]',
  },
  violet: {
    value: 'text-[#7A5AF8]',
    border: '#7A5AF833',
    background:
      'linear-gradient(101.59deg, rgba(122, 90, 248, 0.06) -0.16%, rgba(122, 90, 248, 0) 100%), #FFFFFF',
    note: 'text-[#7A5AF8]',
    pillBg: 'bg-[#F0EBFD]',
    pillText: 'text-[#7A5AF8]',
  },
}

export function SoftStatCard({
  label,
  value,
  tone = 'brand',
  note,
  noteAsPill = true,
  /** Extra vertical padding — used by Data Reports KPI rows. */
  tall = false,
}: {
  label: string
  value: number | string
  tone?: SoftTone
  note?: string
  noteAsPill?: boolean
  tall?: boolean
}) {
  const styles = TONES[tone]
  const roomy = tall || Boolean(note)

  return (
    <div
      className={`flex min-w-0 flex-col justify-center rounded-[10px] px-[20px] ${
        roomy ? 'min-h-[148px] py-[24px]' : 'h-[110px] py-[20px]'
      }`}
      style={{ background: styles.background, border: `1px solid ${styles.border}` }}
    >
      <p className="text-[14px] font-semibold leading-normal text-[#07121E]">{label}</p>
      <p className={`mt-[8px] text-[24px] font-bold leading-[30px] ${styles.value}`}>{value}</p>
      {note ? (
        noteAsPill ? (
          <span
            className={`mt-[12px] inline-flex w-fit rounded-full px-[10px] py-[4px] text-[11.5px] font-medium leading-4 ${styles.pillBg} ${styles.pillText}`}
          >
            {note}
          </span>
        ) : (
          <p className={`mt-[12px] text-[12px] font-medium leading-4 ${styles.note}`}>{note}</p>
        )
      ) : null}
    </div>
  )
}

export default function SoftStatCardsRow({
  items,
  columns = 5,
  gap = 14,
  className = '',
  tall = false,
}: {
  items: SoftStatItem[]
  columns?: number
  gap?: number
  className?: string
  tall?: boolean
}) {
  return (
    <div
      className={`grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: `${gap}px` }}
    >
      {items.map((item) => (
        <SoftStatCard
          key={item.key}
          label={item.label}
          value={item.value}
          tone={item.tone}
          note={item.note}
          noteAsPill={item.noteAsPill}
          tall={tall}
        />
      ))}
    </div>
  )
}
