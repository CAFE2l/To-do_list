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
    class="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all duration-300"
    :class="[
      'border-l-[3px]',
      task.priority === 'high' ? 'border-l-red-500/40' : task.priority === 'medium' ? 'border-l-yellow-500/40' : 'border-l-emerald-500/40',
      task.completed ? 'opacity-50' : 'opacity-100',
      deleting ? 'animate-fadeOutRight' : 'animate-fadeInUp',
      !deleting && !task.completed ? 'hover:bg-white/[0.06] hover:border-white/[0.10]' : '',
    ]"
  >
    <button
      @click="emit('toggle', task.id, !task.completed)"
      class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
      :class="task.completed
        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-cyan-500'
        : 'border-white/20 hover:border-cyan-500/50'"
    >
      <svg v-if="task.completed" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
      </svg>
    </button>

    <template v-if="editing">
      <input
        :id="'edit-' + task.id"
        v-model="editText"
        maxlength="60"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
        class="flex-1 text-sm bg-white/10 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-400/50"
      />
      <button @click="saveEdit" class="text-emerald-400/60 hover:text-emerald-400 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </button>
      <button @click="cancelEdit" class="text-white/30 hover:text-white/60 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </template>

    <template v-else>
      <span
        class="flex-1 text-sm text-white/80 transition-all duration-200"
        :class="{ 'line-through opacity-40': task.completed }"
      >{{ task.text }}</span>

      <span class="text-xs opacity-40 shrink-0">{{ task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢' }}</span>

      <button
        v-if="!task.completed"
        @click="startEdit"
        class="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 text-white/20 hover:text-cyan-400 transition-all duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
      </button>

      <button
        @click="handleDelete"
        class="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    </template>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOutRight {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(30px); }
}

.animate-fadeInUp { animation: fadeInUp 0.3s ease forwards; }
.animate-fadeOutRight { animation: fadeOutRight 0.35s ease forwards; }
</style>
