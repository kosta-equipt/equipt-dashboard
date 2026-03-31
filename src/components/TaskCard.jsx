// TaskCard — Individual task with status toggle pills

export default function TaskCard({ task, status, accentColor, onStatusChange }) {
  const isDone = status === 'done'

  return (
    <div
      className={`task-card${isDone ? ' is-done' : ''}`}
      style={{ '--accent-color': accentColor }}
    >
      <div className="task-card-left">
        <div className="task-card-top">
          <span className="task-card-label">{task.label}</span>
          {task.priority && <span className="priority-badge">Priority</span>}
          {task.badges && task.badges.map(b => (
            <span
              key={b.label}
              className="task-badge"
              style={{
                background: b.color + '22',
                color: b.color,
                border: `1px solid ${b.color}44`,
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
        {task.note && <p className="task-card-note">{task.note}</p>}
      </div>

      <div className="status-toggles">
        <button
          className={`status-btn${status === 'todo' ? ' active-todo' : ''}`}
          onClick={() => onStatusChange(task.id, 'todo')}
        >
          To Do
        </button>
        <button
          className={`status-btn${status === 'inprogress' ? ' active-inprogress' : ''}`}
          onClick={() => onStatusChange(task.id, 'inprogress')}
        >
          In Progress
        </button>
        <button
          className={`status-btn${status === 'done' ? ' active-done' : ''}`}
          onClick={() => onStatusChange(task.id, 'done')}
        >
          Done
        </button>
      </div>
    </div>
  )
}
