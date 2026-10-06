import { stpMapMarkers } from '../../data/mockData'

const DOT = {
  ok: 'bg-[#168E3F]',
  warn: 'bg-[#F5B417]',
  danger: 'bg-[#DC2626]',
}

export default function StpLocationsMapCard() {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-[16px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)] xl:min-h-[230px]">
      <img
        src="/dashboard/map-locations.png"
        alt="STP locations map"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-[1] flex h-full flex-col p-[12px]">
        <p className="text-[16px] font-bold leading-5 text-white">STP Locations</p>
        <p className="mt-[2px] text-[13px] font-medium leading-5 text-[#D2E1FF]">Live Status Overview</p>

        <div className="relative mt-auto min-h-[140px] flex-1">
          {stpMapMarkers.map((m) => (
            <div
              key={m.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              <span className={`mx-auto mb-[4px] block size-[9px] rounded-full ring-4 ring-white/40 ${DOT[m.tone]}`} />
              <p className="whitespace-nowrap text-[13px] font-bold leading-none text-white">{m.label}</p>
              <p className="mt-[3px] whitespace-nowrap text-[11px] font-medium leading-none text-white/90">{m.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
