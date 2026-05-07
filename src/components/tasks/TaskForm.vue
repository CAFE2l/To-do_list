<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '@/types'

const emit = defineEmits<{
  add: [text: string, priority: Task['priority']]
}>()

const text = ref('')
const priority = ref<Task['priority']>('medium')

function submit() {
  const trimmed = text.value.trim()
  if (!trimmed) return
  emit('add', trimmed, priority.value)
  text.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="flex gap-2">
    <input
      v-model="text"
      type="text"
      placeholder="Nova tarefa..."
      maxlength="60"
      class="input-glass flex-1 text-sm"
    />
    <select
      v-model="priority"
      class="input-glass w-20 text-xs text-center appearance-none cursor-pointer"
    >
      <option value="low">🟢</option>
      <option value="medium">🟡</option>
      <option value="high">🔴</option>
    </select>
    <button type="submit" class="btn-primary px-3.5">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
    </button>
  </form>
</template>
