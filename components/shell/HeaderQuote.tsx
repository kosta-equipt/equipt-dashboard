import { getRandomQuote } from '@/lib/quotes'

/**
 * Server component: picks a fresh quote on every render.
 * Pages mark themselves `dynamic = 'force-dynamic'`, so each refresh
 * lands on a new quote.
 */
export function HeaderQuote() {
  const quote = getRandomQuote()
  return (
    <div className="border-b border-line/60 bg-bone/60 dark:border-line-dark/60 dark:bg-bone-dark/60">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 py-2 text-center">
        <p className="truncate text-xs italic text-muted dark:text-muted-dark">
          <span className="text-ink/80 dark:text-linen/80">“{quote.text}”</span>
          <span className="mx-2 text-muted/60 dark:text-muted-dark/60">—</span>
          <span className="not-italic font-medium tracking-wide text-muted dark:text-muted-dark">
            {quote.author}
          </span>
        </p>
      </div>
    </div>
  )
}
