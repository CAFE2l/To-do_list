<script setup lang="ts">
import { ref, computed } from 'vue'
import { getIconPath, getIconColor } from '@/constants/socialIcons'

const props = defineProps<{
  icon: string
  size?: number
}>()

const imgFailed = ref(false)
const iconPath = computed(() => getIconPath(props.icon) || '')
const color = computed(() => getIconColor(props.icon))

function onError() {
  imgFailed.value = true
}
</script>

<template>
  <img
    v-if="iconPath && !imgFailed"
    :src="iconPath"
    :alt="icon"
    class="social-icon"
    :style="{ width: size + 'px', height: size + 'px' }"
    @error="onError"
  />
  <div
    v-else
    class="rounded-lg flex items-center justify-center flex-shrink-0"
    :style="{
      width: (size || 34) + 'px',
      height: (size || 34) + 'px',
      background: color + '20',
      border: '1px solid ' + color + '40',
    }"
    :title="icon"
  >
    <svg class="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
    </svg>
  </div>
</template>
