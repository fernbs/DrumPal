export default function TopBar({ completed, total, sidebarOpen, onToggleSidebar }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const r = 17
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <header className="topbar">
      <button className="hamburger" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <span className="ham-icon">
          <span />
          <span />
          <span />
        </span>
      </button>
      <div className="topbar-brand">DrumPal</div>
      <div className="topbar-progress">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
          <circle
            cx="20" cy="20" r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth="3"
          />
          <circle
            cx="20" cy="20" r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <span className="topbar-pct">{pct}%</span>
      </div>
    </header>
  )
}
