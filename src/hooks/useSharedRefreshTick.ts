import { useEffect, useState } from 'react'

const DEFAULT_INTERVAL_MS = Number(import.meta.env.VITE_STP_LIVE_POLL_MS) || 5000

/**
 * Shared refresh clock for STP live panels. Every tick, Realtime Parameter
 * Values and Transaction Logs should refetch together.
 */
export function useSharedRefreshTick(enabled: boolean, intervalMs = DEFAULT_INTERVAL_MS) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!enabled) return undefined

    setTick((value) => value + 1)

    const timer = window.setInterval(() => {
      setTick((value) => value + 1)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [enabled, intervalMs])

  return tick
}
