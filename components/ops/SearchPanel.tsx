'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Check, Copy, Search, X } from 'lucide-react'
import type { OpsVisit, VisitType } from '@/types/ops'
import { VISIT_TYPE_COLOUR } from '@/lib/ops/palette'
import { computeKpis } from '@/lib/ops/metrics'

type Props = {
  visits: OpsVisit[]
  onActiveChange?: (active: boolean) => void
}

const VISIT_ORDER: readonly VisitType[] = [
  'Installation',
  'Maintenance',
  'Inspection',
  'Delivery',
  'AMC',
  'Side Task',
  'WH',
]

const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatVisitDate(visit: OpsVisit): string {
  if (visit.deliveryDateIso) {
    return DATE_FMT.format(new Date(visit.deliveryDateIso + 'T00:00:00Z'))
  }
  return visit.deliveryDateRaw ?? visit.monthLabel
}

function matches(visit: OpsVisit, query: string): boolean {
  const haystack = [
    visit.project,
    visit.notes,
    visit.projectType,
    visit.visitType,
  ]
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .map((s) => s.toLowerCase())
    .join(' | ')
  return haystack.includes(query)
}

export function SearchPanel({ visits, onActiveChange }: Props) {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const deferred = useDeferredValue(query.trim().toLowerCase())

  const active = deferred.length > 0

  useEffect(() => {
    onActiveChange?.(active)
  }, [active, onActiveChange])

  const results = useMemo(() => {
    if (!active) return [] as OpsVisit[]
    return visits.filter((v) => matches(v, deferred))
  }, [visits, deferred, active])

  const kpis = useMemo(() => computeKpis(results), [results])
  const visitTypeCounts = useMemo(() => {
    const counts = new Map<VisitType, number>()
    for (const v of results) {
      if (!v.visitType) continue
      counts.set(v.visitType, (counts.get(v.visitType) ?? 0) + 1)
    }
    return counts
  }, [results])

  const span = useMemo(() => {
    let earliest: string | null = null
    let latest: string | null = null
    for (const v of results) {
      if (!v.deliveryDateIso) continue
      if (!earliest || v.deliveryDateIso < earliest) earliest = v.deliveryDateIso
      if (!latest || v.deliveryDateIso > latest) latest = v.deliveryDateIso
    }
    if (!earliest || !latest) return null
    return {
      from: DATE_FMT.format(new Date(earliest + 'T00:00:00Z')),
      to: DATE_FMT.format(new Date(latest + 'T00:00:00Z')),
    }
  }, [results])

  function copyResults() {
    const lines: string[] = []
    lines.push(`Equipt Ops Dashboard — search "${query.trim()}"`)
    lines.push(`${results.length} matching visits`)
    if (span) lines.push(`${span.from} → ${span.to}`)
    if (kpis.onTimeRate !== null) {
      lines.push(`On-time rate: ${(kpis.onTimeRate * 100).toFixed(0)}%`)
    }
    lines.push('')
    for (const v of results) {
      const date = formatVisitDate(v)
      const visitType = v.visitType ?? '—'
      const project = v.project ?? '—'
      const projectType = v.projectType ? ` · ${v.projectType}` : ''
      const delay = v.delay
        ? v.delay.onTime
          ? ' · on time'
          : ` · ${v.delay.raw}`
        : ''
      const notes = v.notes ? ` — ${v.notes}` : ''
      lines.push(`${date} · ${project} · ${visitType}${projectType}${delay}${notes}`)
    }
    const text = lines.join('\n')
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      })
    }
  }

  return (
    <section className="space-y-3">
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-4 h-4 w-4 text-muted dark:text-muted-dark"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a project, gym, or keyword…"
          className="w-full rounded-2xl border border-line bg-white py-3 pl-11 pr-11 text-sm text-ink shadow-card placeholder:text-muted/80 focus:border-midnight/30 focus:outline-none focus:ring-2 focus:ring-midnight/15 dark:border-line-dark dark:bg-linen-dark dark:text-linen dark:placeholder:text-muted-dark/80"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-line/60 dark:text-muted-dark dark:hover:bg-line-dark/60"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </div>

      {active && (
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card dark:border-line-dark dark:bg-linen-dark">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-tightest text-midnight dark:text-linen">
              Found {results.length}{' '}
              {results.length === 1 ? 'visit' : 'visits'} matching{' '}
              <span className="text-gold">"{query.trim()}"</span>
            </h2>
            <button
              type="button"
              onClick={copyResults}
              disabled={results.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-midnight/10 bg-white px-3 py-1.5 text-xs font-medium text-midnight shadow-card transition hover:border-midnight/30 disabled:cursor-not-allowed disabled:opacity-40 dark:border-line-dark dark:bg-linen-dark dark:text-linen"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  Copy to clipboard
                </>
              )}
            </button>
          </div>

          {results.length > 0 && (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted dark:text-muted-dark">
                {VISIT_ORDER.map((t) => {
                  const c = visitTypeCounts.get(t) ?? 0
                  if (c === 0) return null
                  return (
                    <span key={t} className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: VISIT_TYPE_COLOUR[t] }}
                        aria-hidden
                      />
                      <span>
                        <span className="font-mono tabular-nums text-ink dark:text-linen">
                          {c}
                        </span>{' '}
                        {t}
                      </span>
                    </span>
                  )
                })}
                {span && (
                  <span>
                    <span className="text-ink dark:text-linen">{span.from}</span> →{' '}
                    <span className="text-ink dark:text-linen">{span.to}</span>
                  </span>
                )}
                {kpis.onTimeRate !== null && (
                  <span>
                    On-time:{' '}
                    <span className="font-mono tabular-nums text-ink dark:text-linen">
                      {(kpis.onTimeRate * 100).toFixed(0)}%
                    </span>
                  </span>
                )}
              </div>

              <ol className="mt-4 max-h-[480px] divide-y divide-line/60 overflow-y-auto rounded-xl border border-line/70 dark:divide-line-dark/60 dark:border-line-dark/70">
                {results.map((v, i) => (
                  <li
                    key={`${v.tabTitle}-${i}-${v.project ?? ''}-${v.deliveryDateRaw ?? ''}`}
                    className="grid grid-cols-[7rem,1fr,auto] items-baseline gap-3 px-4 py-2.5"
                  >
                    <span className="font-mono text-xs tabular-nums text-muted dark:text-muted-dark">
                      {formatVisitDate(v)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink dark:text-linen">
                        {v.project ?? '—'}
                      </p>
                      {v.notes && (
                        <p className="truncate text-xs text-muted dark:text-muted-dark">
                          {v.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {v.visitType && (
                        <span
                          className="rounded-full px-2 py-0.5 text-white"
                          style={{ backgroundColor: VISIT_TYPE_COLOUR[v.visitType] }}
                        >
                          {v.visitType}
                        </span>
                      )}
                      {v.projectType && (
                        <span className="text-muted dark:text-muted-dark">
                          {v.projectType}
                        </span>
                      )}
                      {v.delay && (
                        <span
                          className={
                            v.delay.onTime
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-gold'
                          }
                        >
                          {v.delay.onTime ? 'on time' : v.delay.raw}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}

          {results.length === 0 && (
            <p className="mt-3 text-sm text-muted dark:text-muted-dark">
              No matches yet. Try a project name, a visit type like
              <span className="font-mono"> AMC </span>, or a project type.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
