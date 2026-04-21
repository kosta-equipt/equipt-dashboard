import { NextResponse } from 'next/server'
import { bustAllSheets } from '@/lib/sheets/cache'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  bustAllSheets()
  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
