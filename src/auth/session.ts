import { API_BASE_URL } from '../config/api'

export const AUTH_API_URL = API_BASE_URL.auth

export const SESSION_STORAGE_KEY = 'ng-auth'
export const LAST_LOGIN_KEY = 'ng-last-login'
export const SESSION_EXPIRED_EVENT = 'ng-session-expired'

export type AuthSession = {
  token: string
  expiresAt: number
  userCode: string
  name: string
  email: string
  role: string
  roleId: string
  permissions: Record<string, string[]>
}

function readRaw(store: Storage): AuthSession | null {
  const raw = store.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function getSession(): AuthSession | null {
  const session = readRaw(localStorage) ?? readRaw(sessionStorage)
  if (!session) return null
  if (session.expiresAt && Date.now() >= session.expiresAt) {
    clearSession()
    return null
  }
  return session
}

export function saveSession(session: AuthSession, remember: boolean) {
  clearSession()
  const store = remember ? localStorage : sessionStorage
  store.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
  localStorage.removeItem(SESSION_STORAGE_KEY)
  sessionStorage.removeItem(LAST_LOGIN_KEY)
  localStorage.removeItem(LAST_LOGIN_KEY)
}

export function getAccessToken() {
  return getSession()?.token ?? null
}

/**
 * Appends the token as a query param for media elements (`<video>`, `<img>`) that cannot send headers.
 * Only backend CCTV URLs get it, so the token never goes to third-party stream hosts.
 */
export function withAccessToken(url: string) {
  const token = getAccessToken()
  const isBackendUrl = url.startsWith(API_BASE_URL.cctv) || url.startsWith('/cctv-api') || url.startsWith('/api/')
  if (!token || !isBackendUrl) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}access_token=${encodeURIComponent(token)}`
}

/** fetch wrapper that attaches the JWT and signals session expiry on 401. */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers || {})
  const token = getAccessToken()
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(input, { ...init, headers })
  if (response.status === 401 && token) {
    clearSession()
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
  }
  return response
}
