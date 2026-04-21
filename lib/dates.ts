const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

/**
 * Dates written without a year are ambiguous — "Aug 28" in April could be
 * this year (future) or last year (past). For a planner mixing a short
 * future scheduling window with a long historical record, we assume
 * current year unless the date is MORE than ~6 months in the future,
 * which is far beyond a reasonable scheduling horizon.
 */
function rollBackIfFarFuture(d: Date, reference: Date) {
  const sixMonthsMs = 180 * 24 * 60 * 60 * 1000
  if (d.getTime() > reference.getTime() + sixMonthsMs) {
    d.setUTCFullYear(d.getUTCFullYear() - 1)
  }
}

/**
 * Parse a sheet date string like "Apr 20", "Apr 20, 2026", "2026-04-20",
 * or "20/04/2026". When no year is supplied, assume current year; if the
 * resulting date is more than a day in the future, roll it back a year —
 * sheets with mixed history + near-term scheduling usually mean "last year"
 * for future-looking bare dates like "Aug 28" viewed in April.
 */
export function parseSheetDate(raw: unknown, reference: Date = new Date()): Date | null {
  if (raw === null || raw === undefined) return null
  const s = String(raw).trim()
  if (!s) return null

  // ISO first (YYYY-MM-DD or full ISO).
  const iso = Date.parse(s)
  if (!Number.isNaN(iso) && /\d{4}-\d{2}-\d{2}/.test(s)) {
    return startOfDayUTC(new Date(iso))
  }

  // DD/MM/YYYY or DD-MM-YYYY.
  const dmy = s.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})$/)
  if (dmy) {
    const [, dd, mm, yy] = dmy
    const year = yy.length === 2 ? 2000 + Number(yy) : Number(yy)
    return new Date(Date.UTC(year, Number(mm) - 1, Number(dd)))
  }

  // "Apr 20" or "Apr 20, 2026".
  const monthFirst = s.match(
    /^([A-Za-z]{3,})\s+(\d{1,2})(?:,\s*(\d{4}))?$/,
  )
  if (monthFirst) {
    const [, mon, day, year] = monthFirst
    const mi = MONTHS.indexOf(mon.slice(0, 3).toLowerCase())
    if (mi < 0) return null
    const y = year ? Number(year) : reference.getUTCFullYear()
    const d = new Date(Date.UTC(y, mi, Number(day)))
    if (!year) rollBackIfFarFuture(d, reference)
    return d
  }

  // "20 Apr" or "20 Apr 2026".
  const dayFirst = s.match(/^(\d{1,2})\s+([A-Za-z]{3,})(?:\s+(\d{4}))?$/)
  if (dayFirst) {
    const [, day, mon, year] = dayFirst
    const mi = MONTHS.indexOf(mon.slice(0, 3).toLowerCase())
    if (mi < 0) return null
    const y = year ? Number(year) : reference.getUTCFullYear()
    const d = new Date(Date.UTC(y, mi, Number(day)))
    if (!year) rollBackIfFarFuture(d, reference)
    return d
  }

  return null
}

export function monthKey(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function monthLabel(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function dayLabel(d: Date): string {
  return DAYS[d.getUTCDay()]
}

export function isTodayOrFuture(d: Date, reference: Date = new Date()): boolean {
  return startOfDayUTC(d).getTime() >= startOfDayUTC(reference).getTime()
}
