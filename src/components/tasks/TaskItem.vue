<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [id: string, completed: boolean]
  delete: [id: string]
  update: [id: string, data: Partial<Omit<Task, 'id'>>]
}>()

const editing = ref(false)
const editText = ref(props.task.text)
const deleting = ref(false)

function startEdit() {
  editText.value = props.task.text
  editing.value = true
  nextTick(() => {
    const input = document.querySelector(`#edit-${props.task.id}`) as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function saveEdit() {
  const text = editText.value.trim()
  if (!text) return
  emit('update', props.task.id, { text })
  editing.value = false
}

function cancelEdit() {
  editText.value = props.task.text
  editing.value = false
}

function handleDelete() {
  deleting.value = true
  setTimeout(() => {
    emit('delete', props.task.id)
  }, 350)
}
</script>

<template>
  <div
    class="task-item group"
    :class="[
      'priority-' + task.priority,
      { 'completed': task.completed, 'removing': deleting },
    ]"
  >
    <button
      @click="emit('toggle', task.id, !task.completed)"
      class="custom-checkbox shrink-0"
      :class="{ 'checked': task.completed }"
    ></button>

    <template v-if="editing">
      <input
        :id="'edit-' + task.id"
        v-model="editText"
        maxlength="60"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
        class="glass-input flex-1 py-1.5 px-2.5 text-sm"
      />
      <button @click="saveEdit" class="text-emerald-400/60 hover:text-emerald-400 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </button>
      <button @click="cancelEdit" class="text-white/30 hover:text-white/60 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </template>

    <template v-else>
      <span class="task-text flex-1 text-sm text-white/80">{{ task.text }}</span>

      <span class="text-xs opacity-40 shrink-0">{{ task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢' }}</span>

      <button
        v-if="!task.completed"
        @click="startEdit"
        class="delete-btn"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
      </button>

      <button
        @click="handleDelete"
        class="delete-btn"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    </template>
  </div>
</template>
