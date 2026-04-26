'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import type { OpsVisit } from '@/types/ops'

type SortKey = 'date' | 'project' | 'visitType' | 'projectType' | 'delay'
type SortDir = 'asc' | 'desc'

const HEAD_CLASS =
  'cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider2 text-muted dark:text-muted-dark'

const CELL_CLASS = 'px-3 py-2 align-top text-sm text-ink dark:text-linen'

function dateLabel(iso: string | null, raw: string | null): string {
  if (iso) {
    return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
  return raw ?? '—'
}

function compareStrings(a: string | null, b: string | null): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return a.localeCompare(b)
}

export function MonthVisitTable({ visits }: { visits: OpsVisit[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = useMemo(() => {
    const arr = [...visits]
    arr.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'date': {
          const ak = a.deliveryDateIso ?? ''
          const bk = b.deliveryDateIso ?? ''
          cmp = ak.localeCompare(bk)
          break
        }
        case 'project':
          cmp = compareStrings(a.project, b.project)
          break
        case 'visitType':
          cmp = compareStrings(a.visitType, b.visitType)
          break
        case 'projectType':
          cmp = compareStrings(a.projectType, b.projectType)
          break
        case 'delay': {
          const av = a.delay?.onTime ? 0 : (a.delay?.minutes ?? Number.MAX_SAFE_INTEGER)
          const bv = b.delay?.onTime ? 0 : (b.delay?.minutes ?? Number.MAX_SAFE_INTEGER)
          cmp = av - bv
          break
        }
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [visits, sortKey, sortDir])

  function toggle(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'date' ? 'desc' : 'asc')
    }
  }

  function head(key: SortKey, label: string) {
    const active = key === sortKey
    return (
      <th className={HEAD_CLASS} onClick={() => toggle(key)} scope="col">
        <span className="inline-flex items-center gap-1">
          {label}
          {active &&
            (sortDir === 'asc' ? (
              <ArrowUp className="h-3 w-3" aria-hidden />
            ) : (
              <ArrowDown className="h-3 w-3" aria-hidden />
            ))}
        </span>
      </th>
    )
  }

  if (visits.length === 0) {
    return (
      <p className="px-3 py-6 text-sm text-muted dark:text-muted-dark">
        No visits recorded for this month.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="border-b border-line dark:border-line-dark">
            {head('date', 'Date')}
            {head('project', 'Project')}
            {head('visitType', 'Visit Type')}
            {head('projectType', 'Project Type')}
            {head('delay', 'Delay')}
            <th className={HEAD_CLASS}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((v, i) => (
            <tr
              key={`${v.tabTitle}-${i}-${v.project ?? ''}-${v.deliveryDateRaw ?? ''}`}
              className="border-t border-line/60 dark:border-line-dark/60"
            >
              <td className={`${CELL_CLASS} whitespace-nowrap font-mono tabular-nums`}>
                {dateLabel(v.deliveryDateIso, v.deliveryDateRaw)}
              </td>
              <td className={`${CELL_CLASS} font-medium`}>{v.project ?? '—'}</td>
              <td className={CELL_CLASS}>{v.visitType ?? '—'}</td>
              <td className={CELL_CLASS}>{v.projectType ?? '—'}</td>
              <td className={CELL_CLASS}>
                {v.delay ? (
                  <DelayChip onTime={v.delay.onTime} raw={v.delay.raw} />
                ) : (
                  '—'
                )}
              </td>
              <td className={`${CELL_CLASS} max-w-[24rem] text-muted dark:text-muted-dark`}>
                {v.notes ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DelayChip({ onTime, raw }: { onTime: boolean; raw: string }) {
  if (onTime) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
        On time
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[11px] font-medium text-ink dark:text-linen">
      {raw}
    </span>
  )
}
