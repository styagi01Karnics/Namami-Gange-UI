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
import { canAccessStp, loadRoleAccess, plantCodesForStpDetails } from '../lib/stpAccess'

type LoginEnvelope = {
  success?: boolean
  message?: string
  data?: {
    token?: string
    expiresInSeconds: number
    user: { userCode: string; name: string; email: string }
    roleId: string
  }
}

type RoleAccessState = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  roleName: string | null
  permissions: Record<string, string[]>
  plantCodes: Set<string>
}

const EMPTY_ROLE_ACCESS: RoleAccessState = {
  status: 'idle',
  roleName: null,
  permissions: {},
  plantCodes: new Set(),
}

type AuthContextValue = {
  isAuthenticated: boolean
  /** Logged-in user's display name from the session. */
  name: string | null
  /** Logged-in user's email from the session. */
  email: string | null
  /** Formatted last-login stamp for the current user, e.g. `08/15/2026, 3.56.42 PM`. */
  lastLoginAt: string | null
  role: string | null
  permissions: Record<string, string[]>
  /** `can('stp')` = any grant in module; `can('stp', 'Manpower')` = that exact key. */
  can: (moduleId: string, key?: string) => boolean
  /** True when the dashboard plant code maps to one of the STPs assigned to the user's role. */
  hasStpAccess: (plantCode?: string | null) => boolean
  /** True while the role's STP list is still loading; `hasStpAccess` is false until it resolves. */
  stpAccessLoading: boolean
  login:  (email: string, password: string, remember?: boolean) => Promise<void>
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
  const [roleAccess, setRoleAccess] = useState<RoleAccessState>(EMPTY_ROLE_ACCESS)
  const roleId = session?.roleId

  // Role details, permissions and STPs all come from the login roleId (login and page reload both land here).
  useEffect(() => {
    if (!roleId) {
      setRoleAccess(EMPTY_ROLE_ACCESS)
      return
    }
    let cancelled = false
    setRoleAccess({ ...EMPTY_ROLE_ACCESS, status: 'loading' })
    loadRoleAccess(roleId)
      .then((access) => {
        if (cancelled) return
        setRoleAccess({
          status: 'ready',
          roleName: access.roleName,
          permissions: access.permissions,
          plantCodes: plantCodesForStpDetails(access.stpDetails),
        })
      })
      .catch(() => {
        if (!cancelled) setRoleAccess({ ...EMPTY_ROLE_ACCESS, status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [roleId])

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
      credentials: 'include',
      body: JSON.stringify({ email, password, remember }),
    })

    let payload: LoginEnvelope | null = null
    try {
      payload = await response.json()
    } catch {
      // Non-JSON error body; handled below
    }

    if (!response.ok || !payload?.data) {
      throw new Error(payload?.message || 'Invalid email or password.')
    }

    const data = payload.data
    const next: AuthSession = {
      expiresAt: Date.now() + data.expiresInSeconds * 1000,
      userCode: data.user.userCode,
      name: data.user.name,
      email: data.user.email,
      roleId: data.roleId,
    }

    saveSession(next, remember)
    const stamp = formatLoginStamp(new Date())
    const store = remember ? localStorage : sessionStorage
    store.setItem(LAST_LOGIN_KEY, stamp)
    setLastLoginAt(stamp)
    setSession(next)
  }, [])

  const logout = useCallback(() => {
    if (session) {
      // Best-effort server revoke; local state is cleared regardless.
      fetch(`${AUTH_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => undefined)
    }
    clearLocal()
  }, [session, clearLocal])

  const can = useCallback(
    (moduleId: string, key?: string) => {
      const keys = roleAccess.permissions[moduleId] ?? []
      if (!key) return keys.length > 0
      return keys.includes(key)
    },
    [roleAccess.permissions],
  )

  const hasStpAccess = useCallback(
    (plantCode?: string | null) => roleAccess.status === 'ready' && canAccessStp(roleAccess.plantCodes, plantCode),
    [roleAccess],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session),
      name: session?.name ?? null,
      email: session?.email ?? null,
      lastLoginAt,
      role: roleAccess.roleName,
      permissions: roleAccess.permissions,
      can,
      hasStpAccess,
      stpAccessLoading: roleAccess.status === 'idle' || roleAccess.status === 'loading',
      login,
      logout,
    }),
    [session, lastLoginAt, roleAccess, can, hasStpAccess, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
