import 'server-only'
import { unstable_cache, revalidateTag } from 'next/cache'
import { listSheetTitles, readRange, type SheetKind } from './client'

export const CACHE_TAG_ALL = 'equipt-sheet'
const REVALIDATE_SECONDS = 300 // 5 minutes

export type CachedRead = {
  rows: string[][]
  fetchedAt: string
}

export function cachedRange(
  keyParts: string[],
  range: string,
  kind: SheetKind = 'marketing',
) {
  const fn = unstable_cache(
    async (): Promise<CachedRead> => {
      const rows = await readRange(range, kind)
      return { rows, fetchedAt: new Date().toISOString() }
    },
    ['equipt-sheet', kind, ...keyParts],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: [CACHE_TAG_ALL],
    },
  )
  return fn()
}

export function cachedTitles(kind: SheetKind = 'marketing') {
  const fn = unstable_cache(
    async (): Promise<{ titles: string[]; fetchedAt: string }> => {
      const titles = await listSheetTitles(kind)
      return { titles, fetchedAt: new Date().toISOString() }
    },
    ['equipt-sheet', kind, 'titles'],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG_ALL] },
  )
  return fn()
}

export function bustAllSheets() {
  revalidateTag(CACHE_TAG_ALL, { expire: 0 })
}
