import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { formatNumber, formatPercent } from '@/lib/format'

type KpiCardProps = {
  label: string
  value: number | null
  format?: 'number' | 'percent'
  icon?: ReactNode
  hint?: string
  deltaValue?: number
  deltaUnit?: 'abs' | 'pct'
  deltaLabel?: string
}

export function KpiCard({
  label,
  value,
  format = 'number',
  icon,
  hint,
  deltaValue,
  deltaUnit = 'abs',
  deltaLabel,
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
      <Delta value={deltaValue} unit={deltaUnit} label={deltaLabel} hint={hint} />
    </div>
  )
}

function Delta({
  value,
  unit,
  label,
  hint,
}: {
  value?: number
  unit: 'abs' | 'pct'
  label?: string
  hint?: string
}) {
  if (value === undefined || value === null) {
    return hint ? (
      <p className="mt-1 text-xs text-muted dark:text-muted-dark">{hint}</p>
    ) : null
  }

  const direction = value > 0 ? 'up' : value < 0 ? 'down' : 'flat'
  const Icon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus
  const colourClass =
    direction === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : direction === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted dark:text-muted-dark'
  const prefix = value > 0 ? '+' : value < 0 ? '' : ''
  const formatted =
    unit === 'pct'
      ? `${prefix}${Math.round(value)}%`
      : `${prefix}${formatNumber(value)}`

  return (
    <p className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${colourClass}`}>
      <Icon className="h-3 w-3" aria-hidden />
      <span className="font-mono tabular-nums">{formatted}</span>
      {label && (
        <span className="font-normal text-muted dark:text-muted-dark">
          {label}
        </span>
      )}
    </p>
  )
}
