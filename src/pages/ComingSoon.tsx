import { ico } from '../components/ui/Ico'
import Card from '../components/ui/Card'
import type { ReactNode } from 'react'

const HammerIcon = ico('fluent:hammer-24-filled')

export default function ComingSoon({ title }: { title: ReactNode }) {
  return (
    <Card className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-brand-soft">
        <HammerIcon size={24} className="text-brand" />
      </span>
      <h2 className="mt-[16px] text-[17px] font-semibold text-ink">{title}</h2>
      <p className="mt-[8px] max-w-[420px] text-[13px] leading-[19px] text-ink-muted">
        This section hasn&rsquo;t been designed yet. Hand over the Figma frame and it drops in
        alongside Dashboard and STP Management.
      </p>
    </Card>
  )
}
