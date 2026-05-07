<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { auth } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'
import type { UserProfile } from '@/composables/useProfile'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import ProfilePreview from '@/components/profile/ProfilePreview.vue'

const { user } = useAuth()
const uid = computed(() => user.value?.uid || '')

const {
  profile, loading, saving, uploading, error, success,
  subscribeToProfile, updateUserProfile, uploadAvatar,
} = useProfile()

onMounted(() => {
  if (uid.value) subscribeToProfile(uid.value)
})
watch(uid, (id) => { if (id) subscribeToProfile(id) })

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
    socialLinks: data.socialLinks || [],
  })
}

async function handleUploadAvatar(file: File) {
  if (!uid.value) return
  try {
    await uploadAvatar(uid.value, file)
  } catch {
    // error is set in composable
  }
}

async function handleRemoveAvatar() {
  if (!uid.value) return
  updateUserProfile(uid.value, { photoURL: '' })
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { photoURL: '' })
  }
}
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

      <div v-if="loading" class="flex items-center justify-center py-24">
        <div class="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7">
          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl">
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
              @save="handleSave"
              @upload-avatar="handleUploadAvatar"
              @remove-avatar="handleRemoveAvatar"
            />
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="lg:sticky lg:top-24">
            <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl">
              <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Preview
              </h2>
              <ProfilePreview :profile="profile" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
