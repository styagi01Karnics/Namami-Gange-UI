import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AUTH_API_URL,
  LAST_LOGIN_KEY,
  SESSION_EXPIRED_EVENT,
  clearSession,
  getSession,
  saveSession,
  type AuthSession,
} from './session'

type LoginEnvelope = {
  success?: boolean
  message?: string
  data?: {
    token: string
    expiresInSeconds: number
    user: { userCode: string; name: string; email: string }
    role: string
    roleId: string
    permissions: Record<string, string[]>
  }
}

type AuthContextValue = {
  isAuthenticated: boolean
  /** Logged-in user's display name from the session. */
  name: string | null
  /** Formatted last-login stamp for the current user, e.g. `08/15/2026, 3.56.42 PM`. */
  lastLoginAt: string | null
  role: string | null
  permissions: Record<string, string[]>
  /** `can('stp')` = any grant in module; `can('stp', 'Manpower')` = that exact key. */
  can: (moduleId: string, key?: string) => boolean
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

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

function readLastLogin() {
  return localStorage.getItem(LAST_LOGIN_KEY) || sessionStorage.getItem(LAST_LOGIN_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(getSession)
  const [lastLoginAt, setLastLoginAt] = useState<string | null>(readLastLogin)

  const clearLocal = useCallback(() => {
    clearSession()
    setSession(null)
    setLastLoginAt(null)
  }, [])

  useEffect(() => {
    const onExpired = () => clearLocal()
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [clearLocal])

  const login = useCallback(async (email: string, password: string, remember = false) => {
    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    let payload: LoginEnvelope | null = null
    try {
      payload = await response.json()
    } catch {
      // Non-JSON error body; handled below
    }

    if (!response.ok || !payload?.data?.token) {
      throw new Error(payload?.message || 'Invalid email or password.')
    }

    const data = payload.data
    const next: AuthSession = {
      token: data.token,
      expiresAt: Date.now() + data.expiresInSeconds * 1000,
      userCode: data.user.userCode,
      name: data.user.name,
      email: data.user.email,
      role: data.role,
      roleId: data.roleId,
      permissions: data.permissions ?? {},
    }

    clearSession()
    saveSession(next, remember)
    const stamp = formatLoginStamp(new Date())
    const store = remember ? localStorage : sessionStorage
    store.setItem(LAST_LOGIN_KEY, stamp)
    setLastLoginAt(stamp)
    setSession(next)
  }, [])

  const logout = useCallback(() => {
    const token = session?.token
    if (token) {
      // Best-effort server revoke; local state is cleared regardless.
      fetch(`${AUTH_API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined)
    }
    clearLocal()
  }, [session, clearLocal])

  const can = useCallback(
    (moduleId: string, key?: string) => {
      const keys = session?.permissions?.[moduleId] ?? []
      if (!key) return keys.length > 0
      return keys.includes(key)
    },
    [session],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session),
      name: session?.name ?? null,
      lastLoginAt,
      role: session?.role ?? null,
      permissions: session?.permissions ?? {},
      can,
      login,
      logout,
    }),
    [session, lastLoginAt, can, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
