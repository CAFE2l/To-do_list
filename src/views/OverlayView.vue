<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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
} = useTasks(userId.value)

const {
  settings,
  loading: settingsLoading,
  subscribeToSettings,
} = useOverlaySettings(userId.value)

onMounted(() => {
  if (userId.value) {
    subscribeToTasks()
    subscribeToSettings()
  }
})

watch(userId, (newId) => {
  if (newId) {
    subscribeToTasks()
    subscribeToSettings()
  }
})

const notFound = ref(false)
</script>

<template>
  <!--
    =======================================================
    OVERLAY VIEW — PÚBLICO & TRANSPARENTE
    =======================================================
    Esta página é pública e não exige login.
    Deve ser usada como Browser Source no OBS.

    Configuração recomendada no OBS:
    - Largura: 400px
    - Altura: 700px
    - Fundo: transparente (ativar "Allow transparency")

    O body deve ter background: transparent para
    funcionar corretamente com o chroma key do OBS.
    =======================================================
  -->
  <div v-if="tasksLoading || settingsLoading" class="overlay-loading">
    <div class="w-5 h-5 border-2 border-overlay-500/30 border-t-overlay-500 rounded-full animate-spin"></div>
  </div>

  <div v-else class="overlay-wrapper">
    <OverlayCard
      :tasks="tasks"
      :settings="settings"
    />
  </div>
</template>

<style>
/* 
  OBS Browser Source — fundo transparente obrigatório
  OBS precisa do background: transparent para exibir
  o overlay corretamente sobre a cena.
*/
html, body {
  background: transparent !important;
  background-color: transparent !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

#app {
  width: 100%;
}

.overlay-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 8px;
}

.overlay-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
