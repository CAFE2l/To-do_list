import { reactive, watch } from 'vue'

export interface LocalOverlaySettings {
  theme: 'transparent' | 'dark' | 'neon' | 'light'
  primary: string
  secondary: string
  text: string
  font: string
  opacity: number
  scale: number
}

const STORAGE_KEY = 'overloom-overlay-settings'
const defaults: LocalOverlaySettings = { theme: 'neon', primary: '#22d3ee', secondary: '#86efac', text: 'ON AIR', font: 'Inter', opacity: 0.94, scale: 1 }

function readSettings(): LocalOverlaySettings {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } }
  catch { return { ...defaults } }
}

const settings = reactive<LocalOverlaySettings>(readSettings())
watch(settings, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })

export function useLocalOverlaySettings() {
  function resetSettings() { Object.assign(settings, defaults) }
  return { settings, resetSettings }
}
