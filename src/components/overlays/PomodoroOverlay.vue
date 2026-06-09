<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
const focus = ref(true), running = ref(false), seconds = ref(25 * 60)
let timer: number | undefined
const formatted = computed(() => `${String(Math.floor(seconds.value / 60)).padStart(2, '0')}:${String(seconds.value % 60).padStart(2, '0')}`)
function toggle() { running.value = !running.value; if (running.value) timer = window.setInterval(() => { if (seconds.value > 0) seconds.value--; else { focus.value = !focus.value; seconds.value = focus.value ? 25 * 60 : 5 * 60 } }, 1000); else clearInterval(timer) }
function reset() { clearInterval(timer); running.value = false; seconds.value = focus.value ? 25 * 60 : 5 * 60 }
onUnmounted(() => clearInterval(timer))
</script>
<template>
  <section class="widget pomo-widget"><small>STUDY WITH ME</small><span class="mode-pill">{{ focus ? 'FOCO' : 'PAUSA' }}</span><strong>{{ formatted }}</strong><p>{{ focus ? 'Mantenha o ritmo. Uma tarefa por vez.' : 'Respire e prepare-se para o próximo ciclo.' }}</p><div class="widget-actions"><button @click="toggle">{{ running ? 'Pausar' : 'Iniciar' }}</button><button @click="reset">Resetar</button></div></section>
</template>
