import { ico } from '../ui/Ico'
import StreamHeader from './StreamHeader'
import ParamTile from './ParamTile'
import { stpRealtime, stpStreams } from '../../data/mockData'

const ClockIcon = ico('fluent:clock-32-filled')

export default function RealtimeParametersPanel() {
  return (
    <div className="grid grid-cols-2 gap-[14px]">
      {stpStreams.map((stream) => {
        const data = stpRealtime[stream.key]

        return (
          <div key={stream.key} className="rounded-[12px] border border-line bg-[#F7FAFF] p-[14px]">
            <StreamHeader stream={stream}>
              <span
                className={`flex shrink-0 items-center gap-[6px] text-[12.5px] font-medium leading-4 ${
                  stream.tone === 'ok' ? 'text-ok' : 'text-brand'
                }`}
              >
                <ClockIcon size={15} />
                {stpRealtime.at}
              </span>
            </StreamHeader>

            <p className="mt-[14px] text-[13.5px] leading-[18px] text-ink-soft">Flow</p>
            <p className="mt-[4px] text-[21px] font-bold leading-7 text-ink">
              {data.flow.value}
              <span className="ml-[4px] text-[15px] font-semibold">{data.flow.unit}</span>
            </p>

            <div className="mt-[13px] grid grid-cols-3 gap-[10px]">
              {data.params.map((p) => (
                <ParamTile key={p.key} param={p} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
