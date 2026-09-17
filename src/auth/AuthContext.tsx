import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type AuthContextValue = {
  isAuthenticated: boolean
  login: (username: string, password: string, remember?: boolean) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'ng-auth'

const VALID = { username: 'admin', password: 'admin' }

function readStoredAuth() {
  return localStorage.getItem(STORAGE_KEY) === '1' || sessionStorage.getItem(STORAGE_KEY) === '1'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredAuth)

  const login = (username: string, password: string, remember = false) => {
    if (username !== VALID.username || password !== VALID.password) return false
    sessionStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY)
    ;(remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, '1')
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
  }

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
