<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="flex items-center justify-between cursor-pointer group">
    <span v-if="label" class="text-sm text-white/70">{{ label }}</span>
    <button
      type="button"
      @click="toggle"
      class="relative w-11 h-6 rounded-full transition-colors duration-300"
      :class="modelValue ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-white/10'"
    >
      <span
        class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md"
        :class="modelValue ? 'translate-x-5' : ''"
      ></span>
    </button>
  </label>
</template>
