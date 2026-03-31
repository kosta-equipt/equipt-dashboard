// FilterBar — All / To Do / In Progress / Done filter per tab

const FILTERS = [
  { id: 'all',        label: 'All' },
  { id: 'todo',       label: 'To Do',      className: 'filter-todo' },
  { id: 'inprogress', label: 'In Progress', className: 'filter-progress' },
  { id: 'done',       label: 'Done',       className: 'filter-done' },
]

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-bar">
      <span className="filter-label">Filter</span>
      {FILTERS.map(f => (
        <button
          key={f.id}
          className={`filter-btn${activeFilter === f.id ? ` active ${f.className || ''}` : ''}`}
          onClick={() => onFilterChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
