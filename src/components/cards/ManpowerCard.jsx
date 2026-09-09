import Card from '../ui/Card'
import CardTitle from '../ui/CardTitle'
import NestedDonut from '../charts/NestedDonut'
import { manpower } from '../../data/mockData'

const TRACKS = {
  '#2E9E5B': '#DFF1E7',
  '#E5484D': '#FBE0E1',
  '#F5B417': '#FCEFD2',
}

export default function ManpowerCard() {
  const rings = manpower.attendance.map((a) => ({
    percent: parseFloat(a.percent),
    color: a.color,
    track: TRACKS[a.color] ?? '#EEF2F7',
  }))

  return (
    <Card className="flex flex-col p-[15px]">
      <CardTitle>Manpower Overview</CardTitle>

      <div className="mt-[13px] grid grid-cols-[0.9fr_1.2fr_0.9fr] overflow-hidden rounded-[9px] border border-line">
        {manpower.stats.map((s, i) => (
          <div key={s.label} className={`px-[12px] py-[13px] ${i > 0 ? 'border-l border-line' : ''}`}>
            <p className="whitespace-nowrap text-[11.5px] font-medium leading-4 text-ink-soft">{s.label}</p>
            <p className="mt-[6px] text-[17px] font-bold leading-6 text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-[18px] flex items-center gap-[12px]">
        <NestedDonut rings={rings} size={128} thickness={8} gap={5} />

        <div className="flex-1 space-y-[15px]">
          {manpower.attendance.map((a) => (
            <div key={a.key} className="flex items-center">
              <span className="mr-[8px] h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: a.color }} />
              <span className="text-[12.5px] font-medium leading-4 text-ink-soft">{a.label}</span>
              <span className="ml-auto text-[13px] font-bold leading-4 text-ink">{a.value}</span>
              <span className="ml-[14px] w-[46px] text-right text-[12px] font-semibold leading-4" style={{ color: a.color }}>
                {a.percent}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mt-[14px] self-end text-[12.5px] font-medium leading-4 text-brand-link underline decoration-brand-link/60 underline-offset-2"
      >
        View Report
      </button>
    </Card>
  )
}
