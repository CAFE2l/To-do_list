<script setup lang="ts">
import { computed } from 'vue'
import type { Task, OverlaySettings } from '@/types'

const props = defineProps<{
  tasks: Task[]
  settings: OverlaySettings
}>()

const completedCount = computed(() => props.tasks.filter(t => t.completed).length)
const progress = computed(() =>
  props.tasks.length === 0 ? 0 : Math.round((completedCount.value / props.tasks.length) * 100)
)
const allCompleted = computed(() => props.tasks.length > 0 && completedCount.value === props.tasks.length)

const themeStyles: Record<string, { primary: string; glow: string; badge: string }> = {
  'aqua': {
    primary: 'rgba(99, 102, 241, ',
    glow: 'rgba(99, 102, 241, 0.35)',
    badge: 'rgba(248, 113, 113, 0.1)',
  },
  'purple': {
    primary: 'rgba(168, 85, 247, ',
    glow: 'rgba(168, 85, 247, 0.35)',
    badge: 'rgba(248, 113, 113, 0.1)',
  },
  'green': {
    primary: 'rgba(34, 197, 94, ',
    glow: 'rgba(34, 197, 94, 0.35)',
    badge: 'rgba(248, 113, 113, 0.1)',
  },
  'minimal-dark': {
    primary: 'rgba(255, 255, 255, ',
    glow: 'rgba(255, 255, 255, 0.15)',
    badge: 'rgba(248, 113, 113, 0.1)',
  },
}

const currentTheme = computed(() => themeStyles[props.settings.theme] || themeStyles['aqua'])
</script>

<template>
  <div
    class="overlay-container"
    :style="{
      width: settings.width + 'px',
      opacity: settings.opacity,
    }"
  >
    <div class="overlay-card">
      <div class="scanline"></div>

      <div class="p-5">
        <div class="flex items-center justify-between mb-1">
          <h1 class="text-white font-bold text-lg tracking-tight">{{ settings.title }}</h1>
          <div
            v-if="settings.showLiveBadge"
            class="flex items-center gap-1.5 rounded-full px-2.5 py-1"
            :style="{
              background: currentTheme.badge,
              border: '1px solid rgba(248, 113, 113, 0.2)',
            }"
          >
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span class="text-red-400 text-[10px] font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div v-if="settings.showProgress" class="mt-3">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs text-white/40 font-medium">Progresso</span>
            <span class="text-xs text-overlay-300 font-semibold">{{ completedCount }} / {{ tasks.length }}</span>
          </div>
          <div class="progress-bar-track">
            <div
              class="progress-bar-fill"
              :style="{ width: progress + '%' }"
              :class="{ 'completed-all': allCompleted }"
            ></div>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
            <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <span class="text-2xl opacity-30">📋</span>
            </div>
            <p class="text-white/30 text-sm font-medium">{{ settings.emptyText }}</p>
          </div>

          <div v-for="task in tasks" :key="task.id">
            <div v-if="!task.completed || settings.showCompletedTasks" class="task-item" :class="['priority-' + task.priority, { 'completed': task.completed }]">
              <div class="flex items-center gap-2.5">
                <div class="checkbox-custom" :class="{ 'checked': task.completed }">
                  <svg v-if="task.completed" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="task-text text-sm text-white/80">{{ task.text }}</span>
              </div>
              <span class="text-xs opacity-40">{{ task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢' }}</span>
            </div>
          </div>

          <div v-if="allCompleted" class="flex flex-col items-center justify-center pt-4 pb-2">
            <p class="text-sm font-semibold text-overlay-400">✓ Session complete</p>
            <p class="text-xs text-white/30 mt-0.5">All tasks completed</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay-container {
  margin: 0 auto;
}

.overlay-card {
  background: linear-gradient(135deg, rgba(15, 15, 35, var(--card-opacity, 0.88)), rgba(25, 15, 45, 0.82));
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 24px;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;
}

.overlay-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 24px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #6366f1);
  background-size: 300%;
  z-index: -1;
  animation: borderMove 4s linear infinite;
}

@keyframes borderMove {
  to { background-position: 300%; }
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent);
  animation: scanlineMove 6s linear infinite;
  pointer-events: none;
}

@keyframes scanlineMove {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  animation: fadeInUp 0.3s ease forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.task-item.priority-high { border-left: 3px solid rgba(239, 68, 68, 0.5); }
.task-item.priority-medium { border-left: 3px solid rgba(234, 179, 8, 0.5); }
.task-item.priority-low { border-left: 3px solid rgba(34, 197, 94, 0.5); }

.task-item.completed .task-text {
  text-decoration: line-through;
  opacity: 0.35;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 2px solid rgba(99, 102, 241, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.checkbox-custom.checked {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-color: #6366f1;
}

.progress-bar-track {
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-bar-fill.completed-all {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}
</style>
