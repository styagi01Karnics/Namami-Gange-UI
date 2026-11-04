/**
 * User Service profile client (self-service: the logged-in user only).
 * Microservice endpoint: /api/profile/me
 */
import { authFetch } from '../auth/session'
import { API_BASE_URL } from '../config/api'

const PROFILE_API_URL = `${API_BASE_URL.user}/profile/me`

export const PHOTO_MAX_BYTES = 2 * 1024 * 1024
export const PHOTO_ACCEPT = 'image/png,image/jpeg'
const PHOTO_TYPES = ['image/png', 'image/jpeg']

export type MyProfile = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  /** Full data URL (`data:image/png;base64,...`) or null when no photo is set. */
  photo: string | null
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (init.body) headers['Content-Type'] = 'application/json'

  const response = await authFetch(`${PROFILE_API_URL}${path}`, { ...init, headers })

  let payload: { message?: string; data?: T } | null = null
  try {
    payload = await response.json()
  } catch {
    // Non-JSON body; handled below
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`)
  }
  return payload?.data as T
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.readAsDataURL(file)
  })
}

export function getMyProfile() {
  return request<MyProfile>('')
}

export function updateMyPhone(phone: string) {
  return request<MyProfile>('/phone', { method: 'PATCH', body: JSON.stringify({ phone }) })
}

export async function uploadMyPhoto(file: File) {
  if (!PHOTO_TYPES.includes(file.type)) {
    throw new Error('Only PNG or JPG images are allowed.')
  }
  if (file.size > PHOTO_MAX_BYTES) {
    throw new Error('Photo must be 2 MB or smaller.')
  }
  const contentBase64 = await readAsBase64(file)
  return request<MyProfile>('/photo', {
    method: 'PUT',
    body: JSON.stringify({ fileName: file.name, contentType: file.type, contentBase64 }),
  })
}

export function removeMyPhoto() {
  return request<MyProfile>('/photo', { method: 'DELETE' })
}
