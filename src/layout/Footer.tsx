import Logo from '../components/ui/Logo'

export default function Footer() {
  return (
    <footer className="relative z-30 flex shrink-0 items-center justify-between border-t border-line bg-white px-[24px] py-[10px] text-[12px] text-ink-muted">
      <div className="flex items-center gap-[10px]">
        <Logo compact className="shrink-0 h-[32px] w-auto" />
        <span className="text-[12px] font-medium text-ink">Namami Gange</span>
      </div>
      <div className="flex items-center gap-[20px] text-[11px]">
        <span> &copy; National Mission for Clean Ganga</span>
        <span>Version 1.0.0</span>
      </div>
    </footer>
  )
}
