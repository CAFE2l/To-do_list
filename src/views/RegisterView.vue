<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AuthBackground from '@/components/AuthBackground.vue'

const { createWithEmail, loginWithGoogle } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordsMatch = computed(() => password.value === confirmPassword.value)
const passwordMinLength = computed(() => password.value.length >= 6)
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const canSubmit = computed(() =>
  name.value.trim() &&
  isEmailValid.value &&
  passwordMinLength.value &&
  passwordsMatch.value &&
  confirmPassword.value
)

const errorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
}

function getErrorMessage(e: any): string {
  if (e?.code && errorMessages[e.code]) return errorMessages[e.code]
  if (e?.message) return e.message
  return 'An unexpected error occurred.'
}

async function handleSubmit() {
  if (!canSubmit.value) return
  loading.value = true
  error.value = ''
  try {
    await createWithEmail(name.value.trim(), email.value.trim(), password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}

async function handleGoogle() {
  googleLoading.value = true
  error.value = ''
  try {
    await loginWithGoogle()
    router.push('/dashboard')
  } catch (e: any) {
    error.value = getErrorMessage(e)
  } finally {
    googleLoading.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen pt-20 flex items-center justify-center p-4 overflow-hidden">
    <AuthBackground />

    <div class="relative w-full max-w-[420px]">
      <div class="glass-card rounded-2xl p-8 sm:p-10">

          <div class="scanline"></div>

          <div class="text-center mb-7">
            <router-link to="/" class="inline-flex items-center gap-2.5 mb-5 group">
              <div class="relative">
                <div class="absolute inset-0 bg-cyan-400/20 blur-xl rounded-xl group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-lg shadow-lg shadow-cyan-500/20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
            </router-link>
            <h1 class="text-2xl sm:text-[28px] font-bold text-white tracking-tight">Create your overlay</h1>
            <p class="text-[15px] text-white/40 mt-1.5 font-light">Start sharing your study sessions beautifully.</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-3.5">
            <div class="space-y-1.5">
              <label class="block text-xs font-medium text-white/40 uppercase tracking-wider">Name</label>
              <div class="relative group">
                <div class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-400/0 to-blue-500/0 group-focus-within:from-cyan-400/20 group-focus-within:to-blue-500/20 transition-all duration-300 blur-sm"></div>
                <input
                  v-model="name"
                  type="text"
                  placeholder="Your name"
                  autocomplete="name"
                  class="glass-input w-full"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-medium text-white/40 uppercase tracking-wider">Email</label>
              <div class="relative group">
                <div class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-400/0 to-blue-500/0 group-focus-within:from-cyan-400/20 group-focus-within:to-blue-500/20 transition-all duration-300 blur-sm"></div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  class="glass-input w-full"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-medium text-white/40 uppercase tracking-wider">Password</label>
                <div class="relative group">
                  <div class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-400/0 to-blue-500/0 group-focus-within:from-cyan-400/20 group-focus-within:to-blue-500/20 transition-all duration-300 blur-sm"></div>
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••"
                    autocomplete="new-password"
                    maxlength="64"
                    class="glass-input w-full pr-9"
                  />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                    <svg v-if="!showPassword" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  </button>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-medium text-white/40 uppercase tracking-wider">Confirm</label>
                <div class="relative group">
                  <div class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-400/0 to-blue-500/0 group-focus-within:from-cyan-400/20 group-focus-within:to-blue-500/20 transition-all duration-300 blur-sm"></div>
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="••••••"
                    autocomplete="new-password"
                    maxlength="64"
                    class="glass-input w-full pr-9"
                  />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                    <svg v-if="!showConfirmPassword" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 text-xs">
              <div v-if="password" class="flex items-center gap-1" :class="passwordMinLength ? 'text-emerald-400' : 'text-white/30'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path v-if="passwordMinLength" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/><path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                6+ characters
              </div>
              <div v-if="confirmPassword" class="flex items-center gap-1" :class="passwordsMatch ? 'text-emerald-400' : 'text-white/30'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path v-if="passwordsMatch" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/><path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                Match
              </div>
            </div>

            <div v-if="error" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p class="text-sm text-red-400 text-center">{{ error }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading || !canSubmit"
              class="relative w-full py-3 rounded-xl font-semibold text-white text-sm overflow-hidden group transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-300"></div>
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400/20 to-transparent transition-opacity duration-300"></div>
              <span class="relative flex items-center justify-center gap-2">
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ loading ? 'Creating account...' : 'Create account' }}
              </span>
            </button>
          </form>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/[0.06]"></div></div>
            <div class="relative flex justify-center"><span class="px-4 text-xs text-white/20 bg-[#0d1b2a]">or continue with</span></div>
          </div>

          <button
            @click="handleGoogle"
            :disabled="googleLoading"
            class="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-white/70 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <svg v-if="googleLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <svg v-else class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {{ googleLoading ? 'Connecting...' : 'Sign up with Google' }}
          </button>

          <p class="text-center mt-6 text-sm text-white/30">
            Already have an account?
            <router-link to="/login" class="text-cyan-400/80 hover:text-cyan-300 font-medium transition-colors">Sign in</router-link>
          </p>
      </div>
    </div>
  </div>
</template>
