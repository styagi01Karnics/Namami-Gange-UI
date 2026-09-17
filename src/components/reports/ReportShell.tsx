import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Select from '../ui/Select'
import DateRangeField from '../ui/DateRangeField'
import SectionTabs from '../stp/SectionTabs'
import { ExportMetaProvider } from '../export/exportMeta'
import { REPORT_TABS } from '../../routes'
import { defaultDateRange, reportStpOptions } from '../../data/mockData'

const TAB_LABELS = REPORT_TABS.map((t) => t.label)

/** Filter bar + tab strip + page body shared by all five Data Reports sub-pages. */
export default function ReportShell({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [stp, setStp] = useState(reportStpOptions[0])
  const [range, setRange] = useState(defaultDateRange)

  const active = REPORT_TABS.find((t) => t.path === pathname)?.label ?? TAB_LABELS[0]
  const openTab = (label) => navigate(REPORT_TABS.find((t) => t.label === label).path)

  return (
    <ExportMetaProvider value={{ rangeLabel: range, badge: null, address: null }}>
      <div className="flex flex-col gap-[16px] pb-[22px]">
        <div className="flex items-center justify-end gap-[16px]">
          <Select options={reportStpOptions} value={stp} onChange={setStp} className="w-[33%]" align="right" />
          <DateRangeField value={range} onChange={setRange} className="w-[28%]" />
        </div>

        <SectionTabs tabs={TAB_LABELS} active={active} onChange={openTab} />

        {children}
      </div>
    </ExportMetaProvider>
  )
}
