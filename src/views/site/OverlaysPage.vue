<script setup lang="ts">
import { computed, ref } from 'vue'
import OverlayCard from '@/components/site/OverlayCard.vue'
import { overlays } from '@/data/overlays'
const active = ref('Todos')
const copied = ref('')
const categories = ['Todos', ...new Set(overlays.map((overlay) => overlay.category))]
const filtered = computed(() => active.value === 'Todos' ? overlays : overlays.filter((overlay) => overlay.category === active.value))
function copy(id: string) { navigator.clipboard.writeText(`${window.location.origin}/overlay-mode/${id}`); copied.value = id; setTimeout(() => copied.value = '', 1800) }
</script>
<template><main class="site-container page-shell">
  <section class="page-intro"><p class="eyebrow">OVERLAY LIBRARY • {{ overlays.length }} WIDGETS</p><h1>Escolha a camada certa para a <em>sua live.</em></h1><p>Widgets de produtividade, engajamento e cenas especiais. Explore a coleção e copie a URL para o OBS.</p></section>
  <div class="filter-row"><button v-for="category in categories" :key="category" :class="{ active: active === category }" @click="active = category">{{ category }}</button></div>
  <p v-if="copied" class="copy-toast">URL copiada para o OBS</p>
  <section class="catalog-grid"><OverlayCard v-for="overlay in filtered" :key="overlay.id" :overlay="overlay" @copy="copy" /></section>
</main></template>
