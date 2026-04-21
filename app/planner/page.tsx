import { Header } from '@/components/shell/Header'
import { SetupNotice } from '@/components/shell/SetupNotice'
import { SectionHeader } from '@/components/analytics/SectionHeader'
import { WeekTable } from '@/components/planner/WeekTable'
import { getContentCalendar } from '@/lib/sheets/adapters'

export const dynamic = 'force-dynamic'

export default async function PlannerPage() {
  const calendar = await getContentCalendar()
  const configured = calendar.configured
  const doneCount = calendar.data.filter((r) => r.done).length

  return (
    <>
      <Header fetchedAt={calendar.fetchedAt} configured={configured} />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-10 px-6 py-10">
        {!configured && <SetupNotice />}

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Content Calendar"
            title="Week ahead"
            subtitle={
              calendar.data.length
                ? `${doneCount} of ${calendar.data.length} planned posts marked done.`
                : 'Plan and track what is scheduled. Edits land in the Content Calendar tab.'
            }
          />
          <WeekTable rows={calendar.data} />
        </section>
      </main>
    </>
  )
}
