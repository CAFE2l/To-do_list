<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useOverlaySettings } from '@/composables/useOverlaySettings'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import OverlayPreview from '@/components/overlay/OverlayPreview.vue'
import ProfileEditor from '@/components/profile/ProfileEditor.vue'
import type { Theme } from '@/types'

const { user } = useAuth()
const userId = computed(() => user.value?.uid || null)

const {
  settings,
  loading: settingsLoading,
  subscribeToSettings,
  updateSettings,
} = useOverlaySettings(userId.value)

onMounted(() => {
  if (userId.value) subscribeToSettings()
})
watch(userId, (id) => { if (id) subscribeToSettings() })

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

function selectTheme(t: Theme) { updateSettings({ theme: t }) }

const themes: { key: Theme; label: string; gradient: string; dot: string }[] = [
  { key: 'aqua', label: 'Aqua', gradient: 'from-cyan-400 to-blue-500', dot: 'bg-cyan-400' },
  { key: 'purple', label: 'Purple', gradient: 'from-purple-400 to-pink-500', dot: 'bg-purple-400' },
  { key: 'green', label: 'Green', gradient: 'from-emerald-400 to-teal-500', dot: 'bg-emerald-400' },
  { key: 'minimal-dark', label: 'Minimal Dark', gradient: 'from-white/20 to-white/5', dot: 'bg-white/30' },
]
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
          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl">
            <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>General</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Overlay title</label>
                <input v-model="localTitle" @change="commitTitle" maxlength="30" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" />
              </div>
              <div>
                <label class="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Empty state message</label>
                <input v-model="localEmptyText" @change="commitEmpty" maxlength="40" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" />
              </div>
            </div>
          </div>

          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl">
            <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Appearance</h2>
            <div class="space-y-5">
              <div>
                <label class="block text-xs text-white/40 uppercase tracking-wider mb-3">Theme</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    v-for="t in themes" :key="t.key"
                    @click="selectTheme(t.key)"
                    class="relative rounded-xl p-3 border transition-all duration-200 text-center group"
                    :class="settings.theme === t.key ? 'border-cyan-500/40 bg-cyan-500/10 ring-1 ring-cyan-500/20' : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'"
                  >
                    <div class="w-full h-8 rounded-lg bg-gradient-to-br mb-2" :class="t.gradient"></div>
                    <div class="flex items-center justify-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full" :class="t.dot"></div>
                      <span class="text-xs text-white/50 group-hover:text-white/70 transition-colors">{{ t.label }}</span>
                    </div>
                    <div v-if="settings.theme === t.key" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                  </button>
                </div>
              </div>

              <div>
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

          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl">
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
            <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl">
              <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Live Preview</h2>
              <OverlayPreview :settings="settings" />
            </div>

            <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl">
              <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Profile</h2>
              <ProfileEditor />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
