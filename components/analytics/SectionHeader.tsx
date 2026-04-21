type SectionHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string
}

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      {eyebrow && (
        <p className="text-[11px] font-medium uppercase tracking-wider2 text-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-2xl font-semibold tracking-tightest text-midnight dark:text-linen">
        {title}
      </h2>
      {subtitle && <p className="text-sm text-muted dark:text-muted-dark">{subtitle}</p>}
    </div>
  )
}
