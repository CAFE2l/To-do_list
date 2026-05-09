const DANGEROUS_PATTERNS = [
  /javascript\s*:/i,
  /data\s*:/i,
  /vbscript\s*:/i,
  /file\s*:/i,
  /blob\s*:/i,
  /about\s*:/i,
  /chrome\s*:/i,
  /view-source\s*:/i,
  /<script/i,
  /onerror\s*=/i,
  /onclick\s*=/i,
  /onload\s*=/i,
  /onmouseover\s*=/i,
  /onfocus\s*=/i,
  /onchange\s*=/i,
  /<iframe/i,
  /<embed/i,
  /<object/i,
  /<svg/i,
]

interface DetectionResult {
  type: string
  label: string
}

interface ValidationResult {
  valid: boolean
  error?: string
}

export function sanitizeText(input: string): string {
  if (!input) return ""
  let text = input.trim()
  text = text.replace(/</g, "")
  text = text.replace(/>/g, "")
  text = text.slice(0, 40)
  return text
}

export function validateSafeUrl(url: string): ValidationResult {
  if (!url || !url.trim()) {
    return { valid: false, error: "URL is required" }
  }

  let trimmed = url.trim()

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: "This URL is not allowed" }
    }
  }

  const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(trimmed)
  if (hasProtocol) {
    if (
      !trimmed.startsWith("https://") &&
      !trimmed.startsWith("http://") &&
      !trimmed.startsWith("mailto:")
    ) {
      return { valid: false, error: "Only https, http and mailto URLs are allowed" }
    }
  }

  if (trimmed.includes("<")) {
    return { valid: false, error: "HTML tags are not allowed in URLs" }
  }
  if (/["']/.test(trimmed)) {
    return { valid: false, error: "Invalid characters in URL" }
  }

  return { valid: true }
}

export function normalizeSocialUrl(input: string): string {
  if (!input) return ""
  let url = input.trim()

  if (url.startsWith("mailto:")) {
    const email = url.replace("mailto:", "").trim()
    if (email.includes("@") && !email.includes(" ") && !email.includes("<")) {
      return url
    }
    return ""
  }

  url = url.replace(/^https?:\/\//i, "")

  url = url.replace(/^\/\//, "")

  url = url.replace(/\/+$/, "")

  if (url) {
    url = "https://" + url
  }

  return url
}

export function detectSocialLinkType(url: string): DetectionResult {
  if (!url) return { type: "other", label: "Other" }

  const normalized = url.toLowerCase().trim()

  if (normalized.startsWith("mailto:")) {
    return { type: "email", label: "Email" }
  }

  const patterns: [RegExp, string, string][] = [
    [/youtube\.com/i, "youtube", "YouTube"],
    [/youtu\.be/i, "youtube", "YouTube"],
    [/github\.com/i, "github", "GitHub"],
    [/instagram\.com/i, "instagram", "Instagram"],
    [/tiktok\.com/i, "tiktok", "TikTok"],
    [/x\.com/i, "x", "X"],
    [/twitter\.com/i, "twitter", "Twitter"],
    [/linkedin\.com/i, "linkedin", "LinkedIn"],
    [/discord\.gg/i, "discord", "Discord"],
    [/discord\.com\/invite/i, "discord", "Discord"],
    [/discordapp\.com/i, "discord", "Discord"],
    [/t\.me\//i, "telegram", "Telegram"],
    [/telegram\.me\//i, "telegram", "Telegram"],
    [/telegram\.org/i, "telegram", "Telegram"],
    [/twitch\.tv/i, "twitch", "Twitch"],
    [/wa\.me\//i, "whatsapp", "WhatsApp"],
    [/api\.whatsapp\.com/i, "whatsapp", "WhatsApp"],
    [/whatsapp\.com/i, "whatsapp", "WhatsApp"],
    [/reddit\.com/i, "reddit", "Reddit"],
    [/pinterest\.com/i, "pinterest", "Pinterest"],
    [/pinterest\.ca/i, "pinterest", "Pinterest"],
    [/facebook\.com/i, "facebook", "Facebook"],
    [/fb\.com/i, "facebook", "Facebook"],
    [/spotify\.com/i, "spotify", "Spotify"],
    [/behance\.net/i, "behance", "Behance"],
    [/dribbble\.com/i, "dribbble", "Dribbble"],
    [/figma\.com/i, "figma", "Figma"],
    [/steamcommunity\.com/i, "steam", "Steam"],
    [/steampowered\.com/i, "steam", "Steam"],
    [/roblox\.com/i, "roblox", "Roblox"],
  ]

  for (const [regex, type, label] of patterns) {
    if (regex.test(normalized)) {
      return { type, label }
    }
  }

  if (normalized.includes("@") && !normalized.startsWith("http")) {
    return { type: "email", label: "Email" }
  }

  try {
    const hostname = new URL(normalized.startsWith("http") ? normalized : "https://" + normalized).hostname
      .replace(/^www\./, "")
    return { type: "website", label: hostname || "Website" }
  } catch {
    return { type: "website", label: "Website" }
  }
}

export function getSocialTitleFromUrl(url: string): string {
  const { label } = detectSocialLinkType(url)
  if (label === "Website") {
    try {
      const normalized = url.toLowerCase().trim()
      const withProto = normalized.startsWith("http") ? normalized : "https://" + normalized
      const hostname = new URL(withProto).hostname.replace(/^www\./, "")
      return hostname || "Website"
    } catch {
      return "Website"
    }
  }
  return label
}

export function sanitizeSocialLinkData(data: {
  title: string
  url: string
  icon: string
}): { title: string; url: string; icon: string } | null {
  const title = sanitizeText(data.title)
  if (!title) return null

  const url = normalizeSocialUrl(data.url)
  const validation = validateSafeUrl(url)
  if (!validation.valid) return null

  const allowedIcons = [
    "youtube", "github", "instagram", "tiktok", "x", "twitter",
    "linkedin", "discord", "telegram", "twitch", "whatsapp",
    "website", "email", "portfolio", "reddit", "pinterest",
    "facebook", "spotify", "behance", "dribbble", "figma",
    "steam", "roblox", "other",
  ]
  const icon = allowedIcons.includes(data.icon) ? data.icon : "other"

  return { title, url, icon }
}
