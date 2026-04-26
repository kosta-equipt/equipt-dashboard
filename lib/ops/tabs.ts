import type { MonthlyTabMeta } from '@/types/ops'

const MONTH_NAMES = [
  ['jan', 'january'],
  ['feb', 'february'],
  ['mar', 'march'],
  ['apr', 'april'],
  ['may', 'may'],
  ['jun', 'june'],
  ['jul', 'july'],
  ['aug', 'august'],
  ['sep', 'september', 'sept'],
  ['oct', 'october'],
  ['nov', 'november'],
  ['dec', 'december'],
]

function monthIndexFromName(name: string): number | null {
  const lower = name.trim().toLowerCase()
  for (let i = 0; i < MONTH_NAMES.length; i++) {
    if (MONTH_NAMES[i].some((alias) => alias === lower)) return i
  }
  return null
}

function monthLabel(year: number, monthIndex: number): string {
  return new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function monthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`
}

export type TabClassification =
  | { kind: 'monthly'; meta: MonthlyTabMeta }
  | { kind: 'aggregate'; year: number; title: string }
  | { kind: 'shipments'; title: string }
  | { kind: 'unknown'; title: string }

export function classifyTab(title: string): TabClassification {
  const trimmed = title.trim()
  if (!trimmed) return { kind: 'unknown', title }

  if (/^shipments$/i.test(trimmed)) {
    return { kind: 'shipments', title: trimmed }
  }

  // "2026 Projects" / "2025 Projects"
  const aggregate = trimmed.match(/^(\d{4})\s+projects$/i)
  if (aggregate) {
    return { kind: 'aggregate', year: Number(aggregate[1]), title: trimmed }
  }

  // "April 2026", "Apr 2026", "April 26", "Apr 26"
  const monthly = trimmed.match(/^([A-Za-z]+)\s+(\d{2}|\d{4})$/)
  if (monthly) {
    const monthIndex = monthIndexFromName(monthly[1])
    if (monthIndex !== null) {
      const yearRaw = Number(monthly[2])
      const year = monthly[2].length === 2 ? 2000 + yearRaw : yearRaw
      return {
        kind: 'monthly',
        meta: {
          title: trimmed,
          year,
          monthIndex,
          monthKey: monthKey(year, monthIndex),
          monthLabel: monthLabel(year, monthIndex),
        },
      }
    }
  }

  return { kind: 'unknown', title: trimmed }
}

export function discoverMonthlyTabs(titles: string[]): MonthlyTabMeta[] {
  const monthly: MonthlyTabMeta[] = []
  const seen = new Set<string>()
  for (const title of titles) {
    const c = classifyTab(title)
    if (c.kind !== 'monthly') continue
    if (seen.has(c.meta.monthKey)) continue
    seen.add(c.meta.monthKey)
    monthly.push(c.meta)
  }
  // newest first
  monthly.sort((a, b) => (a.monthKey < b.monthKey ? 1 : -1))
  return monthly
}
