<script setup lang="ts">
import { ref, computed } from 'vue'
import { getIconPath } from '@/constants/socialIcons'

const props = defineProps<{
  icon: string
  size?: number
}>()

const imgFailed = ref(false)
const iconPath = computed(() => getIconPath(props.icon))
const actualSize = computed(() => props.size || 34)

function onError() {
  imgFailed.value = true
}

function onRetry() {
  imgFailed.value = false
}
</script>

<template>
  <img
    v-if="iconPath && !imgFailed"
    :key="icon + String(imgFailed)"
    :src="iconPath"
    :alt="icon"
    class="social-icon flex-shrink-0"
    :style="{
      width: actualSize + 'px',
      height: actualSize + 'px',
      objectFit: 'contain',
      imageRendering: 'pixelated',
    }"
    @error="onError"
    @load="onRetry"
  />
  <div
    v-else
    class="flex-shrink-0 rounded-lg"
    :style="{
      width: actualSize + 'px',
      height: actualSize + 'px',
    }"
  ></div>
</template>
