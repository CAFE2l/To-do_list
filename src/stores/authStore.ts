import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db, googleProvider } from '@/lib/firebase'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { AppUser } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AppUser | null>(null)
  const firebaseUser = ref(auth.currentUser)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)

  function init() {
    loading.value = true
    onAuthStateChanged(auth, async (fbUser) => {
      firebaseUser.value = fbUser
      if (fbUser) {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
        if (userDoc.exists()) {
          user.value = userDoc.data() as AppUser
        } else {
          const newUser: AppUser = {
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'User',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || '',
            createdAt: Date.now(),
          }
          await setDoc(doc(db, 'users', fbUser.uid), newUser)
          user.value = newUser
        }
      } else {
        user.value = null
      }
      loading.value = false
    })
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    const fbUser = result.user
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
    if (!userDoc.exists()) {
      const newUser: AppUser = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'User',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || '',
        createdAt: Date.now(),
      }
      await setDoc(doc(db, 'users', fbUser.uid), newUser)
      user.value = newUser
    } else {
      user.value = userDoc.data() as AppUser
    }
  }

  async function loginWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const fbUser = result.user
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
    if (userDoc.exists()) {
      user.value = userDoc.data() as AppUser
    }
  }

  async function createWithEmail(name: string, email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const fbUser = result.user
    await updateProfile(fbUser, { displayName: name })
    const newUser: AppUser = {
      uid: fbUser.uid,
      displayName: name,
      email: fbUser.email || '',
      photoURL: '',
      createdAt: Date.now(),
    }
    await setDoc(doc(db, 'users', fbUser.uid), newUser)
    user.value = newUser
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  }

  async function logout() {
    await signOut(auth)
    user.value = null
  }

  return {
    user, firebaseUser, loading, isAuthenticated,
    init, loginWithGoogle, loginWithEmail, createWithEmail, resetPassword, logout,
  }
})
