import { ico } from '../ui/Ico'
import GaugeSummaryCard from '../ui/GaugeSummaryCard'
import { stpManpower } from '../../data/mockData'

const PersonIcon = ico('fluent:person-32-filled')

export default function TotalEmployeesCard() {
  return (
    <GaugeSummaryCard
      icon={PersonIcon}
      label="Total Employees"
      total={stpManpower.totalEmployees}
      scopeLabel={stpManpower.scopeLabel}
      breakdown={stpManpower.breakdown}
      className="h-full"
      gaugeSize={172}
    />
  )
}
