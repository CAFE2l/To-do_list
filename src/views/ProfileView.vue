<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { auth } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'
import { useSocialLinks } from '@/composables/useSocialLinks'
import type { UserProfile } from '@/composables/useProfile'
import type { SocialLinkIcon } from '@/types'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import ProfilePreview from '@/components/profile/ProfilePreview.vue'

const { user } = useAuth()
const uid = computed(() => user.value?.uid || '')

const {
  profile, loading, saving, uploading, error, success,
  subscribeToProfile, updateUserProfile, uploadAvatar,
} = useProfile()

const {
  socialLinks,
  loading: linksLoading,
  subscribeToLinks, addLink, updateLink, deleteLink,
} = useSocialLinks()

onMounted(() => {
  if (uid.value) {
    subscribeToProfile(uid.value)
    subscribeToLinks(uid.value)
  }
})
watch(uid, (id) => {
  if (id) {
    subscribeToProfile(id)
    subscribeToLinks(id)
  }
})

function handleSave(data: Partial<UserProfile>) {
  if (!uid.value) return
  updateUserProfile(uid.value, {
    displayName: data.displayName || '',
    username: data.username || '',
    bio: data.bio || '',
    status: (data.status as UserProfile['status']) || 'active',
    role: data.role || '',
    location: data.location || '',
    website: data.website || '',
  })
}

async function handleUploadAvatar(file: File) {
  if (!uid.value) return
  try {
    await uploadAvatar(uid.value, file)
  } catch { }
}

async function handleRemoveAvatar() {
  if (!uid.value) return
  updateUserProfile(uid.value, { photoURL: '' })
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { photoURL: '' })
  }
}

function handleAddSocialLink(data: { title: string; url: string; icon: SocialLinkIcon }) {
  if (!uid.value) return
  addLink(data)
}

function handleEditSocialLink(id: string, data: { title: string; url: string; icon: SocialLinkIcon }) {
  if (!uid.value) return
  updateLink(id, data)
}

function handleDeleteSocialLink(id: string) {
  if (!uid.value) return
  deleteLink(id)
}

const linkwaveUrl = import.meta.env.VITE_LINKWAVE_URL || 'https://linkwave.app'
</script>

<template>
  <div class="min-h-screen pt-24 pb-16 px-4 sm:px-6">
    <div class="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none"></div>
    <div class="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="relative max-w-6xl mx-auto">
      <div class="mb-10">
        <h1 class="text-2xl font-bold text-white">Profile Settings</h1>
        <p class="text-sm text-white/40 mt-1">Manage your public identity and account information.</p>
      </div>

      <div v-if="loading || linksLoading" class="flex items-center justify-center py-24">
        <div class="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 space-y-6">
          <div class="glass-card rounded-2xl p-5 sm:p-6">
            <h2 class="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Edit profile
            </h2>
            <ProfileForm
              :profile="profile"
              :saving="saving"
              :uploading="uploading"
              :error="error"
              :success="success"
              :social-links="socialLinks"
              @save="handleSave"
              @upload-avatar="handleUploadAvatar"
              @remove-avatar="handleRemoveAvatar"
              @add-social-link="handleAddSocialLink"
              @edit-social-link="handleEditSocialLink"
              @delete-social-link="handleDeleteSocialLink"
            />
          </div>

          <div class="rounded-2xl bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-emerald-500/5 backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-[60px] pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/5 rounded-full blur-[50px] pointer-events-none"></div>

            <div class="relative">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                </div>
                <div>
                  <h3 class="text-base font-semibold text-white">Want a full custom link page?</h3>
                  <p class="text-sm text-white/40 mt-0.5">Create a beautiful personal profile with all your links, themes, analytics, and more using LinkWave.</p>
                </div>
              </div>
              <a
                :href="linkwaveUrl"
                target="_blank"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/20"
              >Create your LinkWave profile</a>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="lg:sticky lg:top-24">
            <div class="glass-card rounded-2xl p-5 sm:p-6">
              <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Preview
              </h2>
              <ProfilePreview :profile="profile" :social-links="socialLinks" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
