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
  where,
  getDocs,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Task } from '@/types'

export function useTasks(userId: string | null) {
  const tasks = ref<Task[]>([])
  const loading = ref(true)
  let unsubscribe: Unsubscribe | null = null

  function subscribeToTasks() {
    if (!userId) {
      loading.value = false
      return
    }

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
    if (unsubscribe) {
      unsubscribe()
    }
  })

  async function addTask(text: string, priority: Task['priority'] = 'medium') {
    if (!userId) return
    const tasksRef = collection(db, 'users', userId, 'tasks')
    const now = Date.now()
    const order = tasks.value.length
    await addDoc(tasksRef, {
      text,
      completed: false,
      priority,
      order,
      createdAt: now,
      updatedAt: now,
    })
  }

  async function updateTask(taskId: string, data: Partial<Omit<Task, 'id'>>) {
    if (!userId) return
    const taskRef = doc(db, 'users', userId, 'tasks', taskId)
    await updateDoc(taskRef, { ...data, updatedAt: Date.now() })
  }

  async function toggleTask(taskId: string, completed: boolean) {
    await updateTask(taskId, { completed })
  }

  async function deleteTask(taskId: string) {
    if (!userId) return
    const taskRef = doc(db, 'users', userId, 'tasks', taskId)
    await deleteDoc(taskRef)
  }

  async function clearCompleted() {
    if (!userId) return
    const completedTasks = tasks.value.filter(t => t.completed)
    for (const task of completedTasks) {
      await deleteTask(task.id)
    }
  }

  async function reorderTasks(reorderedTasks: Task[]) {
    if (!userId) return
    for (let i = 0; i < reorderedTasks.length; i++) {
      const task = reorderedTasks[i]
      if (task.order !== i) {
        const taskRef = doc(db, 'users', userId, 'tasks', task.id)
        await updateDoc(taskRef, { order: i, updatedAt: Date.now() })
      }
    }
  }

  return {
    tasks,
    loading,
    subscribeToTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    reorderTasks,
  }
}
