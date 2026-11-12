import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchStpDetailRecords, toStpNames, type StpDetail } from '../api/cctv'

export type StpDetailsState = {
  status: 'loading' | 'ready' | 'error'
  /** Raw /stp-details records. */
  details: StpDetail[]
  /** STP names keyed by plantCode, derived from `details`. */
  names: Record<string, string>
  error: string | null
}

const StpDetailsContext = createContext<StpDetailsState | null>(null)

// Module-level so StrictMode's double mount (which can give the provider a fresh ref) still shares one request.
// A failed request is cleared so the next dashboard visit retries.
let stpDetailsRequest: Promise<StpDetail[]> | null = null

function loadStpDetailsOnce(): Promise<StpDetail[]> {
  stpDetailsRequest ??= fetchStpDetailRecords().catch((err: unknown) => {
    stpDetailsRequest = null
    throw err
  })
  return stpDetailsRequest
}

/** Fetches /stp-details once and shares the result with every descendant. */
export function StpDetailsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StpDetailsState>({ status: 'loading', details: [], names: {}, error: null })

  useEffect(() => {
    let cancelled = false

    loadStpDetailsOnce()
      .then((details) => {
        if (!cancelled) setState({ status: 'ready', details, names: toStpNames(details), error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Unable to load STP details'
        setState({ status: 'error', details: [], names: {}, error: message })
      })

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => state, [state])
  return <StpDetailsContext.Provider value={value}>{children}</StpDetailsContext.Provider>
}

export function useStpDetails(): StpDetailsState {
  const ctx = useContext(StpDetailsContext)
  if (!ctx) throw new Error('useStpDetails must be used within StpDetailsProvider')
  return ctx
}
