export interface LocationResult {
  label: string
  city: string
  region: string
  country: string
  lat: number
  lng: number
}

export function detectBrowserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
    })
  })
}

export async function getLocationFromCoordinates(
  lat: number,
  lng: number
): Promise<LocationResult> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`

  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  })

  if (!res.ok) throw new Error('Failed to reverse-geocode location.')

  const data = await res.json()
  const addr = data.address || {}

  const city = addr.city || addr.town || addr.village || addr.municipality || ''
  const region = addr.state || ''
  const country = addr.country || ''

  let label = city ? `${city}, ${country}` : country

  return { label, city, region, country, lat, lng }
}
