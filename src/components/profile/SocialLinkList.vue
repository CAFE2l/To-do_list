<script setup lang="ts">
import { ref } from 'vue'
import type { SocialLink, SocialLinkIcon } from '@/types'
import { SOCIAL_ICON_MAP, SOCIAL_ICON_OPTIONS } from '@/constants/socialIcons'
import {
  detectSocialLinkType,
  getSocialTitleFromUrl,
  normalizeSocialUrl,
  validateSafeUrl,
  sanitizeText,
} from '@/utils/detectSocialLink'

const props = defineProps<{
  links: SocialLink[]
}>()

const emit = defineEmits<{
  edit: [id: string, data: { title: string; url: string; icon: SocialLinkIcon; iconManuallySelected?: boolean }]
  delete: [id: string]
}>()

const editingId = ref<string | null>(null)
const editTitle = ref('')
const editUrl = ref('')
const editIcon = ref<string>('other')
const editManuallySelected = ref(false)
const deletingId = ref<string | null>(null)
const editUrlError = ref('')
const editTitleError = ref('')

function getIconPath(icon: string): string {
  return SOCIAL_ICON_MAP[icon] || SOCIAL_ICON_MAP.other
}

function startEdit(link: SocialLink) {
  editingId.value = link.id
  editTitle.value = link.title
  editUrl.value = link.url
  editIcon.value = link.icon
  editManuallySelected.value = link.iconManuallySelected ?? false
  editUrlError.value = ''
  editTitleError.value = ''
}

function cancelEdit() {
  editingId.value = null
  editUrlError.value = ''
  editTitleError.value = ''
}

function onEditUrlInput(value: string) {
  editUrl.value = value
  editUrlError.value = ''

  if (!editManuallySelected.value && value.trim()) {
    const normalized = normalizeSocialUrl(value)
    if (normalized) {
      const detected = detectSocialLinkType(normalized)
      if (detected.type !== 'other') {
        editIcon.value = detected.type
      }
      if (!editTitle.value.trim()) {
        editTitle.value = getSocialTitleFromUrl(normalized)
      }
    }
  }
}

function saveEdit(id: string) {
  let hasError = false

  const sanitizedTitle = sanitizeText(editTitle.value)
  if (!sanitizedTitle) {
    editTitleError.value = 'Title is required'
    hasError = true
  } else {
    editTitleError.value = ''
  }

  const normalizedUrl = normalizeSocialUrl(editUrl.value)
  const urlValidation = validateSafeUrl(normalizedUrl)
  if (!urlValidation.valid) {
    editUrlError.value = urlValidation.error || 'Invalid URL'
    hasError = true
  } else {
    editUrlError.value = ''
  }

  if (hasError) return

  const detected = detectSocialLinkType(normalizedUrl)
  const finalIcon = editManuallySelected.value ? editIcon.value : detected.type

  emit('edit', id, {
    title: sanitizedTitle,
    url: normalizedUrl,
    icon: finalIcon as SocialLinkIcon,
    iconManuallySelected: editManuallySelected.value,
  })
  editingId.value = null
}

function selectEditIcon(icon: string) {
  editIcon.value = icon
  editManuallySelected.value = true
}

function confirmDelete(id: string) {
  deletingId.value = id
}

function cancelDelete() {
  deletingId.value = null
}

function executeDelete(id: string) {
  emit('delete', id)
  deletingId.value = null
}

function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-white flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        Your links
      </h3>
      <span class="text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{{ links.length }} {{ links.length === 1 ? 'link' : 'links' }}</span>
    </div>

    <div v-if="links.length === 0" class="text-center py-8">
      <div class="w-10 h-10 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
        <svg class="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
      </div>
      <p class="text-sm text-white/30">No social links yet</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="link in links"
        :key="link.id"
        class="group rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200 overflow-hidden"
      >
        <div v-if="editingId === link.id" class="p-3 space-y-2.5">
          <div>
            <input v-model="editTitle" maxlength="40" placeholder="Title" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" />
            <p v-if="editTitleError" class="text-[10px] text-red-400/70 mt-0.5">{{ editTitleError }}</p>
          </div>
          <div>
            <input :value="editUrl" @input="onEditUrlInput(($event.target as HTMLInputElement).value)" placeholder="https://..." class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-all duration-200" />
            <p v-if="editUrlError" class="text-[10px] text-red-400/70 mt-0.5">{{ editUrlError }}</p>
          </div>
          <div class="grid grid-cols-8 gap-1">
            <button
              v-for="opt in SOCIAL_ICON_OPTIONS"
              :key="opt.value"
              @click="selectEditIcon(opt.value)"
              class="aspect-square rounded-lg border flex items-center justify-center p-1 transition-all duration-200"
              :class="editIcon === opt.value ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-white/5 text-white/30 hover:text-white/50'"
              :title="opt.label"
            >
              <img :src="opt.path" :alt="opt.label" class="w-full h-full object-contain" />
            </button>
          </div>
          <div class="flex gap-2">
            <button @click="saveEdit(link.id)" class="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-200">Save</button>
            <button @click="cancelEdit" class="flex-1 py-1.5 rounded-lg text-xs text-white/40 bg-white/5 hover:bg-white/10 transition-all duration-200">Cancel</button>
          </div>
        </div>

        <div v-else class="flex items-center gap-3 p-3">
          <img
            :src="getIconPath(link.icon)"
            :alt="link.icon"
            class="w-9 h-9 object-contain shrink-0"
          />

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ link.title }}</p>
            <p class="text-[11px] text-white/30 truncate">{{ link.url }}</p>
          </div>

          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              @click="openLink(link.url)"
              class="p-1.5 rounded-lg text-white/20 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
              title="Open link"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </button>
            <button @click="startEdit(link)" class="p-1.5 rounded-lg text-white/20 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button @click="confirmDelete(link.id)" class="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <div v-if="deletingId === link.id" class="px-3 pb-3">
          <div class="rounded-xl bg-red-500/5 border border-red-500/10 p-3 text-center">
            <p class="text-xs text-red-400/80 mb-2">Delete "{{ link.title }}"?</p>
            <div class="flex gap-2">
              <button @click="executeDelete(link.id)" class="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-400 transition-all duration-200">Delete</button>
              <button @click="cancelDelete" class="flex-1 py-1.5 rounded-lg text-xs text-white/40 bg-white/5 hover:bg-white/10 transition-all duration-200">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
