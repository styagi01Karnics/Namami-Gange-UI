import TotalEmployeesCard from './TotalEmployeesCard'
import AttendanceTrendsCard from './AttendanceTrendsCard'
import StaffAvailabilityCard from './StaffAvailabilityCard'
import DepartmentStatusCard from './DepartmentStatusCard'

export default function ManpowerTab({ stpName, stpId }) {
  return (
    <div className="space-y-[12px]">
      <div className="grid grid-cols-[0.95fr_1fr] items-stretch gap-[12px]">
        <TotalEmployeesCard stpId={stpId} />
        <AttendanceTrendsCard stpId={stpId} />
      </div>

      <div className="grid grid-cols-[1.86fr_1fr] items-start gap-[12px]">
        <StaffAvailabilityCard stpName={stpName} stpId={stpId} />
        <DepartmentStatusCard stpId={stpId} />
      </div>
    </div>
  )
}
