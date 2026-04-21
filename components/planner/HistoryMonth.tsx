'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { HistoryPost } from '@/types/sheets'
import { formatNumber } from '@/lib/format'
import { HistoryTable } from './HistoryTable'

type HistoryMonthProps = {
  label: string
  posts: HistoryPost[]
}

export function HistoryMonth({ label, posts }: HistoryMonthProps) {
  const [open, setOpen] = useState(false)
  const totalReach = posts.reduce((acc, p) => acc + (p.reach || 0), 0)
  const totalEngagement = posts.reduce((acc, p) => acc + (p.engagement || 0), 0)

  return (
    <div className="rounded-2xl border border-line bg-white shadow-card dark:border-line-dark dark:bg-linen-dark">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <ChevronRight
            className={`h-4 w-4 text-muted transition-transform dark:text-muted-dark ${
              open ? 'rotate-90' : ''
            }`}
            aria-hidden
          />
          <span className="font-display text-sm font-semibold text-midnight dark:text-linen">
            {label}
          </span>
          <span className="text-xs text-muted dark:text-muted-dark">
            {posts.length} post{posts.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted dark:text-muted-dark">
          <span>
            <span className="font-mono text-ink dark:text-linen">{formatNumber(totalReach)}</span> reach
          </span>
          <span>
            <span className="font-mono text-ink dark:text-linen">{formatNumber(totalEngagement)}</span> eng.
          </span>
        </div>
      </button>
      {open && <HistoryTable posts={posts} />}
    </div>
  )
}
