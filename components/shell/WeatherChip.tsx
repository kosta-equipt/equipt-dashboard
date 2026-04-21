import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from 'lucide-react'
import type { WeatherIconKey, WeatherSnapshot } from '@/lib/weather'

const ICONS: Record<WeatherIconKey, typeof Sun> = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  'cloud-fog': CloudFog,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'cloud-lightning': CloudLightning,
}

type WeatherChipProps = {
  snapshot: WeatherSnapshot | null
}

export function WeatherChip({ snapshot }: WeatherChipProps) {
  if (!snapshot) return null
  const Icon = ICONS[snapshot.iconKey]
  return (
    <div
      className="hidden items-center gap-1.5 rounded-full border border-line/80 bg-white/60 px-2.5 py-1 text-xs text-ink shadow-sm backdrop-blur md:inline-flex dark:border-line-dark/80 dark:bg-linen-dark/60 dark:text-linen"
      title={`${snapshot.label} · Doha`}
    >
      <Icon className="h-3.5 w-3.5 text-gold" aria-hidden />
      <span className="font-mono tabular-nums">{snapshot.temperatureC}°</span>
      <span className="text-muted dark:text-muted-dark">Doha</span>
    </div>
  )
}
