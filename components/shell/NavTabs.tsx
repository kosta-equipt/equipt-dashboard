'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Tab = {
  href: string
  label: string
  /** Tailwind classes applied only when this tab is active. */
  activeClass: string
}

const tabs: Tab[] = [
  {
    href: '/',
    label: 'Analytics',
    activeClass: 'bg-midnight text-bone dark:bg-linen dark:text-ink',
  },
  {
    href: '/planner',
    label: 'Planner',
    activeClass: 'bg-midnight-soft text-bone dark:bg-midnight-soft dark:text-bone',
  },
  {
    href: '/ops',
    label: 'Ops',
    activeClass: 'bg-gold text-midnight dark:bg-gold dark:text-midnight',
  },
]

export function NavTabs() {
  const pathname = usePathname()
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {tabs.map((tab) => {
        const active =
          tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        const idle =
          'text-ink hover:bg-line/60 dark:text-linen dark:hover:bg-line-dark/60'
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active ? tab.activeClass : idle
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
