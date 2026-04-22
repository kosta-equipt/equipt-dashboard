export type CommandCentreKpis = {
  totalPosts: number | null
  totalReach: number | null
  totalLikes: number | null
  avgEngagement: number | null
  totalShares: number | null
  totalSaves: number | null
}

export type PerformancePoint = {
  date: string
  reach: number
  engagement: number
  likes: number
}

export type PlannerRow = {
  day: string
  date: string
  topic: string
  platform: string
}

export type HistoryPost = {
  date: string
  dateIso: string
  monthKey: string
  monthLabel: string
  platform: string
  type: string
  topic: string
  reach: number
  engagement: number
  likes: number
  link: string
  /**
   * True when this row was surfaced from the Content Calendar (marked
   * Posted) but has not yet landed in the Performance tab — i.e. metrics
   * haven't been pulled in yet. UI shows these with dashes instead of
   * zeros so it's clear the numbers are pending, not zero.
   */
  pending?: boolean
}

export type Recommendation = {
  id: string
  title: string
  detail: string
}
