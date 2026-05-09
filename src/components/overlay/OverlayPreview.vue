<script setup lang="ts">
import type { OverlaySettings } from '@/types'

const props = defineProps<{
  settings: OverlaySettings
}>()

const fakeTasks = [
  { text: 'Study React hooks', completed: false, priority: 'high' as const },
  { text: 'Review TypeScript', completed: false, priority: 'medium' as const },
  { text: 'Read chapter 5', completed: true, priority: 'low' as const },
]
</script>

<template>
  <div class="rounded-xl bg-[#0a0a1a] p-5 flex items-center justify-center border border-white/[0.04] relative overflow-hidden">
    <div
      class="rounded-xl overflow-hidden transition-all duration-300"
      :style="{
        width: Math.min(settings.width, 280) + 'px',
        opacity: settings.opacity,
      }"
    >
      <div
        class="p-4 rounded-xl"
        :style="{
          background: 'linear-gradient(135deg, rgba(15,15,35,' + settings.opacity + '), rgba(25,15,45,' + (settings.opacity - 0.06).toFixed(2) + '))',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(99,102,241,0.15)',
        }"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-white text-sm font-semibold">{{ settings.title }}</span>
          <span v-if="settings.showLiveBadge" class="text-[10px] text-red-400 font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>LIVE
          </span>
        </div>

        <div v-if="settings.showProgress" class="mb-3">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] text-white/40">Progress</span>
            <span class="text-[10px] text-white/60">1 / 3</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 33%"></div>
          </div>
        </div>

        <div class="space-y-1.5">
          <div v-for="(task, i) in fakeTasks" :key="i"
            class="task-item text-xs py-2 px-2.5"
            :class="task.completed ? 'opacity-40 completed' : 'priority-' + task.priority"
          >
            <div class="custom-checkbox w-3.5 h-3.5" :class="{ 'checked': task.completed }"></div>
            <span class="task-text flex-1 text-white/70 text-[11px]" :class="{ 'line-through': task.completed }">{{ task.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
