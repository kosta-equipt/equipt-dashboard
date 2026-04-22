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

function isPostedStatus(raw: string): boolean {
  const s = raw.toLowerCase().trim()
  return (
    s === 'posted' ||
    s === 'published' ||
    s === 'live' ||
    s === 'done' ||
    s === 'complete'
  )
}

function splitPlatforms(raw: string): string[] {
  const s = raw.trim()
  if (!s) return ['']
  if (/^both$/i.test(s)) return ['Instagram', 'Facebook']
  return s
    .split(/[,/&]|\s+and\s+/i)
    .map((p) => p.trim())
    .filter(Boolean)
}

type CalendarRowRaw = {
  parsedDate: Date | null
  rawDate: string
  topic: string
  platform: string
  status: string
  day: string
}

async function loadCalendarRows(): Promise<{
  rows: CalendarRowRaw[]
  fetchedAt: string
}> {
  const { rows: raw, fetchedAt } = await cachedRange(
    ['content-calendar'],
    `${q(TAB_CONTENT_CALENDAR)}!A1:Z200`,
  )
  const parsed = parseTable(raw, ['Date', 'Post'])
  const today = new Date()

  const out: CalendarRowRaw[] = parsed.map((row) => {
    const topic =
      row['Post'] ??
      row['Post Topic/Caption'] ??
      row['Topic'] ??
      row['Caption'] ??
      row['Idea/Topic'] ??
      ''
    const platform = row['Platforms'] ?? row['Platform'] ?? ''
    const rawDate = row['Date'] ?? ''
    const status = row['Status'] ?? row['Done'] ?? ''
    const parsedDate = parseSheetDate(rawDate, today)
    return {
      parsedDate,
      rawDate,
      topic,
      platform,
      status,
      day: row['Day'] ?? (parsedDate ? dayLabel(parsedDate) : ''),
    }
  })

  return { rows: out, fetchedAt }
}

export async function getContentCalendar(): Promise<{
  data: PlannerRow[]
  fetchedAt: string
  configured: boolean
}> {
  if (!isSheetsConfigured()) {
    return { data: [], fetchedAt: new Date().toISOString(), configured: false }
  }

  const { rows, fetchedAt } = await loadCalendarRows()
  const today = new Date()

  const data: PlannerRow[] = rows
    .filter((r) => !isPostedStatus(r.status))
    .map((r) => ({ parsedDate: r.parsedDate, row: r }))
    .filter(
      (x): x is { parsedDate: Date; row: CalendarRowRaw } =>
        x.parsedDate !== null && isTodayOrFuture(x.parsedDate, today),
    )
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
    .map(({ row }) => ({
      day: row.day,
      date: row.rawDate,
      topic: row.topic,
      platform: row.platform,
    }))

  return { data, fetchedAt, configured: true }
}

function topicKey(topic: string): string {
  return topic.replace(/\s+/g, ' ').trim().slice(0, 40).toLowerCase()
}

export async function getHistory(): Promise<{
  data: HistoryPost[]
  fetchedAt: string
  configured: boolean
}> {
  if (!isSheetsConfigured()) {
    return { data: [], fetchedAt: new Date().toISOString(), configured: false }
  }

  const [perfResult, calendarResult] = await Promise.all([
    cachedRange(['history'], `${q(TAB_PERFORMANCE)}!A1:Z500`),
    loadCalendarRows(),
  ])

  const parsedPerf = parseTable(perfResult.rows, ['Date', 'Reach'])
  const today = new Date()

  // 1. Build the base history from the Performance tab (rows with metrics).
  const fromPerformance: HistoryPost[] = parsedPerf
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
        pending: false,
      }
    })
    .filter((p): p is HistoryPost => p !== null)

  // 2. Index Performance rows by (day key + platform + topic key) so we can
  // detect which Content Calendar Posted rows are already covered.
  const coveredKeys = new Set<string>()
  for (const p of fromPerformance) {
    const dayKey = p.dateIso.slice(0, 10)
    const tk = topicKey(p.topic)
    coveredKeys.add(`${dayKey}|${p.platform.toLowerCase()}|${tk}`)
    // Also index without topic so we don't double-surface when captions differ.
    coveredKeys.add(`${dayKey}|${p.platform.toLowerCase()}|*`)
  }

  // 3. For every Content Calendar row marked Posted, emit a per-platform
  // pending entry unless Performance already has a matching row.
  const pending: HistoryPost[] = []
  for (const r of calendarResult.rows) {
    if (!isPostedStatus(r.status)) continue
    if (!r.parsedDate) continue
    const dayKey = r.parsedDate.toISOString().slice(0, 10)
    for (const plat of splitPlatforms(r.platform)) {
      const platLc = plat.toLowerCase()
      const tk = topicKey(r.topic)
      if (coveredKeys.has(`${dayKey}|${platLc}|${tk}`)) continue
      if (coveredKeys.has(`${dayKey}|${platLc}|*`)) continue
      pending.push({
        date: r.rawDate,
        dateIso: r.parsedDate.toISOString(),
        monthKey: monthKey(r.parsedDate),
        monthLabel: monthLabel(r.parsedDate),
        platform: plat,
        type: '',
        topic: r.topic,
        reach: 0,
        engagement: 0,
        likes: 0,
        link: '',
        pending: true,
      })
    }
  }

  const data = [...fromPerformance, ...pending].sort((a, b) =>
    b.dateIso.localeCompare(a.dateIso),
  )

  return {
    data,
    fetchedAt: perfResult.fetchedAt,
    configured: true,
  }
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
