<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  completed: number
  total: number
}>()

const percentage = computed(() => (props.total === 0 ? 0 : Math.round((props.completed / props.total) * 100)))
const allCompleted = computed(() => props.total > 0 && props.completed === props.total)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-sm text-white/50 font-medium">Progress</span>
      <span class="text-sm text-overlay-300 font-semibold">{{ completed }} / {{ total }}</span>
    </div>
    <div class="h-2 rounded-full bg-white/5 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="allCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400'"
        :style="{ width: percentage + '%' }"
      ></div>
    </div>
    <p v-if="total > 0" class="text-xs text-white/30 mt-1 text-right">{{ percentage }}%</p>
  </div>
</template>
