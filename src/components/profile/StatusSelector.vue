<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const statuses = [
  { value: 'active', label: 'Active', color: 'bg-emerald-400' },
  { value: 'focusing', label: 'Focusing', color: 'bg-cyan-400' },
  { value: 'studying', label: 'Studying', color: 'bg-purple-400' },
  { value: 'offline', label: 'Offline', color: 'bg-white/20' },
]
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
    <button
      v-for="s in statuses"
      :key="s.value"
      @click="emit('update:modelValue', s.value)"
      class="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all duration-200"
      :class="modelValue === s.value
        ? 'border-cyan-500/40 bg-cyan-500/10 ring-1 ring-cyan-500/20 text-white'
        : 'border-white/5 bg-white/[0.02] hover:border-white/10 text-white/50 hover:text-white/70'"
    >
      <span class="w-2 h-2 rounded-full" :class="s.color"></span>
      {{ s.label }}
    </button>
  </div>
</template>
