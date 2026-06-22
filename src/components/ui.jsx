// Small shared UI building blocks (matches the True Service Flow sibling app).

export function Brand({ small }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative flex items-center justify-center rounded-lg bg-true font-bold text-white ${
          small ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-lg'
        }`}
      >
        {/* radar/box sentinel glyph */}
        <svg viewBox="0 0 24 24" className={small ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true">
          <path
            d="M5 8l7-3.5L19 8v8l-7 3.5L5 16z"
            fill="none"
            stroke="#fff"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M5 8l7 3.5L19 8M12 11.5V19" fill="none" stroke="#fff" strokeWidth="1.7" opacity="0.8" />
        </svg>
      </div>
      <div className={`font-bold tracking-tight text-ink ${small ? 'text-sm' : 'text-base'}`}>
        True <span className="font-medium text-ink-soft">Stock Sentinel</span>
      </div>
    </div>
  )
}

export function Tag({ children, color = '#e2231a' }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: `${color}14`, color }}
    >
      {children}
    </span>
  )
}

export function SectionLabel({ children }) {
  return (
    <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-soft/70">
      {children}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`}>
      {children}
    </div>
  )
}

// A small "live agent" status pill with a pulsing dot.
export function LivePill({ label = 'Agent กำลังทำงาน' }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-true opacity-70 pulse-dot" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-true" />
      </span>
      {label}
    </span>
  )
}

// risk → color/label mapping reused across screens
export const RISK = {
  critical: { color: '#e2231a', dot: '🔴', label: 'เสี่ยงหมดสต็อก', soft: '#fef2f2' },
  watch: { color: '#d97706', dot: '🟠', label: 'เฝ้าระวัง', soft: '#fffbeb' },
  healthy: { color: '#16a34a', dot: '🟢', label: 'เพียงพอ', soft: '#f0fdf4' },
}
