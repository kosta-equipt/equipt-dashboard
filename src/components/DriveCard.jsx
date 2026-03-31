// DriveCard — Reference-only Drive link, no status toggle

export default function DriveCard({ item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="drive-card"
    >
      <div className="drive-card-left">
        <div className="drive-card-label">{item.label}</div>
        {item.note && <div className="drive-card-note">{item.note}</div>}
      </div>
      <span className="drive-icon">↗</span>
    </a>
  )
}
