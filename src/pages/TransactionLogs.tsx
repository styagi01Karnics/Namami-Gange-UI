import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import TransactionLogsTab from '../components/transactions/TransactionLogsTab'
import { ExportMetaProvider, stpExportMeta } from '../components/export/exportMeta'
import { defaultDateRange } from '../data/mockData'
import {
  FALLBACK_PLANT_OPTIONS,
  fetchDashboardPlants,
  resolveStpDetail,
  toPlantOptions,
} from '../api/plants'
import { useSharedRefreshTick } from '../hooks/useSharedRefreshTick'

export default function TransactionLogs() {
  const [plantOptions, setPlantOptions] = useState(FALLBACK_PLANT_OPTIONS)
  const [plantCode, setPlantCode] = useState(FALLBACK_PLANT_OPTIONS[0]?.id)
  const [range, setRange] = useState(defaultDateRange)

  useEffect(() => {
    let cancelled = false

    async function loadPlants() {
      const plants = await fetchDashboardPlants()
      if (cancelled || plants.length === 0) return

      const next = toPlantOptions(plants)
      setPlantOptions(next)
      setPlantCode((current) => (next.some((option) => option.id === current) ? current : next[0].id))
    }

    loadPlants()
    return () => {
      cancelled = true
    }
  }, [])

  const selectedPlant = useMemo(
    () => plantOptions.find((option) => option.id === plantCode) ?? plantOptions[0],
    [plantOptions, plantCode],
  )
  const stp = resolveStpDetail(selectedPlant)
  const refreshTick = useSharedRefreshTick(Boolean(selectedPlant?.plantCode))

  return (
    <ExportMetaProvider value={stpExportMeta(stp, range)}>
      <div className="flex flex-col gap-[15px] pb-[22px]">
        <Select
          options={plantOptions}
          value={selectedPlant?.id}
          onChange={setPlantCode}
          className="w-1/2 self-end"
          align="right"
        />

        <StpHeaderCard stp={stp} showPenalty={false} />

        <Card className="p-[15px]">
          <DateRangeField value={range} onChange={setRange} className="ml-auto w-[54%]" />

          <div className="mt-[15px]">
            <TransactionLogsTab plantCode={selectedPlant?.plantCode} refreshTick={refreshTick} />
          </div>
        </Card>
      </div>
    </ExportMetaProvider>
  )
}
