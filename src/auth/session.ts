import { API_BASE_URL } from '../config/api'

export const AUTH_API_URL = API_BASE_URL.auth

export const SESSION_STORAGE_KEY = 'ng-auth'
export const LAST_LOGIN_KEY = 'ng-last-login'
export const SESSION_EXPIRED_EVENT = 'ng-session-expired'

export type AuthSession = {
  expiresAt: number
  userCode: string
  name: string
  email: string
  role: string
  roleId: string
  permissions: Record<string, string[]>
  /** Role STP codes (e.g. `BAZPUR`, `JAG_18`) the user may open from the dashboard. */
  stps: string[]
}

/**
 * Profile persisted in web storage. The JWT is never readable from JS: the auth service
 * sets it as an HttpOnly cookie and the browser attaches it to every API request.
 */
type StoredProfile = AuthSession

function readProfile(store: Storage): StoredProfile | null {
  const raw = store.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null
  try {
    // Drop any token left in storage by older builds.
    const { token: _legacyToken, ...profile } = JSON.parse(raw) as Partial<AuthSession> & { token?: string }
    return profile as StoredProfile
  } catch {
    return null
  }
}

export function getSession(): AuthSession | null {
  const profile = readProfile(localStorage) ?? readProfile(sessionStorage)
  if (!profile) return null
  if (profile.expiresAt && Date.now() >= profile.expiresAt) {
    clearSession()
    return null
  }
  return profile
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
/** fetch wrapper that sends the HttpOnly auth cookie and signals session expiry on 401. */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const hadSession = getSession() !== null
  const response = await fetch(input, { ...init, credentials: 'include' })
  if (response.status === 401 && hadSession) {
    clearSession()
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
  }
  return response
}