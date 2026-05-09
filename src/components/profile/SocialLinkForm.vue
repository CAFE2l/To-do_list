<script setup lang="ts">
import { ref } from 'vue'
import type { SocialLinkIcon } from '@/types'
import { SOCIAL_LINK_ICONS } from '@/types'

const emit = defineEmits<{
  add: [data: { title: string; url: string; icon: SocialLinkIcon }]
}>()

const title = ref('')
const url = ref('')
const icon = ref<SocialLinkIcon>('website')

const icons = Object.entries(SOCIAL_LINK_ICONS) as [SocialLinkIcon, { label: string; svg: string }][]

const error = ref('')

function handleSubmit() {
  error.value = ''

  if (!title.value.trim()) {
    error.value = 'Title is required.'
    return
  }

  if (!url.value.trim()) {
    error.value = 'URL is required.'
    return
  }

  if (!url.value.startsWith('http://') && !url.value.startsWith('https://')) {
    error.value = 'URL must start with http:// or https://'
    return
  }

  emit('add', {
    title: title.value.trim(),
    url: url.value.trim(),
    icon: icon.value,
  })

  title.value = ''
  url.value = ''
  icon.value = 'website'
}

function selectIcon(i: SocialLinkIcon) {
  icon.value = i
}
</script>

<template>
  <div class="card-glass p-4 sm:p-5">
    <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
      New social link
    </h3>

    <div class="space-y-3.5">
      <div>
        <label class="block text-[11px] text-white/40 uppercase tracking-wider mb-1">Title</label>
        <input v-model="title" maxlength="30" placeholder="GitHub" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" />
      </div>

      <div>
        <label class="block text-[11px] text-white/40 uppercase tracking-wider mb-1">URL</label>
        <input v-model="url" placeholder="https://github.com/username" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" />
      </div>

      <div>
        <label class="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Icon</label>
        <div class="grid grid-cols-7 gap-1.5">
          <button
            v-for="[key, info] in icons"
            :key="key"
            @click="selectIcon(key)"
            class="w-full aspect-square rounded-xl border flex items-center justify-center p-1.5 transition-all duration-200"
            :class="icon === key
              ? 'border-cyan-500/40 bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400'
              : 'border-white/5 bg-white/[0.02] hover:border-white/10 text-white/30 hover:text-white/50'"
            :title="info.label"
            v-html="info.svg"
          ></button>
        </div>
      </div>

      <p v-if="error" class="text-[11px] text-red-400">{{ error }}</p>

      <button @click="handleSubmit"
        class="w-full py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 active:scale-[0.98]"
      >+ Add link</button>
    </div>
  </div>
</template>
