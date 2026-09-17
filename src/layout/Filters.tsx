import { useState } from 'react'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import { defaultDateRange, stateOptions } from '../data/mockData'

export default function Filters() {
  const [range, setRange] = useState(defaultDateRange)
  const [state, setState] = useState(stateOptions[0])

  return (
    <div className="flex items-center justify-end gap-[14px] pb-[14px] pr-[2px]">
      <DateRangeField value={range} onChange={setRange} className="w-[262px] shadow-card" />
      <Select
        options={stateOptions}
        value={state}
        onChange={setState}
        className="w-[196px]"
        buttonClassName="shadow-card"
        align="right"
      />
    </div>
  )
}
