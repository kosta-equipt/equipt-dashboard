import { Header } from '@/components/shell/Header'
import { SetupNotice } from '@/components/shell/SetupNotice'
import { SectionHeader } from '@/components/analytics/SectionHeader'
import { WeekTable } from '@/components/planner/WeekTable'
import { HistorySection } from '@/components/planner/HistorySection'
import { getContentCalendar, getHistory } from '@/lib/sheets/adapters'

export const dynamic = 'force-dynamic'

export default async function PlannerPage() {
  const [calendar, history] = await Promise.all([
    getContentCalendar(),
    getHistory(),
  ])
  const configured = calendar.configured && history.configured

  return (
    <>
      <Header fetchedAt={calendar.fetchedAt} configured={configured} />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-6 py-10">
        {!configured && <SetupNotice />}

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Content Calendar"
            title="Week ahead"
            subtitle={
              calendar.data.length
                ? `${calendar.data.length} post${calendar.data.length === 1 ? '' : 's'} coming up, nearest first.`
                : 'Future-dated rows in the Content Calendar tab will appear here.'
            }
          />
          <WeekTable rows={calendar.data} />
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider2 text-muted">
              History
            </h2>
            <span className="text-xs text-muted">
              {history.data.length} post{history.data.length === 1 ? '' : 's'} on record
            </span>
          </div>
          <HistorySection posts={history.data} />
        </section>
      </main>
    </>
  )
}
