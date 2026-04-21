import type { PlannerRow } from '@/types/sheets'

type WeekTableProps = {
  rows: PlannerRow[]
}

export function WeekTable({ rows }: WeekTableProps) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center text-sm text-muted shadow-card dark:border-line-dark dark:bg-linen-dark dark:text-muted-dark">
        Nothing scheduled yet. Add future-dated rows in the Content Calendar tab.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card dark:border-line-dark dark:bg-linen-dark">
      <table className="w-full text-left text-sm">
        <thead className="bg-linen/60 text-[11px] uppercase tracking-wider2 text-muted dark:bg-ink-dark/40 dark:text-muted-dark">
          <tr>
            <th className="w-20 px-4 py-3 font-medium">Day</th>
            <th className="w-28 px-4 py-3 font-medium">Date</th>
            <th className="w-32 px-4 py-3 font-medium">Platform</th>
            <th className="px-4 py-3 font-medium">Topic</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70 dark:divide-line-dark/70">
          {rows.map((row, i) => (
            <tr key={`${row.day}-${row.date}-${i}`} className="hover:bg-linen/40 dark:hover:bg-ink-dark/30">
              <td className="px-4 py-3 font-medium text-midnight dark:text-linen">
                {row.day || '—'}
              </td>
              <td className="px-4 py-3 text-muted dark:text-muted-dark">{row.date || '—'}</td>
              <td className="px-4 py-3">
                {row.platform ? (
                  <span className="inline-flex rounded-full border border-line bg-linen/60 px-2.5 py-0.5 text-[11px] font-medium text-ink dark:border-line-dark dark:bg-ink-dark/60 dark:text-linen">
                    {row.platform}
                  </span>
                ) : (
                  <span className="text-muted dark:text-muted-dark">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-ink dark:text-linen">
                <div className="line-clamp-2">
                  {row.topic || <span className="text-muted dark:text-muted-dark">(empty)</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
