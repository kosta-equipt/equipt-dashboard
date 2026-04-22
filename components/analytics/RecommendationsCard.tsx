import { Sparkles } from 'lucide-react'
import type { Recommendation } from '@/types/sheets'

type RecommendationsCardProps = {
  recs: Recommendation[]
}

export function RecommendationsCard({ recs }: RecommendationsCardProps) {
  if (!recs.length) return null

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card dark:border-line-dark dark:bg-linen-dark">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-gold" aria-hidden />
        <h3 className="text-[11px] font-medium uppercase tracking-wider2 text-gold">
          What to post next
        </h3>
      </div>
      <ol className="space-y-3">
        {recs.map((rec, i) => (
          <li key={rec.id} className="flex gap-3">
            <span
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-[10px] font-semibold text-midnight dark:border-line-dark dark:text-linen"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="space-y-0.5">
              <p className="font-display text-sm font-semibold text-midnight dark:text-linen">
                {rec.title}
              </p>
              <p className="text-xs leading-relaxed text-muted dark:text-muted-dark">
                {rec.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
