import { LayoutPanelTop } from 'lucide-react'

/** Shown for tabs whose Figma design hasn't been handed over yet. */
export default function TabPlaceholder({ name }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D6E3F2] bg-[#FAFCFE] px-6 text-center">
      <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-brand-soft">
        <LayoutPanelTop size={22} className="text-brand" strokeWidth={1.9} />
      </span>
      <p className="mt-[14px] text-[14.5px] font-semibold text-ink">{name}</p>
      <p className="mt-[6px] max-w-[380px] text-[12.5px] leading-[18px] text-ink-muted">
        Design pending. Drop the Figma for this tab and it slots in here — data goes in
        <code className="mx-1 rounded bg-white px-[5px] py-[1px] text-[11.5px] text-ink-soft">src/data/mockData.js</code>
        like the rest.
      </p>
    </div>
  )
}
