<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/')
}

const initials = computed(() => {
  if (!user.value?.displayName) return '?'
  return user.value.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] backdrop-blur-2xl bg-[#0a0a1a]/70">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2.5 group shrink-0">
          <div class="relative">
            <div class="absolute inset-0 bg-cyan-400/10 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm shadow-lg shadow-cyan-500/20">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
          </div>
          <span class="font-bold text-white text-base tracking-tight hidden sm:block">Study Overlay</span>
        </router-link>

        <nav class="flex items-center gap-0.5 sm:gap-1">
          <template v-if="user">
            <router-link to="/dashboard" class="px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200">Dashboard</router-link>
            <router-link to="/settings" class="px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200">Settings</router-link>
            <div class="flex items-center gap-2.5 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-white/[0.06]">
              <div class="hidden sm:block text-right">
                <p class="text-sm text-white font-medium leading-tight">{{ user.displayName }}</p>
                <p class="text-[11px] text-white/30 truncate max-w-[120px]">{{ user.email }}</p>
              </div>
              <div v-if="user.photoURL" class="relative">
                <img :src="user.photoURL" class="w-8 h-8 rounded-full ring-2 ring-cyan-500/20 object-cover" />
              </div>
              <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-cyan-500/20">
                {{ initials }}
              </div>
              <button @click="handleLogout" class="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-white/[0.04] transition-all duration-200" title="Logout">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              </button>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200">Sign In</router-link>
            <router-link to="/register" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/20">Sign Up</router-link>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>
