import type { ReactNode } from 'react'
import { formatNumber, formatPercent } from '@/lib/format'

type KpiCardProps = {
  label: string
  value: number | null
  format?: 'number' | 'percent'
  icon?: ReactNode
  hint?: string
}

export function KpiCard({
  label,
  value,
  format = 'number',
  icon,
  hint,
}: KpiCardProps) {
  const display =
    format === 'percent' ? formatPercent(value) : formatNumber(value)

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-card dark:border-line-dark dark:bg-linen-dark">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider2 text-muted dark:text-muted-dark">
          {label}
        </p>
        {icon && <div className="text-gold">{icon}</div>}
      </div>
      <p className="mt-6 font-display text-3xl font-semibold tracking-tightest text-midnight dark:text-linen">
        {display}
      </p>
      {hint && <p className="mt-1 text-xs text-muted dark:text-muted-dark">{hint}</p>}
    </div>
  )
}
