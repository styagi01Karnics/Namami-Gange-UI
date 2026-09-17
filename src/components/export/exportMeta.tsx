import { createContext, useContext, type ReactNode } from 'react'
import { defaultDateRange } from '../../data/mockData'
import { statusTone } from '../ui/StatusPill'

type ExportMeta = {
  address: string | null
  badge: string | null
  badgeTone: string
  rangeLabel: string
}

const DEFAULT_META: ExportMeta = {
  address: null,
  badge: null,
  badgeTone: 'brand',
  rangeLabel: defaultDateRange,
}

const ExportMetaContext = createContext<ExportMeta>(DEFAULT_META)

export function ExportMetaProvider({ value, children }: { value?: Partial<ExportMeta>; children: ReactNode }) {
  return <ExportMetaContext.Provider value={{ ...DEFAULT_META, ...value }}>{children}</ExportMetaContext.Provider>
}

export function useExportMeta() {
  return useContext(ExportMetaContext)
}

export function stpExportMeta(stp: { address?: string; status?: string }, rangeLabel: string): ExportMeta {
  return {
    address: stp.address ?? null,
    badge: stp.status ?? null,
    badgeTone: statusTone(stp.status ?? ''),
    rangeLabel,
  }
}
