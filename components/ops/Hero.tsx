import type { WeatherSnapshot } from '@/lib/weather'

const DOHA_TZ = 'Asia/Qatar'

const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: DOHA_TZ,
})

const HOUR_FMT = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  hour12: false,
  timeZone: DOHA_TZ,
})

function greetingForHour(hour: number): string {
  if (hour < 5) return 'Working late, Boss'
  if (hour < 12) return 'Good morning, Boss'
  if (hour < 17) return 'Good afternoon, Boss'
  if (hour < 21) return 'Good evening, Boss'
  return 'Working late, Boss'
}

export function Hero({ weather }: { weather: WeatherSnapshot | null }) {
  const now = new Date()
  const hour = Number(HOUR_FMT.format(now))
  const greeting = greetingForHour(hour)
  const dateLabel = DATE_FMT.format(now)
  const subtitle = weather
    ? `${dateLabel} · ${weather.temperatureC}° in Doha · ${weather.label}`
    : dateLabel

  return (
    <section className="space-y-2">
      <h1 className="font-display text-4xl font-semibold tracking-tightest text-midnight dark:text-linen md:text-5xl">
        {greeting}.
      </h1>
      <p className="text-sm text-muted dark:text-muted-dark">{subtitle}</p>
    </section>
  )
}
