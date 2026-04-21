'use client'

import { useEffect, useState } from 'react'

const FORMATTER = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Qatar',
})

const DAY_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  timeZone: 'Asia/Qatar',
})

function formatNow() {
  const now = new Date()
  return {
    time: FORMATTER.format(now),
    day: DAY_FORMATTER.format(now),
  }
}

export function LiveClock() {
  const [value, setValue] = useState<{ time: string; day: string } | null>(null)

  useEffect(() => {
    setValue(formatNow())
    const id = setInterval(() => setValue(formatNow()), 1000 * 30)
    return () => clearInterval(id)
  }, [])

  if (!value) {
    return (
      <div
        aria-hidden
        className="hidden h-[26px] w-[86px] rounded-full border border-line/80 bg-white/60 md:inline-block dark:border-line-dark/80 dark:bg-linen-dark/60"
      />
    )
  }

  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-line/80 bg-white/60 px-2.5 py-1 text-xs text-ink shadow-sm backdrop-blur md:inline-flex dark:border-line-dark/80 dark:bg-linen-dark/60 dark:text-linen">
      <span className="text-muted dark:text-muted-dark">{value.day}</span>
      <span className="font-mono tabular-nums">{value.time}</span>
    </div>
  )
}
