import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BarChart3,
} from 'lucide-react'
import { Header } from '@/components/shell/Header'
import { SetupNotice } from '@/components/shell/SetupNotice'
import { KpiCard } from '@/components/analytics/KpiCard'
import { SectionHeader } from '@/components/analytics/SectionHeader'
import { TrendChart } from '@/components/analytics/TrendChart'
import { Greeting } from '@/components/analytics/Greeting'
import { QuickActions } from '@/components/analytics/QuickActions'
import { TopPostCard } from '@/components/analytics/TopPostCard'
import { getCommandCentre, getPerformance } from '@/lib/sheets/adapters'
import { getWeekInsights } from '@/lib/sheets/insights'
import { getDohaWeather } from '@/lib/weather'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const [kpis, perf, insights, weather] = await Promise.all([
    getCommandCentre(),
    getPerformance(),
    getWeekInsights(),
    getDohaWeather(),
  ])
  const configured = kpis.configured && perf.configured
  const fetchedAt = kpis.fetchedAt
  const { thisWeek } = insights

  return (
    <>
      <Header fetchedAt={fetchedAt} configured={configured} />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-10 px-6 py-10">
        {!configured && <SetupNotice />}

        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Greeting name="Kosta" weather={weather} />
          <QuickActions />
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Command Centre"
            title="Today at a glance"
            subtitle="All-time totals, with a 7-day delta pulled from the Performance tab."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <KpiCard
              label="Total Posts"
              value={kpis.data.totalPosts}
              icon={<BarChart3 className="h-4 w-4" />}
              deltaValue={thisWeek.posts}
              deltaLabel="this week"
            />
            <KpiCard
              label="Total Reach"
              value={kpis.data.totalReach}
              icon={<Eye className="h-4 w-4" />}
              deltaValue={thisWeek.reach}
              deltaLabel="this week"
            />
            <KpiCard
              label="Total Likes"
              value={kpis.data.totalLikes}
              icon={<Heart className="h-4 w-4" />}
              deltaValue={thisWeek.likes}
              deltaLabel="this week"
            />
            <KpiCard
              label="Avg Engagement"
              value={kpis.data.avgEngagement}
              format="percent"
              icon={<MessageCircle className="h-4 w-4" />}
              deltaValue={thisWeek.engagement}
              deltaLabel="this week"
            />
            <KpiCard
              label="Total Shares"
              value={kpis.data.totalShares}
              icon={<Share2 className="h-4 w-4" />}
              deltaValue={thisWeek.shares}
              deltaLabel="this week"
            />
            <KpiCard
              label="Total Saves"
              value={kpis.data.totalSaves}
              icon={<Bookmark className="h-4 w-4" />}
              deltaValue={thisWeek.saves}
              deltaLabel="this week"
            />
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Spotlight"
            title="What's working"
            subtitle="Your best-performing post from the last seven days."
          />
          <TopPostCard post={insights.topPost} />
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

