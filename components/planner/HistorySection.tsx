import type { HistoryPost } from '@/types/sheets'
import { HistoryMonth } from './HistoryMonth'

type HistorySectionProps = {
  posts: HistoryPost[]
}

export function HistorySection({ posts }: HistorySectionProps) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-center text-xs text-muted shadow-card">
        No historical posts yet. Entries land here automatically once metrics
        are pulled into the Performance tab.
      </div>
    )
  }

  const months = new Map<
    string,
    { label: string; posts: HistoryPost[]; firstDate: string }
  >()

  for (const post of posts) {
    const existing = months.get(post.monthKey)
    if (existing) {
      existing.posts.push(post)
    } else {
      months.set(post.monthKey, {
        label: post.monthLabel,
        posts: [post],
        firstDate: post.dateIso,
      })
    }
  }

  const ordered = Array.from(months.entries()).sort(([a], [b]) =>
    b.localeCompare(a),
  )

  return (
    <div className="space-y-2">
      {ordered.map(([key, group]) => (
        <HistoryMonth key={key} label={group.label} posts={group.posts} />
      ))}
    </div>
  )
}
