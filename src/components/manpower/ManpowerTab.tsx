import { useState } from 'react'
import MetricRingCard from '../ui/MetricRingCard'
import StaffAvailabilityCard from './StaffAvailabilityCard'
import { stpManpower } from '../../data/mockData'

export default function ManpowerTab() {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const { totalEmployees, breakdown } = stpManpower
  const present = breakdown.find((b) => b.key === 'present')
  const absent = breakdown.find((b) => b.key === 'absent')
  const leave = breakdown.find((b) => b.key === 'leave')

  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-4 gap-[16px]">
        <MetricRingCard label="Total Employees" value={totalEmployees} tone="brand" />
        <MetricRingCard
          label="Present"
          value={present?.value ?? 0}
          percent={83.33}
          percentLabel={present?.percent ?? '83.33%'}
          tone="ok"
        />
        <MetricRingCard
          label="Absent"
          value={absent?.value ?? 0}
          percent={10}
          percentLabel={absent?.percent ?? '10%'}
          tone="danger"
        />
        <MetricRingCard
          label="On Leave"
          value={leave?.value ?? 0}
          percent={10}
          percentLabel={leave?.percent ?? '10%'}
          tone="orange"
        />
      </div>

      <StaffAvailabilityCard open={detailsOpen} onToggle={() => setDetailsOpen((v) => !v)} />
    </div>
  )
}
