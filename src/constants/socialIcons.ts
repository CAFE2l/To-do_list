export const SOCIAL_ICON_MAP: Record<string, string> = {
  youtube: "/icons/social/8bit/youtube.png",
  github: "/icons/social/8bit/github.png",
  instagram: "/icons/social/8bit/instagram.png",
  tiktok: "/icons/social/8bit/tiktok.png",
  x: "/icons/social/8bit/x.png",
  twitter: "/icons/social/8bit/twitter.png",
  linkedin: "/icons/social/8bit/linkedin.png",
  discord: "/icons/social/8bit/discord.png",
  telegram: "/icons/social/8bit/telegram.png",
  twitch: "/icons/social/8bit/twitch.png",
  whatsapp: "/icons/social/8bit/whatsapp.png",
  website: "/icons/social/8bit/website.png",
  email: "/icons/social/8bit/email.png",
  portfolio: "/icons/social/8bit/portfolio.png",
  reddit: "/icons/social/8bit/reddit.png",
  pinterest: "/icons/social/8bit/pinterest.png",
  facebook: "/icons/social/8bit/facebook.png",
  spotify: "/icons/social/8bit/spotify.png",
  behance: "/icons/social/8bit/behance.png",
  dribbble: "/icons/social/8bit/dribbble.png",
  figma: "/icons/social/8bit/figma.png",
  steam: "/icons/social/8bit/steam.png",
  roblox: "/icons/social/8bit/roblox.png",
  other: "/icons/social/8bit/other.png",
}

export interface SocialIconOption {
  value: string
  label: string
  path: string
}

export const SOCIAL_ICON_OPTIONS: SocialIconOption[] = [
  { value: "youtube", label: "YouTube", path: SOCIAL_ICON_MAP.youtube },
  { value: "github", label: "GitHub", path: SOCIAL_ICON_MAP.github },
  { value: "instagram", label: "Instagram", path: SOCIAL_ICON_MAP.instagram },
  { value: "tiktok", label: "TikTok", path: SOCIAL_ICON_MAP.tiktok },
  { value: "x", label: "X / Twitter", path: SOCIAL_ICON_MAP.x },
  { value: "twitter", label: "Twitter", path: SOCIAL_ICON_MAP.twitter },
  { value: "linkedin", label: "LinkedIn", path: SOCIAL_ICON_MAP.linkedin },
  { value: "discord", label: "Discord", path: SOCIAL_ICON_MAP.discord },
  { value: "telegram", label: "Telegram", path: SOCIAL_ICON_MAP.telegram },
  { value: "twitch", label: "Twitch", path: SOCIAL_ICON_MAP.twitch },
  { value: "whatsapp", label: "WhatsApp", path: SOCIAL_ICON_MAP.whatsapp },
  { value: "website", label: "Website", path: SOCIAL_ICON_MAP.website },
  { value: "email", label: "Email", path: SOCIAL_ICON_MAP.email },
  { value: "portfolio", label: "Portfolio", path: SOCIAL_ICON_MAP.portfolio },
  { value: "reddit", label: "Reddit", path: SOCIAL_ICON_MAP.reddit },
  { value: "pinterest", label: "Pinterest", path: SOCIAL_ICON_MAP.pinterest },
  { value: "facebook", label: "Facebook", path: SOCIAL_ICON_MAP.facebook },
  { value: "spotify", label: "Spotify", path: SOCIAL_ICON_MAP.spotify },
  { value: "behance", label: "Behance", path: SOCIAL_ICON_MAP.behance },
  { value: "dribbble", label: "Dribbble", path: SOCIAL_ICON_MAP.dribbble },
  { value: "figma", label: "Figma", path: SOCIAL_ICON_MAP.figma },
  { value: "steam", label: "Steam", path: SOCIAL_ICON_MAP.steam },
  { value: "roblox", label: "Roblox", path: SOCIAL_ICON_MAP.roblox },
  { value: "other", label: "Other", path: SOCIAL_ICON_MAP.other },
]

export function getIconPath(value: string): string {
  return SOCIAL_ICON_MAP[value] || SOCIAL_ICON_MAP.other
}

export function getIconLabel(value: string): string {
  const option = SOCIAL_ICON_OPTIONS.find(o => o.value === value)
  return option?.label || "Other"
}

export const MAX_SOCIAL_LINKS = 20
