import { User } from 'lucide-react'
import GaugeSummaryCard from '../ui/GaugeSummaryCard'
import { getStpPageMetrics, stpManpower } from '../../data/mockData'

export default function TotalEmployeesCard({ stpId }) {
  const manpower = getStpPageMetrics(stpId)?.manpower ?? stpManpower

  return (
    <GaugeSummaryCard
      icon={User}
      label="Total Employees"
      total={manpower.totalEmployees}
      scopeLabel={manpower.scopeLabel}
      breakdown={manpower.breakdown}
    />
  )
}
