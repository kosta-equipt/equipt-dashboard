'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { RefreshCw } from 'lucide-react'
import { refreshSheets } from '@/app/actions'
import { formatRelativeTime } from '@/lib/format'

type RefreshButtonProps = {
  fetchedAt: string | null
  disabled?: boolean
}

export function RefreshButton({ fetchedAt, disabled }: RefreshButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [nowTick, setNowTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setNowTick((t) => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  const label =
    fetchedAt && !disabled
      ? `Synced ${formatRelativeTime(fetchedAt)}`
      : disabled
        ? 'Not connected'
        : 'Syncing…'

  // nowTick is only used to trigger a re-render so the relative time updates.
  void nowTick

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-muted sm:inline">{label}</span>
      <button
        type="button"
        disabled={disabled || pending}
        onClick={() => {
          startTransition(async () => {
            await refreshSheets()
            router.refresh()
          })
        }}
        className="inline-flex items-center gap-2 rounded-full border border-midnight/10 bg-white px-4 py-1.5 text-sm font-medium text-midnight shadow-card transition hover:border-midnight/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${pending ? 'animate-spin' : ''}`}
          aria-hidden
        />
        {pending ? 'Refreshing' : 'Refresh'}
      </button>
    </div>
  )
}
