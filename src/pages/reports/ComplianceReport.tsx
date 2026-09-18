import { useMemo, useState } from 'react'
import { ico } from '../../components/ui/Ico'
import ReportShell from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import StatCardsRow from '../../components/ui/StatCardsRow'
import GroupedTabs from '../../components/ui/GroupedTabs'
import Select from '../../components/ui/Select'
import StatusPill, { statusTone } from '../../components/ui/StatusPill'
import { StpLink, TwoLineDate } from '../../components/reports/cells'
import {
  complianceReportColumns,
  complianceReportParameters,
  complianceReportRows,
  complianceSummary,
  complianceTypes,
} from '../../data/mockData'

const ArrowOutIcon = ico('fluent:arrow-up-right-24-filled')

export default function ComplianceReport() {
  const [type, setType] = useState(complianceTypes[0])
  const [parameter, setParameter] = useState(complianceReportParameters[1])

  const rows = useMemo(() => {
    return complianceReportRows.filter(
      (r) => r.type === type && (parameter === 'All' || r.parameter === parameter),
    )
  }, [type, parameter])

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'stp':
        return <StpLink>{row.stp}</StpLink>
      case 'parameter':
        return (
          <>
            <span className="inline-flex rounded-[6px] bg-brand-soft px-[9px] py-[3px] text-[12px] font-semibold leading-4 text-brand">
              {row.parameter}
            </span>
            <span className="mt-[8px] flex w-fit items-center gap-[2px] rounded-[6px] bg-danger-soft px-[7px] py-[3px] text-[11.5px] font-semibold leading-4 text-danger">
              <ArrowOutIcon size={12} />
              {row.exceedance}
            </span>
          </>
        )
      case 'downtime':
        return (
          <>
            <span className="block text-[13px] font-medium leading-[18px] text-orange">{row.downtime}</span>
            <span className="mt-[8px] inline-flex rounded-[6px] bg-danger-soft px-[8px] py-[3px] text-[11.5px] font-medium leading-4 text-danger">
              Penalty : {row.penalty}
            </span>
          </>
        )
      case 'detectedOn':
        return <TwoLineDate date={row.date} time={row.time} />
      case 'status':
        return <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
      default:
        return row[col.key]
    }
  }

  return (
    <ReportShell>
      <StatCardsRow items={complianceSummary} />
      <ReportTable
        columns={complianceReportColumns}
        rows={rows}
        searchKeys={['stp', 'id', 'type', 'parameter', 'location', 'status']}
        leading={<GroupedTabs tabs={complianceTypes} active={type} onChange={setType} />}
        toolbar={
          <Select
            options={complianceReportParameters}
            value={parameter}
            onChange={setParameter}
            className="w-[140px]"
            buttonClassName="h-[34px]"
          />
        }
        renderCell={renderCell}
        minWidth={1120}
        emptyMessage={`No ${parameter === 'All' ? '' : `${parameter} `}violations under "${type}".`}
        exportTitle="Compliance Report"
        exportFileName="compliance-report"
        exportValue={(row, col) => {
          if (col.key === 'parameter') return `${row.parameter} (${row.exceedance})`
          if (col.key === 'downtime') return `${row.downtime} (Penalty: ${row.penalty})`
          if (col.key === 'detectedOn') return `${row.date} ,${row.time}`
          return undefined
        }}
      />
    </ReportShell>
  )
}
