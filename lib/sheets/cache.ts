import 'server-only'
import { unstable_cache, revalidateTag } from 'next/cache'
import { readRange } from './client'

export const CACHE_TAG_ALL = 'equipt-sheet'
const REVALIDATE_SECONDS = 300 // 5 minutes

export type CachedRead = {
  rows: string[][]
  fetchedAt: string
}

export function cachedRange(keyParts: string[], range: string) {
  const fn = unstable_cache(
    async (): Promise<CachedRead> => {
      const rows = await readRange(range)
      return { rows, fetchedAt: new Date().toISOString() }
    },
    ['equipt-sheet', ...keyParts],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: [CACHE_TAG_ALL],
    },
  )
  return fn()
}

export function bustAllSheets() {
  revalidateTag(CACHE_TAG_ALL, { expire: 0 })
}
