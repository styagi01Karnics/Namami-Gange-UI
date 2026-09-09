import { useState } from 'react'
import Select from '../ui/Select'
import DateRangeField from '../ui/DateRangeField'
import { defaultDateRange, reportStpOptions } from '../../data/mockData'

/** Filter bar + page body shared by all five Data Reports sub-pages. */
export default function ReportShell({ children }) {
  const [stp, setStp] = useState(reportStpOptions[0])
  const [range, setRange] = useState(defaultDateRange)

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <div className="flex items-center justify-end gap-[16px]">
        <Select options={reportStpOptions} value={stp} onChange={setStp} className="w-[33%]" align="right" />
        <DateRangeField value={range} onChange={setRange} className="w-[28%]" />
      </div>

      {children}
    </div>
  )
}
