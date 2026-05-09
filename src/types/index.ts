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

export type SocialLinkIcon =
  | 'youtube' | 'github' | 'instagram' | 'tiktok' | 'x' | 'twitter'
  | 'linkedin' | 'discord' | 'telegram' | 'twitch' | 'whatsapp'
  | 'website' | 'portfolio' | 'email' | 'reddit' | 'pinterest'
  | 'facebook' | 'spotify' | 'behance' | 'dribbble' | 'figma'
  | 'steam' | 'roblox' | 'other'

export interface SocialLink {
  id: string
  title: string
  url: string
  icon: SocialLinkIcon
  iconManuallySelected?: boolean
  order: number
  createdAt: number
  updatedAt: number
}

export const DEFAULT_OVERLAY_SETTINGS: OverlaySettings = {
  title: 'Study Tasks',
  showLiveBadge: true,
  showProgress: true,
  showCompletedTasks: true,
  width: 380,
  opacity: 0.88,
  emptyText: 'No tasks yet',
  updatedAt: Date.now(),
}
