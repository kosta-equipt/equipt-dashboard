import 'server-only'
import { cachedRange } from './cache'
import { isSheetsConfigured } from './client'
import type {
  CommandCentreKpis,
  PerformancePoint,
  PlannerRow,
} from '@/types/sheets'

const TAB_COMMAND_CENTRE =
  process.env.SHEET_TAB_COMMAND_CENTRE ?? 'EQUIPT — Command Centre'
const TAB_PERFORMANCE = process.env.SHEET_TAB_PERFORMANCE ?? 'Performance'
const TAB_CONTENT_CALENDAR =
  process.env.SHEET_TAB_CONTENT_CALENDAR ?? 'Content Calendar'

function q(tab: string): string {
  // Sheets A1 notation requires quoted tab names when they contain spaces or em-dashes.
  return `'${tab.replace(/'/g, "''")}'`
}

function normaliseCell(raw: string | undefined): string {
  return (raw ?? '').toString().trim()
}

function toNumber(raw: string): number | null {
  const cleaned = raw.replace(/[,%$\s]/g, '')
  if (!cleaned) return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

function findHeaderRowIndex(rows: string[][]): number {
  for (let i = 0; i < rows.length; i++) {
    const filled = rows[i].filter((c) => normaliseCell(c)).length
    if (filled >= 2) return i
  }
  return 0
}

export function parseTable(rows: string[][]): Record<string, string>[] {
  if (!rows.length) return []
  const headerIdx = findHeaderRowIndex(rows)
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

function findLabelValue(rows: string[][], labels: string[]): string | null {
  const wanted = labels.map((l) => l.toLowerCase().trim())
  for (const row of rows) {
    for (let i = 0; i < row.length; i++) {
      const cell = normaliseCell(row[i]).toLowerCase()
      if (!cell) continue
      if (wanted.includes(cell)) {
        for (let j = i + 1; j < row.length; j++) {
          const val = normaliseCell(row[j])
          if (val) return val
        }
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

  const parsed = parseTable(rows)
  const data: PerformancePoint[] = parsed
    .map((row) => {
      const dateKey =
        Object.keys(row).find((k) => /^date$/i.test(k)) ??
        Object.keys(row).find((k) => /date|day|week|month/i.test(k))
      if (!dateKey) return null
      const date = row[dateKey]
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

  const parsed = parseTable(rows)
  const data: PlannerRow[] = parsed.map((row) => {
    const topic =
      row['Post Topic/Caption'] ??
      row['Topic'] ??
      row['Caption'] ??
      row['Post'] ??
      row['Idea/Topic'] ??
      ''
    const done = (row['Done'] ?? row['Status'] ?? '').toLowerCase()
    return {
      day: row['Day'] ?? '',
      date: row['Date'] ?? '',
      topic,
      platform: row['Platform'] ?? '',
      type: row['Type'] ?? '',
      priority: row['Priority'] ?? '',
      notes: row['Notes/Details'] ?? row['Notes'] ?? '',
      done: /^(yes|y|true|done|✓|x|complete)$/i.test(done),
    }
  })

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
