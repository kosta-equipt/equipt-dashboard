import 'server-only'
import { cachedRange } from './cache'
import { isSheetsConfigured } from './client'
import {
  dayLabel,
  isTodayOrFuture,
  monthKey,
  monthLabel,
  parseSheetDate,
} from '@/lib/dates'
import type {
  CommandCentreKpis,
  HistoryPost,
  PerformancePoint,
  PlannerRow,
} from '@/types/sheets'

const TAB_COMMAND_CENTRE =
  process.env.SHEET_TAB_COMMAND_CENTRE ?? 'Dashboard'
const TAB_PERFORMANCE = process.env.SHEET_TAB_PERFORMANCE ?? 'Performance'
const TAB_CONTENT_CALENDAR =
  process.env.SHEET_TAB_CONTENT_CALENDAR ?? 'Content Calendar'

function q(tab: string): string {
  return `'${tab.replace(/'/g, "''")}'`
}

function normaliseCell(raw: unknown): string {
  if (raw === null || raw === undefined) return ''
  return String(raw).trim()
}

function toNumber(raw: string): number | null {
  const cleaned = raw.replace(/[,%$\s]/g, '')
  if (!cleaned) return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

function findHeaderRowIndex(
  rows: string[][],
  requiredLabels: string[] = [],
): number {
  const required = requiredLabels.map((l) => l.toLowerCase())
  if (required.length) {
    for (let i = 0; i < rows.length; i++) {
      const lc = rows[i].map((c) => normaliseCell(c).toLowerCase())
      if (required.every((r) => lc.includes(r))) return i
    }
  }
  for (let i = 0; i < rows.length; i++) {
    const filled = rows[i].filter((c) => normaliseCell(c)).length
    if (filled >= 2) return i
  }
  return 0
}

function parseTable(
  rows: string[][],
  requiredLabels: string[] = [],
): Record<string, string>[] {
  if (!rows.length) return []
  const headerIdx = findHeaderRowIndex(rows, requiredLabels)
  const headers = rows[headerIdx].map((h) => normaliseCell(h))
  const out: Record<string, string>[] = []
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i] ?? []
    const hasContent = row.some((c) => normaliseCell(c))
    if (!hasContent) continue
    const obj: Record<string, string> = {}
    headers.forEach((h, idx) => {
      if (!h) return
      obj[h] = normaliseCell(row[idx])
    })
    out.push(obj)
  }
  return out
}

function looksNumeric(s: string): boolean {
  return /^-?[\d,.\s%]+$/.test(s.trim())
}

function findLabelValue(rows: string[][], labels: string[]): string | null {
  const wanted = labels.map((l) => l.toLowerCase().trim())
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] ?? []
    for (let c = 0; c < row.length; c++) {
      const cell = normaliseCell(row[c]).toLowerCase()
      if (!cell || !wanted.includes(cell)) continue

      for (let rr = r + 1; rr < Math.min(rows.length, r + 4); rr++) {
        const v = normaliseCell(rows[rr]?.[c])
        if (v && looksNumeric(v)) return v
      }
      for (let cc = c + 1; cc < row.length; cc++) {
        const v = normaliseCell(row[cc])
        if (!v) continue
        if (looksNumeric(v)) return v
        break
      }
    }
  }
  return null
}

export async function getCommandCentre(): Promise<{
  data: CommandCentreKpis
  fetchedAt: string
  configured: boolean
}> {
  if (!isSheetsConfigured()) {
    return { data: emptyKpis(), fetchedAt: new Date().toISOString(), configured: false }
  }

  const { rows, fetchedAt } = await cachedRange(
    ['command-centre'],
    `${q(TAB_COMMAND_CENTRE)}!A1:Z60`,
  )

  const data: CommandCentreKpis = {
    totalPosts: toNumber(findLabelValue(rows, ['Total Posts']) ?? ''),
    totalReach: toNumber(findLabelValue(rows, ['Total Reach']) ?? ''),
    totalLikes: toNumber(findLabelValue(rows, ['Total Likes']) ?? ''),
    avgEngagement: toNumber(
      findLabelValue(rows, ['Avg Engagement', 'Average Engagement']) ?? '',
    ),
    totalShares: toNumber(findLabelValue(rows, ['Total Shares']) ?? ''),
    totalSaves: toNumber(findLabelValue(rows, ['Total Saves']) ?? ''),
  }

  return { data, fetchedAt, configured: true }
}

export async function getPerformance(): Promise<{
  data: PerformancePoint[]
  fetchedAt: string
  configured: boolean
}> {
  if (!isSheetsConfigured()) {
    return { data: [], fetchedAt: new Date().toISOString(), configured: false }
  }

  const { rows, fetchedAt } = await cachedRange(
    ['performance'],
    `${q(TAB_PERFORMANCE)}!A1:Z500`,
  )

  const parsed = parseTable(rows, ['Date', 'Reach'])

  const data: PerformancePoint[] = parsed
    .map((row) => {
      const date = row['Date'] ?? row['Day'] ?? row['Week'] ?? ''
      if (!date) return null
      const reach = toNumber(row['Reach'] ?? row['Total Reach'] ?? '')
      const engagement = toNumber(
        row['Engagement'] ??
          row['Avg Engagement'] ??
          row['Engagement Rate'] ??
          row['Total Engagement'] ??
          '',
      )
      const likes = toNumber(row['Likes'] ?? row['Total Likes'] ?? '')
      return {
        date,
        reach: reach ?? 0,
        engagement: engagement ?? 0,
        likes: likes ?? 0,
      }
    })
    .filter((p): p is PerformancePoint => p !== null)
    .reverse()

  return { data, fetchedAt, configured: true }
}

export async function getContentCalendar(): Promise<{
  data: PlannerRow[]
  fetchedAt: string
  configured: boolean
}> {
  if (!isSheetsConfigured()) {
    return { data: [], fetchedAt: new Date().toISOString(), configured: false }
  }

  const { rows, fetchedAt } = await cachedRange(
    ['content-calendar'],
    `${q(TAB_CONTENT_CALENDAR)}!A1:Z200`,
  )

  const parsed = parseTable(rows, ['Date', 'Post'])
  const today = new Date()

  const data: PlannerRow[] = parsed
    .map((row) => {
      const topic =
        row['Post'] ??
        row['Post Topic/Caption'] ??
        row['Topic'] ??
        row['Caption'] ??
        row['Idea/Topic'] ??
        ''
      const platform = row['Platforms'] ?? row['Platform'] ?? ''
      const rawDate = row['Date'] ?? ''
      const parsedDate = parseSheetDate(rawDate, today)

      return {
        parsedDate,
        row: {
          day: row['Day'] ?? (parsedDate ? dayLabel(parsedDate) : ''),
          date: rawDate,
          topic,
          platform,
        },
      }
    })
    .filter(
      (x): x is { parsedDate: Date; row: PlannerRow } =>
        x.parsedDate !== null && isTodayOrFuture(x.parsedDate, today),
    )
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
    .map((x) => x.row)

  return { data, fetchedAt, configured: true }
}

export async function getHistory(): Promise<{
  data: HistoryPost[]
  fetchedAt: string
  configured: boolean
}> {
  if (!isSheetsConfigured()) {
    return { data: [], fetchedAt: new Date().toISOString(), configured: false }
  }

  const { rows, fetchedAt } = await cachedRange(
    ['history'],
    `${q(TAB_PERFORMANCE)}!A1:Z500`,
  )

  const parsed = parseTable(rows, ['Date', 'Reach'])
  const today = new Date()

  const data: HistoryPost[] = parsed
    .map((row): HistoryPost | null => {
      const rawDate = row['Date'] ?? ''
      const parsedDate = parseSheetDate(rawDate, today, 'past')
      if (!parsedDate) return null
      return {
        date: rawDate,
        dateIso: parsedDate.toISOString(),
        monthKey: monthKey(parsedDate),
        monthLabel: monthLabel(parsedDate),
        platform: row['Platform'] ?? '',
        type: row['Type'] ?? '',
        topic: row['Post'] ?? row['Topic'] ?? row['Caption'] ?? '',
        reach: toNumber(row['Reach'] ?? '') ?? 0,
        engagement: toNumber(row['Engagement'] ?? '') ?? 0,
        likes: toNumber(row['Likes'] ?? '') ?? 0,
        link: row['Link'] ?? row['URL'] ?? '',
      }
    })
    .filter((p): p is HistoryPost => p !== null)
    .sort((a, b) => b.dateIso.localeCompare(a.dateIso))

  return { data, fetchedAt, configured: true }
}

function emptyKpis(): CommandCentreKpis {
  return {
    totalPosts: null,
    totalReach: null,
    totalLikes: null,
    avgEngagement: null,
    totalShares: null,
    totalSaves: null,
  }
}
