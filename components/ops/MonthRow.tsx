'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { MonthVisitTable } from './MonthVisitTable'
import { MixDots } from './MixDots'
import type { MonthlySummary, ProjectType, VisitType } from '@/types/ops'
import { VISIT_TYPE_COLOUR, PROJECT_TYPE_COLOUR } from '@/lib/ops/palette'

const VISIT_ORDER: readonly VisitType[] = [
  'Installation',
  'Maintenance',
  'Inspection',
  'Delivery',
  'AMC',
  'Side Task',
  'WH',
]

const PROJECT_ORDER: readonly ProjectType[] = [
  'Commercial Gym',
  'Home Gym',
  'Residential Gym',
  'Studio Gym',
  'Corporate Gym',
  'Rehabilitation Studio',
  'Internal Task',
]

export function MonthRow({
  summary,
  defaultOpen = false,
}: {
  summary: MonthlySummary
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const { meta, visits, visitTypeCounts, projectTypeCounts, total } = summary

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card dark:border-line-dark dark:bg-linen-dark">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-bone/40 dark:hover:bg-bone-dark/40"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted transition-transform dark:text-muted-dark ${
              open ? 'rotate-0' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span className="font-display text-base font-semibold text-midnight dark:text-linen">
            {meta.monthLabel}
          </span>
          <span className="hidden text-xs text-muted dark:text-muted-dark sm:inline">
            {meta.title}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <MixDots counts={visitTypeCounts} total={total} />
          <span className="font-mono text-sm tabular-nums text-ink dark:text-linen">
            {total}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-line/70 px-5 py-4 dark:border-line-dark/70">
          <CategoryStrip
            label="Visit type"
            counts={visitTypeCounts as Record<string, number>}
            order={VISIT_ORDER as readonly string[]}
            colours={VISIT_TYPE_COLOUR as Record<string, string>}
            total={total}
          />
          <CategoryStrip
            label="Project type"
            counts={projectTypeCounts as Record<string, number>}
            order={PROJECT_ORDER as readonly string[]}
            colours={PROJECT_TYPE_COLOUR as Record<string, string>}
            total={total}
          />
          <div className="mt-4 -mx-5 border-t border-line/70 dark:border-line-dark/70">
            <MonthVisitTable visits={visits} />
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryStrip({
  label,
  counts,
  order,
  colours,
  total,
}: {
  label: string
  counts: Record<string, number>
  order: readonly string[]
  colours: Record<string, string>
  total: number
}) {
  const entries = order
    .map((k) => ({ key: k, count: counts[k] ?? 0 }))
    .filter((e) => e.count > 0)

  if (entries.length === 0) {
    return (
      <div className="mb-3">
        <p className="text-[11px] font-medium uppercase tracking-wider2 text-muted dark:text-muted-dark">
          {label}
        </p>
        <p className="mt-1 text-sm text-muted dark:text-muted-dark">—</p>
      </div>
    )
  }

  return (
    <div className="mb-3">
      <p className="text-[11px] font-medium uppercase tracking-wider2 text-muted dark:text-muted-dark">
        {label}
      </p>
      <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 md:grid-cols-3 lg:grid-cols-4">
        {entries.map(({ key, count }) => {
          const pct = total === 0 ? 0 : count / total
          return (
            <li key={key} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colours[key] }}
                aria-hidden
              />
              <span className="flex-1 truncate text-sm text-ink dark:text-linen">
                {key}
              </span>
              <span className="font-mono text-xs tabular-nums text-muted dark:text-muted-dark">
                {count}
              </span>
              <div className="hidden h-1 w-12 overflow-hidden rounded-full bg-line dark:bg-line-dark md:block">
                <div
                  className="h-full"
                  style={{ width: `${Math.round(pct * 100)}%`, backgroundColor: colours[key] }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
