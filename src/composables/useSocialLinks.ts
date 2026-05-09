import { ref, onUnmounted } from 'vue'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { SocialLink, SocialLinkIcon } from '@/types'
import {
  detectSocialLinkType,
  getSocialTitleFromUrl,
  sanitizeSocialLinkData,
  normalizeSocialUrl,
  validateSafeUrl,
  sanitizeText,
} from '@/utils/detectSocialLink'
import { MAX_SOCIAL_LINKS } from '@/constants/socialIcons'

export function useSocialLinks() {
  const socialLinks = ref<SocialLink[]>([])
  const loading = ref(true)
  const saving = ref(false)
  const error = ref('')
  const successMessage = ref('')
  let unsubscribe: Unsubscribe | null = null
  let currentUserId: string | null = null

  function subscribeToLinks(userId: string) {
    if (unsubscribe) unsubscribe()
    currentUserId = userId
    loading.value = true

    const linksRef = collection(db, 'users', userId, 'socialLinks')
    const q = query(linksRef, orderBy('order', 'asc'))

    unsubscribe = onSnapshot(q, (snapshot) => {
      socialLinks.value = snapshot.docs.map(snap => ({
        id: snap.id,
        ...snap.data(),
      })) as SocialLink[]
      loading.value = false
    }, () => {
      loading.value = false
    })
  }

  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  function clearMessages() {
    error.value = ''
    successMessage.value = ''
  }

  async function addLink(data: { title: string; url: string; icon: string; iconManuallySelected?: boolean }) {
    if (!currentUserId) return
    clearMessages()

    if (socialLinks.value.length >= MAX_SOCIAL_LINKS) {
      error.value = `You reached the limit of ${MAX_SOCIAL_LINKS} links.`
      return
    }

    const sanitized = sanitizeSocialLinkData({
      title: data.title,
      url: data.url,
      icon: data.icon,
    })
    if (!sanitized) {
      error.value = 'Invalid link data. Check the URL and try again.'
      return
    }

    saving.value = true
    try {
      const linksRef = collection(db, 'users', currentUserId, 'socialLinks')
      const now = Date.now()
      const order = socialLinks.value.length
      await addDoc(linksRef, {
        title: sanitized.title,
        url: sanitized.url,
        icon: sanitized.icon,
        iconManuallySelected: data.iconManuallySelected ?? false,
        order,
        createdAt: now,
        updatedAt: now,
      })
      successMessage.value = 'Link added successfully.'
    } catch (e: any) {
      error.value = e.message || 'Failed to add link.'
    } finally {
      saving.value = false
    }
  }

  async function updateLink(id: string, data: {
    title?: string
    url?: string
    icon?: SocialLinkIcon
    iconManuallySelected?: boolean
  }) {
    if (!currentUserId) return
    clearMessages()

    if (data.title !== undefined) {
      const sanitizedTitle = sanitizeText(data.title)
      if (!sanitizedTitle) {
        error.value = 'Title is required.'
        return
      }
      data.title = sanitizedTitle
    }

    if (data.url !== undefined && data.url.trim()) {
      const normalizedUrl = normalizeSocialUrl(data.url)
      const validation = validateSafeUrl(normalizedUrl)
      if (!validation.valid) {
        error.value = validation.error || 'Invalid URL.'
        return
      }
      data.url = normalizedUrl
    }

    saving.value = true
    try {
      const linkRef = doc(db, 'users', currentUserId, 'socialLinks', id)
      await updateDoc(linkRef, { ...data, updatedAt: Date.now() })
      successMessage.value = 'Link updated successfully.'
    } catch (e: any) {
      error.value = e.message || 'Failed to update link.'
    } finally {
      saving.value = false
    }
  }

  async function deleteLink(id: string) {
    if (!currentUserId) return
    clearMessages()
    saving.value = true

    try {
      const linkRef = doc(db, 'users', currentUserId, 'socialLinks', id)
      await deleteDoc(linkRef)
      successMessage.value = 'Link deleted successfully.'
    } catch (e: any) {
      error.value = e.message || 'Failed to delete link.'
    } finally {
      saving.value = false
    }
  }

  return {
    socialLinks, loading, saving, error, successMessage,
    subscribeToLinks, addLink, updateLink, deleteLink, clearMessages,
  }
}
