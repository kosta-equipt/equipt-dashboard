import type { PlannerRow } from '@/types/sheets'
import { Check, Circle } from 'lucide-react'

type WeekTableProps = {
  rows: PlannerRow[]
}

export function WeekTable({ rows }: WeekTableProps) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center text-sm text-muted shadow-card">
        No rows found in the Content Calendar tab yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-linen/60 text-[11px] uppercase tracking-wider2 text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Day</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Platform</th>
            <th className="px-4 py-3 font-medium">Topic</th>
            <th className="w-20 px-4 py-3 text-right font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {rows.map((row, i) => (
            <tr key={`${row.day}-${row.date}-${i}`} className="hover:bg-linen/40">
              <td className="px-4 py-3 font-medium text-midnight">
                {row.day || '—'}
              </td>
              <td className="px-4 py-3 text-muted">{row.date || '—'}</td>
              <td className="px-4 py-3">
                {row.platform ? (
                  <span className="inline-flex rounded-full border border-line bg-linen/60 px-2.5 py-0.5 text-[11px] font-medium text-ink">
                    {row.platform}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-ink">
                <div className="line-clamp-2">
                  {row.topic || <span className="text-muted">(empty)</span>}
                </div>
                {row.notes && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                    {row.notes}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {row.done ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-midnight">
                    <Check className="h-3.5 w-3.5 text-gold" aria-hidden />
                    Done
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Circle className="h-3 w-3" aria-hidden />
                    Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
