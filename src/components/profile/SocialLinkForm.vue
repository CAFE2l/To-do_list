<script setup lang="ts">
import { ref, computed } from 'vue'
import SocialIconImg from '@/components/common/SocialIconImg.vue'
import {
  SOCIAL_ICON_OPTIONS,
  MAX_SOCIAL_LINKS,
} from '@/constants/socialIcons'
import {
  detectSocialLinkType,
  getSocialTitleFromUrl,
  normalizeSocialUrl,
  validateSafeUrl,
  sanitizeText,
} from '@/utils/detectSocialLink'

const props = defineProps<{
  linkCount: number
}>()

const emit = defineEmits<{
  add: [data: { title: string; url: string; icon: string; iconManuallySelected: boolean }]
}>()

const title = ref('')
const url = ref('')
const selectedIcon = ref('other')
const iconManuallySelected = ref(false)
const showIconGrid = ref(false)
const urlError = ref('')
const titleError = ref('')
const isDetecting = ref(false)

const isAtLimit = computed(() => props.linkCount >= MAX_SOCIAL_LINKS)

const detectedPreview = computed(() => {
  return selectedIcon.value
})

function detectFromUrl(value: string) {
  if (!value.trim() || iconManuallySelected.value) return

  isDetecting.value = true
  try {
    const normalized = normalizeSocialUrl(value)
    if (!normalized) return

    const validation = validateSafeUrl(normalized)
    if (!validation.valid) {
      urlError.value = validation.error || ''
      return
    }
    urlError.value = ''

    const detected = detectSocialLinkType(normalized)
    if (detected.type !== 'other') {
      selectedIcon.value = detected.type
    }

    if (!title.value.trim()) {
      title.value = getSocialTitleFromUrl(normalized)
    }
  } finally {
    isDetecting.value = false
  }
}

const urlInputDebounce = ref<ReturnType<typeof setTimeout>>()

function onUrlInput(value: string) {
  url.value = value
  urlError.value = ''

  if (urlInputDebounce.value) clearTimeout(urlInputDebounce.value)
  urlInputDebounce.value = setTimeout(() => {
    detectFromUrl(value)
  }, 400)
}

function selectIcon(icon: string) {
  selectedIcon.value = icon
  iconManuallySelected.value = true
  showIconGrid.value = false
}

function submit() {
  let hasError = false

  const sanitizedTitle = sanitizeText(title.value)
  if (!sanitizedTitle) {
    titleError.value = 'Title is required'
    hasError = true
  } else {
    titleError.value = ''
  }

  const normalizedUrl = normalizeSocialUrl(url.value)
  const urlValidation = validateSafeUrl(normalizedUrl)
  if (!urlValidation.valid) {
    urlError.value = urlValidation.error || 'Invalid URL'
    hasError = true
  } else {
    urlError.value = ''
  }

  if (hasError) return

  const detected = detectSocialLinkType(normalizedUrl)
  const finalIcon = iconManuallySelected.value ? selectedIcon.value : detected.type

  emit('add', {
    title: sanitizedTitle,
    url: normalizedUrl,
    icon: finalIcon,
    iconManuallySelected: iconManuallySelected.value,
  })

  title.value = ''
  url.value = ''
  selectedIcon.value = 'other'
  iconManuallySelected.value = false
}
</script>

<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6">
    <h3 class="text-sm font-semibold text-white flex items-center gap-2 mb-4">
      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
      New social link
      <span v-if="isAtLimit" class="text-[10px] text-red-400/70 font-normal ml-1">(limit reached)</span>
    </h3>

    <div v-if="isAtLimit" class="text-center py-4">
      <p class="text-sm text-white/30">You reached the limit of {{ MAX_SOCIAL_LINKS }} links.</p>
    </div>

    <form v-else @submit.prevent="submit" class="space-y-3">
      <div>
        <input
          v-model="title"
          type="text"
          maxlength="40"
          placeholder="Link title"
          class="glass-input w-full text-sm"
        />
        <p v-if="titleError" class="text-[11px] text-red-400/70 mt-1">{{ titleError }}</p>
      </div>

      <div>
        <div class="relative">
          <input
            :value="url"
            @input="onUrlInput(($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="https://..."
            class="glass-input w-full text-sm pr-9"
          />
          <div v-if="isDetecting" class="absolute right-3 top-1/2 -translate-y-1/2">
            <div class="w-4 h-4 border border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <p v-if="urlError" class="text-[11px] text-red-400/70 mt-1">{{ urlError }}</p>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-white/40">Icon</span>
          <SocialIconImg
            v-if="detectedPreview"
            :icon="detectedPreview"
            :size="24"
          />
          <button
            type="button"
            @click="showIconGrid = !showIconGrid"
            class="text-[10px] text-cyan-400/60 hover:text-cyan-300 underline underline-offset-2 transition-colors"
          >
            {{ showIconGrid ? 'Close' : 'Change' }}
          </button>
        </div>
        <p class="text-[10px] text-white/20 mb-2">Icon is detected automatically from the URL.</p>

        <div
          v-if="showIconGrid"
          class="grid grid-cols-6 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
        >
          <button
            v-for="opt in SOCIAL_ICON_OPTIONS"
            :key="opt.value"
            type="button"
            @click="selectIcon(opt.value)"
            class="aspect-square rounded-lg border flex items-center justify-center p-1.5 transition-all duration-200"
            :class="selectedIcon === opt.value
              ? 'border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
              : 'border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04]'"
            :title="opt.label"
          >
            <SocialIconImg :icon="opt.value" :size="36" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-2.5 rounded-xl text-sm font-medium add-btn gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add link
      </button>
    </form>
  </div>
</template>
