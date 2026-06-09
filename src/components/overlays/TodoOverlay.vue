<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Todo { id: number; text: string; done: boolean }
const key = 'overloom-tasks'
const initial: Todo[] = [
  { id: 1, text: 'Preparar cena principal', done: true },
  { id: 2, text: 'Revisar pauta da live', done: false },
  { id: 3, text: 'Responder a comunidade', done: false },
]
const tasks = ref<Todo[]>(JSON.parse(localStorage.getItem(key) || 'null') || initial)
const draft = ref('')
watch(tasks, (value) => localStorage.setItem(key, JSON.stringify(value)), { deep: true })
const done = computed(() => tasks.value.filter((task) => task.done).length)
const progress = computed(() => tasks.value.length ? Math.round(done.value / tasks.value.length * 100) : 0)
function addTask() { if (draft.value.trim()) { tasks.value.push({ id: Date.now(), text: draft.value.trim(), done: false }); draft.value = '' } }
</script>
<template>
  <section class="widget todo-widget">
    <header class="widget-header"><div><small>STREAM PLANNER</small><h2>Lista da live</h2></div><span class="live-pill"><i></i> LIVE</span></header>
    <div class="progress-meta"><span>Progresso da sessão</span><b>{{ done }} / {{ tasks.length }}</b></div>
    <div class="progress-track"><i :style="{ width: progress + '%' }"></i></div>
    <div class="todo-list">
      <label v-for="task in tasks" :key="task.id" :class="{ done: task.done }"><input v-model="task.done" type="checkbox"><span>{{ task.text }}</span><button aria-label="Remover tarefa" @click.prevent="tasks = tasks.filter((item) => item.id !== task.id)">×</button></label>
    </div>
    <form class="todo-form" @submit.prevent="addTask"><input v-model="draft" placeholder="Adicionar tarefa..."><button>+</button></form>
  </section>
</template>
