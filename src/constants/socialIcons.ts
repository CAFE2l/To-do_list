export const SOCIAL_ICON_MAP: Record<string, string | undefined> = {
  youtube: "/icons/8bit/youtube.png",
  instagram: "/icons/8bit/instagram.png",
  tiktok: "/icons/8bit/tiktok.png",
  twitter: "/icons/8bit/twitter.png",
  linkedin: "/icons/8bit/linkedin.png",
  discord: "/icons/8bit/discord.png",
  telegram: "/icons/8bit/telegram.png",
  twitch: "/icons/8bit/twitch.png",
  whatsapp: "/icons/8bit/whatsapp.png",
  facebook: "/icons/8bit/facebook.png",
  reddit: "/icons/8bit/reddit.png",
  pinterest: "/icons/8bit/pinterest.png",
  spotify: "/icons/8bit/spotify.png",
  steam: "/icons/8bit/steam.png",
}

export const SOCIAL_ICON_COLORS: Record<string, string> = {
  github: "#6e40c9",
  x: "#000000",
  email: "#eab308",
  website: "#22d3ee",
  portfolio: "#3b82f6",
  behance: "#1769ff",
  dribbble: "#ea4c89",
  figma: "#f24e1e",
  roblox: "#b41e1e",
  youtube: "#ff0000",
  instagram: "#e1306c",
  tiktok: "#000000",
  twitter: "#1da1f2",
  linkedin: "#0a66c2",
  discord: "#5865f2",
  telegram: "#0088cc",
  twitch: "#6441a5",
  whatsapp: "#25d366",
  facebook: "#1877f2",
  reddit: "#ff4500",
  pinterest: "#bd081c",
  spotify: "#1db954",
  steam: "#000000",
  other: "#666666",
}

export interface SocialIconOption {
  value: string
  label: string
  path: string | undefined
  color: string
}

export const SOCIAL_ICON_OPTIONS: SocialIconOption[] = [
  { value: "youtube", label: "YouTube", path: SOCIAL_ICON_MAP.youtube, color: SOCIAL_ICON_COLORS.youtube },
  { value: "github", label: "GitHub", path: SOCIAL_ICON_MAP.github, color: SOCIAL_ICON_COLORS.github },
  { value: "instagram", label: "Instagram", path: SOCIAL_ICON_MAP.instagram, color: SOCIAL_ICON_COLORS.instagram },
  { value: "tiktok", label: "TikTok", path: SOCIAL_ICON_MAP.tiktok, color: SOCIAL_ICON_COLORS.tiktok },
  { value: "x", label: "X / Twitter", path: SOCIAL_ICON_MAP.x, color: SOCIAL_ICON_COLORS.x },
  { value: "twitter", label: "Twitter", path: SOCIAL_ICON_MAP.twitter, color: SOCIAL_ICON_COLORS.twitter },
  { value: "linkedin", label: "LinkedIn", path: SOCIAL_ICON_MAP.linkedin, color: SOCIAL_ICON_COLORS.linkedin },
  { value: "discord", label: "Discord", path: SOCIAL_ICON_MAP.discord, color: SOCIAL_ICON_COLORS.discord },
  { value: "telegram", label: "Telegram", path: SOCIAL_ICON_MAP.telegram, color: SOCIAL_ICON_COLORS.telegram },
  { value: "twitch", label: "Twitch", path: SOCIAL_ICON_MAP.twitch, color: SOCIAL_ICON_COLORS.twitch },
  { value: "whatsapp", label: "WhatsApp", path: SOCIAL_ICON_MAP.whatsapp, color: SOCIAL_ICON_COLORS.whatsapp },
  { value: "website", label: "Website", path: SOCIAL_ICON_MAP.website, color: SOCIAL_ICON_COLORS.website },
  { value: "email", label: "Email", path: SOCIAL_ICON_MAP.email, color: SOCIAL_ICON_COLORS.email },
  { value: "portfolio", label: "Portfolio", path: SOCIAL_ICON_MAP.portfolio, color: SOCIAL_ICON_COLORS.portfolio },
  { value: "reddit", label: "Reddit", path: SOCIAL_ICON_MAP.reddit, color: SOCIAL_ICON_COLORS.reddit },
  { value: "pinterest", label: "Pinterest", path: SOCIAL_ICON_MAP.pinterest, color: SOCIAL_ICON_COLORS.pinterest },
  { value: "facebook", label: "Facebook", path: SOCIAL_ICON_MAP.facebook, color: SOCIAL_ICON_COLORS.facebook },
  { value: "spotify", label: "Spotify", path: SOCIAL_ICON_MAP.spotify, color: SOCIAL_ICON_COLORS.spotify },
  { value: "behance", label: "Behance", path: SOCIAL_ICON_MAP.behance, color: SOCIAL_ICON_COLORS.behance },
  { value: "dribbble", label: "Dribbble", path: SOCIAL_ICON_MAP.dribbble, color: SOCIAL_ICON_COLORS.dribbble },
  { value: "figma", label: "Figma", path: SOCIAL_ICON_MAP.figma, color: SOCIAL_ICON_COLORS.figma },
  { value: "steam", label: "Steam", path: SOCIAL_ICON_MAP.steam, color: SOCIAL_ICON_COLORS.steam },
  { value: "roblox", label: "Roblox", path: SOCIAL_ICON_MAP.roblox, color: SOCIAL_ICON_COLORS.roblox },
  { value: "other", label: "Other", path: SOCIAL_ICON_MAP.other, color: SOCIAL_ICON_COLORS.other },
]

export function getIconPath(value: string): string | undefined {
  return SOCIAL_ICON_MAP[value]
}

export function getIconColor(value: string): string {
  return SOCIAL_ICON_COLORS[value] || SOCIAL_ICON_COLORS.other
}

export function getIconLabel(value: string): string {
  const option = SOCIAL_ICON_OPTIONS.find(o => o.value === value)
  return option?.label || "Other"
}

export const MAX_SOCIAL_LINKS = 20
