<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
const seconds = ref(5 * 60), running = ref(false), title = ref('A LIVE COMEÇA EM')
let timer: number | undefined
const formatted = computed(() => `${String(Math.floor(seconds.value / 60)).padStart(2, '0')}:${String(seconds.value % 60).padStart(2, '0')}`)
function toggle() { running.value = !running.value; if (running.value) timer = window.setInterval(() => { if (seconds.value > 0) seconds.value--; else { clearInterval(timer); running.value = false } }, 1000); else clearInterval(timer) }
function reset() { clearInterval(timer); running.value = false; seconds.value = 5 * 60 }
onUnmounted(() => clearInterval(timer))
</script>
<template>
  <section class="widget countdown-widget"><input v-model="title" aria-label="Texto do countdown"><strong>{{ formatted }}</strong><div class="scan"></div><p>PREPARE O CAFÉ • AJUSTE O VOLUME</p><div class="widget-actions"><button @click="toggle">{{ running ? 'Pausar' : 'Iniciar' }}</button><button @click="reset">Resetar</button></div></section>
</template>
