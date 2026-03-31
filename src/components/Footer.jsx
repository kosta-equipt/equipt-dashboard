// Footer — Minimal one-line footer with date and task completion count

export default function Footer({ totalDone, totalTasks }) {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-left">
          Equipt · Built to Perform · {today}
        </span>
        <span className="footer-right">
          {totalDone}/{totalTasks} tasks complete · Progress auto-saves
        </span>
      </div>
    </footer>
  )
}
