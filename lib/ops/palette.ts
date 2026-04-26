import type { ProjectType, VisitType } from '@/types/ops'

// Brand-compliant chart palette: navy gradient with a single Amber Gold accent.
// Order matters — most-prominent / first-shown series gets Midnight Navy,
// the accent index gets Gold.
const NAVY_SCALE: readonly string[] = [
  '#14304D', // Midnight Navy (primary)
  '#2A5788', // Midnight Soft
  '#4A7AB8', // Lighter blue
  '#7AA3D1', // Mid blue
  '#A8C2DD', // Pale blue
  '#3D3D45', // Ink soft (neutral)
  '#D4A745', // Amber Gold (accent — last in order, kept at <=10% of palette)
] as const

export function chartColours(count: number): string[] {
  if (count <= 0) return []
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    out.push(NAVY_SCALE[i] ?? NAVY_SCALE[NAVY_SCALE.length - 1])
  }
  return out
}

export const VISIT_TYPE_COLOUR: Record<VisitType, string> = {
  Installation: '#14304D',
  Maintenance: '#2A5788',
  Inspection: '#4A7AB8',
  Delivery: '#7AA3D1',
  AMC: '#D4A745', // gold accent — most strategically important visit type
  'Side Task': '#A8C2DD',
  WH: '#3D3D45',
}

export const PROJECT_TYPE_COLOUR: Record<ProjectType, string> = {
  'Commercial Gym': '#14304D',
  'Home Gym': '#2A5788',
  'Residential Gym': '#4A7AB8',
  'Studio Gym': '#7AA3D1',
  'Corporate Gym': '#A8C2DD',
  'Rehabilitation Studio': '#3D3D45',
  'Internal Task': '#D4A745', // gold accent
}
