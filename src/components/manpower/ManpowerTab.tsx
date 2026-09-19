import { useState } from 'react'
import TotalEmployeesCard from './TotalEmployeesCard'
import AttendanceTrendsCard from './AttendanceTrendsCard'
import StaffAvailabilityCard from './StaffAvailabilityCard'
import DepartmentStatusCard from './DepartmentStatusCard'

export default function ManpowerTab() {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const toggleDetails = () => setDetailsOpen((v) => !v)

  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-[0.95fr_1fr] items-stretch gap-[14px] [&>*]:min-w-0">
        <TotalEmployeesCard />
        <AttendanceTrendsCard />
      </div>

      {/* The staff table scrolls inside its card, so the grid children must be
          allowed to shrink past its min-width or they starve the right column. */}
      <div className="grid grid-cols-[1.9fr_1fr] items-stretch gap-[12px] [&>*]:min-w-0">
        <StaffAvailabilityCard open={detailsOpen} onToggle={toggleDetails} />
        <DepartmentStatusCard open={detailsOpen} onToggle={toggleDetails} />
      </div>
    </div>
  )
}
