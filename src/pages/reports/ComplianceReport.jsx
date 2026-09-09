import { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import ReportShell from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import StatCardsRow from '../../components/ui/StatCardsRow'
import Select from '../../components/ui/Select'
import StatusPill, { statusTone } from '../../components/ui/StatusPill'
import { StpLink, TwoLineDate } from '../../components/reports/cells'
import {
  complianceBasisOptions,
  complianceReportColumns,
  complianceReportParameters,
  complianceReportRows,
  complianceSummary,
} from '../../data/mockData'

export default function ComplianceReport() {
  const [basis, setBasis] = useState(complianceBasisOptions[0])
  const [parameter, setParameter] = useState(complianceReportParameters[1])

  const rows = useMemo(() => {
    const wantedType = basis.replace('Based On ', '')
    return complianceReportRows.filter(
      (r) => r.type === wantedType && (parameter === 'All' || r.parameter === parameter),
    )
  }, [basis, parameter])

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
              <ArrowUpRight size={12} strokeWidth={2.6} />
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
      <StatCardsRow items={complianceSummary} noteChip />
      <ReportTable
        columns={complianceReportColumns}
        rows={rows}
        searchKeys={['stp', 'id', 'type', 'parameter', 'location', 'status']}
        toolbar={
          <Select
            options={complianceBasisOptions}
            value={basis}
            onChange={setBasis}
            className="w-[234px]"
            buttonClassName="h-[34px]"
          />
        }
        filters={
          <div className="flex flex-wrap items-center gap-[4px]">
            {complianceReportParameters.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setParameter(p)}
                className={`rounded-[8px] px-[15px] py-[8px] text-[13px] font-medium leading-4 transition-colors ${
                  parameter === p ? 'bg-brand text-white' : 'text-ink hover:bg-brand-soft'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
        renderCell={renderCell}
        minWidth={1120}
        emptyMessage={`No ${parameter === 'All' ? '' : `${parameter} `}violations under "${basis}".`}
      />
    </ReportShell>
  )
}
