import 'server-only'
import { cachedRange, cachedTitles } from './cache'
import { discoverMonthlyTabs } from '@/lib/ops/tabs'
import { normaliseVisitType, normaliseProjectType, parseDelay } from '@/lib/ops/normalise'
import { parseSheetDate } from '@/lib/dates'
import type { MonthlyTabMeta, OpsVisit } from '@/types/ops'

type CanonicalField =
  | 'project'
  | 'invoiceRef'
  | 'deliveryDate'
  | 'scheduledTime'
  | 'arrivalTime'
  | 'delay'
  | 'timeOut'
  | 'totalHrs'
  | 'notes'
  | 'visitType'
  | 'projectType'
  | 'deliveryTime'

const HEADER_TO_FIELD: Record<string, CanonicalField> = {
  project: 'project',
  'invoice ref': 'invoiceRef',
  'invoice reference': 'invoiceRef',
  invoice: 'invoiceRef',
  'delivery date': 'deliveryDate',
  date: 'deliveryDate',
  'scheduled time': 'scheduledTime',
  'arrival time': 'arrivalTime',
  delay: 'delay',
  'time out': 'timeOut',
  'total hrs': 'totalHrs',
  'total hours': 'totalHrs',
  hours: 'totalHrs',
  notes: 'notes',
  note: 'notes',
  'visit type': 'visitType',
  'project type': 'projectType',
  'delivery time': 'deliveryTime',
}

function buildHeaderMap(headerRow: string[]): Map<CanonicalField, number> {
  const map = new Map<CanonicalField, number>()
  headerRow.forEach((cell, idx) => {
    const key = (cell ?? '').trim().toLowerCase()
    const field = HEADER_TO_FIELD[key]
    if (field && !map.has(field)) {
      map.set(field, idx)
    }
  })
  return map
}

function emptyToNull(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

function readCell(
  row: string[],
  headers: Map<CanonicalField, number>,
  field: CanonicalField,
): string | null {
  const idx = headers.get(field)
  if (idx === undefined) return null
  return emptyToNull(row[idx])
}

function escapeRange(title: string): string {
  // Always single-quote the sheet name in an A1 range; escape embedded single quotes.
  return `'${title.replace(/'/g, "''")}'`
}

async function getMonthlyVisitsFor(meta: MonthlyTabMeta): Promise<OpsVisit[]> {
  const range = `${escapeRange(meta.title)}!A1:Z`
  const { rows } = await cachedRange(['monthly', meta.monthKey], range, 'ops')
  if (rows.length === 0) return []

  const [headerRow, ...dataRows] = rows
  const headers = buildHeaderMap(headerRow)
  if (!headers.has('project') && !headers.has('deliveryDate')) {
    return []
  }

  const visits: OpsVisit[] = []
  for (const row of dataRows) {
    const project = readCell(row, headers, 'project')
    const deliveryDateRaw = readCell(row, headers, 'deliveryDate')
    if (!project && !deliveryDateRaw) continue // skip empty trailing rows

    const scheduledTime =
      readCell(row, headers, 'scheduledTime') ??
      readCell(row, headers, 'deliveryTime')
    const visitTypeRaw = readCell(row, headers, 'visitType')
    const projectTypeRaw = readCell(row, headers, 'projectType')
    const delayRaw = readCell(row, headers, 'delay')

    const parsedDate = deliveryDateRaw
      ? parseSheetDate(
          deliveryDateRaw,
          new Date(Date.UTC(meta.year, meta.monthIndex, 15)),
          'past',
        )
      : null

    visits.push({
      monthKey: meta.monthKey,
      monthLabel: meta.monthLabel,
      tabTitle: meta.title,
      project,
      invoiceRef: readCell(row, headers, 'invoiceRef'),
      deliveryDateIso: parsedDate ? parsedDate.toISOString().slice(0, 10) : null,
      deliveryDateRaw,
      scheduledTime,
      arrivalTime: readCell(row, headers, 'arrivalTime'),
      delay: parseDelay(delayRaw),
      timeOut: readCell(row, headers, 'timeOut'),
      totalHrs: readCell(row, headers, 'totalHrs'),
      notes: readCell(row, headers, 'notes'),
      visitType: normaliseVisitType(visitTypeRaw),
      projectType: normaliseProjectType(projectTypeRaw),
    })
  }
  return visits
}

export async function getMonthlyTabs(): Promise<MonthlyTabMeta[]> {
  const { titles } = await cachedTitles('ops')
  return discoverMonthlyTabs(titles)
}

export async function getAllVisits(): Promise<{
  metas: MonthlyTabMeta[]
  visits: OpsVisit[]
  fetchedAt: string
}> {
  const metas = await getMonthlyTabs()
  const all = await Promise.all(metas.map((m) => getMonthlyVisitsFor(m)))
  const visits = all.flat()

  // Stable sort by deliveryDateIso desc, falling back to monthKey desc, then tab order.
  visits.sort((a, b) => {
    const aKey = a.deliveryDateIso ?? a.monthKey + '-00'
    const bKey = b.deliveryDateIso ?? b.monthKey + '-00'
    if (aKey === bKey) return 0
    return aKey < bKey ? 1 : -1
  })

  return {
    metas,
    visits,
    fetchedAt: new Date().toISOString(),
  }
}

export async function getMonthlyVisits(monthKey: string): Promise<OpsVisit[]> {
  const metas = await getMonthlyTabs()
  const meta = metas.find((m) => m.monthKey === monthKey)
  if (!meta) return []
  return getMonthlyVisitsFor(meta)
}
