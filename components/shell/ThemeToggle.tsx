'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'equipt-theme'
const WIPE_MS = 450

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [wiping, setWiping] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(readTheme())
  }, [])

  function toggle() {
    if (wiping) return
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setWiping(next)
    // Flip the actual theme at the peak of the wipe (when the overlay fully
    // covers the viewport) so the hand-off is invisible behind the overlay.
    window.setTimeout(() => {
      document.documentElement.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {}
      setTheme(next)
    }, WIPE_MS)
    // Clear the overlay after it has completed its exit fade.
    window.setTimeout(() => setWiping(null), WIPE_MS + 250)
  }

  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
  const icon =
    theme === 'dark' ? (
      <Sun className="h-3.5 w-3.5" aria-hidden />
    ) : (
      <Moon className="h-3.5 w-3.5" aria-hidden />
    )

  const overlayColour = wiping === 'dark' ? '#0F0F11' : '#FAF7F2'

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={`Switch to ${nextTheme} mode`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-midnight/10 bg-white text-midnight shadow-card transition hover:border-midnight/30 dark:border-line-dark dark:bg-linen-dark dark:text-linen"
      >
        {icon}
      </button>

      {wiping && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100]"
          style={{
            backgroundColor: overlayColour,
            animation: `theme-wipe-in ${WIPE_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards, theme-wipe-out 250ms ease ${WIPE_MS}ms forwards`,
          }}
        />
      )}
    </>
  )
}
