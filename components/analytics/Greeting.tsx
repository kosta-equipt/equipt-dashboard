import type { WeatherSnapshot } from '@/lib/weather'

type GreetingProps = {
  name: string
  weather: WeatherSnapshot | null
}

function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 22) return 'Good evening'
  return 'Still up'
}

function dohaHour(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'Asia/Qatar',
  }).formatToParts(new Date())
  const h = parts.find((p) => p.type === 'hour')?.value ?? '0'
  return Number(h)
}

function dohaDateLabel(): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Qatar',
  }).format(new Date())
}

export function Greeting({ name, weather }: GreetingProps) {
  const hour = dohaHour()
  const hello = greetingForHour(hour)
  const dateLabel = dohaDateLabel()

  const weatherLine = weather
    ? `${weather.temperatureC}° · ${weather.label.toLowerCase()} in Doha`
    : 'Welcome back.'

  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-display text-3xl font-semibold tracking-tightest text-midnight md:text-4xl dark:text-linen">
        {hello}, {name}.
      </h1>
      <p className="text-sm text-muted dark:text-muted-dark">
        {dateLabel} · {weatherLine}
      </p>
    </div>
  )
}
