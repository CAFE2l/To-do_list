<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user, logout } = useAuth()
const router = useRouter()

const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggle() { open.value = !open.value }
function close() { open.value = false }

function go(path: string) { close(); router.push(path) }

async function handleLogout() {
  close()
  await logout()
  router.push('/')
}

function copyOverlayLink() {
  if (!user.value) return
  navigator.clipboard.writeText(`${window.location.origin}/overlay/${user.value.uid}`)
  close()
}

function openOverlay() {
  if (!user.value) return
  window.open(`/overlay/${user.value.uid}`, '_blank', 'width=400,height=700')
  close()
}

const initials = computed(() => {
  if (!user.value?.displayName) return '?'
  return user.value.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    close()
  }
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEsc)
})
</script>

<template>
  <div v-if="user" ref="dropdownRef" class="relative">
    <button @click="toggle" class="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200">
      <img
        v-if="user.photoURL"
        :src="user.photoURL"
        class="w-8 h-8 rounded-full ring-2 ring-cyan-500/20 object-cover"
      />
      <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-cyan-500/20">
        {{ initials }}
      </div>
      <svg class="w-3.5 h-3.5 text-white/30 transition-transform duration-200" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
    </button>

    <transition name="dropdown">
      <div v-if="open" class="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#0d1b2a]/90 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-cyan-500/5 overflow-hidden z-50">
        <div class="p-4 border-b border-white/[0.04]">
          <div class="flex items-center gap-3">
            <img v-if="user.photoURL" :src="user.photoURL" class="w-10 h-10 rounded-full ring-2 ring-cyan-500/20 object-cover" />
            <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-cyan-500/20">{{ initials }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ user.displayName }}</p>
              <p class="text-xs text-white/30 truncate">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <div class="p-1.5">
          <button @click="go('/dashboard')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Dashboard
          </button>
          <button @click="go('/settings')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Overlay Settings
          </button>
          <button @click="go('/profile')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Profile
          </button>

          <div class="border-t border-white/[0.04] my-1"></div>

          <button @click="openOverlay" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            Open OBS Overlay
          </button>
          <button @click="copyOverlayLink" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            Copy Overlay Link
          </button>

          <div class="border-t border-white/[0.04] my-1"></div>

          <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active { transition: all 0.2s ease-out; }
.dropdown-leave-active { transition: all 0.15s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.96); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
</style>
