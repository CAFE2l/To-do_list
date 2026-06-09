<script setup lang="ts">
import type { OverlayDefinition } from '@/data/overlays'
defineProps<{ overlay: OverlayDefinition }>()
const emit = defineEmits<{ copy: [id: string] }>()
</script>
<template>
  <article class="catalog-card" :style="{ '--accent': overlay.accent }">
    <div class="catalog-preview"><div class="preview-grid"></div><span class="preview-symbol">{{ overlay.icon }}</span><span class="preview-label">{{ overlay.shortName }}</span></div>
    <div class="catalog-content">
      <div class="card-topline"><span>{{ overlay.category }}</span><b v-if="!overlay.available">EM BREVE</b></div>
      <h3>{{ overlay.name }}</h3><p>{{ overlay.description }}</p>
      <div class="tag-row"><span v-for="tag in overlay.tags" :key="tag">{{ tag }}</span></div>
      <div class="card-actions">
        <router-link v-if="overlay.available" :to="`/overlays/${overlay.id}`" class="small-btn primary">Ver overlay</router-link>
        <button v-if="overlay.available" class="small-btn ghost" @click="emit('copy', overlay.id)">Copiar URL</button>
        <span v-else class="coming-soon">Disponível em breve</span>
      </div>
    </div>
  </article>
</template>
