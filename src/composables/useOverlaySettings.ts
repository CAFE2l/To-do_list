import { ref, onUnmounted } from 'vue'
import {
  doc,
  onSnapshot,
  updateDoc,
  Unsubscribe,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { OverlaySettings } from '@/types'
import { DEFAULT_OVERLAY_SETTINGS } from '@/types'

export function useOverlaySettings(userId: string | null) {
  const settings = ref<OverlaySettings>({ ...DEFAULT_OVERLAY_SETTINGS })
  const loading = ref(true)
  let unsubscribe: Unsubscribe | null = null

  function subscribeToSettings() {
    if (!userId) {
      loading.value = false
      return
    }

    loading.value = true
    const settingsRef = doc(db, 'users', userId, 'settings', 'overlay')

    unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        settings.value = snapshot.data() as OverlaySettings
      } else {
        setDoc(settingsRef, DEFAULT_OVERLAY_SETTINGS)
      }
      loading.value = false
    }, (error) => {
      console.error('Error fetching settings:', error)
      loading.value = false
    })
  }

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  async function updateSettings(data: Partial<OverlaySettings>) {
    if (!userId) return
    const settingsRef = doc(db, 'users', userId, 'settings', 'overlay')
    await updateDoc(settingsRef, { ...data, updatedAt: Date.now() })
  }

  return {
    settings,
    loading,
    subscribeToSettings,
    updateSettings,
  }
}
