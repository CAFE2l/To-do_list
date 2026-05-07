<script setup lang="ts">
const props = defineProps<{
  class?: string
  glow?: boolean
  hover?: boolean
}>()
</script>

<template>
  <div
    class="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] shadow-xl shadow-black/10 transition-all duration-300"
    :class="[
      glow ? 'shadow-cyan-500/5' : '',
      hover ? 'hover:bg-white/[0.05] hover:border-white/[0.10] hover:shadow-cyan-500/10' : '',
      props.class,
    ]"
  >
    <slot />
  </div>
</template>
