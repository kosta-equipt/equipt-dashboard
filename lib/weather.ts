import 'server-only'
import { unstable_cache } from 'next/cache'
import { CACHE_TAG_ALL } from '@/lib/sheets/cache'

export type WeatherSnapshot = {
  temperatureC: number
  weatherCode: number
  label: string
  iconKey: WeatherIconKey
  fetchedAt: string
}

export type WeatherIconKey =
  | 'sun'
  | 'cloud-sun'
  | 'cloud'
  | 'cloud-fog'
  | 'cloud-rain'
  | 'cloud-snow'
  | 'cloud-lightning'

const DOHA_LAT = 25.2854
const DOHA_LON = 51.531

const URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${DOHA_LAT}&longitude=${DOHA_LON}` +
  `&current=temperature_2m,weather_code&timezone=Asia%2FQatar`

function codeToPresentation(code: number): { label: string; iconKey: WeatherIconKey } {
  if (code === 0) return { label: 'Clear', iconKey: 'sun' }
  if (code === 1) return { label: 'Mostly clear', iconKey: 'cloud-sun' }
  if (code === 2) return { label: 'Partly cloudy', iconKey: 'cloud-sun' }
  if (code === 3) return { label: 'Overcast', iconKey: 'cloud' }
  if (code === 45 || code === 48) return { label: 'Fog', iconKey: 'cloud-fog' }
  if (code >= 51 && code <= 57) return { label: 'Drizzle', iconKey: 'cloud-rain' }
  if (code >= 61 && code <= 67) return { label: 'Rain', iconKey: 'cloud-rain' }
  if (code >= 71 && code <= 77) return { label: 'Snow', iconKey: 'cloud-snow' }
  if (code >= 80 && code <= 82) return { label: 'Showers', iconKey: 'cloud-rain' }
  if (code >= 85 && code <= 86) return { label: 'Snow showers', iconKey: 'cloud-snow' }
  if (code >= 95) return { label: 'Thunderstorm', iconKey: 'cloud-lightning' }
  return { label: 'Clear', iconKey: 'sun' }
}

async function fetchDoha(): Promise<WeatherSnapshot | null> {
  try {
    const res = await fetch(URL, { next: { revalidate: 600 } })
    if (!res.ok) return null
    const json = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number }
    }
    const temp = json.current?.temperature_2m
    const code = json.current?.weather_code ?? 0
    if (typeof temp !== 'number') return null
    const { label, iconKey } = codeToPresentation(code)
    return {
      temperatureC: Math.round(temp),
      weatherCode: code,
      label,
      iconKey,
      fetchedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export const getDohaWeather = unstable_cache(fetchDoha, ['weather-doha'], {
  revalidate: 600,
  tags: [CACHE_TAG_ALL],
})
