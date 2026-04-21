import Link from 'next/link'
import { ExternalLink, Sparkles } from 'lucide-react'
import type { HistoryPost } from '@/types/sheets'
import { formatNumber } from '@/lib/format'

type TopPostCardProps = {
  post: HistoryPost | null
}

export function TopPostCard({ post }: TopPostCardProps) {
  if (!post) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-sm text-muted shadow-card dark:border-line-dark dark:bg-linen-dark dark:text-muted-dark">
        No top post yet this week — it shows up here once metrics land in the Performance tab.
      </div>
    )
  }

  const topic = post.topic.replace(/\s+/g, ' ').slice(0, 240)

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:border-gold/60 dark:border-line-dark dark:bg-linen-dark dark:hover:border-gold/60">
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-gold/5 blur-2xl transition group-hover:bg-gold/10" aria-hidden />
      <div className="relative flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden />
            <span className="text-[11px] font-medium uppercase tracking-wider2 text-gold">
              Top post this week
            </span>
            {post.platform && (
              <span className="inline-flex rounded-full border border-line bg-linen/60 px-2 py-0.5 text-[10px] font-medium text-ink dark:border-line-dark dark:bg-ink-dark/60 dark:text-linen">
                {post.platform}
              </span>
            )}
            <span className="text-[11px] text-muted dark:text-muted-dark">
              {post.date}
            </span>
          </div>
          <p className="line-clamp-3 font-display text-lg font-medium leading-snug text-midnight dark:text-linen">
            {topic || <span className="text-muted">(empty caption)</span>}
          </p>
        </div>
        <div className="flex gap-5 md:flex-col md:gap-2 md:pl-6 md:text-right">
          <Stat label="Reach" value={post.reach} />
          <Stat label="Engagement" value={post.engagement} />
          <Stat label="Likes" value={post.likes} />
        </div>
        {post.link && (
          <Link
            href={post.link}
            target="_blank"
            rel="noreferrer"
            className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-muted transition hover:border-gold hover:text-gold dark:border-line-dark dark:bg-linen-dark dark:text-muted-dark"
            aria-label="Open post"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-[92px] items-baseline gap-1.5 md:flex-col md:items-end md:gap-0.5">
      <span className="font-display text-lg font-semibold tabular-nums text-midnight dark:text-linen">
        {formatNumber(value)}
      </span>
      <span className="text-[10px] uppercase tracking-wider2 text-muted dark:text-muted-dark">
        {label}
      </span>
    </div>
  )
}
