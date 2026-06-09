<script setup lang="ts">
import TodoOverlay from './TodoOverlay.vue'
import PomodoroOverlay from './PomodoroOverlay.vue'
import CountdownOverlay from './CountdownOverlay.vue'
import SocialLinksOverlay from './SocialLinksOverlay.vue'
import GoalOverlay from './GoalOverlay.vue'
import ChatBoxOverlay from './ChatBoxOverlay.vue'
import DonationOverlay from './DonationOverlay.vue'
import { useLocalOverlaySettings } from '@/composables/useLocalOverlaySettings'
defineProps<{ id: string }>()
const { settings } = useLocalOverlaySettings()
const components: Record<string, unknown> = { 'todo-list': TodoOverlay, pomodoro: PomodoroOverlay, countdown: CountdownOverlay, 'social-links': SocialLinksOverlay, goal: GoalOverlay, 'chat-box': ChatBoxOverlay, donation: DonationOverlay }
</script>
<template><div class="overlay-stage" :class="`theme-${settings.theme}`" :style="{ '--primary': settings.primary, '--secondary': settings.secondary, '--widget-opacity': settings.opacity, '--widget-scale': settings.scale, fontFamily: settings.font }"><component :is="components[id] || TodoOverlay" /></div></template>
