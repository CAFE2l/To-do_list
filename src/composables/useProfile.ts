import { ref, onUnmounted } from 'vue'
import { doc, onSnapshot, updateDoc, Unsubscribe } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import { useAuthStore } from '@/stores/authStore'
import type { UserLocation } from '@/types'
import { uploadAvatarToCloudinary } from '@/lib/cloudinary'

export interface UserProfile {
  uid: string
  displayName: string
  username: string
  email: string
  photoURL: string
  bio: string
  status: 'active' | 'focusing' | 'studying' | 'offline'
  role: string
  location: string | UserLocation
  website: string
  socialLinks: string[]
  updatedAt: number
}

export function useProfile() {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(true)
  const saving = ref(false)
  const uploading = ref(false)
  const error = ref('')
  const success = ref(false)
  const store = useAuthStore()

  let unsubscribe: Unsubscribe | null = null

  function subscribeToProfile(uid: string) {
    if (unsubscribe) unsubscribe()
    loading.value = true

    unsubscribe = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) {
        profile.value = snap.data() as UserProfile
      }
      loading.value = false
    }, () => {
      loading.value = false
    })
  }

  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
    saving.value = true
    error.value = ''
    success.value = false

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: data.displayName || null,
          photoURL: data.photoURL || null,
        })
      }

      await updateDoc(doc(db, 'users', uid), {
        ...data,
        updatedAt: Date.now(),
      })

      if (store.user) {
        if (data.displayName) store.user.displayName = data.displayName
        if (data.photoURL !== undefined) store.user.photoURL = data.photoURL
      }

      success.value = true
      setTimeout(() => { success.value = false }, 3000)
    } catch (e: any) {
      error.value = e.message || 'Failed to save profile.'
    } finally {
      saving.value = false
    }
  }

  async function uploadAvatar(uid: string, file: File): Promise<string> {
    uploading.value = true
    error.value = ''

    try {
      const url = await uploadAvatarToCloudinary(file)

      await updateUserProfile(uid, { photoURL: url })

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url })
      }

      return url
    } catch (e: any) {
      error.value = e.message || 'Upload failed.'
      throw e
    } finally {
      uploading.value = false
    }
  }

  return {
    profile, loading, saving, uploading, error, success,
    subscribeToProfile, updateUserProfile, uploadAvatar,
  }
}
