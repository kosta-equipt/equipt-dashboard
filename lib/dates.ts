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

function rollBackIfInFuture(d: Date, reference: Date, bias: DateBias) {
  const sixMonthsMs = 180 * 24 * 60 * 60 * 1000
  const oneDayMs = 24 * 60 * 60 * 1000
  const threshold =
    bias === 'past'
      ? reference.getTime() + oneDayMs
      : reference.getTime() + sixMonthsMs
  if (d.getTime() > threshold) {
    d.setUTCFullYear(d.getUTCFullYear() - 1)
  }
}

export type DateBias = 'upcoming' | 'past'

/**
 * Parse a sheet date string like "Apr 20", "Apr 20, 2026", "2026-04-20",
 * or "20/04/2026". When no year is supplied, assume current year; if
 * that puts the date implausibly in the future, roll back a year.
 *
 * Bias controls the threshold:
 * - "upcoming" (default): keep this year unless >6 months in the future
 *   (matches short scheduling horizons in a content planner).
 * - "past": roll back the moment the date is even a day in the future
 *   (for tabs that only hold historical data).
 */
export function parseSheetDate(
  raw: unknown,
  reference: Date = new Date(),
  bias: DateBias = 'upcoming',
): Date | null {
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
    if (!year) rollBackIfInFuture(d, reference, bias)
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
    if (!year) rollBackIfInFuture(d, reference, bias)
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
