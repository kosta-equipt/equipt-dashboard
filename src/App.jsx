// ─────────────────────────────────────────────────────────────
// App.jsx — Equipt Marketing Ops Dashboard
// Main state: statuses, active tab, filters, report panel
// Storage key: equipt_statuses_v2 — never change this
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import { TABS, TASKS_BY_TAB, ALL_TASKS, driveLinks } from './data/tasks.js'
import Header from './components/Header.jsx'
import TabBar from './components/TabBar.jsx'
import FilterBar from './components/FilterBar.jsx'
import TaskCard from './components/TaskCard.jsx'
import DriveCard from './components/DriveCard.jsx'
import ReportPanel from './components/ReportPanel.jsx'
import Footer from './components/Footer.jsx'

const STORAGE_KEY = 'equipt_statuses_v2'

// ─── Load initial statuses from localStorage ──────────────────
function loadStatuses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// ─── Build a formatted text report grouped by status ──────────
function buildReport(statuses) {
  const groups = { inprogress: [], todo: [], done: [] }

  for (const task of ALL_TASKS) {
    const s = statuses[task.id] || 'todo'
    groups[s].push(task)
  }

  const lines = [
    '═══════════════════════════════════════',
    '  EQUIPT — Marketing Ops Status Report',
    `  Generated: ${new Date().toLocaleString('en-GB')}`,
    '═══════════════════════════════════════',
    '',
  ]

  const sections = [
    { key: 'inprogress', heading: '▸ IN PROGRESS' },
    { key: 'todo',       heading: '▸ TO DO' },
    { key: 'done',       heading: '▸ DONE' },
  ]

  for (const { key, heading } of sections) {
    const tasks = groups[key]
    if (tasks.length === 0) continue
    lines.push(heading)
    lines.push('─'.repeat(39))
    for (const t of tasks) {
      lines.push(`  • ${t.label}`)
    }
    lines.push('')
  }

  const totalDone = groups.done.length
  const total = ALL_TASKS.length
  const pct = Math.round((totalDone / total) * 100)
  lines.push(`Overall Progress: ${totalDone}/${total} (${pct}%)`)

  return lines.join('\n')
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [statuses, setStatuses]         = useState(loadStatuses)
  const [activeTab, setActiveTab]       = useState('day1')
  const [filters, setFilters]           = useState({})   // { tabId: filterKey }
  const [reportOpen, setReportOpen]     = useState(false)
  const [reportText, setReportText]     = useState('')

  // Persist to localStorage on every status change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
    } catch {
      // storage unavailable — silent fail
    }
  }, [statuses])

  // Update status for a single task
  const handleStatusChange = useCallback((taskId, newStatus) => {
    setStatuses(prev => ({ ...prev, [taskId]: newStatus }))
  }, [])

  // Toggle the report panel; generate text on open
  const handleToggleReport = () => {
    if (!reportOpen) {
      setReportText(buildReport(statuses))
    }
    setReportOpen(prev => !prev)
  }

  // Per-tab filter
  const activeFilter = filters[activeTab] || 'all'
  const handleFilterChange = (f) => {
    setFilters(prev => ({ ...prev, [activeTab]: f }))
  }

  // ─── Compute task counts per tab (for badges) ────────────────
  const taskCounts = {}
  for (const tab of TABS) {
    if (tab.id === 'drive') {
      // Drive links have no status — show item count only
      taskCounts[tab.id] = { done: driveLinks.length, total: driveLinks.length }
    } else {
      const tasks = TASKS_BY_TAB[tab.id] || []
      const done  = tasks.filter(t => (statuses[t.id] || 'todo') === 'done').length
      taskCounts[tab.id] = { done, total: tasks.length }
    }
  }

  // ─── Overall progress across all statusable tasks ────────────
  const totalTasks = ALL_TASKS.length
  const totalDone  = ALL_TASKS.filter(t => (statuses[t.id] || 'todo') === 'done').length

  // ─── Current tab data ────────────────────────────────────────
  const isDriveTab  = activeTab === 'drive'
  const currentTab  = TABS.find(t => t.id === activeTab)
  const rawTasks    = isDriveTab ? driveLinks : (TASKS_BY_TAB[activeTab] || [])

  // Apply filter (Drive tab has no filter)
  const filteredTasks = isDriveTab
    ? rawTasks
    : rawTasks.filter(task => {
        if (activeFilter === 'all') return true
        return (statuses[task.id] || 'todo') === activeFilter
      })

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="app">
      <Header
        totalDone={totalDone}
        totalTasks={totalTasks}
        onToggleReport={handleToggleReport}
        reportOpen={reportOpen}
      />

      <ReportPanel isOpen={reportOpen} reportText={reportText} />

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        taskCounts={taskCounts}
      />

      <main className="app-main">
        {/* Section header */}
        <div className="tab-section-header">
          <span className="tab-section-title">{currentTab?.label}</span>
          <span className="tab-section-count">
            {isDriveTab
              ? `${rawTasks.length} links`
              : `${taskCounts[activeTab]?.done}/${rawTasks.length} complete`}
          </span>
        </div>

        {/* Filter bar — not shown on Drive tab */}
        {!isDriveTab && (
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Task / link list */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="task-empty">No tasks matching this filter.</div>
          ) : isDriveTab ? (
            filteredTasks.map(item => (
              <DriveCard key={item.id} item={item} />
            ))
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                status={statuses[task.id] || 'todo'}
                accentColor={currentTab?.accentColor}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </main>

      <Footer totalDone={totalDone} totalTasks={totalTasks} />
    </div>
  )
}
