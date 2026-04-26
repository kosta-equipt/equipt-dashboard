import type {
  KpiSet,
  MonthlySummary,
  MonthlyTabMeta,
  OpsVisit,
  ProjectType,
  VisitType,
  Window,
} from '@/types/ops'
import { PROJECT_TYPES, VISIT_TYPES } from '@/types/ops'

export function emptyVisitTypeCounts(): Record<VisitType, number> {
  return {
    Installation: 0,
    Maintenance: 0,
    Inspection: 0,
    Delivery: 0,
    AMC: 0,
    'Side Task': 0,
    WH: 0,
  }
}

export function emptyProjectTypeCounts(): Record<ProjectType, number> {
  return {
    'Home Gym': 0,
    'Residential Gym': 0,
    'Commercial Gym': 0,
    'Studio Gym': 0,
    'Corporate Gym': 0,
    'Rehabilitation Studio': 0,
    'Internal Task': 0,
  }
}

export function countByVisitType(visits: OpsVisit[]): Record<VisitType, number> {
  const counts = emptyVisitTypeCounts()
  for (const v of visits) {
    if (v.visitType) counts[v.visitType] += 1
  }
  return counts
}

export function countByProjectType(visits: OpsVisit[]): Record<ProjectType, number> {
  const counts = emptyProjectTypeCounts()
  for (const v of visits) {
    if (v.projectType) counts[v.projectType] += 1
  }
  return counts
}

export function computeKpis(visits: OpsVisit[]): KpiSet {
  const counts = countByVisitType(visits)
  const withDelay = visits.filter((v) => v.delay !== null)
  const onTime = withDelay.filter((v) => v.delay?.onTime).length
  const onTimeRate = withDelay.length === 0 ? null : onTime / withDelay.length
  return {
    total: visits.length,
    installations: counts.Installation,
    maintenancePlusAmc: counts.Maintenance + counts.AMC,
    inspections: counts.Inspection,
    deliveries: counts.Delivery,
    onTimeRate,
  }
}

function previousMonthKey(monthKey: string): string {
  const [yStr, mStr] = monthKey.split('-')
  let year = Number(yStr)
  let month0 = Number(mStr) - 2 // current 0-indexed (-1) minus 1 = previous 0-indexed
  if (month0 < 0) {
    month0 = 11
    year -= 1
  }
  return `${year}-${String(month0 + 1).padStart(2, '0')}`
}

export function summarisePerMonth(
  metas: MonthlyTabMeta[],
  visits: OpsVisit[],
): MonthlySummary[] {
  const byKey = new Map<string, OpsVisit[]>()
  for (const v of visits) {
    const list = byKey.get(v.monthKey)
    if (list) list.push(v)
    else byKey.set(v.monthKey, [v])
  }
  return metas.map((meta) => {
    const monthVisits = byKey.get(meta.monthKey) ?? []
    return {
      meta,
      visits: monthVisits,
      visitTypeCounts: countByVisitType(monthVisits),
      projectTypeCounts: countByProjectType(monthVisits),
      total: monthVisits.length,
    }
  })
}

export function currentAndPreviousMonth(
  metas: MonthlyTabMeta[],
): { current: MonthlyTabMeta | null; previous: MonthlyTabMeta | null } {
  if (metas.length === 0) return { current: null, previous: null }
  // metas already sorted newest-first
  const current = metas[0]
  const prevKey = previousMonthKey(current.monthKey)
  const previous = metas.find((m) => m.monthKey === prevKey) ?? metas[1] ?? null
  return { current, previous }
}

export function visitsForMonth(visits: OpsVisit[], monthKey: string): OpsVisit[] {
  return visits.filter((v) => v.monthKey === monthKey)
}

function inLastNMonths(visit: OpsVisit, anchor: Date, months: number): boolean {
  if (!visit.deliveryDateIso) {
    // Fall back to monthKey when the row date isn't parseable.
    const [yStr, mStr] = visit.monthKey.split('-')
    const anchorYM = anchor.getUTCFullYear() * 12 + anchor.getUTCMonth()
    const visitYM = Number(yStr) * 12 + (Number(mStr) - 1)
    return anchorYM - visitYM < months && anchorYM - visitYM >= 0
  }
  const d = new Date(visit.deliveryDateIso + 'T00:00:00Z')
  const ms = anchor.getTime() - d.getTime()
  if (ms < 0) return false
  const days = ms / (1000 * 60 * 60 * 24)
  return days < months * 31
}

export function applyWindow(
  visits: OpsVisit[],
  window: Window,
  anchor: Date = new Date(),
): OpsVisit[] {
  if (window === 'allTime') return visits
  if (window === 'thisMonth') {
    const key = `${anchor.getUTCFullYear()}-${String(anchor.getUTCMonth() + 1).padStart(2, '0')}`
    return visits.filter((v) => v.monthKey === key)
  }
  if (window === 'thisYear') {
    const yr = String(anchor.getUTCFullYear())
    return visits.filter((v) => v.monthKey.startsWith(yr))
  }
  // last3 → trailing 3 months
  return visits.filter((v) => inLastNMonths(v, anchor, 3))
}

export const VISIT_TYPE_ORDER: readonly VisitType[] = VISIT_TYPES
export const PROJECT_TYPE_ORDER: readonly ProjectType[] = PROJECT_TYPES
