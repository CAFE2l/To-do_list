<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useOverlaySettings } from '@/composables/useOverlaySettings'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import OverlayPreview from '@/components/overlay/OverlayPreview.vue'
import ProfileEditor from '@/components/profile/ProfileEditor.vue'

const { user } = useAuth()
const userId = computed(() => user.value?.uid || null)

const {
  settings,
  loading: settingsLoading,
  subscribeToSettings,
  updateSettings,
} = useOverlaySettings()

onMounted(() => {
  if (userId.value) subscribeToSettings(userId.value)
})
watch(userId, (id) => { if (id) subscribeToSettings(id) })

const localTitle = ref(settings.value.title)
const localEmptyText = ref(settings.value.emptyText)
const localWidth = ref(settings.value.width)
const localOpacity = ref(Math.round(settings.value.opacity * 100))

watch(settings, (s) => {
  localTitle.value = s.title
  localEmptyText.value = s.emptyText
  localWidth.value = s.width
  localOpacity.value = Math.round(s.opacity * 100)
}, { immediate: true })

function commitTitle() { updateSettings({ title: localTitle.value }) }
function commitEmpty() { updateSettings({ emptyText: localEmptyText.value }) }
function commitWidth() {
  localWidth.value = Math.max(280, Math.min(600, localWidth.value))
  updateSettings({ width: localWidth.value })
}
function commitOpacity() {
  const v = Math.max(30, Math.min(100, localOpacity.value))
  localOpacity.value = v
  updateSettings({ opacity: Math.round(v) / 100 })
}
</script>

<template>
  <div class="min-h-screen pt-24 pb-16 px-4 sm:px-6">
    <div class="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none"></div>
    <div class="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="relative max-w-6xl mx-auto">
      <div class="mb-10">
        <h1 class="text-2xl font-bold text-white">Overlay Settings</h1>
        <p class="text-sm text-white/40 mt-1">Customize how your study overlay appears on OBS.</p>
      </div>

      <div v-if="settingsLoading" class="flex items-center justify-center py-24">
        <div class="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid lg:grid-cols-12 gap-6">

        <div class="lg:col-span-7 space-y-6">
          <div class="glass-card p-5 sm:p-6 rounded-2xl">
            <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>General</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Overlay title</label>
                <input v-model="localTitle" @change="commitTitle" maxlength="30" class="glass-input w-full" />
              </div>
              <div>
                <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Empty state message</label>
                <input v-model="localEmptyText" @change="commitEmpty" maxlength="40" class="glass-input w-full" />
              </div>
            </div>
          </div>

          <div class="glass-card p-5 sm:p-6 rounded-2xl">
            <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Appearance</h2>
            <div class="space-y-5">
              <div>
                <div class="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 mb-4">
                  <p class="text-sm text-cyan-400/80 font-medium mb-1">Official Overlay Style</p>
                  <p class="text-xs text-white/40">This overlay uses the official Study Overlay design system — inspired by futuristic glass HUD interfaces. LED border, neon glow, and glassmorphism are applied automatically.</p>
                </div>

                <label class="block text-xs text-white/40 uppercase tracking-wider mb-3">Width: <span class="text-white/70">{{ localWidth }}px</span></label>
                <input type="range" min="280" max="600" step="10" v-model.number="localWidth" @change="commitWidth" class="w-full accent-cyan-500 h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer" />
                <div class="flex justify-between text-[10px] text-white/20 mt-1"><span>280px</span><span>600px</span></div>
              </div>

              <div>
                <label class="block text-xs text-white/40 uppercase tracking-wider mb-3">Card opacity: <span class="text-white/70">{{ localOpacity }}%</span></label>
                <input type="range" min="30" max="100" step="5" v-model.number="localOpacity" @change="commitOpacity" class="w-full accent-cyan-500 h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer" />
                <div class="flex justify-between text-[10px] text-white/20 mt-1"><span>30%</span><span>100%</span></div>
              </div>
            </div>
          </div>

          <div class="glass-card p-5 sm:p-6 rounded-2xl">
            <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Visibility</h2>
            <div class="space-y-4">
              <ToggleSwitch v-model="settings.showLiveBadge" @update:model-value="updateSettings({ showLiveBadge: $event })" label="Show LIVE badge" />
              <ToggleSwitch v-model="settings.showProgress" @update:model-value="updateSettings({ showProgress: $event })" label="Show progress bar" />
              <ToggleSwitch v-model="settings.showCompletedTasks" @update:model-value="updateSettings({ showCompletedTasks: $event })" label="Show completed tasks" />
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <div class="lg:sticky lg:top-24 space-y-6">
            <div class="glass-card p-5 sm:p-6 rounded-2xl">
              <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Live Preview</h2>
              <OverlayPreview :settings="settings" />
            </div>

            <div class="glass-card p-5 sm:p-6 rounded-2xl">
              <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Profile</h2>
              <ProfileEditor />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
