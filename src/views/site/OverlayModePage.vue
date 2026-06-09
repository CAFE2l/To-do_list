<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import OverlayRenderer from '@/components/overlays/OverlayRenderer.vue'
const route = useRoute()
const id = computed(() => route.params.id as string)
onMounted(() => document.documentElement.classList.add('obs-mode'))
onUnmounted(() => document.documentElement.classList.remove('obs-mode'))
</script>
<template><main class="obs-page"><OverlayRenderer :id="id" /></main></template>
