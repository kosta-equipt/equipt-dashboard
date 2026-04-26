import type { DelayInfo, ProjectType, VisitType } from '@/types/ops'
import { VISIT_TYPES, PROJECT_TYPES } from '@/types/ops'

const VISIT_TYPE_ALIASES: Record<string, VisitType> = {
  installation: 'Installation',
  installations: 'Installation',
  install: 'Installation',
  maintenance: 'Maintenance',
  inspection: 'Inspection',
  inspections: 'Inspection',
  delivery: 'Delivery',
  deliveries: 'Delivery',
  amc: 'AMC',
  'side task': 'Side Task',
  sidetask: 'Side Task',
  wh: 'WH',
  warehouse: 'WH',
}

const PROJECT_TYPE_ALIASES: Record<string, ProjectType> = {
  'home gym': 'Home Gym',
  'residential gym': 'Residential Gym',
  'commercial gym': 'Commercial Gym',
  'commerical gym': 'Commercial Gym', // explicit fix for known sheet typo
  'studio gym': 'Studio Gym',
  'corporate gym': 'Corporate Gym',
  'rehabilitation studio': 'Rehabilitation Studio',
  'rehab studio': 'Rehabilitation Studio',
  'internal task': 'Internal Task',
  internal: 'Internal Task',
}

function canonicalKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function normaliseVisitType(raw: string | null | undefined): VisitType | null {
  if (!raw) return null
  const key = canonicalKey(raw)
  if (!key) return null
  if (VISIT_TYPE_ALIASES[key]) return VISIT_TYPE_ALIASES[key]
  // Fall back to title-cased exact match against the canonical list.
  const candidate = (VISIT_TYPES as readonly string[]).find(
    (v) => v.toLowerCase() === key,
  )
  return (candidate as VisitType | undefined) ?? null
}

export function normaliseProjectType(
  raw: string | null | undefined,
): ProjectType | null {
  if (!raw) return null
  const key = canonicalKey(raw)
  if (!key) return null
  if (PROJECT_TYPE_ALIASES[key]) return PROJECT_TYPE_ALIASES[key]
  const candidate = (PROJECT_TYPES as readonly string[]).find(
    (p) => p.toLowerCase() === key,
  )
  return (candidate as ProjectType | undefined) ?? null
}

const DURATION_RE = /(\d+)\s*(h|hr|hrs|hour|hours)?\s*(\d+)?\s*(m|min|mins|minute|minutes)?/i
const NUMERIC_MIN_RE = /^(\d+)\s*(m|min|mins|minutes?)$/i

function parseDelayMinutes(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  // "30m", "45 min"
  const numericMatch = trimmed.match(NUMERIC_MIN_RE)
  if (numericMatch) return Number(numericMatch[1])

  // "1h 15m", "2h"
  const m = trimmed.match(DURATION_RE)
  if (m && (m[1] || m[3])) {
    const hours = m[2] ? Number(m[1]) : 0
    const mins = m[2]
      ? m[3]
        ? Number(m[3])
        : 0
      : Number(m[1])
    if (Number.isFinite(hours) && Number.isFinite(mins)) {
      return hours * 60 + mins
    }
  }

  return null
}

export function parseDelay(raw: string | null | undefined): DelayInfo | null {
  if (raw === null || raw === undefined) return null
  const trimmed = String(raw).trim()
  if (!trimmed) return null
  const lower = trimmed.toLowerCase()
  const onTime = lower.startsWith('on time')
  const minutes = onTime ? 0 : parseDelayMinutes(trimmed)
  return { raw: trimmed, onTime, minutes }
}
