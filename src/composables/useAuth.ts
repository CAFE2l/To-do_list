import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const store = useAuthStore()
  const { user, loading, isAuthenticated } = storeToRefs(store)

  async function loginWithGoogle() {
    await store.loginWithGoogle()
  }

  async function loginWithEmail(email: string, password: string) {
    await store.loginWithEmail(email, password)
  }

  async function createWithEmail(name: string, email: string, password: string) {
    await store.createWithEmail(name, email, password)
  }

  async function resetPassword(email: string) {
    await store.resetPassword(email)
  }

  async function logout() {
    await store.logout()
  }

  return {
    user, loading, isAuthenticated,
    loginWithGoogle, loginWithEmail, createWithEmail, resetPassword, logout,
  }
}
