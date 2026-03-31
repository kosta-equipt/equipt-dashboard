// Header — Logo, overall progress bar, and Generate Report button

export default function Header({ totalDone, totalTasks, onToggleReport, reportOpen }) {
  const pct = totalTasks === 0 ? 0 : Math.round((totalDone / totalTasks) * 100)
  const isComplete = pct === 100

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo">EQUIPT</span>
          <span className="header-subtitle">Marketing Ops Dashboard</span>
        </div>

        <div className="header-right">
          <div className="header-progress-wrap">
            <div className="header-progress-bar">
              <div
                className={`header-progress-fill${isComplete ? ' complete' : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="header-progress-pct">{pct}%</span>
          </div>

          <button
            className={`btn ${reportOpen ? 'btn-outline' : 'btn-gold'}`}
            onClick={onToggleReport}
          >
            {reportOpen ? 'Close' : 'Generate Report'}
          </button>
        </div>
      </div>
    </header>
  )
}
