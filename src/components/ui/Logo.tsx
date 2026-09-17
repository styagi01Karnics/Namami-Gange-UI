const SIZES = {
  hero: 'h-[104px] w-auto max-w-[240px]',
  sidebar: 'h-[128px] w-auto max-w-[248px]',
  compact: 'h-[60px] w-auto max-w-[72px]',
  default: 'h-[62px] w-auto max-w-[186px]',
}

type LogoProps = {
  compact?: boolean
  hero?: boolean
  sidebar?: boolean
  className?: string
}

export default function Logo({ compact = false, hero = false, sidebar = false, className = '' }: LogoProps) {
  const size = hero ? 'hero' : compact ? 'compact' : sidebar ? 'sidebar' : 'default'

  return (
    <img
      src="/logo.png"
      alt="Namami Gange"
      className={`${SIZES[size]} object-contain ${className}`.trim()}
    />
  )
}
