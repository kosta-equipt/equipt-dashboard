import { Eye, Heart, MessageCircle, Share2, Bookmark, BarChart3 } from 'lucide-react'
import { Header } from '@/components/shell/Header'
import { SetupNotice } from '@/components/shell/SetupNotice'
import { KpiCard } from '@/components/analytics/KpiCard'
import { SectionHeader } from '@/components/analytics/SectionHeader'
import { TrendChart } from '@/components/analytics/TrendChart'
import { getCommandCentre, getPerformance } from '@/lib/sheets/adapters'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const [kpis, perf] = await Promise.all([getCommandCentre(), getPerformance()])
  const configured = kpis.configured && perf.configured
  const fetchedAt = kpis.fetchedAt

  return (
    <>
      <Header fetchedAt={fetchedAt} configured={configured} />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-10 px-6 py-10">
        {!configured && <SetupNotice />}

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Command Centre"
            title="Today at a glance"
            subtitle="Top-line social performance totals, pulled straight from the tracker."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <KpiCard
              label="Total Posts"
              value={kpis.data.totalPosts}
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <KpiCard
              label="Total Reach"
              value={kpis.data.totalReach}
              icon={<Eye className="h-4 w-4" />}
            />
            <KpiCard
              label="Total Likes"
              value={kpis.data.totalLikes}
              icon={<Heart className="h-4 w-4" />}
            />
            <KpiCard
              label="Avg Engagement"
              value={kpis.data.avgEngagement}
              format="percent"
              icon={<MessageCircle className="h-4 w-4" />}
            />
            <KpiCard
              label="Total Shares"
              value={kpis.data.totalShares}
              icon={<Share2 className="h-4 w-4" />}
            />
            <KpiCard
              label="Total Saves"
              value={kpis.data.totalSaves}
              icon={<Bookmark className="h-4 w-4" />}
            />
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Performance"
            title="Trends over time"
            subtitle="Rolling view of reach and engagement. Add rows to the Performance tab to extend the series."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <TrendChart
              title="Reach"
              data={perf.data}
              dataKey="reach"
              colour="#14304D"
            />
            <TrendChart
              title="Engagement"
              data={perf.data}
              dataKey="engagement"
              colour="#D4A745"
            />
          </div>
        </section>
      </main>
    </>
  )
}
