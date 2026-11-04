import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  PHOTO_ACCEPT,
  PHOTO_MAX_BYTES,
  getMyProfile,
  removeMyPhoto,
  updateMyPhone,
  uploadMyPhoto,
  type MyProfile,
} from '../api/profile'
import type { ToastFeedback } from '../components/ui/Toast'

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

// Shared profile store so the top bar avatar and the profile modal stay in sync.
let cachedProfile: MyProfile | null = null
const listeners = new Set<() => void>()

function setCachedProfile(next: MyProfile) {
  cachedProfile = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getCachedProfile() {
  return cachedProfile
}

type PendingPhoto = { file: File; url: string }

/**
 * Loads the logged-in user's profile and manages draft edits.
 * Phone, photo selection and photo removal are only sent to the server by saveChanges().
 */
export function useMyProfile() {
  const profile = useSyncExternalStore(subscribe, getCachedProfile, getCachedProfile)
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [loading, setLoading] = useState(!profile)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<ToastFeedback | null>(null)
  const [pendingPhoto, setPendingPhoto] = useState<PendingPhoto | null>(null)
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false)
  const pendingUrl = useRef<string | null>(null)

  const showFeedback = useCallback((tone: ToastFeedback['tone'], text: string) => {
    setFeedback({ id: Date.now(), tone, text })
  }, [])

  const dismissFeedback = useCallback(() => setFeedback(null), [])

  const replacePendingUrl = useCallback((url: string | null) => {
    if (pendingUrl.current) URL.revokeObjectURL(pendingUrl.current)
    pendingUrl.current = url
  }, [])

  const discardChanges = useCallback(() => {
    replacePendingUrl(null)
    setPendingPhoto(null)
    setConfirmRemoveOpen(false)
    setPhone(getCachedProfile()?.phone ?? '')
  }, [replacePendingUrl])

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const next = await getMyProfile()
      setCachedProfile(next)
      discardChanges()
      setPhone(next.phone ?? '')
    } catch (err) {
      showFeedback('error', messageOf(err))
    } finally {
      setLoading(false)
    }
  }, [discardChanges, showFeedback])

  useEffect(() => {
    if (!getCachedProfile()) reload()
  }, [reload])

  useEffect(() => () => replacePendingUrl(null), [replacePendingUrl])

  const selectPhoto = useCallback(
    (file: File) => {
      if (!PHOTO_ACCEPT.split(',').includes(file.type)) {
        showFeedback('error', 'Only PNG or JPG images are allowed.')
        return
      }
      if (file.size > PHOTO_MAX_BYTES) {
        showFeedback('error', 'Photo must be 2 MB or smaller.')
        return
      }
      const url = URL.createObjectURL(file)
      replacePendingUrl(url)
      setPendingPhoto({ file, url })
    },
    [replacePendingUrl, showFeedback],
  )

  const requestRemovePhoto = useCallback(() => setConfirmRemoveOpen(true), [])
  const cancelRemovePhoto = useCallback(() => setConfirmRemoveOpen(false), [])

  // Confirmed removal is sent immediately; it does not wait for Save changes.
  const confirmRemovePhoto = useCallback(async () => {
    setConfirmRemoveOpen(false)
    const hadSavedPhoto = Boolean(getCachedProfile()?.photo)
    replacePendingUrl(null)
    setPendingPhoto(null)
    if (!hadSavedPhoto) return

    setBusy(true)
    try {
      setCachedProfile(await removeMyPhoto())
      showFeedback('success', 'Profile photo deleted successfully.')
    } catch (err) {
      showFeedback('error', messageOf(err))
    } finally {
      setBusy(false)
    }
  }, [replacePendingUrl, showFeedback])

  const photoPreview = pendingPhoto?.url ?? profile?.photo ?? null
  const phoneChanged = phone.trim() !== (profile?.phone ?? '').trim()
  const isDirty = phoneChanged || pendingPhoto !== null

  const saveChanges = useCallback(async () => {
    if (!isDirty || busy) return
    setBusy(true)
    try {
      if (pendingPhoto) {
        setCachedProfile(await uploadMyPhoto(pendingPhoto.file))
      }
      if (phoneChanged) {
        setCachedProfile(await updateMyPhone(phone.trim()))
      }
      discardChanges()
      setPhone(getCachedProfile()?.phone ?? '')
      showFeedback('success', 'Profile updated successfully.')
    } catch (err) {
      showFeedback('error', messageOf(err))
    } finally {
      setBusy(false)
    }
  }, [busy, discardChanges, isDirty, pendingPhoto, phone, phoneChanged, showFeedback])

  return {
    profile,
    photoPreview,
    phone,
    setPhone,
    loading,
    busy,
    feedback,
    dismissFeedback,
    isDirty,
    reload,
    selectPhoto,
    requestRemovePhoto,
    confirmRemovePhoto,
    cancelRemovePhoto,
    confirmRemoveOpen,
    hasPendingPhoto: pendingPhoto !== null,
    saveChanges,
    discardChanges,
  }
}
