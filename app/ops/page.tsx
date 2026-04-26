import { Header } from '@/components/shell/Header'
import { SetupNotice } from '@/components/shell/SetupNotice'
import { Hero } from '@/components/ops/Hero'
import { KpiStrip } from '@/components/ops/KpiStrip'
import { MonthAccordion } from '@/components/ops/MonthAccordion'
import { Visualise } from '@/components/ops/Visualise'
import { DashboardShell } from '@/components/ops/DashboardShell'
import { isSheetsConfigured } from '@/lib/sheets/client'
import { getAllVisits } from '@/lib/sheets/ops-adapters'
import { getDohaWeather } from '@/lib/weather'
import {
  computeKpis,
  currentAndPreviousMonth,
  summarisePerMonth,
  visitsForMonth,
} from '@/lib/ops/metrics'
import type { KpiSet } from '@/types/ops'

export const dynamic = 'force-dynamic'

const EMPTY_KPIS: KpiSet = {
  total: 0,
  installations: 0,
  maintenancePlusAmc: 0,
  inspections: 0,
  deliveries: 0,
  onTimeRate: null,
}

export default async function OpsPage() {
  const configured = isSheetsConfigured('ops')

  if (!configured) {
    return (
      <>
        <Header fetchedAt={null} configured={false} />
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-10">
          <Hero weather={await getDohaWeather()} />
          <SetupNotice missingVar="OPS_SHEET_ID" />
        </main>
      </>
    )
  }

  const [{ metas, visits, fetchedAt }, weather] = await Promise.all([
    getAllVisits(),
    getDohaWeather(),
  ])

  const summaries = summarisePerMonth(metas, visits)
  const { current, previous } = currentAndPreviousMonth(metas)

  const currentVisits = current ? visitsForMonth(visits, current.monthKey) : []
  const previousVisits = previous ? visitsForMonth(visits, previous.monthKey) : []
  const currentKpis = current ? computeKpis(currentVisits) : EMPTY_KPIS
  const previousKpis = previous ? computeKpis(previousVisits) : null

  return (
    <>
      <Header fetchedAt={fetchedAt} configured={true} />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-10 px-6 py-10">
        <Hero weather={weather} />
        <DashboardShell visits={visits}>
          <div className="space-y-10">
            <KpiStrip
              current={currentKpis}
              previous={previousKpis}
              currentMeta={current}
              previousMeta={previous}
            />
            <Visualise visits={visits} />
            <MonthAccordion summaries={summaries} />
          </div>
        </DashboardShell>
      </main>
    </>
  )
}
