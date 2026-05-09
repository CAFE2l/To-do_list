<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTasks } from '@/composables/useTasks'
import { useOverlaySettings } from '@/composables/useOverlaySettings'
import OverlayCard from '@/components/OverlayCard.vue'
import type { Task, OverlaySettings } from '@/types'
import { DEFAULT_OVERLAY_SETTINGS } from '@/types'

const route = useRoute()
const userId = computed(() => route.params.userId as string)

const {
  tasks,
  loading: tasksLoading,
  subscribeToTasks,
} = useTasks()

const {
  settings,
  loading: settingsLoading,
  subscribeToSettings,
} = useOverlaySettings()

const overlayError = ref(false)

onMounted(() => {
  document.documentElement.classList.add('overlay-mode')
  if (userId.value) {
    subscribeToTasks(userId.value)
    subscribeToSettings(userId.value)
  } else {
    overlayError.value = true
  }
})

onUnmounted(() => {
  document.documentElement.classList.remove('overlay-mode')
})

watch(userId, (newId) => {
  if (newId) {
    overlayError.value = false
    subscribeToTasks(newId)
    subscribeToSettings(newId)
  } else {
    overlayError.value = true
  }
})
</script>

<template>
  <div v-if="overlayError" class="overlay-page">
    <div class="overlay-card error-card">
      <div class="p-5 text-center">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
        </div>
        <p class="text-white/50 text-sm font-medium">Overlay not found or unavailable.</p>
      </div>
    </div>
  </div>

  <div v-else-if="tasksLoading || settingsLoading" class="overlay-page">
    <div class="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
  </div>

  <div v-else class="overlay-page">
    <OverlayCard
      :tasks="tasks"
      :settings="settings"
    />
  </div>
</template>

<style>
html.overlay-mode, html.overlay-mode body {
  background: transparent !important;
  background-color: transparent !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

html.overlay-mode body {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

html.overlay-mode #app {
  width: 100%;
}

.overlay-page {
  width: 100%;
  min-height: 100vh;
  background: transparent;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 8px;
}

.error-card {
  background: linear-gradient(135deg, rgba(5, 8, 22, 0.96), rgba(10, 18, 35, 0.92));
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(34, 211, 238, 0.15);
  border-radius: 24px;
  width: 380px;
}
</style>
