<script setup lang="ts">
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [id: string, completed: boolean]
  delete: [id: string]
  update: [id: string, data: Partial<Omit<Task, 'id'>>]
}>()
</script>

<template>
  <div
    class="task-item group flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
    :class="['priority-' + task.priority, { 'opacity-60': task.completed }]"
  >
    <button
      @click="emit('toggle', task.id, !task.completed)"
      class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
      :class="task.completed
        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-500'
        : 'border-white/20 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20'"
    >
      <svg v-if="task.completed" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
      </svg>
    </button>

    <input
      :value="task.text"
      @change="(e) => emit('update', task.id, { text: (e.target as HTMLInputElement).value })"
      class="flex-1 text-sm bg-transparent outline-none text-white/80 group-hover:text-white transition-colors"
      :class="{ 'line-through opacity-50': task.completed }"
      :disabled="task.completed"
    />

    <span class="text-xs opacity-40">{{ task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢' }}</span>

    <button
      @click="emit('delete', task.id)"
      class="opacity-0 group-hover:opacity-100 transition-all duration-200 text-white/20 hover:text-red-400"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.priority-high { border-left: 3px solid rgba(239, 68, 68, 0.4); }
.priority-medium { border-left: 3px solid rgba(234, 179, 8, 0.4); }
.priority-low { border-left: 3px solid rgba(34, 197, 94, 0.4); }
</style>
