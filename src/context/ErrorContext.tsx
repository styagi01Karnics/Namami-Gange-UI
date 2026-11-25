import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ErrorContextValue = {
  error: string | null
  setError: (message: string | null) => void
  clearError: () => void
}

const ErrorContext = createContext<ErrorContextValue | null>(null)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setErrorState] = useState<string | null>(null)

  const setError = useCallback((message: string | null) => {
    setErrorState(message)
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError(): ErrorContextValue {
  const ctx = useContext(ErrorContext)
  if (!ctx) throw new Error('useError must be used within ErrorProvider')
  return ctx
}
