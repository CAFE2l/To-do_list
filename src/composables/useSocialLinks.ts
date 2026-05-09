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

export function useSocialLinks() {
  const socialLinks = ref<SocialLink[]>([])
  const loading = ref(true)
  const saving = ref(false)
  const error = ref('')
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

  async function addLink(data: { title: string; url: string; icon: SocialLinkIcon }) {
    if (!currentUserId) return
    saving.value = true
    error.value = ''

    try {
      const linksRef = collection(db, 'users', currentUserId, 'socialLinks')
      const now = Date.now()
      const order = socialLinks.value.length
      await addDoc(linksRef, {
        title: data.title,
        url: data.url,
        icon: data.icon,
        order,
        createdAt: now,
        updatedAt: now,
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to add link.'
    } finally {
      saving.value = false
    }
  }

  async function updateLink(id: string, data: { title?: string; url?: string; icon?: SocialLinkIcon }) {
    if (!currentUserId) return
    saving.value = true
    error.value = ''

    try {
      const linkRef = doc(db, 'users', currentUserId, 'socialLinks', id)
      await updateDoc(linkRef, { ...data, updatedAt: Date.now() })
    } catch (e: any) {
      error.value = e.message || 'Failed to update link.'
    } finally {
      saving.value = false
    }
  }

  async function deleteLink(id: string) {
    if (!currentUserId) return
    saving.value = true
    error.value = ''

    try {
      const linkRef = doc(db, 'users', currentUserId, 'socialLinks', id)
      await deleteDoc(linkRef)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete link.'
    } finally {
      saving.value = false
    }
  }

  return {
    socialLinks, loading, saving, error,
    subscribeToLinks, addLink, updateLink, deleteLink,
  }
}
