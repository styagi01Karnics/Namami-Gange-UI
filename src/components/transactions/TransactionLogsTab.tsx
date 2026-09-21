import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import { useTableExport } from '../export/useTableExport'
import StreamTransactionPanel from './StreamTransactionPanel'
import { stpStreams } from '../../data/mockData'
import {
  fetchTransactionLogs,
  getFallbackTransactionLogs,
  type TransactionStreamData,
} from '../../api/transactionLogs'

const EXPORT_COLUMNS = [
  { key: 'stream', label: 'Stream' },
  { key: 'txnId', label: 'ID' },
  { key: 'uniqueId', label: 'Unique ID' },
  { key: 'status', label: 'Status' },
  { key: 'timestamp', label: 'Created At' },
]

function pinBlockToTop(container: HTMLElement, block: HTMLElement) {
  const headerH = container.querySelector('thead')?.getBoundingClientRect().height ?? 0
  const cRect = container.getBoundingClientRect()
  const bRect = block.getBoundingClientRect()
  container.scrollTop += bRect.top - cRect.top - headerH - 8
}

/**
 * Shared by the Transaction Logs page and its tab in STP Management — the two
 * streams sit side by side so a reading can be compared inlet to outlet.
 */
export default function TransactionLogsTab({
  plantCode,
  refreshTick = 0,
}: {
  plantCode?: string
  refreshTick?: number
}) {
  const [query, setQuery] = useState('')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [streams, setStreams] = useState<{
    influent: TransactionStreamData
    effluent: TransactionStreamData
  }>(() => getFallbackTransactionLogs())
  const [loading, setLoading] = useState(false)

  const scrollEls = useRef<Record<string, HTMLDivElement | null>>({})
  const syncingScroll = useRef(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const lastPlantCode = useRef<string | undefined>(undefined)

  const registerScrollEl = useCallback((key: string, node: HTMLDivElement | null) => {
    scrollEls.current[key] = node
  }, [])

  const syncScrollFrom = useCallback((sourceKey: string, scrollTop: number) => {
    if (syncingScroll.current) return
    syncingScroll.current = true

    Object.entries(scrollEls.current).forEach(([key, el]) => {
      if (key !== sourceKey && el && el.scrollTop !== scrollTop) {
        el.scrollTop = scrollTop
      }
    })

    window.requestAnimationFrame(() => {
      syncingScroll.current = false
    })
  }, [])

  const focusExpandedRows = useCallback((key: string) => {
    const run = () => {
      syncingScroll.current = true

      // 1) Pin each table so the selected row sits under the sticky header.
      Object.values(scrollEls.current).forEach((container) => {
        if (!container) return
        const block = container.querySelector<HTMLElement>(`[data-txn-key="${CSS.escape(key)}"]`)
        if (block) pinBlockToTop(container, block)
      })

      // 2) Keep both tables aligned.
      const leadTop = scrollEls.current.influent?.scrollTop ?? scrollEls.current.effluent?.scrollTop ?? 0
      Object.values(scrollEls.current).forEach((el) => {
        if (el) el.scrollTop = leadTop
      })

      // 3) Bring the expanded reading into the page viewport so all fields are readable.
      const primary =
        scrollEls.current.influent?.querySelector<HTMLElement>(
          `[data-txn-key="${CSS.escape(key)}"] [data-txn-details]`,
        ) ??
        scrollEls.current.effluent?.querySelector<HTMLElement>(
          `[data-txn-key="${CSS.escape(key)}"] [data-txn-details]`,
        )

      primary?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      primary?.focus({ preventScroll: true })

      window.setTimeout(() => {
        syncingScroll.current = false
      }, 350)
    }

    // Two passes: after expand DOM mounts, then after layout/paint.
    window.requestAnimationFrame(() => {
      run()
      window.setTimeout(run, 120)
    })
  }, [])

  const toggleExpanded = (key: string) => {
    setExpandedKey((prev) => {
      const next = prev === key ? null : key
      if (next) window.setTimeout(() => focusExpandedRows(next), 0)
      return next
    })
  }

  useEffect(() => {
    if (!plantCode) return undefined

    let cancelled = false
    const plantChanged = lastPlantCode.current !== plantCode
    lastPlantCode.current = plantCode
    const showLoader = plantChanged || refreshTick <= 1

    async function loadLogs() {
      if (showLoader) {
        setLoading(true)
        setExpandedKey(null)
      }
      const next = await fetchTransactionLogs(plantCode)
      if (cancelled) return
      if (next) setStreams(next)
      setLoading(false)
    }

    loadLogs()
    return () => {
      cancelled = true
    }
  }, [plantCode, refreshTick])

  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Transaction Logs',
    fileName: 'transaction-logs',
    columns: EXPORT_COLUMNS,
  })

  const q = query.trim().toLowerCase()

  const filteredStreams = useMemo(() => {
    const filterRows = (data: TransactionStreamData) => ({
      ...data,
      rows: data.rows.filter(
        (row) =>
          !q ||
          [row.id, row.status, row.timestamp, data.uniqueId].some((field) =>
            String(field).toLowerCase().includes(q),
          ),
      ),
    })

    return {
      influent: filterRows(streams.influent),
      effluent: filterRows(streams.effluent),
    }
  }, [streams, q])

  const exportRows = useMemo(
    () =>
      stpStreams.flatMap((stream) => {
        const data = filteredStreams[stream.key]
        return data.rows.map((row, i) => ({
          id: `${stream.key}-${i}`,
          txnId: row.id,
          stream: stream.title,
          uniqueId: data.uniqueId,
          status: row.status,
          timestamp: row.timestamp,
        }))
      }),
    [filteredStreams],
  )

  return (
    <div ref={sectionRef} className="space-y-[14px]">
      <div className="flex items-center justify-end gap-[12px]">
        <SearchInput value={query} onChange={setQuery} className="w-[268px]" />
        <ExportButton label="PDF" onClick={() => exportPdf(exportRows)} />
        <ExportButton label="CSV" onClick={() => exportCsv(exportRows)} />
      </div>
      {printNode}

      {loading && (
        <p className="text-[13px] text-ink-soft">Loading transaction logs...</p>
      )}

      <div className="grid grid-cols-2 gap-[14px] [&>*]:min-w-0">
        {stpStreams.map((stream) => (
          <StreamTransactionPanel
            key={stream.key}
            stream={stream}
            data={filteredStreams[stream.key]}
            expandedKey={expandedKey}
            onToggleExpanded={toggleExpanded}
            onRegisterScroll={registerScrollEl}
            onScrollSync={syncScrollFrom}
          />
        ))}
      </div>
    </div>
  )
}
