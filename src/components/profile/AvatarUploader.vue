<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  photoURL: string
  displayName: string
  uploading: boolean
}>()

const emit = defineEmits<{
  select: [file: File]
  remove: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const preview = ref<string | null>(null)
const dragOver = ref(false)

const initials = computed(() => {
  const n = props.displayName || '?'
  return n.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2)
})

const currentSrc = computed(() => preview.value || props.photoURL)

function triggerInput() {
  if (props.uploading) return
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  validateAndPreview(file)
  target.value = ''
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  validateAndPreview(file)
}

function validateAndPreview(file: File) {
  const allowed = ['image/png', 'image/jpeg', 'image/webp']
  if (!allowed.includes(file.type)) {
    emit('select', file)
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    emit('select', file)
    return
  }
  const reader = new FileReader()
  reader.onload = () => { preview.value = reader.result as string }
  reader.readAsDataURL(file)
  emit('select', file)
}

function handleRemove() {
  preview.value = null
  emit('remove')
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div
      @click="triggerInput"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="onDrop"
      class="relative w-24 h-24 rounded-full cursor-pointer group"
      :class="{ 'opacity-60': uploading }"
    >
      <img
        v-if="currentSrc"
        :src="currentSrc"
        class="w-full h-full rounded-full object-cover ring-2 ring-cyan-500/20 group-hover:ring-cyan-400/40 transition-all duration-300"
      />
      <div
        v-else
        class="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl ring-2 ring-cyan-500/20 group-hover:ring-cyan-400/40 transition-all duration-300"
      >{{ initials }}</div>

      <div
        class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
      >
        <svg v-if="!uploading" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <svg v-else class="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
      </div>

      <div
        v-if="dragOver"
        class="absolute inset-0 rounded-full ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0a1a]"
      ></div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      class="hidden"
      @change="onFileChange"
    />

    <div class="flex items-center gap-3">
      <button @click="triggerInput" :disabled="uploading"
        class="text-xs text-cyan-400/60 hover:text-cyan-300 transition-colors disabled:opacity-40"
      >{{ photoURL ? 'Change photo' : 'Upload photo' }}</button>
      <span v-if="photoURL" class="text-white/20">·</span>
      <button v-if="photoURL" @click="handleRemove"
        class="text-xs text-white/30 hover:text-red-400 transition-colors"
      >Remove</button>
    </div>

    <p class="text-[10px] text-white/20">PNG, JPEG or WebP · Max 2MB</p>
  </div>
</template>
