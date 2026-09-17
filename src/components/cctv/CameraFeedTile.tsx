import PlantScene from './PlantScene'

const STATUS_DOT = { Live: 'bg-ok', Offline: 'bg-danger' }

export default function CameraFeedTile({ feed, divider = false }) {
  const isOffline = feed.status === 'Offline'

  return (
    <div className="flex min-w-0 flex-col">
      <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[10px] bg-[#CBD9E5]">
        <div className={isOffline ? 'h-full w-full grayscale' : 'h-full w-full'}>
          {feed.image ? (
            <img src={feed.image} alt={`${feed.location} camera`} className="h-full w-full object-cover" />
          ) : (
            <PlantScene id={`scene-${feed.key}`} />
          )}
        </div>

        {isOffline && <div className="absolute inset-0 bg-white/45" />}

        <span className="absolute left-[10px] top-[10px] inline-flex items-center gap-[6px] rounded-full bg-white/95 px-[10px] py-[4px] text-[11.5px] font-semibold leading-4 text-ink shadow-card">
          <span className={`h-[7px] w-[7px] rounded-full ${STATUS_DOT[feed.status]}`} />
          {feed.status}
        </span>

        {feed.timecode && (
          <span className="absolute bottom-[9px] left-[11px] inline-flex items-center gap-[5px] text-[11px] font-medium leading-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
            <span className="h-[5px] w-[5px] rounded-full bg-danger" />
            {feed.timecode}
          </span>
        )}
      </div>

      <dl
        className={`mt-[14px] divide-y divide-line ${
          divider ? 'border-l border-line pl-[16px]' : 'pr-[16px]'
        }`}
      >
        {[
          ['Camera ID:', feed.id],
          ['Location:', feed.location],
          ['Last Active:', feed.lastActive],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-[10px] py-[10px]">
            <dt className="text-[13px] leading-[18px] text-ink-soft">{label}</dt>
            <dd className="text-right text-[13px] font-semibold leading-[18px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
