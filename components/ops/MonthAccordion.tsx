import { MonthRow } from './MonthRow'
import type { MonthlySummary } from '@/types/ops'

export function MonthAccordion({ summaries }: { summaries: MonthlySummary[] }) {
  if (summaries.length === 0) {
    return (
      <p className="text-sm text-muted dark:text-muted-dark">
        No monthly tabs detected in the sheet yet.
      </p>
    )
  }
  return (
    <section className="space-y-3">
      <header className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold text-midnight dark:text-linen">
          Month-by-month
        </h2>
        <span className="text-xs text-muted dark:text-muted-dark">
          {summaries.length} {summaries.length === 1 ? 'month' : 'months'}
        </span>
      </header>
      <div className="space-y-2">
        {summaries.map((s, idx) => (
          <MonthRow key={s.meta.monthKey} summary={s} defaultOpen={idx === 0} />
        ))}
      </div>
    </section>
  )
}
