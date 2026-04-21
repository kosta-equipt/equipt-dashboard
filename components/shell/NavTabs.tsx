'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Analytics' },
  { href: '/planner', label: 'Planner' },
]

export function NavTabs() {
  const pathname = usePathname()
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {tabs.map((tab) => {
        const active =
          tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              active
                ? 'bg-midnight text-bone'
                : 'text-ink hover:bg-line/60'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
