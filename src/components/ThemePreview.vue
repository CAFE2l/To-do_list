<script setup lang="ts">
import type { Theme } from '@/types'

const props = defineProps<{
  theme: Theme
}>()

const themes: { key: Theme; label: string; gradient: string; accent: string }[] = [
  { key: 'aqua', label: 'Aqua', gradient: 'from-overlay-500 via-purple-500 to-pink-500', accent: 'bg-overlay-500' },
  { key: 'purple', label: 'Purple', gradient: 'from-purple-500 via-pink-500 to-red-500', accent: 'bg-purple-500' },
  { key: 'green', label: 'Green', gradient: 'from-green-400 via-emerald-500 to-teal-500', accent: 'bg-green-500' },
  { key: 'minimal-dark', label: 'Minimal Dark', gradient: 'from-white/20 via-white/10 to-white/5', accent: 'bg-white/30' },
]
</script>

<template>
  <div class="grid grid-cols-4 gap-2">
    <button
      v-for="t in themes"
      :key="t.key"
      @click="$emit('select', t.key)"
      class="relative rounded-xl p-3 border transition-all duration-200 text-center"
      :class="theme === t.key
        ? 'border-overlay-500/50 bg-overlay-500/10 ring-1 ring-overlay-500/30'
        : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'"
    >
      <div class="w-full h-8 rounded-lg bg-gradient-to-br mb-2" :class="t.gradient"></div>
      <div class="flex items-center justify-center gap-1.5">
        <div class="w-2 h-2 rounded-full" :class="t.accent"></div>
        <span class="text-xs text-white/60">{{ t.label }}</span>
      </div>
      <div v-if="theme === t.key" class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-overlay-500 flex items-center justify-center">
        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    </button>
  </div>
</template>
