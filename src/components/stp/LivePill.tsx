export default function LivePill() {
  return (
    <span className="inline-flex h-[24px] items-center gap-[4px] rounded-full bg-[#EAF3EC] px-[6px] text-[12px] font-semibold leading-4 text-[#168E3F]">
      <span className="relative flex h-[8px] w-[8px]">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#168E3F] opacity-60" />
        <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-[#168E3F]" />
      </span>
      Live
    </span>
  )
}
