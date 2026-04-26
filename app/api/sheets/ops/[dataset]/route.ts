import { NextResponse } from 'next/server'
import {
  getAllVisits,
  getMonthlyTabs,
  getMonthlyVisits,
} from '@/lib/sheets/ops-adapters'
import { computeKpis, currentAndPreviousMonth, visitsForMonth } from '@/lib/ops/metrics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ dataset: string }> }

export async function GET(req: Request, { params }: Params) {
  const { dataset } = await params
  try {
    switch (dataset) {
      case 'months': {
        const metas = await getMonthlyTabs()
        return NextResponse.json({ months: metas })
      }
      case 'all': {
        const data = await getAllVisits()
        return NextResponse.json(data)
      }
      case 'kpis': {
        const url = new URL(req.url)
        const monthKey = url.searchParams.get('month')
        const { metas, visits } = await getAllVisits()
        if (monthKey) {
          const visitsForKey = visitsForMonth(visits, monthKey)
          return NextResponse.json({
            month: monthKey,
            kpis: computeKpis(visitsForKey),
          })
        }
        const { current, previous } = currentAndPreviousMonth(metas)
        return NextResponse.json({
          current: current
            ? { meta: current, kpis: computeKpis(visitsForMonth(visits, current.monthKey)) }
            : null,
          previous: previous
            ? { meta: previous, kpis: computeKpis(visitsForMonth(visits, previous.monthKey)) }
            : null,
        })
      }
      case 'monthly': {
        const url = new URL(req.url)
        const monthKey = url.searchParams.get('month')
        if (!monthKey) {
          return NextResponse.json({ error: 'month query param required' }, { status: 400 })
        }
        const visits = await getMonthlyVisits(monthKey)
        return NextResponse.json({ month: monthKey, visits })
      }
      default:
        return NextResponse.json({ error: `Unknown ops dataset: ${dataset}` }, { status: 404 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
