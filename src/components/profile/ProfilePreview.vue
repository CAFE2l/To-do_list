<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfile } from '@/composables/useProfile'
import type { UserLocation, SocialLink } from '@/types'
import SocialIconImg from '@/components/common/SocialIconImg.vue'

const props = defineProps<{
  profile: UserProfile | null
  socialLinks?: SocialLink[]
}>()

const initials = computed(() => {
  if (!props.profile?.displayName) return '?'
  return props.profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const statusColors: Record<string, string> = {
  active: 'bg-emerald-400',
  focusing: 'bg-cyan-400',
  studying: 'bg-blue-400',
  offline: 'bg-white/20',
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  focusing: 'Focusing',
  studying: 'Studying',
  offline: 'Offline',
}

const locationLabel = computed(() => {
  const loc = props.profile?.location
  if (!loc) return ''
  if (typeof loc === 'string') return loc
  return (loc as UserLocation).label || ''
})
</script>

<template>
  <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6 text-center">
    <div class="relative inline-block mb-4">
      <img
        v-if="profile?.photoURL"
        :src="profile.photoURL"
        class="w-20 h-20 rounded-full object-cover ring-2 ring-cyan-500/20"
      />
      <div v-else
        class="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl ring-2 ring-cyan-500/20"
      >{{ initials }}</div>
      <span
        class="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-[#0a0a1a]"
        :class="statusColors[profile?.status || 'offline']"
      ></span>
    </div>

    <h3 class="text-lg font-semibold text-white">{{ profile?.displayName || 'Your name' }}</h3>
    <p v-if="profile?.username" class="text-sm text-white/40">@{{ profile.username }}</p>
    <p class="text-xs text-white/30 mt-0.5">{{ profile?.email }}</p>

    <div v-if="profile?.status || profile?.role" class="flex items-center justify-center gap-2 mt-3">
      <span v-if="profile?.status" class="flex items-center gap-1.5 text-xs text-white/50">
        <span class="w-1.5 h-1.5 rounded-full" :class="statusColors[profile.status]"></span>
        {{ statusLabels[profile.status] }}
      </span>
      <span v-if="profile?.role" class="text-xs text-white/30">·</span>
      <span v-if="profile?.role" class="text-xs text-cyan-400/70 font-medium">{{ profile.role }}</span>
    </div>

    <p v-if="profile?.bio" class="text-sm text-white/50 mt-4 leading-relaxed">{{ profile.bio }}</p>

    <div v-if="locationLabel" class="mt-4 text-xs text-white/30 flex items-center justify-center gap-1">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      {{ locationLabel }}
    </div>

    <div v-if="profile?.website" class="mt-2">
      <a :href="profile.website" target="_blank" class="text-xs text-cyan-400/60 hover:text-cyan-300 transition-colors">{{ profile.website }}</a>
    </div>

    <div v-if="socialLinks?.length" class="flex items-center justify-center gap-3 mt-4 flex-wrap">
      <template v-for="link in socialLinks.slice(0, 6)" :key="link.id">
        <a
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :title="link.title"
          class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-200"
        >
          <SocialIconImg :icon="link.icon" :size="28" />
        </a>
      </template>
      <span v-if="socialLinks.length > 6" class="text-[10px] text-white/20">+{{ socialLinks.length - 6 }}</span>
    </div>
    <p v-else class="text-[11px] text-white/20 mt-4">No social links yet</p>
  </div>
</template>
