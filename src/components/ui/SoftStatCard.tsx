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
    value: 'text-brand',
    border: '#0768D233',
    background:
      'linear-gradient(101.59deg, rgba(7, 104, 210, 0.05) -0.16%, rgba(7, 104, 210, 0) 100%), #FFFFFF',
    note: 'text-brand',
    pillBg: 'bg-[#EEF6FD]',
    pillText: 'text-[#0768D2]',
  },
  ok: {
    value: 'text-ok',
    border: '#168E3F33',
    background:
      'linear-gradient(101.59deg, rgba(22, 142, 63, 0.05) -0.16%, rgba(22, 142, 63, 0) 100%), #FFFFFF',
    note: 'text-ok',
    pillBg: 'bg-[#E8F7EE]',
    pillText: 'text-[#168E3F]',
  },
  warn: {
    value: 'text-orange',
    border: '#EE9B2C33',
    background:
      'linear-gradient(101.59deg, rgba(238, 155, 44, 0.08) -0.16%, rgba(238, 155, 44, 0) 100%), #FFFFFF',
    note: 'text-orange',
    pillBg: 'bg-[#FFF4E5]',
    pillText: 'text-[#D97706]',
  },
  danger: {
    value: 'text-danger',
    border: '#C50F1F33',
    background:
      'linear-gradient(101.59deg, rgba(220, 38, 38, 0.05) -0.16%, rgba(220, 38, 38, 0) 100%), #FFFFFF',
    note: 'text-danger',
    pillBg: 'bg-[#FDECEC]',
    pillText: 'text-[#C50F1F]',
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
}: {
  label: string
  value: number | string
  tone?: SoftTone
  note?: string
  noteAsPill?: boolean
}) {
  const styles = TONES[tone]

  return (
    <div
      className="flex min-h-[128px] flex-col justify-center rounded-[12px] px-[20px] py-[20px]"
      style={{ background: styles.background, border: `1px solid ${styles.border}` }}
    >
      <p className="text-[13.5px] font-medium leading-5 text-ink">{label}</p>
      <p className={`mt-[10px] text-[28px] font-bold leading-8 ${styles.value}`}>{value}</p>
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
}: {
  items: SoftStatItem[]
  columns?: number
  gap?: number
  className?: string
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
        />
      ))}
    </div>
  )
}
