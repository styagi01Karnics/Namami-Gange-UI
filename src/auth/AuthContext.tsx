import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type AuthContextValue = {
  isAuthenticated: boolean
  /** Formatted last-login stamp for the current user, e.g. `08/15/2026, 3.56.42 PM`. */
  lastLoginAt: string | null
  login: (username: string, password: string, remember?: boolean) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'ng-auth'
const LAST_LOGIN_KEY = 'ng-last-login'

const VALID = { username: 'admin', password: 'admin' }

function formatLoginStamp(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const meridiem = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${month}/${day}/${year}, ${hours}.${minutes}.${seconds} ${meridiem}`
}

function authStore() {
  if (localStorage.getItem(STORAGE_KEY) === '1') return localStorage
  if (sessionStorage.getItem(STORAGE_KEY) === '1') return sessionStorage
  return null
}

function readStoredAuth() {
  return Boolean(authStore())
}

function readLastLogin() {
  return localStorage.getItem(LAST_LOGIN_KEY) || sessionStorage.getItem(LAST_LOGIN_KEY)
}

function clearAuthStorage() {
  sessionStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(LAST_LOGIN_KEY)
  localStorage.removeItem(LAST_LOGIN_KEY)
}

function resolveInitialLastLogin() {
  const existing = readLastLogin()
  if (existing) return existing
  if (!readStoredAuth()) return null

  // Persist a stamp for an already-open session so Last seen is not blank after deploy.
  const stamp = formatLoginStamp(new Date())
  authStore()?.setItem(LAST_LOGIN_KEY, stamp)
  return stamp
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredAuth)
  const [lastLoginAt, setLastLoginAt] = useState<string | null>(resolveInitialLastLogin)

  const login = (username: string, password: string, remember = false) => {
    if (username !== VALID.username || password !== VALID.password) return false

    clearAuthStorage()
    const stamp = formatLoginStamp(new Date())
    const store = remember ? localStorage : sessionStorage
    store.setItem(STORAGE_KEY, '1')
    store.setItem(LAST_LOGIN_KEY, stamp)
    setLastLoginAt(stamp)
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    clearAuthStorage()
    setLastLoginAt(null)
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({ isAuthenticated, lastLoginAt, login, logout }),
    [isAuthenticated, lastLoginAt],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
