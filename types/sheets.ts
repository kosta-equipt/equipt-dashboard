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
}
