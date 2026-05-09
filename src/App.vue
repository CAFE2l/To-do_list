<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import AppHeader from "@/components/AppHeader.vue";

const authStore = useAuthStore();
const route = useRoute();
const showHeader = computed(() => route.name !== "overlay");

onMounted(() => {
    authStore.init();
});
</script>

<template>
    <AppHeader v-if="showHeader" />
    <router-view v-slot="{ Component, route: r }">
        <transition name="fade" mode="out-in">
            <component :is="Component" :key="r.path" />
        </transition>
    </router-view>
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
