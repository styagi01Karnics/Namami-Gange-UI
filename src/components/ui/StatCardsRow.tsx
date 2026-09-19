import BuildingIcon from './BuildingIcon'
import SettingsIcon from './SettingsIcon'
import TeamIcon from './TeamIcon'
import { ico } from './Ico'
import type { StatCardItem } from '../../types'

const TONES: Record<string, { box: string; glyph: string; value: string }> = {
  brand: { box: 'bg-brand-soft', glyph: 'text-brand', value: 'text-ink' },
  ok: { box: 'bg-ok-soft', glyph: 'text-ok', value: 'text-ok' },
  danger: { box: 'bg-danger-soft', glyph: 'text-danger', value: 'text-danger' },
  warn: { box: 'bg-warn-soft', glyph: 'text-warn', value: 'text-warn' },
  slate: { box: 'bg-slate2-soft', glyph: 'text-slate2', value: 'text-ink' },
  okQuiet: { box: 'bg-ok-soft', glyph: 'text-ok', value: 'text-ink' },
  dangerQuiet: { box: 'bg-danger-soft', glyph: 'text-danger', value: 'text-ink' },
  warnQuiet: { box: 'bg-warn-soft', glyph: 'text-warn', value: 'text-ink' },
  violetQuiet: { box: 'bg-[#F0EBFD]', glyph: 'text-[#7A5AF8]', value: 'text-ink' },
}

const ICONS: Record<string, ReturnType<typeof ico> | typeof BuildingIcon> = {
  file: ico('famicons:document-sharp'),
  check: ico('fluent:checkmark-circle-32-filled'),
  cross: ico('fluent:dismiss-circle-32-filled'),
  triangleAlert: ico('clarity:warning-standard-solid'),
  money: ico('fluent:money-24-filled'),
  boxes: ico('fluent:box-24-filled'),
  boxOut: ico('fluent:box-arrow-left-20-filled'),
  building: BuildingIcon,
  package: ico('fluent:box-multiple-24-filled'),
  days: ico('fluent:calendar-clock-24-filled'),
  timer: ico('fluent:timer-12-filled'),
  user: ico('fluent:person-32-filled'),
  users: TeamIcon,
  peopleTeam: ico('fluent:people-team-16-filled'),
  personRibbon: ico('fluent:person-ribbon-16-filled'),
  userCheck: ico('fluent:person-available-24-filled'),
  userClock: ico('fluent:person-clock-24-filled'),
  userAlert: ico('fluent:person-add-24-filled'),
  roles: ico('fluent:person-board-32-filled'),
  history: ico('fluent:history-24-filled'),
  settings: SettingsIcon,
  camera: ico('fluent:camera-20-filled'),
  cameraOn: ico('fluent:camera-20-filled'),
  cameraOff: ico('fluent:camera-off-20-filled'),
  maintenance: ico('fluent:square-32-filled'),
  ticket: ico('bi:ticket-fill'),
  ticketOpen: ico('bi:ticket-fill'),
  progress: ico('fluent:arrow-sync-24-filled'),
  circleCheck: ico('fluent:checkmark-circle-32-filled'),
  circleAlert: ico('fluent:error-circle-24-filled'),
  clock: ico('fluent:clock-20-filled'),
}

const SIZE = {
  default: {
    card: 'p-[14px]',
    box: 'h-[50px] w-[50px] rounded-[12px]',
    icon: 26,
    value: 'mt-[6px]',
    note: 'mt-[12px]',
  },
  comfortable: {
    card: 'px-[16px] py-[18px]',
    box: 'h-[50px] w-[50px] rounded-[12px]',
    icon: 26,
    value: 'mt-[6px]',
    note: 'mt-[12px]',
  },
}

function StatCard({ item, size = 'default' }: { item: StatCardItem; size?: keyof typeof SIZE }) {
  const tone = TONES[item.tone]
  const Icon = ICONS[item.icon]
  const s = SIZE[size]

  return (
    <div className={`flex h-full flex-col justify-center rounded-[12px] border border-line bg-white shadow-card ${s.card}`}>
      <div className="flex items-start gap-[12px]">
        <span className={`flex shrink-0 items-center justify-center ${s.box} ${tone.box}`}>
          <Icon size={s.icon} strokeWidth={2.2} className={tone.glyph} />
        </span>

        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-4 text-ink-soft">{item.label}</p>
          <p className={`text-[19px] font-bold leading-6 ${s.value} ${tone.value}`}>{item.value}</p>
          {item.note && (
            <span className={`inline-flex rounded-full bg-[#EEF6FD] px-[8px] py-[4px] text-[11.5px] font-medium leading-4 text-[#0768D2] ${s.note}`}>
              {item.note}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

type StatCardsRowProps = {
  items: StatCardItem[]
  columns?: number
  gap?: number
  className?: string
  size?: keyof typeof SIZE
}

export default function StatCardsRow({ items, columns = 4, gap = 16, className = '', size = 'default' }: StatCardsRowProps) {
  return (
    <div
      className={`grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: `${gap}px` }}
    >
      {items.map((item) => (
        <StatCard key={item.key} item={item} size={size} />
      ))}
    </div>
  )
}
