import { useCallback, useEffect, useRef, useState } from 'react'

export const FIFTEEN_MINUTES_MS = 15 * 60 * 1000 // 900,000 ms

/** Grace period (in ms) past the :00, :15, :30, :45 mark to allow the backend job to write the DB entry. */
const SYNC_GRACE_OFFSET_MS = 10 * 1000 // 10 seconds

/**
 * Calculates milliseconds until the next 15-minute clock mark plus grace offset.
 * Example: if current time is 12:14:50, next sync boundary is 12:15:10 (20 seconds away).
 */
export function getMsUntilNext15MinInterval(now = Date.now()): number {
  const msPastInterval = now % FIFTEEN_MINUTES_MS
  const remaining = FIFTEEN_MINUTES_MS - msPastInterval + SYNC_GRACE_OFFSET_MS
  return remaining > 0 ? remaining : remaining + FIFTEEN_MINUTES_MS
}

/**
 * Hook that executes a fetch callback:
 * 1. Immediately on mount and when key dependencies change (e.g. selected STP site).
 * 2. Synchronized to the 15-minute interval boundary when DB tables receive new entries (:00, :15, :30, :45).
 * 3. Recurring every 15 minutes thereafter.
 * 4. Automatically re-checks when the browser tab becomes active if 15+ minutes have passed.
 */
export function useFifteenMinuteInterval(
  onFetch: () => Promise<void> | void,
  enabled = true,
  dependencyKey?: string | number,
) {
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [tick, setTick] = useState(0)

  const savedCallback = useRef(onFetch)
  useEffect(() => {
    savedCallback.current = onFetch
  })

  const executeFetch = useCallback(async () => {
    if (!enabled) return
    setIsFetching(true)
    try {
      await savedCallback.current()
      setLastFetchedAt(new Date())
    } finally {
      setIsFetching(false)
    }
  }, [enabled])

  // Immediate fetch on mount or when dependency (such as plantCode or site) changes
  useEffect(() => {
    if (!enabled) return
    executeFetch()
  }, [enabled, dependencyKey, tick, executeFetch])

  // Schedule synchronized 15-minute interval
  useEffect(() => {
    if (!enabled) return undefined

    let intervalId: number | undefined
    const delay = getMsUntilNext15MinInterval()

    const timeoutId = window.setTimeout(() => {
      executeFetch()
      // Once aligned to the 15-minute boundary, repeat every 15 minutes
      intervalId = window.setInterval(() => {
        executeFetch()
      }, FIFTEEN_MINUTES_MS)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [enabled, dependencyKey, executeFetch])

  // Re-fetch when browser tab becomes visible if 15+ minutes have elapsed
  useEffect(() => {
    if (!enabled) return undefined

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && lastFetchedAt) {
        const elapsed = Date.now() - lastFetchedAt.getTime()
        if (elapsed >= FIFTEEN_MINUTES_MS) {
          executeFetch()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, lastFetchedAt, executeFetch])

  const refetch = useCallback(() => {
    setTick((v) => v + 1)
  }, [])

  return {
    lastFetchedAt,
    isFetching,
    refetch,
  }
}
