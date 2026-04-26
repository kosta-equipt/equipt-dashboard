'use client'

import { useMemo, useState } from 'react'
import {
  ChartPie,
  ChartDonut,
  ChartBar,
  ChartLine,
  type BarDatum,
  type LineDatum,
} from './Charts'
import type { OpsVisit, ProjectType, VisitType, Window } from '@/types/ops'
import { applyWindow } from '@/lib/ops/metrics'
import { VISIT_TYPE_COLOUR, PROJECT_TYPE_COLOUR } from '@/lib/ops/palette'

type ChartType = 'pie' | 'donut' | 'bar' | 'line'

const CHART_TABS: { value: ChartType; label: string }[] = [
  { value: 'pie', label: 'Pie' },
  { value: 'donut', label: 'Donut' },
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
]

const WINDOWS: { value: Window; label: string }[] = [
  { value: 'thisMonth', label: 'This month' },
  { value: 'last3', label: 'Last 3 months' },
  { value: 'thisYear', label: 'This year' },
  { value: 'allTime', label: 'All time' },
]

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

const MONTH_FMT = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC',
})

function lastTwelveMonthKeys(anchor: Date = new Date()): string[] {
  const out: string[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - i, 1))
    const yr = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    out.push(`${yr}-${m}`)
  }
  return out
}

function monthLabelShort(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number)
  return MONTH_FMT.format(new Date(Date.UTC(y, m - 1, 1)))
}

export function Visualise({ visits }: { visits: OpsVisit[] }) {
  const [chart, setChart] = useState<ChartType>('pie')
  const [windowSel, setWindowSel] = useState<Window>('thisMonth')

  const windowed = useMemo(() => applyWindow(visits, windowSel), [visits, windowSel])

  const visitTypeData = useMemo(() => {
    const counts = new Map<VisitType, number>()
    for (const v of windowed) {
      if (!v.visitType) continue
      counts.set(v.visitType, (counts.get(v.visitType) ?? 0) + 1)
    }
    return VISIT_ORDER.map((k) => ({
      key: k,
      value: counts.get(k) ?? 0,
      colour: VISIT_TYPE_COLOUR[k],
    }))
  }, [windowed])

  const projectTypeData = useMemo(() => {
    const counts = new Map<ProjectType, number>()
    for (const v of windowed) {
      if (!v.projectType) continue
      counts.set(v.projectType, (counts.get(v.projectType) ?? 0) + 1)
    }
    return PROJECT_ORDER.map((k) => ({
      key: k,
      value: counts.get(k) ?? 0,
      colour: PROJECT_TYPE_COLOUR[k],
    }))
  }, [windowed])

  const barData: BarDatum[] = useMemo(() => {
    const keys = lastTwelveMonthKeys()
    const counts = new Map<string, number>(keys.map((k) => [k, 0]))
    for (const v of visits) {
      if (counts.has(v.monthKey)) {
        counts.set(v.monthKey, (counts.get(v.monthKey) ?? 0) + 1)
      }
    }
    return keys.map((k) => ({ label: monthLabelShort(k), value: counts.get(k) ?? 0 }))
  }, [visits])

  const lineData: { data: LineDatum[]; series: string[] } = useMemo(() => {
    const set = new Set<string>()
    for (const v of windowed) if (v.visitType) set.add(v.visitType)
    const series = Array.from(set)
    if (series.length === 0) return { data: [], series: [] }

    const byMonth = new Map<string, Record<string, number>>()
    for (const v of windowed) {
      if (!v.visitType) continue
      const bucket = byMonth.get(v.monthKey) ?? Object.fromEntries(series.map((s) => [s, 0]))
      bucket[v.visitType] = (bucket[v.visitType] ?? 0) + 1
      byMonth.set(v.monthKey, bucket)
    }
    const sortedKeys = Array.from(byMonth.keys()).sort()
    const data: LineDatum[] = sortedKeys.map((k) => ({
      date: monthLabelShort(k),
      ...byMonth.get(k)!,
    }))
    return { data, series }
  }, [windowed])

  const windowDisabled = chart === 'bar'

  return (
    <section className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-midnight dark:text-linen">
          Visualise
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <SegControl
            value={chart}
            onChange={setChart}
            options={CHART_TABS}
          />
          <select
            value={windowSel}
            onChange={(e) => setWindowSel(e.target.value as Window)}
            disabled={windowDisabled}
            className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink shadow-card disabled:cursor-not-allowed disabled:opacity-50 dark:border-line-dark dark:bg-linen-dark dark:text-linen"
          >
            {WINDOWS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {chart === 'pie' && (
        <ChartPie title="Visit-type share" data={visitTypeData} />
      )}
      {chart === 'donut' && (
        <ChartDonut title="Project-type share" data={projectTypeData} />
      )}
      {chart === 'bar' && (
        <ChartBar title="Visits per month — last 12" data={barData} />
      )}
      {chart === 'line' && (
        <ChartLine
          title="Visits over time — by visit type"
          data={lineData.data}
          series={lineData.series}
        />
      )}
    </section>
  )
}

function SegControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: readonly { value: T; label: string }[]
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-line bg-white p-0.5 text-xs shadow-card dark:border-line-dark dark:bg-linen-dark">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1 transition-colors ${
              active
                ? 'bg-midnight text-bone dark:bg-linen dark:text-ink'
                : 'text-muted hover:text-ink dark:text-muted-dark dark:hover:text-linen'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
