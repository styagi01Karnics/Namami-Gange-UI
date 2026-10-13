import { useMemo, useState } from 'react'
import { Activity, Download, List, RefreshCw, LineChart as LineChartIcon } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { liveStpData } from '../../data/mockData'
import Card from '../ui/Card'

type ParameterKey = 'BOD' | 'pH' | 'TSS' | 'COD'

const PARAMS: Record<ParameterKey, { unit: string; limit?: number; min?: number; ideal?: string; label: string }> = {
  BOD: { unit: 'mg/L', limit: 10, min: 0, ideal: '0 – 10', label: 'Biochemical Oxygen Demand' },
  'pH': { unit: 'pH', limit: 9, min: 5.5, ideal: '5.5 – 9', label: 'pH' },
  TSS: { unit: 'mg/L', limit: 20, min: 0, ideal: '0 – 20', label: 'Total Suspended Solids' },
  COD: { unit: 'mg/L', limit: 50, min: 0, ideal: '0 – 50', label: 'Chemical Oxygen Demand' },
}

const COLORS = ['#2588EE', '#16B98B', '#FF6265', '#FF941F', '#8B5CF6', '#EC58A5', '#12B8D2', '#F5B700', '#3F75D5', '#19A97C', '#F04444', '#28B7E5', '#7C8BA1']
const CHART_POINTS = 25

function seriesValue(stpIndex: number, pointIndex: number, parameter: ParameterKey) {
  const config = PARAMS[parameter]
  const base = parameter === 'COD'
    ? [29, 34, 43, 24, 23, 37, 26, 32, 20, 39, 31, 28, 21][stpIndex]
    : parameter === 'BOD'
      ? [5.2, 4.7, 8.1, 3.8, 4.4, 6.2, 5.5, 5.3, 3.2, 6.8, 5.1, 4.9, 3.6][stpIndex]
      : parameter === 'TSS'
        ? [14, 18, 24, 12, 16, 21, 19, 15, 11, 22, 17, 13, 10][stpIndex]
        : (parameter as string) === 'NO₃-N'
          ? [6.0, 6.4, 8.1, 5.6, 7.2, 6.8, 5.4, 6.3, 4.8, 8.4, 6.2, 5.9, 7.0][stpIndex]
          : (parameter as string) === 'Totalizer'
            ? 0
            : [7.1, 7.3, 8.8, 7.0, 7.4, 7.2, 7.6, 7.4, 7.1, 8.4, 7.3, 7.5, 7.2][stpIndex]
  const variation = parameter === 'pH' ? 0.3 : (parameter as string) === 'Totalizer' ? 80 : (config.limit ?? 10) * 0.085
  const secondaryVariation = parameter === 'pH' ? 0.14 : (parameter as string) === 'Totalizer' ? 35 : (config.limit ?? 10) * 0.045
  const wave = Math.sin(pointIndex * 0.72 + stpIndex * 1.37) * variation
    + Math.cos(pointIndex * 0.31 + stpIndex * 0.83) * secondaryVariation
  return Number(Math.max(0, base + wave).toFixed(1))
}

function timeLabels() {
  return Array.from({ length: CHART_POINTS }, (_, i) => `${String(Math.floor(i * 24 / (CHART_POINTS - 1))).padStart(2, '0')}:00`)
}

export default function RealtimeStpTrendsCard() {
  const [parameter, setParameter] = useState<ParameterKey>('COD')
  const [view, setView] = useState<'graph' | 'list'>('graph')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(() => new Set(liveStpData.map((stp) => stp.id)))
  const config = PARAMS[parameter]

  const rows = useMemo(() => {
    const labels = timeLabels()
    return labels.map((time, pointIndex) => {
      const row: Record<string, string | number> = { time }
      liveStpData.forEach((stp, stpIndex) => {
        row[stp.id] = seriesValue(stpIndex, pointIndex, parameter)
      })
      return row
    })
  }, [parameter])

  const filteredPlants = liveStpData.filter((stp) => stp.name.toLowerCase().includes(search.toLowerCase()))
  const allPlantsSelected = liveStpData.every((stp) => selected.has(stp.id))
  const currentValues = liveStpData.map((stp, index) => ({
    stp,
    value: seriesValue(index, CHART_POINTS - 1, parameter),
    trend: Math.sin(index * 2.1 + 1) > 0 ? 'up' : 'down',
  }))
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const splitIndex = Math.ceil(liveStpData.length / 2)
  const visibleGroups = [liveStpData.slice(0, splitIndex), liveStpData.slice(splitIndex)]
  const matrixStatus = (value: number) => {
    if (config.min === undefined || config.limit === undefined) return 'normal'
    if (value < config.min || value > config.limit) return 'breach'
    const width = config.limit - config.min
    const nearLower = value < config.min + width * 0.12
    const nearUpper = value > config.limit - width * 0.12
    return nearLower || nearUpper ? 'warning' : 'normal'
  }

  const MATRIX_COLORS = {
    normal: 'bg-[#DDF8E8] text-[#155B37]',
    warning: 'bg-[#FFF1BD] text-[#73530A]',
    breach: 'bg-[#FFDADA] text-[#8F2222]',
  }

  const togglePlant = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const downloadCsv = () => {
    const plantHeaders = liveStpData.filter((stp) => selected.has(stp.id))
    const content = [
      ['Time', ...plantHeaders.map((stp) => stp.name)].join(','),
      ...rows.map((row) => [row.time, ...plantHeaders.map((stp) => row[stp.id])].join(',')),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `stp-${parameter.toLowerCase()}-24h-preview.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="overflow-hidden rounded-[14px] border-[#DDECFB] p-3 shadow-[0_5px_20px_rgba(7,104,210,0.10)] sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[10px] bg-[#EAF4FF] text-[#1268E8]"><Activity size={21} /></span>
          <div>
            <h2 className="text-[15px] font-bold leading-5 text-[#102653] sm:text-[17px]">Real-Time Parameter Trends - All 13 STPs</h2>
            <p className="text-[12px] font-medium leading-4 text-[#7085A2]">Compare parameter values across all STPs</p>
          </div>
        </div>
        <div className="flex flex-nowrap items-end gap-2">
          <div className="flex shrink-0 flex-col gap-1 text-[11px] font-medium text-[#647A96]">
            <span>Ideal Range</span>
            <span className="inline-flex h-9 items-center">
              <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#EAF4FF] px-2 text-[10px] font-semibold text-[#1673E6]">
                {config.ideal ? `${config.ideal} ${config.unit}` : 'Not specified'}
              </span>
            </span>
          </div>
          <div className="flex shrink-0 flex-col gap-1 text-[11px] font-medium text-[#647A96]">
            <label htmlFor="trend-parameter">Parameter</label>
            <div className="flex h-9 items-center">
              <select id="trend-parameter" value={parameter} onChange={(event) => setParameter(event.target.value as ParameterKey)} className="h-9 rounded-[7px] border border-[#DCE8F5] bg-white px-2 text-[12px] font-semibold text-[#273B56] outline-none focus:border-brand">
                {Object.entries(PARAMS).map(([key, item]) => <option key={key} value={key}>{key} ({item.unit})</option>)}
              </select>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-1 text-[11px] font-medium text-[#647A96]">
            Time Range
            <div className="flex h-9 items-center rounded-[7px] border border-[#E2ECF7] bg-[#F6FAFE] p-[2px]">
              <span className="flex h-[29px] items-center rounded-[5px] bg-[#1673E6] px-3 text-[11px] font-semibold text-white shadow-sm">24H</span>
            </div>
          </div>
          <div className="flex h-9 shrink-0 items-center rounded-[7px] border border-[#E2ECF7] bg-white p-[2px]">
            <button type="button" onClick={() => setView('graph')} className={`flex h-[29px] items-center gap-1 rounded-[5px] px-2 text-[11px] font-semibold ${view === 'graph' ? 'bg-[#1673E6] text-white' : 'text-[#51647D]'}`}><LineChartIcon size={14} /> Graphical View</button>
            <button type="button" onClick={() => setView('list')} className={`flex h-[29px] items-center gap-1 rounded-[5px] px-2 text-[11px] font-semibold ${view === 'list' ? 'bg-[#1673E6] text-white' : 'text-[#51647D]'}`}><List size={14} /> List View</button>
          </div>
          <button type="button" onClick={downloadCsv} title="Download trend data CSV" className="grid size-9 place-items-center rounded-[7px] border border-[#E2ECF7] text-[#43617F] hover:bg-[#F5F9FE]"><Download size={16} /></button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_230px]">
        <div className="min-w-0 rounded-[9px] border border-[#E5EEF8] bg-white p-2">
          {view === 'graph' ? (
            <div className="h-[220px] w-full sm:h-[258px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="#EAF0F7" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#526780' }} tickLine={false} axisLine={{ stroke: '#DCE7F2' }} interval="preserveStartEnd" />
                  <YAxis width={42} tick={{ fontSize: 11, fill: '#526780' }} tickLine={false} axisLine={false} domain={[0, 'auto']} label={{ value: `${parameter} (${config.unit})`, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#526780' }} />
                  <Tooltip contentStyle={{ border: '1px solid #DCE8F5', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#60758D', fontWeight: 600 }} formatter={(value, name) => [`${value} ${config.unit}`, liveStpData.find((plant) => plant.id === name)?.name ?? name]} />
                  {liveStpData.map((stp, index) => selected.has(stp.id) && <Line key={stp.id} type="monotone" dataKey={stp.id} name={stp.id} stroke={COLORS[index]} strokeWidth={1.6} dot={false} activeDot={{ r: 3 }} isAnimationActive={false} />)}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="max-h-[320px] overflow-auto">
              <table className="w-full min-w-[900px] border-separate border-spacing-[1px] text-left text-[11px]">
                <thead className="sticky top-0 z-[2] text-center text-[10px] font-semibold text-[#526780]">
                  <tr>
                    <th className="sticky left-0 z-[3] w-9 bg-[#EFF7FF] px-2 py-1.5">#</th>
                    <th className="sticky left-9 z-[3] min-w-[190px] bg-[#EFF7FF] px-2 py-1.5 text-left">STP Name</th>
                    <th className="w-[90px] bg-[#EFF7FF] px-2 py-1.5">Capacity<br />(MLD)</th>
                    <th className="w-[120px] bg-[#EFF7FF] px-2 py-1.5">{parameter}<br />({config.unit})<br />{config.ideal ?? '—'}</th>
                    <th className="w-[110px] bg-[#EFF7FF] px-2 py-1.5">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {liveStpData.filter((stp) => selected.has(stp.id)).map((stp) => {
                    const index = liveStpData.findIndex((plant) => plant.id === stp.id)
                    return (
                      <tr key={stp.id} className="h-[34px] text-center">
                        <td className="sticky left-0 z-[1] bg-white px-2 py-1 text-[#647A96]">{index + 1}</td>
                        <td className="sticky left-9 z-[1] bg-white px-2 py-1 text-left font-semibold text-[#245077]" title={stp.name}>{stp.name}</td>
                        <td className="bg-white px-2 py-1">{stp.name.match(/[\d.]+/)?.[0] ?? '—'}</td>
                        {(() => {
                          const value = currentValues[index].value
                          const status = matrixStatus(value)
                          return <td className={`px-2 py-1 font-semibold ${MATRIX_COLORS[status]}`}>{value.toFixed(1)}</td>
                        })()}
                        <td className="bg-white px-2 py-1 text-[#647A96]">{currentTime}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="flex min-h-0 flex-col rounded-[9px] border border-[#E5EEF8] bg-white p-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[12px] font-bold text-[#243955]">STP List ({liveStpData.length})</h3>
            <button
              type="button"
              aria-pressed={allPlantsSelected}
              onClick={() => setSelected(allPlantsSelected ? new Set() : new Set(liveStpData.map((stp) => stp.id)))}
              className="text-[11px] font-semibold text-[#1673E6] hover:underline"
            >
              {allPlantsSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search STP..." className="mt-1.5 h-8 rounded-[6px] border border-[#E4ECF5] px-2 text-[11px] outline-none focus:border-brand" />
          <div className="scroll-thin mt-1.5 max-h-[206px] space-y-0.5 overflow-y-auto">
            {filteredPlants.map((stp) => {
              const index = liveStpData.findIndex((plant) => plant.id === stp.id)
              const value = currentValues[index].value
              return (
                <label key={stp.id} className="flex cursor-pointer items-center gap-1.5 rounded-[5px] px-1 py-1 hover:bg-[#F6FAFE]">
                  <input type="checkbox" checked={selected.has(stp.id)} onChange={() => togglePlant(stp.id)} className="size-3.5 accent-[#1673E6]" />
                    <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-[#344A63]" title={stp.name}>{stp.name}</span>
                    <span className="rounded-full bg-[#EAF4FF] px-1.5 py-0.5 text-[11px] font-semibold text-[#3479BD]">{value}</span>
                </label>
              )
            })}
          </div>
        </aside>
      </div>

      <section className="mt-3 rounded-[9px] border border-[#E5EEF8] bg-white p-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <h3 className="text-[11px] font-bold text-[#243955]">Current Values - {parameter} ({config.unit})</h3>
          <span className="flex items-center gap-1 text-[11px] text-[#71849B]">Last Updated: {currentTime} <RefreshCw size={12} /></span>
        </div>
            <div className="scroll-thin mt-2 grid grid-cols-2 gap-1.5 overflow-x-auto pb-1 sm:grid-cols-4 xl:grid-cols-7 2xl:grid-cols-[repeat(13,minmax(0,1fr))]">
          {currentValues.map(({ stp, value }, index) => (
            <div key={stp.id} className={`min-w-0 rounded-[7px] border p-2 ${selected.has(stp.id) ? 'border-[#E5EEF8] bg-[#FBFDFF]' : 'border-[#EDF1F6] bg-[#F7F8FA] opacity-55'}`}>
              <div className="flex min-w-0 items-center gap-1">
                <span className="grid size-[18px] shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: COLORS[index] }}>{index + 1}</span>
                <span className="truncate text-[10px] font-semibold leading-[13px] text-[#536981]" title={stp.name}>{stp.name}</span>
              </div>
              <p className="mt-2 text-center text-[15px] font-bold leading-5 text-[#192F56]">{value.toFixed(1)}<span className="ml-0.5 text-[10px] font-medium text-[#7A90AB]">{config.unit}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-[9px] border border-[#E5EEF8] bg-white p-2">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h3 className="text-[11px] font-bold text-[#243955]">All STPs - Current Reading ({parameter})</h3>
          <div className="flex items-center gap-2 text-[11px] text-[#637891]"><span className="size-2.5 rounded-full bg-[#16B98B]" /> Normal <span className="size-2.5 rounded-full bg-[#F5B700]" /> Warning <span className="size-2.5 rounded-full bg-[#F04444]" /> Breach</div>
        </div>
        <div className="mt-1.5 grid grid-cols-1 gap-2 xl:grid-cols-2">
          {visibleGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="overflow-x-auto">
              <table className="w-full min-w-[420px] table-fixed border-collapse text-left text-[11px]">
                <thead className="bg-[#EFF7FF] text-[#526780]"><tr><th className="w-5 p-1">#</th><th className="p-1">STP Name</th><th className="w-14 p-1">Capacity</th><th className="w-[90px] p-1">Current ({config.unit})</th><th className="w-16 p-1">Limit</th></tr></thead>
                <tbody>{group.map((stp) => {
                  const index = liveStpData.findIndex((plant) => plant.id === stp.id)
                  const value = currentValues[index].value
                  return <tr key={stp.id} className="border-b border-[#E8F0F8] last:border-0"><td className="p-1 text-[#647A96]">{index + 1}</td><td className="truncate p-1 font-medium text-[#245077]" title={stp.name}>{stp.name}</td><td className="p-1">{stp.name.match(/[\d.]+/)?.[0] ?? '—'}</td><td className="p-1 font-semibold">{value.toFixed(1)}</td><td className="p-1">{config.ideal ?? '—'}</td></tr>
                })}</tbody>
              </table>
            </div>
          ))}
        </div>
      </section>
      
    </Card>
  )
}
