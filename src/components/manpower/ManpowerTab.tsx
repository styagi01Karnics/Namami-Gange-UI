import TotalEmployeesCard from './TotalEmployeesCard'
import AttendanceTrendsCard from './AttendanceTrendsCard'
import StaffAvailabilityCard from './StaffAvailabilityCard'
import DepartmentStatusCard from './DepartmentStatusCard'

export default function ManpowerTab() {
  return (
    <div className="space-y-[12px]">
      <div className="grid grid-cols-[0.95fr_1fr] items-stretch gap-[12px] [&>*]:min-w-0">
        <TotalEmployeesCard />
        <AttendanceTrendsCard />
      </div>

      {/* The staff table scrolls inside its card, so the grid children must be
          allowed to shrink past its min-width or they starve the right column. */}
      <div className="grid grid-cols-[1.9fr_1fr] items-start gap-[12px] [&>*]:min-w-0">
        <StaffAvailabilityCard />
        <DepartmentStatusCard />
      </div>
    </div>
  )
}
