'use client'

import { ExternalLink } from 'lucide-react'
import { usePathname } from 'next/navigation'

type Props = {
  marketingUrl: string
  opsUrl: string
}

export function SheetLink({ marketingUrl, opsUrl }: Props) {
  const pathname = usePathname()
  const isOps = pathname.startsWith('/ops')
  const href = isOps ? opsUrl : marketingUrl
  const label = isOps ? 'Ops sheet' : 'Marketing sheet'

  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open the ${label} in Google Sheets`}
      className="hidden items-center gap-1.5 rounded-full border border-midnight/10 bg-white px-3 py-1.5 text-xs font-medium text-midnight shadow-card transition hover:border-midnight/30 sm:inline-flex dark:border-line-dark dark:bg-linen-dark dark:text-linen dark:hover:border-gold/50"
    >
      <ExternalLink className="h-3 w-3" aria-hidden />
      <span className="hidden lg:inline">{label}</span>
      <span className="lg:hidden">Sheet</span>
    </a>
  )
}
