'use server'

import { bustAllSheets } from '@/lib/sheets/cache'

export async function refreshSheets(): Promise<{ ok: true; at: string }> {
  bustAllSheets()
  return { ok: true, at: new Date().toISOString() }
}
