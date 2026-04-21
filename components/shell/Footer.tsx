export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line/70 bg-bone/60 dark:border-line-dark/70 dark:bg-bone-dark/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-muted dark:text-muted-dark">
        <span>Equipt · Built to Perform · {year}</span>
        <span>Live data from Google Sheets · auto-synced every 5 min</span>
      </div>
    </footer>
  )
}
