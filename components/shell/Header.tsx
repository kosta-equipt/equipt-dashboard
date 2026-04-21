import Link from 'next/link'
import { NavTabs } from './NavTabs'
import { RefreshButton } from './RefreshButton'
import { ThemeToggle } from './ThemeToggle'
import { WeatherChip } from './WeatherChip'
import { LiveClock } from './LiveClock'
import { getDohaWeather } from '@/lib/weather'

type HeaderProps = {
  fetchedAt: string | null
  configured: boolean
}

export async function Header({ fetchedAt, configured }: HeaderProps) {
  const weather = await getDohaWeather()

  return (
    <header className="border-b border-line bg-bone/80 backdrop-blur dark:border-line-dark dark:bg-bone-dark/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-xl font-semibold tracking-wider2 text-midnight dark:text-linen">
            EQUIPT
          </span>
          <span className="text-xs uppercase tracking-wider2 text-muted dark:text-muted-dark">
            Dashboard
          </span>
        </Link>
        <NavTabs />
        <div className="flex items-center gap-2">
          <WeatherChip snapshot={weather} />
          <LiveClock />
          <RefreshButton fetchedAt={fetchedAt} disabled={!configured} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
