<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/AppHeader.vue'
import SiteNavbar from '@/components/site/SiteNavbar.vue'
import SiteFooter from '@/components/site/SiteFooter.vue'

const authStore = useAuthStore()
const route = useRoute()
const isObsMode = computed(() => route.meta.obsMode)
const isLegacy = computed(() => route.meta.legacy)
onMounted(() => authStore.init())
</script>

<template>
  <AppHeader v-if="isLegacy && !isObsMode" />
  <SiteNavbar v-else-if="!isObsMode" />
  <router-view v-slot="{ Component, route: currentRoute }">
    <transition name="fade" mode="out-in"><component :is="Component" :key="currentRoute.path" /></transition>
  </router-view>
  <SiteFooter v-if="!isObsMode && !isLegacy" />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
