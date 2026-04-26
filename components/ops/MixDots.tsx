import type { VisitType } from '@/types/ops'
import { VISIT_TYPE_COLOUR } from '@/lib/ops/palette'

type Props = {
  counts: Record<VisitType, number>
  total: number
  size?: number
}

const ORDER: readonly VisitType[] = [
  'Installation',
  'Maintenance',
  'Inspection',
  'Delivery',
  'AMC',
  'Side Task',
  'WH',
]

const TARGET_DOTS = 6

export function MixDots({ counts, total, size = 6 }: Props) {
  if (total === 0) {
    return (
      <span
        aria-hidden
        className="inline-flex h-2 items-center text-[10px] text-muted dark:text-muted-dark"
      >
        —
      </span>
    )
  }

  // Allocate up to TARGET_DOTS dots proportionally to each visit type's share.
  const allocations: { type: VisitType; dots: number }[] = []
  let remainder = TARGET_DOTS
  for (const t of ORDER) {
    if (counts[t] === 0) continue
    const share = counts[t] / total
    const dots = Math.max(1, Math.round(share * TARGET_DOTS))
    allocations.push({ type: t, dots })
    remainder -= dots
  }
  // If we over-allocated, trim from the smallest tail-first.
  while (remainder < 0 && allocations.length > 0) {
    allocations.sort((a, b) => a.dots - b.dots)
    allocations[0].dots -= 1
    if (allocations[0].dots <= 0) allocations.shift()
    remainder += 1
  }

  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      {allocations.flatMap(({ type, dots }) =>
        Array.from({ length: dots }, (_, i) => (
          <span
            key={`${type}-${i}`}
            className="inline-block rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: VISIT_TYPE_COLOUR[type],
            }}
          />
        )),
      )}
    </span>
  )
}
