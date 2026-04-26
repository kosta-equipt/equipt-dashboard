import {
  Activity,
  CalendarCheck,
  ClipboardCheck,
  Truck,
  Wrench,
  Gauge,
} from 'lucide-react'
import { KpiCard } from '@/components/analytics/KpiCard'
import type { KpiSet, MonthlyTabMeta } from '@/types/ops'

type Props = {
  current: KpiSet
  previous: KpiSet | null
  currentMeta: MonthlyTabMeta | null
  previousMeta: MonthlyTabMeta | null
}

function shortMonth(meta: MonthlyTabMeta | null): string {
  if (!meta) return ''
  return new Date(Date.UTC(meta.year, meta.monthIndex, 1))
    .toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })
}

function delta(curr: number, prev: number | undefined | null): number | undefined {
  if (prev === undefined || prev === null) return undefined
  return curr - prev
}

export function KpiStrip({ current, previous, currentMeta, previousMeta }: Props) {
  const prevLabel = previousMeta ? `vs ${shortMonth(previousMeta)}` : undefined
  const currLabel = currentMeta ? currentMeta.monthLabel : 'this month'

  return (
    <section className="space-y-3">
      <header className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold text-midnight dark:text-linen">
          {currLabel} at a glance
        </h2>
      </header>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Total visits"
          value={current.total}
          icon={<Activity className="h-4 w-4" aria-hidden />}
          deltaValue={delta(current.total, previous?.total)}
          deltaUnit="abs"
          deltaLabel={prevLabel}
        />
        <KpiCard
          label="Installations"
          value={current.installations}
          icon={<Wrench className="h-4 w-4" aria-hidden />}
          deltaValue={delta(current.installations, previous?.installations)}
          deltaUnit="abs"
          deltaLabel={prevLabel}
        />
        <KpiCard
          label="Maintenance + AMC"
          value={current.maintenancePlusAmc}
          icon={<CalendarCheck className="h-4 w-4" aria-hidden />}
          deltaValue={delta(current.maintenancePlusAmc, previous?.maintenancePlusAmc)}
          deltaUnit="abs"
          deltaLabel={prevLabel}
        />
        <KpiCard
          label="Inspections"
          value={current.inspections}
          icon={<ClipboardCheck className="h-4 w-4" aria-hidden />}
          deltaValue={delta(current.inspections, previous?.inspections)}
          deltaUnit="abs"
          deltaLabel={prevLabel}
        />
        <KpiCard
          label="Deliveries"
          value={current.deliveries}
          icon={<Truck className="h-4 w-4" aria-hidden />}
          deltaValue={delta(current.deliveries, previous?.deliveries)}
          deltaUnit="abs"
          deltaLabel={prevLabel}
        />
        <KpiCard
          label="On-time rate"
          value={current.onTimeRate === null ? null : current.onTimeRate * 100}
          format="percent"
          icon={<Gauge className="h-4 w-4" aria-hidden />}
          deltaValue={
            current.onTimeRate !== null && previous?.onTimeRate !== null && previous?.onTimeRate !== undefined
              ? Math.round((current.onTimeRate - previous.onTimeRate) * 100)
              : undefined
          }
          deltaUnit="pct"
          deltaLabel={prevLabel}
          hint={current.onTimeRate === null ? 'No delay data this month' : undefined}
        />
      </div>
    </section>
  )
}
