import Link from 'next/link'
import { NavTabs } from './NavTabs'
import { RefreshButton } from './RefreshButton'

type HeaderProps = {
  fetchedAt: string | null
  configured: boolean
}

export function Header({ fetchedAt, configured }: HeaderProps) {
  return (
    <header className="border-b border-line bg-bone/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-xl font-semibold tracking-wider2 text-midnight">
            EQUIPT
          </span>
          <span className="text-xs uppercase tracking-wider2 text-muted">
            Dashboard
          </span>
        </Link>
        <NavTabs />
        <RefreshButton fetchedAt={fetchedAt} disabled={!configured} />
      </div>
    </header>
  )
}
