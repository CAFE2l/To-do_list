<script setup lang="ts">
import { computed } from 'vue'
import type { OverlaySettings } from '@/types'

const props = defineProps<{
  settings: OverlaySettings
}>()

const themeGradients: Record<string, string> = {
  aqua: 'from-cyan-500 to-blue-500',
  purple: 'from-purple-500 to-pink-500',
  green: 'from-emerald-500 to-teal-500',
  'minimal-dark': 'from-white/20 to-white/5',
}

const themePrimary: Record<string, string> = {
  aqua: 'bg-cyan-500',
  purple: 'bg-purple-500',
  green: 'bg-emerald-500',
  'minimal-dark': 'bg-white/30',
}

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
          <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div class="h-full w-[33%] rounded-full bg-gradient-to-r transition-all duration-500" :class="themeGradients[settings.theme] || themeGradients.aqua"></div>
          </div>
        </div>

        <div class="space-y-1.5">
          <div v-for="(task, i) in fakeTasks" :key="i"
            class="flex items-center gap-2 p-2 rounded-lg text-xs"
            :class="task.completed ? 'opacity-40' : 'bg-white/[0.03] border border-white/[0.04] border-l-[2px] ' + (task.priority === 'high' ? 'border-l-red-500/40' : task.priority === 'medium' ? 'border-l-yellow-500/40' : 'border-l-emerald-500/40')"
          >
            <div class="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0"
              :class="task.completed ? 'bg-gradient-to-br ' + themeGradients[settings.theme] + ' border-transparent' : 'border-white/20'"
            >
              <svg v-if="task.completed" class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span class="flex-1 text-white/70" :class="{ 'line-through': task.completed }">{{ task.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
