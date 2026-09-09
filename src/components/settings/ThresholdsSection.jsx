import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import { GroupTitle, PanelFooter, PanelHeader } from './parts'
import { alertThresholds, breachGraceOptions } from '../../data/mockData'

function NumInput({ value, onChange, suffix }) {
  return (
    <span className="relative block">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className={`h-[34px] w-full rounded-[8px] border border-line bg-white px-[11px] text-[13px] text-ink outline-none transition-colors focus:border-brand ${
          suffix ? 'pr-[26px]' : ''
        }`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-[10px] top-[8px] text-[12px] text-ink-muted">{suffix}</span>
      )}
    </span>
  )
}

export default function ThresholdsSection({ section }) {
  const [rows, setRows] = useState(alertThresholds)
  const [grace, setGrace] = useState(breachGraceOptions[1])

  const update = (key, field) => (value) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)))

  return (
    <>
      <PanelHeader title={section.label} blurb={section.blurb} />

      <div className="px-[22px] py-[20px]">
        <div className="flex items-center justify-between gap-4">
          <GroupTitle>Permissible limits</GroupTitle>
          <Button variant="ghost" className="h-[32px] px-[12px]" onClick={() => setRows(alertThresholds)}>
            <RotateCcw size={14} strokeWidth={2.2} />
            Reset to CPCB defaults
          </Button>
        </div>

        <div className="mt-[12px] overflow-hidden rounded-[10px] border border-line">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '19%' }} />
              <col style={{ width: '19%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-line bg-[#F7F9FC]">
                {['Parameter', 'Unit', 'Minimum', 'Maximum', 'Warn at'].map((h) => (
                  <th key={h} className="px-[14px] py-[12px] text-left text-[12.5px] font-medium leading-4 text-ink-soft">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-line last:border-0">
                  <td className="px-[14px] py-[11px] text-[13px] font-medium leading-[18px] text-ink">{r.parameter}</td>
                  <td className="px-[14px] py-[11px] text-[13px] leading-[18px] text-ink-muted">{r.unit}</td>
                  <td className="px-[14px] py-[11px]">
                    <NumInput value={r.min} onChange={update(r.key, 'min')} />
                  </td>
                  <td className="px-[14px] py-[11px]">
                    <NumInput value={r.max} onChange={update(r.key, 'max')} />
                  </td>
                  <td className="px-[14px] py-[11px]">
                    <NumInput value={r.warnAt} onChange={update(r.key, 'warnAt')} suffix="%" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <GroupTitle className="mt-[24px]">Breach handling</GroupTitle>
        <div className="mt-[12px] flex flex-wrap items-center justify-between gap-[14px] rounded-[10px] border border-line bg-[#FAFCFE] px-[15px] py-[13px]">
          <span className="min-w-0">
            <span className="block text-[13px] font-medium leading-[18px] text-ink">
              Raise a violation only after the breach persists for
            </span>
            <span className="mt-[3px] block text-[12px] leading-[17px] text-ink-muted">
              Stops brief spikes during backwash from being logged as violations.
            </span>
          </span>
          <Select options={breachGraceOptions} value={grace} onChange={setGrace} className="w-[152px]" align="right" />
        </div>
      </div>

      <PanelFooter>
        <Button variant="ghost" onClick={() => setRows(alertThresholds)}>Cancel</Button>
        <Button>Save changes</Button>
      </PanelFooter>
    </>
  )
}
