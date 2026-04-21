import 'server-only'
import { cachedRange } from './cache'
import { isSheetsConfigured } from './client'
import { parseSheetDate } from '@/lib/dates'
import type { HistoryPost } from '@/types/sheets'

const TAB_PERFORMANCE = process.env.SHEET_TAB_PERFORMANCE ?? 'Performance'

function q(tab: string): string {
  return `'${tab.replace(/'/g, "''")}'`
}

function normaliseCell(raw: unknown): string {
  if (raw === null || raw === undefined) return ''
  return String(raw).trim()
}

function toNumber(raw: string): number {
  const cleaned = raw.replace(/[,%$\s]/g, '')
  if (!cleaned) return 0
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

function findHeader(rows: string[][], required: string[]): number {
  const needed = required.map((r) => r.toLowerCase())
  for (let i = 0; i < rows.length; i++) {
    const lc = rows[i].map((c) => normaliseCell(c).toLowerCase())
    if (needed.every((n) => lc.includes(n))) return i
  }
  return 0
}

export type WeeklyDelta = {
  posts: number
  reach: number
  likes: number
  engagement: number
  shares: number
  saves: number
}

export type WeekInsights = {
  thisWeek: WeeklyDelta
  lastWeek: WeeklyDelta
  topPost: HistoryPost | null
  configured: boolean
  fetchedAt: string
}

const EMPTY_DELTA: WeeklyDelta = {
  posts: 0,
  reach: 0,
  likes: 0,
  engagement: 0,
  shares: 0,
  saves: 0,
}

export async function getWeekInsights(): Promise<WeekInsights> {
  if (!isSheetsConfigured()) {
    return {
      thisWeek: EMPTY_DELTA,
      lastWeek: EMPTY_DELTA,
      topPost: null,
      configured: false,
      fetchedAt: new Date().toISOString(),
    }
  }

  const { rows, fetchedAt } = await cachedRange(
    ['insights'],
    `${q(TAB_PERFORMANCE)}!A1:Z500`,
  )

  const headerIdx = findHeader(rows, ['Date', 'Reach'])
  const headers = (rows[headerIdx] ?? []).map((h) => normaliseCell(h))

  const colIndex = (name: string) =>
    headers.findIndex((h) => h.toLowerCase() === name.toLowerCase())

  const iDate = colIndex('Date')
  const iReach = colIndex('Reach')
  const iEng = colIndex('Engagement')
  const iLikes = colIndex('Likes')
  const iShares = colIndex('Shares')
  const iSaves = colIndex('Saves')
  const iPost = colIndex('Post')
  const iPlatform = colIndex('Platform')
  const iType = colIndex('Type')
  const iLink = colIndex('Link')

  const today = new Date()
  const oneDay = 24 * 60 * 60 * 1000
  const thisStart = today.getTime() - 7 * oneDay
  const lastStart = today.getTime() - 14 * oneDay

  const thisWeek: WeeklyDelta = { ...EMPTY_DELTA }
  const lastWeek: WeeklyDelta = { ...EMPTY_DELTA }
  let topPost: HistoryPost | null = null

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i] ?? []
    if (!row.some((c) => normaliseCell(c))) continue

    const rawDate = normaliseCell(row[iDate] ?? '')
    const parsed = parseSheetDate(rawDate, today, 'past')
    if (!parsed) continue

    const reach = toNumber(normaliseCell(row[iReach] ?? ''))
    const engagement = toNumber(normaliseCell(row[iEng] ?? ''))
    const likes = toNumber(normaliseCell(row[iLikes] ?? ''))
    const shares = toNumber(normaliseCell(row[iShares] ?? ''))
    const saves = toNumber(normaliseCell(row[iSaves] ?? ''))

    const t = parsed.getTime()
    if (t >= thisStart && t <= today.getTime()) {
      thisWeek.posts += 1
      thisWeek.reach += reach
      thisWeek.likes += likes
      thisWeek.engagement += engagement
      thisWeek.shares += shares
      thisWeek.saves += saves

      if (!topPost || engagement > topPost.engagement) {
        topPost = {
          date: rawDate,
          dateIso: parsed.toISOString(),
          monthKey: '',
          monthLabel: '',
          platform: normaliseCell(row[iPlatform] ?? ''),
          type: normaliseCell(row[iType] ?? ''),
          topic: normaliseCell(row[iPost] ?? ''),
          reach,
          engagement,
          likes,
          link: normaliseCell(row[iLink] ?? ''),
        }
      }
    } else if (t >= lastStart && t < thisStart) {
      lastWeek.posts += 1
      lastWeek.reach += reach
      lastWeek.likes += likes
      lastWeek.engagement += engagement
      lastWeek.shares += shares
      lastWeek.saves += saves
    }
  }

  return { thisWeek, lastWeek, topPost, configured: true, fetchedAt }
}
