export interface Task {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  order: number
  createdAt: number
  updatedAt: number
}

export interface OverlaySettings {
  title: string
  theme: 'aqua' | 'purple' | 'green' | 'minimal-dark'
  showLiveBadge: boolean
  showProgress: boolean
  showCompletedTasks: boolean
  width: number
  opacity: number
  emptyText: string
  updatedAt: number
}

export interface UserLocation {
  label: string
  city: string
  region: string
  country: string
  lat?: number
  lng?: number
}

export interface AppUser {
  uid: string
  displayName: string
  email: string
  photoURL: string
  createdAt: number
}

export type Theme = OverlaySettings['theme']

export const DEFAULT_OVERLAY_SETTINGS: OverlaySettings = {
  title: 'Study Tasks',
  theme: 'aqua',
  showLiveBadge: true,
  showProgress: true,
  showCompletedTasks: true,
  width: 380,
  opacity: 0.88,
  emptyText: 'No tasks yet',
  updatedAt: Date.now(),
}
