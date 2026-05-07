<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTasks } from '@/composables/useTasks'
import TaskForm from '@/components/tasks/TaskForm.vue'
import TaskItem from '@/components/tasks/TaskItem.vue'
import type { Task } from '@/types'

const { user } = useAuth()
const userId = computed(() => user.value?.uid || null)

const {
  tasks,
  loading: tasksLoading,
  subscribeToTasks,
  addTask,
  toggleTask,
  deleteTask,
  clearCompleted,
  updateTask,
} = useTasks(userId.value)

const copyFeedback = ref(false)
const overlayUrl = computed(() => {
  if (!user.value) return ''
  return `${window.location.origin}/overlay/${user.value.uid}`
})

onMounted(() => {
  if (userId.value) subscribeToTasks()
})

watch(userId, (id) => { if (id) subscribeToTasks() })

const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
const progress = computed(() => tasks.value.length === 0 ? 0 : Math.round((completedCount.value / tasks.value.length) * 100))

async function handleAdd(text: string, priority: Task['priority']) { await addTask(text, priority) }
async function handleToggle(id: string, completed: boolean) { await toggleTask(id, completed) }
async function handleDelete(id: string) { await deleteTask(id) }
async function handleUpdate(id: string, data: Partial<Omit<Task, 'id'>>) { await updateTask(id, data) }
async function handleClear() { await clearCompleted() }

function copyLink() {
  navigator.clipboard.writeText(overlayUrl.value)
  copyFeedback.value = true
  setTimeout(() => { copyFeedback.value = false }, 2000)
}

function openOverlay() {
  window.open(overlayUrl.value, '_blank', 'width=400,height=700')
}

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
</script>

<template>
  <div class="min-h-screen pt-24 pb-16 px-4 sm:px-6">
    <div class="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none"></div>
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="relative max-w-6xl mx-auto">
      <div v-if="user" class="flex items-center gap-4 mb-10">
        <img
          v-if="user.photoURL"
          :src="user.photoURL"
          class="w-12 h-12 rounded-full ring-2 ring-cyan-500/30 object-cover"
        />
        <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-cyan-500/30">
          {{ initials(user.displayName) }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">Welcome, {{ user.displayName }}</h1>
          <p class="text-sm text-white/40">Manage your study tasks and overlay</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 space-y-6">
          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-cyan-500/5">
            <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Add new task
            </h2>
            <TaskForm @add="handleAdd" />
          </div>

          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-cyan-500/5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-semibold text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Tasks
                <span class="text-xs text-white/30 font-normal">({{ tasks.length }})</span>
              </h2>
              <button
                v-if="completedCount > 0"
                @click="handleClear"
                class="text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Clear completed
              </button>
            </div>

            <div v-if="tasksLoading" class="flex items-center justify-center py-12">
              <div class="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>

            <div v-else-if="tasks.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <span class="text-2xl opacity-30">📋</span>
              </div>
              <p class="text-white/30 text-sm font-medium">No tasks yet</p>
              <p class="text-white/20 text-xs mt-1">Add your first task above!</p>
            </div>

            <div v-else class="space-y-2">
              <TaskItem
                v-for="task in tasks"
                :key="task.id"
                :task="task"
                @toggle="handleToggle"
                @delete="handleDelete"
                @update="handleUpdate"
              />
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-cyan-500/5">
            <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Progress
            </h2>
            <div class="flex items-end gap-3 mb-4">
              <span class="text-4xl font-bold text-white">{{ completedCount }}</span>
              <span class="text-sm text-white/40 mb-1">/ {{ tasks.length }} tasks</span>
            </div>
            <div class="h-2 rounded-full bg-white/5 overflow-hidden mb-2">
              <div
                class="h-full rounded-full transition-all duration-500 ease-out"
                :class="tasks.length > 0 && completedCount === tasks.length ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
            <p class="text-xs text-white/30 text-right">{{ progress }}% complete</p>
          </div>

          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-cyan-500/5">
            <h2 class="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Overlay link
            </h2>
            <div class="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 mb-3">
              <p class="text-xs text-white/50 truncate font-mono">{{ overlayUrl }}</p>
            </div>
            <div class="flex gap-2">
              <button @click="copyLink" class="flex-1 py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                {{ copyFeedback ? 'Copied!' : 'Copy link' }}
              </button>
              <button @click="openOverlay" class="flex-1 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                Open overlay
              </button>
            </div>
          </div>

          <div class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-cyan-500/5">
            <h2 class="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              OBS Setup
            </h2>
            <ol class="text-xs text-white/40 space-y-2.5 list-decimal list-inside">
              <li>Open OBS Studio</li>
              <li>Add a new <span class="text-white/60">Browser Source</span></li>
              <li>Paste your overlay link</li>
              <li>Set size to <span class="text-white/60">400 x 700</span></li>
              <li>Enable <span class="text-white/60">"Allow transparency"</span></li>
              <li>Done!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
