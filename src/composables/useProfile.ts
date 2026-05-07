import { ref, onUnmounted } from 'vue'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import { useAuthStore } from '@/stores/authStore'

export function useProfile() {
  const store = useAuthStore()
  const saving = ref(false)
  const error = ref('')
  const success = ref(false)

  async function saveProfile(uid: string, data: { displayName: string; photoURL: string }) {
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
        displayName: data.displayName,
        photoURL: data.photoURL,
        updatedAt: Date.now(),
      })

      if (store.user) {
        store.user.displayName = data.displayName
        store.user.photoURL = data.photoURL
      }

      success.value = true
      setTimeout(() => { success.value = false }, 3000)
    } catch (e: any) {
      error.value = e.message || 'Failed to save profile.'
    } finally {
      saving.value = false
    }
  }

  return { saving, error, success, saveProfile }
}
