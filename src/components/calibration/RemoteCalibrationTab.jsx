import { useMemo, useState } from 'react'
import Avatar from '../ui/Avatar'
import CheckboxChip from '../ui/CheckboxChip'
import StatusPill, { statusTone } from '../ui/StatusPill'
import ReportTable from '../reports/ReportTable'
import { calibrationColumns, calibrationPoints, calibrationRows } from '../../data/mockData'
import { filterRowsByStp } from '../../utils/stpScope'

export default function RemoteCalibrationTab({ stpId }) {
  const [points, setPoints] = useState(() =>
    Object.fromEntries(calibrationPoints.map((p) => [p.key, p.defaultChecked])),
  )

  const rows = useMemo(
    () =>
      filterRowsByStp(calibrationRows, stpId)
        .filter((r) => points[r.point])
        .map((r, i) => ({ ...r, sno: i + 1 })),
    [points, stpId],
  )

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'performedBy':
        return (
          <span className="flex items-center gap-[10px] text-[13px] leading-[18px] text-ink">
            <Avatar size={30} />
            {row.performedBy}
          </span>
        )
      case 'status':
        return <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
      case 'remarks':
        return (
          <span className="block rounded-[8px] bg-[#EFF4FA] px-[14px] py-[12px] text-[13px] leading-[22px] text-ink">
            {row.remarks}
          </span>
        )
      default:
        return row[col.key]
    }
  }

  return (
    <ReportTable
      nested
      columns={calibrationColumns}
      rows={rows}
      searchKeys={['performedBy', 'analyzer', 'status', 'certificate']}
      searchPlaceholder="Search STP"
      toolbar={calibrationPoints.map((p) => (
        <CheckboxChip
          key={p.key}
          label={p.label}
          checked={points[p.key]}
          onChange={(next) => setPoints((prev) => ({ ...prev, [p.key]: next }))}
        />
      ))}
      renderCell={renderCell}
      minWidth={1120}
      emptyMessage="Select a sampling point to see calibration records."
    />
  )
}
