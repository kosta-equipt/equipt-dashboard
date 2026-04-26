'use client'

import { useState, type ReactNode } from 'react'
import { SearchPanel } from './SearchPanel'
import type { OpsVisit } from '@/types/ops'

type Props = {
  visits: OpsVisit[]
  children: ReactNode
}

export function DashboardShell({ visits, children }: Props) {
  const [searchActive, setSearchActive] = useState(false)

  return (
    <>
      <SearchPanel visits={visits} onActiveChange={setSearchActive} />
      <div
        className={
          searchActive
            ? 'pointer-events-none select-none opacity-60 transition-opacity duration-200'
            : 'transition-opacity duration-200'
        }
        aria-hidden={searchActive}
      >
        {children}
      </div>
    </>
  )
}
