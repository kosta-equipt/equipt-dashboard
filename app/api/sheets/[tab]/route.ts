import { NextResponse } from 'next/server'
import {
  getCommandCentre,
  getContentCalendar,
  getPerformance,
} from '@/lib/sheets/adapters'

export const runtime = 'nodejs'

type Params = { params: Promise<{ tab: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { tab } = await params
  try {
    switch (tab) {
      case 'command-centre':
        return NextResponse.json(await getCommandCentre())
      case 'performance':
        return NextResponse.json(await getPerformance())
      case 'content-calendar':
        return NextResponse.json(await getContentCalendar())
      default:
        return NextResponse.json({ error: `Unknown tab: ${tab}` }, { status: 404 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
