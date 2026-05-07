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
import type { Task } from '@/types'

export function useTasks() {
  const tasks = ref<Task[]>([])
  const loading = ref(true)
  let unsubscribe: Unsubscribe | null = null
  let currentUserId: string | null = null

  function subscribeToTasks(userId: string) {
    if (unsubscribe) unsubscribe()
    currentUserId = userId
    loading.value = true

    const tasksRef = collection(db, 'users', userId, 'tasks')
    const q = query(tasksRef, orderBy('order', 'asc'))

    unsubscribe = onSnapshot(q, (snapshot) => {
      tasks.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[]
      loading.value = false
    }, (error) => {
      console.error('Error fetching tasks:', error)
      loading.value = false
    })
  }

  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  async function addTask(text: string, priority: Task['priority'] = 'medium') {
    if (!currentUserId) return
    const tasksRef = collection(db, 'users', currentUserId, 'tasks')
    const now = Date.now()
    const order = tasks.value.length
    await addDoc(tasksRef, {
      text, completed: false, priority, order,
      createdAt: now, updatedAt: now,
    })
  }

  async function updateTask(taskId: string, data: Partial<Omit<Task, 'id'>>) {
    if (!currentUserId) return
    const taskRef = doc(db, 'users', currentUserId, 'tasks', taskId)
    await updateDoc(taskRef, { ...data, updatedAt: Date.now() })
  }

  async function toggleTask(taskId: string, completed: boolean) {
    await updateTask(taskId, { completed })
  }

  async function deleteTask(taskId: string) {
    if (!currentUserId) return
    const taskRef = doc(db, 'users', currentUserId, 'tasks', taskId)
    await deleteDoc(taskRef)
  }

  async function clearCompleted() {
    if (!currentUserId) return
    for (const task of tasks.value.filter(t => t.completed)) {
      await deleteTask(task.id)
    }
  }

  async function reorderTasks(reorderedTasks: Task[]) {
    if (!currentUserId) return
    for (let i = 0; i < reorderedTasks.length; i++) {
      const t = reorderedTasks[i]
      if (t.order !== i) {
        await updateDoc(doc(db, 'users', currentUserId, 'tasks', t.id), { order: i, updatedAt: Date.now() })
      }
    }
  }

  return {
    tasks, loading, subscribeToTasks,
    addTask, updateTask, toggleTask, deleteTask, clearCompleted, reorderTasks,
  }
}
