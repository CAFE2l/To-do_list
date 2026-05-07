<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'

const { user } = useAuth()
const { saving, error, success, saveProfile } = useProfile()

const name = ref(user.value?.displayName || '')
const photoURL = ref(user.value?.photoURL || '')

function handleSave() {
  if (!user.value) return
  saveProfile(user.value.uid, {
    displayName: name.value.trim(),
    photoURL: photoURL.value.trim(),
  })
}

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <div class="relative shrink-0">
        <img
          v-if="photoURL"
          :src="photoURL"
          class="w-14 h-14 rounded-full object-cover ring-2 ring-white/10"
        />
        <div
          v-else
          class="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg"
        >
          {{ initials(name || '?') }}
        </div>
        <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0a1a]"></div>
      </div>
      <div>
        <p class="text-base font-semibold text-white">{{ name || 'Your name' }}</p>
        <p class="text-sm text-white/40">{{ user?.email }}</p>
      </div>
    </div>

    <div class="space-y-3">
      <div>
        <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Display name</label>
        <input v-model="name" maxlength="30" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 focus:bg-white/[0.06] transition-all duration-200" placeholder="Your name" />
      </div>
      <div>
        <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Profile photo URL</label>
        <input v-model="photoURL" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 focus:bg-white/[0.06] transition-all duration-200" placeholder="https://example.com/avatar.jpg" />
      </div>
    </div>

    <div v-if="error" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{{ error }}</div>
    <div v-if="success" class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">Profile saved!</div>

    <button
      @click="handleSave"
      :disabled="saving"
      class="w-full py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 transition-all duration-200 active:scale-[0.98]"
    >
      {{ saving ? 'Saving...' : 'Save profile' }}
    </button>
  </div>
</template>
