const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024

export async function uploadAvatarToCloudinary(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only PNG, JPEG and WebP are allowed.')
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large. Maximum size is 2MB.')
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'study-overlay/avatars')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error?.message || 'Upload failed.')
  }

  const data = await res.json()
  return data.secure_url as string
}
