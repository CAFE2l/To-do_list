<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOverlay } from '@/data/overlays'
import OverlayRenderer from '@/components/overlays/OverlayRenderer.vue'
import { useLocalOverlaySettings } from '@/composables/useLocalOverlaySettings'
const route = useRoute(), copied = ref(false)
const overlay = computed(() => getOverlay(route.params.id as string))
const obsUrl = computed(() => `${window.location.origin}/overlay-mode/${route.params.id}`)
const { settings } = useLocalOverlaySettings()
function copy() { navigator.clipboard.writeText(obsUrl.value); copied.value = true; setTimeout(() => copied.value = false, 1800) }
</script>
<template><main v-if="overlay" class="site-container page-shell detail-page">
  <div class="detail-heading"><div><router-link to="/overlays" class="back-link">← Voltar para biblioteca</router-link><p class="eyebrow">{{ overlay.category }} • {{ overlay.tags.join(' • ') }}</p><h1>{{ overlay.name }}</h1><p>{{ overlay.description }}</p><div class="hero-actions"><button class="site-btn primary" @click="copy">{{ copied ? 'URL copiada!' : 'Copiar URL para OBS' }}</button><a :href="obsUrl" target="_blank" class="site-btn ghost">Abrir fullscreen ↗</a></div></div><aside><b>OBS READY</b><span>Browser Source</span></aside></div>
  <section class="live-preview"><header><span>PREVIEW AO VIVO</span><small>1920 × 1080 • FUNDO TRANSPARENTE</small></header><div><OverlayRenderer :id="overlay.id" /></div></section>
  <section class="detail-grid">
    <article class="instructions"><p class="eyebrow">SETUP EM 60 SEGUNDOS</p><h2>Use no OBS Studio</h2><ol><li><b>01</b> Copie a URL da overlay</li><li><b>02</b> No OBS, adicione uma Fonte de navegador</li><li><b>03</b> Cole a URL e ajuste largura e altura</li><li><b>04</b> Posicione na cena e salve</li></ol></article>
    <article class="control-card"><p class="eyebrow">AJUSTES RÁPIDOS</p><label>Tema<select v-model="settings.theme"><option value="neon">Neon</option><option value="dark">Escuro</option><option value="transparent">Transparente</option><option value="light">Claro</option></select></label><label>Opacidade<input v-model.number="settings.opacity" type="range" min=".45" max="1" step=".05"></label><label>Cor principal<input v-model="settings.primary" type="color"></label><router-link to="/customize" class="inline-link">Abrir laboratório completo →</router-link></article>
  </section>
</main><main v-else class="site-container page-shell"><section class="page-intro"><h1>Overlay não encontrada.</h1><router-link to="/overlays" class="site-btn primary">Voltar para overlays</router-link></section></main></template>
