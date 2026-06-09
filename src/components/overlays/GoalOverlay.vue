<script setup lang="ts">
import { computed, ref } from 'vue'
const current = ref(742)
const target = ref(1000)
const title = ref('META DE SEGUIDORES')
const percent = computed(() => Math.min(100, Math.round(current.value / target.value * 100)))
</script>
<template><section class="widget goal-widget"><div><input v-model="title" aria-label="Título da meta"><b>{{ current }} <span>/ {{ target }}</span></b></div><div class="goal-track"><i :style="{ width: percent + '%' }"></i></div><small>{{ percent }}% DA META CONCLUÍDA</small></section></template>
