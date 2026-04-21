import Link from 'next/link'
import {
  ExternalLink,
  FileSpreadsheet,
  FolderOpen,
  Instagram,
  type LucideIcon,
  Users,
} from 'lucide-react'

type QuickAction = {
  label: string
  href: string
  Icon: LucideIcon
}

const ACTIONS: QuickAction[] = [
  {
    label: 'Tracker Sheet',
    href: 'https://docs.google.com/spreadsheets/d/1CY3LNWcjwbqignXrGKZ0m-gVWh9wU0PEuQO_ZBO91Vw/edit',
    Icon: FileSpreadsheet,
  },
  {
    label: 'Drive',
    href: 'https://drive.google.com/drive/u/0/my-drive',
    Icon: FolderOpen,
  },
  {
    label: 'Odoo CRM',
    href: 'https://ivanjkruger-equipt-odoo.odoo.com/odoo',
    Icon: Users,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/equipt.gcc/',
    Icon: Instagram,
  },
]

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map(({ label, href, Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink shadow-card transition hover:border-gold hover:text-midnight dark:border-line-dark dark:bg-linen-dark dark:text-linen dark:hover:border-gold dark:hover:text-gold"
        >
          <Icon className="h-3.5 w-3.5 text-muted transition group-hover:text-gold dark:text-muted-dark" aria-hidden />
          {label}
          <ExternalLink className="h-3 w-3 text-muted/60 transition group-hover:text-muted dark:text-muted-dark/60" aria-hidden />
        </Link>
      ))}
    </div>
  )
}
