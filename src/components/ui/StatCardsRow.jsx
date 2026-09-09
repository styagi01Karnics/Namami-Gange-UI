import {
  Banknote,
  Boxes,
  CalendarClock,
  Camera,
  CameraOff,
  Check,
  Disc,
  FileText,
  Package,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  X,
} from 'lucide-react'

const TONES = {
  brand: { box: 'bg-brand-soft', glyph: 'text-brand', chip: null, value: 'text-ink' },
  ok: { box: 'bg-ok-soft', glyph: 'text-white', chip: 'bg-ok', value: 'text-ok' },
  danger: { box: 'bg-danger-soft', glyph: 'text-white', chip: 'bg-danger', value: 'text-danger' },
  warn: { box: 'bg-warn-soft', glyph: 'text-warn', chip: null, value: 'text-warn' },
  // "quiet" tones: coloured glyph, but the number stays neutral
  okQuiet: { box: 'bg-ok-soft', glyph: 'text-ok', chip: null, value: 'text-ink' },
  dangerQuiet: { box: 'bg-danger-soft', glyph: 'text-danger', chip: null, value: 'text-ink' },
  warnQuiet: { box: 'bg-warn-soft', glyph: 'text-warn', chip: null, value: 'text-ink' },
}

const ICONS = {
  file: FileText,
  check: Check,
  cross: X,
  money: Banknote,
  boxes: Boxes,
  package: Package,
  days: CalendarClock,
  user: User,
  userCheck: UserCheck,
  userClock: UserCog,
  userAlert: UserPlus,
  camera: Camera,
  cameraOn: Camera,
  cameraOff: CameraOff,
  maintenance: Disc,
}

function StatCard({ item, noteChip }) {
  const tone = TONES[item.tone]
  const Icon = ICONS[item.icon]

  return (
    <div className="rounded-[12px] border border-line bg-white p-[15px]">
      <span className={`flex h-[32px] w-[32px] items-center justify-center rounded-[9px] ${tone.box}`}>
        {tone.chip ? (
          <span className={`flex h-[20px] w-[20px] items-center justify-center rounded-full ${tone.chip}`}>
            <Icon size={13} strokeWidth={3} className="text-white" />
          </span>
        ) : (
          <Icon size={17} strokeWidth={2} className={tone.glyph} />
        )}
      </span>

      <p className="mt-[14px] text-[13px] font-medium leading-4 text-ink-soft">{item.label}</p>
      <p className={`mt-[9px] text-[19px] font-bold leading-6 ${tone.value}`}>{item.value}</p>
      <button
        type="button"
        className={`mt-[9px] text-[12px] font-medium leading-4 text-brand-link ${
          noteChip
            ? 'rounded-[6px] bg-brand-soft px-[8px] py-[4px] hover:bg-[#DCE9FB]'
            : 'hover:underline'
        }`}
      >
        {item.note}
      </button>
    </div>
  )
}

/** Row of four summary cards — shared by Contracts and Compliance. */
export default function StatCardsRow({ items, columns = 4, gap = 16, className = '', noteChip = false }) {
  return (
    <div
      className={`grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: `${gap}px` }}
    >
      {items.map((item) => (
        <StatCard key={item.key} item={item} noteChip={noteChip} />
      ))}
    </div>
  )
}
