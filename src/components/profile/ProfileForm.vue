<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { UserProfile } from '@/composables/useProfile'
import type { UserLocation, SocialLinkIcon, SocialLink } from '@/types'
import { detectBrowserLocation, getLocationFromCoordinates } from '@/lib/geolocation'
import StatusSelector from './StatusSelector.vue'
import AvatarUploader from './AvatarUploader.vue'
import SocialLinkForm from './SocialLinkForm.vue'
import SocialLinkList from './SocialLinkList.vue'

const props = defineProps<{
  profile: UserProfile | null
  saving: boolean
  uploading: boolean
  error: string
  success: boolean
  socialLinks: SocialLink[]
}>()

type ProfileStatus = UserProfile['status']

const emit = defineEmits<{
  save: [data: Partial<UserProfile>]
  uploadAvatar: [file: File]
  removeAvatar: []
  addSocialLink: [data: { title: string; url: string; icon: SocialLinkIcon }]
  editSocialLink: [id: string, data: { title: string; url: string; icon: SocialLinkIcon }]
  deleteSocialLink: [id: string]
}>()

const local = ref<Partial<UserProfile>>({})
const detecting = ref(false)
const geoError = ref('')

watch(() => props.profile, (p) => {
  if (p) {
    local.value = { ...p }
  }
}, { immediate: true })

const bioCount = computed(() => (local.value.bio || '').length)
const bioRemaining = computed(() => 280 - bioCount.value)

const locationLabel = computed(() => {
  const loc = local.value.location
  if (!loc) return ''
  if (typeof loc === 'string') return loc
  return (loc as UserLocation).label || ''
})

function handleSave() {
  emit('save', {
    ...local.value,
    location: locationLabel.value,
  })
}

async function handleDetectLocation() {
  detecting.value = true
  geoError.value = ''

  try {
    const pos = await detectBrowserLocation()
    const result = await getLocationFromCoordinates(pos.coords.latitude, pos.coords.longitude)
    local.value.location = result.label
  } catch (e: any) {
    if (e.code === 1) {
      geoError.value = 'Location permission denied. You can fill it manually.'
    } else {
      geoError.value = e.message || 'Could not detect location.'
    }
  } finally {
    detecting.value = false
  }
}

function handleAvatarSelect(file: File) {
  emit('uploadAvatar', file)
}

function handleAvatarRemove() {
  emit('removeAvatar')
}

const roles = ['Student', 'Developer', 'Creator', 'Designer', 'Streamer', 'Teacher', 'Writer', 'Other']
</script>

<template>
  <div class="space-y-5">
    <div class="flex justify-center py-2">
      <AvatarUploader
        :photoURL="local.photoURL || ''"
        :display-name="local.displayName || ''"
        :uploading="uploading"
        @select="handleAvatarSelect"
        @remove="handleAvatarRemove"
      />
    </div>

    <div>
      <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Display name</label>
      <input v-model="local.displayName" maxlength="30" class="glass-input w-full" />
    </div>

    <div>
      <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Username</label>
      <input v-model="local.username" maxlength="20" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" placeholder="yourname" />
    </div>

    <div>
      <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Bio <span class="text-white/20 font-normal">({{ bioRemaining }})</span></label>
      <textarea v-model="local.bio" maxlength="280" rows="3" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200 resize-none" placeholder="Tell people what you're studying, building, or streaming..."></textarea>
    </div>

    <div>
      <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Role / Title</label>
      <select v-model="local.role" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-500/30 transition-all duration-200 appearance-none cursor-pointer">
        <option value="" disabled class="bg-[#0a0a1a]">Select a role</option>
        <option v-for="r in roles" :key="r" :value="r" class="bg-[#0a0a1a]">{{ r }}</option>
      </select>
    </div>

    <div>
      <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Status</label>
      <StatusSelector :model-value="local.status ?? 'active'" @update:model-value="local.status = $event as ProfileStatus" />
    </div>

    <div>
      <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Location</label>
      <div class="flex gap-2">
        <input v-model="local.location" maxlength="60" class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" placeholder="Curitiba, Brazil" />
        <button @click="handleDetectLocation" :disabled="detecting"
          class="shrink-0 px-3 py-2.5 rounded-xl border border-white/10 text-xs text-white/40 hover:text-white hover:border-white/20 transition-all duration-200 disabled:opacity-40 flex items-center gap-1.5"
        >
          <svg v-if="!detecting" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          {{ detecting ? 'Detecting...' : 'Detect' }}
        </button>
      </div>
      <p v-if="geoError" class="mt-1.5 text-[11px] text-amber-400/70">{{ geoError }}</p>
    </div>

    <div>
      <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Website</label>
      <input v-model="local.website" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" placeholder="https://yourlink.com" />
    </div>

    <div class="pt-2 border-t border-white/[0.04]">
      <div class="grid md:grid-cols-2 gap-4">
        <SocialLinkForm @add="(data) => emit('addSocialLink', data)" />
        <SocialLinkList
          :links="socialLinks"
          @edit="(id, data) => emit('editSocialLink', id, data)"
          @delete="(id) => emit('deleteSocialLink', id)"
        />
      </div>
    </div>

    <div v-if="error" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{{ error }}</div>
    <div v-if="success" class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">Profile saved!</div>

    <button @click="handleSave" :disabled="saving || uploading"
      class="w-full py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 transition-all duration-200 active:scale-[0.98]"
    >{{ saving ? 'Saving...' : 'Save profile' }}</button>
  </div>
</template>
