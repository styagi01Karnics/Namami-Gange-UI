export default function LivePill() {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-full bg-ok-soft px-[10px] py-[3px] text-[11.5px] font-semibold leading-4 text-ok">
      <span className="relative flex h-[7px] w-[7px]">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
        <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-ok" />
      </span>
      Live
    </span>
  )
}
