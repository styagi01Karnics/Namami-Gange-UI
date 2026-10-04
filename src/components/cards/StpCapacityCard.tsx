import Card from '../ui/Card'
import { polar } from '../charts/arc'
import { stpCapacity } from '../../data/mockData'

const SIZE = 240
const CX = SIZE / 2
const CY = SIZE / 2
const R = 98
/** Pull the 25% slice out along its bisector so the cut edges stay axis-aligned. */
const EXPLODE = 14
/** Nudge labels toward the right so they sit in the visual middle of each segment. */
const LABEL_NUDGE_X = 14

function formatMld(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

/** Pie wedge. Angles are clockwise from 12 o'clock (see `polar`). */
function pieSlice(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const large = endDeg - startDeg > 180 ? 1 : 0
  const start = polar(cx, cy, r, startDeg)
  const end = polar(cx, cy, r, endDeg)
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
}

export default function StpCapacityCard() {
  const { total, unit, used, notUsed } = stpCapacity

  // Fixed 75 / 25 visual split on cardinal angles so both cut lines are straight:
  // Not Used = bottom-right quadrant (3 o'clock → 6 o'clock)
  // Used     = remaining three quadrants (6 o'clock → 3 o'clock)
  const notUsedStart = 90
  const notUsedEnd = 180
  const usedStart = 180
  const usedEnd = 450 // 180 + 270

  const notUsedMid = 135
  const usedMid = 315

  const explode = polar(CX, CY, EXPLODE, notUsedMid)
  const usedLabel = polar(CX, CY, R * 0.45, usedMid)
  const notLabel = polar(explode.x, explode.y, R * 0.5, notUsedMid)

  return (
    <Card className="flex h-full flex-col px-[22px] py-[18px]">
      <div>
        <p className="text-[14px] font-semibold leading-5 text-ink">Total STP&rsquo;s Capacity</p>
        <p className="mt-[6px] text-[28px] font-bold leading-8 text-ink">
          {total} {unit}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center py-[4px]">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="overflow-visible">
          <circle cx={CX} cy={CY} r={R + 1} fill="#FFFFFF" />

          <path d={pieSlice(CX, CY, R, usedStart, usedEnd)} fill="#1668E3" />
          <path d={pieSlice(explode.x, explode.y, R, notUsedStart, notUsedEnd)} fill="#D4E8FB" />

          <text
            x={usedLabel.x + LABEL_NUDGE_X}
            y={usedLabel.y - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize="13"
            fontWeight="700"
          >
            {formatMld(used)} {unit}
          </text>
          <text
            x={usedLabel.x + LABEL_NUDGE_X}
            y={usedLabel.y + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize="12.5"
            fontWeight="500"
          >
            Used
          </text>

          <text
            x={notLabel.x + LABEL_NUDGE_X}
            y={notLabel.y - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#0B4F9C"
            fontSize="12"
            fontWeight="700"
          >
            {formatMld(notUsed)} {unit}
          </text>
          <text
            x={notLabel.x + LABEL_NUDGE_X}
            y={notLabel.y + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#0B4F9C"
            fontSize="11.5"
            fontWeight="500"
          >
            Not Used
          </text>
        </svg>
      </div>
    </Card>
  )
}
