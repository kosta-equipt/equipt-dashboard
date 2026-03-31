// TabBar — Horizontal navigation with done/total badge per tab

import { TABS } from '../data/tasks.js'

export default function TabBar({ activeTab, onTabChange, taskCounts }) {
  return (
    <nav className="tab-bar">
      <div className="tab-bar-inner">
        {TABS.map(tab => {
          const counts = taskCounts[tab.id] || { done: 0, total: 0 }
          return (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
              <span className="tab-badge">
                {counts.done}/{counts.total}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
