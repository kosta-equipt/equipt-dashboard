import 'server-only'
import { cachedRange } from './cache'
import { isSheetsConfigured } from './client'
import { parseSheetDate } from '@/lib/dates'
import type { HistoryPost, Recommendation } from '@/types/sheets'

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

type Aggregates<K extends string> = Record<
  K,
  { posts: number; reach: number; engagement: number }
>

function bump<K extends string>(agg: Aggregates<K>, key: K, r: number, e: number) {
  const current = agg[key] ?? { posts: 0, reach: 0, engagement: 0 }
  current.posts += 1
  current.reach += r
  current.engagement += e
  agg[key] = current
}

function winnerByEngagementPerPost<K extends string>(
  agg: Aggregates<K>,
  { minPosts = 2 }: { minPosts?: number } = {},
): { key: K; avg: number } | null {
  let best: { key: K; avg: number } | null = null
  for (const k of Object.keys(agg) as K[]) {
    const { posts, engagement } = agg[k]
    if (posts < minPosts) continue
    const avg = engagement / Math.max(1, posts)
    if (!best || avg > best.avg) best = { key: k, avg }
  }
  return best
}

/**
 * Rule-based recommendations — no AI, no cost. Reads the Performance tab
 * and surfaces up to three short, actionable prompts for the next post.
 * Designed to be deterministic and cheap; every rule is silent if its data
 * isn't there (so the box simply shows fewer recs rather than hallucinated
 * ones).
 */
export async function getRecommendations(): Promise<{
  data: Recommendation[]
  configured: boolean
  fetchedAt: string
}> {
  if (!isSheetsConfigured()) {
    return { data: [], configured: false, fetchedAt: new Date().toISOString() }
  }

  const { rows, fetchedAt } = await cachedRange(
    ['recommendations'],
    `${q(TAB_PERFORMANCE)}!A1:Z500`,
  )

  const headerIdx = findHeader(rows, ['Date', 'Reach'])
  const headers = (rows[headerIdx] ?? []).map((h) => normaliseCell(h))
  const colIndex = (name: string) =>
    headers.findIndex((h) => h.toLowerCase() === name.toLowerCase())

  const iDate = colIndex('Date')
  const iReach = colIndex('Reach')
  const iEng = colIndex('Engagement')
  const iPost = colIndex('Post')
  const iPlatform = colIndex('Platform')
  const iType = colIndex('Type')

  const today = new Date()
  const windowMs = 45 * 24 * 60 * 60 * 1000
  const cutoff = today.getTime() - windowMs

  const byType: Aggregates<string> = {}
  const byPlatform: Aggregates<string> = {}
  const lastByPlatform: Record<string, number> = {}
  let topPost: { topic: string; engagement: number; platform: string } | null =
    null

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i] ?? []
    if (!row.some((c) => normaliseCell(c))) continue

    const parsed = parseSheetDate(normaliseCell(row[iDate] ?? ''), today, 'past')
    if (!parsed) continue
    const t = parsed.getTime()
    if (t < cutoff) continue

    const reach = toNumber(normaliseCell(row[iReach] ?? ''))
    const engagement = toNumber(normaliseCell(row[iEng] ?? ''))
    const platform = normaliseCell(row[iPlatform] ?? '')
    const type = normaliseCell(row[iType] ?? '')
    const topic = normaliseCell(row[iPost] ?? '')

    if (type) bump(byType, type, reach, engagement)
    if (platform) bump(byPlatform, platform, reach, engagement)
    if (platform) {
      lastByPlatform[platform] = Math.max(lastByPlatform[platform] ?? 0, t)
    }

    if (engagement > 0 && (!topPost || engagement > topPost.engagement)) {
      topPost = { topic, engagement, platform }
    }
  }

  const recs: Recommendation[] = []

  // Rule 1 — winning content type.
  const typeWinner = winnerByEngagementPerPost(byType, { minPosts: 2 })
  if (typeWinner) {
    const pretty = prettifyType(typeWinner.key)
    recs.push({
      id: 'type-winner',
      title: `Lead with another ${pretty}`,
      detail: `${pretty} content averages ${Math.round(typeWinner.avg)} engagement — your strongest format in the last 45 days.`,
    })
  }

  // Rule 2 — platform gap (longest silence among platforms seen recently).
  const gapCandidates = Object.entries(lastByPlatform).map(([platform, t]) => ({
    platform,
    daysSince: Math.floor((today.getTime() - t) / (24 * 60 * 60 * 1000)),
  }))
  gapCandidates.sort((a, b) => b.daysSince - a.daysSince)
  const gap = gapCandidates[0]
  if (gap && gap.daysSince >= 5) {
    recs.push({
      id: 'platform-gap',
      title: `Fill the ${gap.platform} silence`,
      detail: `${gap.daysSince} days since your last ${gap.platform} post — the audience there is due a refresh.`,
    })
  }

  // Rule 3 — echo the top recent post.
  if (topPost && topPost.topic) {
    const snippet = topPost.topic.replace(/\s+/g, ' ').slice(0, 80).trim()
    recs.push({
      id: 'top-echo',
      title: 'Echo your top post',
      detail: `"${snippet}${snippet.length >= 80 ? '…' : ''}" pulled ${Math.round(topPost.engagement)} engagement. Consider a follow-up in the same thread.`,
    })
  }

  return {
    data: recs.slice(0, 3),
    configured: true,
    fetchedAt,
  }
}

function prettifyType(type: string): string {
  const t = type.trim().toUpperCase()
  if (t === 'VIDEO') return 'Reel'
  if (t === 'CAROUSEL_ALBUM' || t === 'CAROUSEL') return 'Carousel'
  if (t === 'IMAGE') return 'Static post'
  if (t === 'STORY') return 'Story'
  return type.toLowerCase().replace(/_/g, ' ') || 'post'
}
