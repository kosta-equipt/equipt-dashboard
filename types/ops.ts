export const VISIT_TYPES = [
  'Installation',
  'Maintenance',
  'Inspection',
  'Delivery',
  'AMC',
  'Side Task',
  'WH',
] as const

export type VisitType = (typeof VISIT_TYPES)[number]

export const PROJECT_TYPES = [
  'Home Gym',
  'Residential Gym',
  'Commercial Gym',
  'Studio Gym',
  'Corporate Gym',
  'Rehabilitation Studio',
  'Internal Task',
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]

export type DelayInfo = {
  raw: string
  onTime: boolean
  minutes: number | null
}

export type OpsVisit = {
  monthKey: string // "2026-04"
  monthLabel: string // "April 2026"
  tabTitle: string // original tab name from sheet
  project: string | null
  invoiceRef: string | null
  deliveryDateIso: string | null // YYYY-MM-DD when parseable
  deliveryDateRaw: string | null
  scheduledTime: string | null
  arrivalTime: string | null
  delay: DelayInfo | null
  timeOut: string | null
  totalHrs: string | null
  notes: string | null
  visitType: VisitType | null
  projectType: ProjectType | null
}

export type KpiSet = {
  total: number
  installations: number
  maintenancePlusAmc: number
  inspections: number
  deliveries: number
  onTimeRate: number | null // 0..1, null if no rows have a Delay value
}

export type MonthlyTabMeta = {
  title: string // original sheet tab title
  year: number
  monthIndex: number // 0..11
  monthKey: string // "2026-04"
  monthLabel: string // "April 2026"
}

export type MonthlySummary = {
  meta: MonthlyTabMeta
  visits: OpsVisit[]
  visitTypeCounts: Record<VisitType, number>
  projectTypeCounts: Record<ProjectType, number>
  total: number
}

export type Window = 'thisMonth' | 'last3' | 'thisYear' | 'allTime'
