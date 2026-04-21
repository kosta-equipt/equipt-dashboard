import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { HistoryPost } from '@/types/sheets'
import { formatNumber } from '@/lib/format'

type HistoryTableProps = {
  posts: HistoryPost[]
}

export function HistoryTable({ posts }: HistoryTableProps) {
  if (!posts.length) return null

  return (
    <div className="border-t border-line/60 dark:border-line-dark/60">
      <table className="w-full text-left text-xs">
        <thead className="bg-linen/40 text-[10px] uppercase tracking-wider2 text-muted dark:bg-ink-dark/30 dark:text-muted-dark">
          <tr>
            <th className="w-20 px-4 py-2 font-medium">Date</th>
            <th className="w-24 px-4 py-2 font-medium">Platform</th>
            <th className="px-4 py-2 font-medium">Topic</th>
            <th className="w-20 px-4 py-2 text-right font-medium">Reach</th>
            <th className="w-20 px-4 py-2 text-right font-medium">Eng.</th>
            <th className="w-10 px-4 py-2 text-right font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/50 dark:divide-line-dark/50">
          {posts.map((p, i) => (
            <tr key={`${p.dateIso}-${i}`} className="hover:bg-linen/30 dark:hover:bg-ink-dark/20">
              <td className="whitespace-nowrap px-4 py-2 text-muted dark:text-muted-dark">{p.date}</td>
              <td className="px-4 py-2">
                {p.platform ? (
                  <span className="inline-flex rounded-full border border-line/70 bg-white px-2 py-0.5 text-[10px] font-medium text-ink dark:border-line-dark/70 dark:bg-ink-dark dark:text-linen">
                    {p.platform}
                  </span>
                ) : (
                  <span className="text-muted dark:text-muted-dark">—</span>
                )}
              </td>
              <td className="px-4 py-2 text-ink dark:text-linen">
                <div className="line-clamp-1">
                  {p.topic || <span className="text-muted dark:text-muted-dark">(empty)</span>}
                </div>
              </td>
              <td className="px-4 py-2 text-right font-mono text-ink dark:text-linen">
                {formatNumber(p.reach)}
              </td>
              <td className="px-4 py-2 text-right font-mono text-ink dark:text-linen">
                {formatNumber(p.engagement)}
              </td>
              <td className="px-4 py-2 text-right">
                {p.link ? (
                  <Link
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex text-muted hover:text-midnight dark:text-muted-dark dark:hover:text-gold"
                    aria-label="Open post"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
