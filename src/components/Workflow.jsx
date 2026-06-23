import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Clock,
  Package,
  Globe,
  Brain,
  Scale,
  MessageSquare,
  ChartColumn,
  Settings,
} from 'lucide-react'
import { NODES, EDGES } from '../data/mock.js'
import { Card, SectionLabel, LivePill, Tag } from './ui.jsx'

const KIND_STYLE = {
  trigger: { ring: '#6366f1', chip: 'อัตโนมัติ' },
  data: { ring: '#0ea5e9', chip: 'ดึงข้อมูล' },
  agent: { ring: '#ec2127', chip: 'AI Agent' },
  decision: { ring: '#d97706', chip: 'ตัดสินใจ' },
  action: { ring: '#16a34a', chip: 'ลงมือ' },
}

// node.id → lucide icon (replaces the emoji stored in mock.js at the render site)
const NODE_ICON = {
  trigger: Clock,
  stock: Package,
  scan: Globe,
  forecast: Brain,
  decision: Scale,
  line: MessageSquare,
  log: ChartColumn,
}

// Visual layout: columns left → right. Each node is placed in a column;
// connectors are drawn by measuring real DOM positions, so the graph stays
// accurate whether it's stacked (mobile) or spread out (desktop).
const COLUMNS = [
  ['trigger'],
  ['stock', 'scan'],
  ['forecast'],
  ['decision'],
  ['line', 'log'],
]

// order the nodes "execute" in, for the one-shot agent-run pulse on mount
const RUN_ORDER = { trigger: 0, stock: 1, scan: 1, forecast: 2, decision: 3, line: 4, log: 4 }

function Node({ node, active, onClick, nodeRef, runOrder = 0 }) {
  const s = KIND_STYLE[node.kind]
  const isAgent = node.kind === 'agent'
  const Icon = NODE_ICON[node.id]
  return (
    <button
      ref={nodeRef}
      onClick={onClick}
      className={`node-run relative w-full rounded-2xl border bg-white p-3 text-left shadow-card transition active:scale-[0.98] sm:w-[180px] ${
        active ? 'ring-2' : 'hover:-translate-y-0.5'
      }`}
      style={{
        ...(active ? { ['--tw-ring-color']: s.ring, borderColor: s.ring } : { borderColor: '#e8e8ee' }),
        animationDelay: `${runOrder * 0.12}s`,
      }}
    >
      {isAgent && <span className="pulse-ring pointer-events-none absolute inset-0 rounded-2xl" />}
      <div className="flex items-center gap-2">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${s.ring}14`, color: s.ring }}
        >
          {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        </span>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold text-ink">{node.title}</div>
          <div className="truncate text-[11px] text-ink-soft">{node.subtitle}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: `${s.ring}14`, color: s.ring }}
        >
          {s.chip}
        </span>
        <span className="text-[10px] text-ink-soft/60">แตะดู</span>
      </div>
    </button>
  )
}

export default function Workflow() {
  const wrapRef = useRef(null)
  const nodeRefs = useRef({})
  const [paths, setPaths] = useState([])
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [open, setOpen] = useState('forecast')
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])

  // measure node centers and build connector paths
  const recompute = () => {
    const wrap = wrapRef.current
    if (!wrap) return
    const wrapBox = wrap.getBoundingClientRect()
    const center = (el) => {
      const b = el.getBoundingClientRect()
      return {
        left: b.left - wrapBox.left,
        right: b.right - wrapBox.left,
        top: b.top - wrapBox.top,
        bottom: b.bottom - wrapBox.top,
        cx: b.left - wrapBox.left + b.width / 2,
        cy: b.top - wrapBox.top + b.height / 2,
      }
    }
    // is the layout stacked (mobile) or side-by-side (desktop)?
    const a = nodeRefs.current['trigger']
    const b = nodeRefs.current['stock']
    const stacked = a && b && Math.abs(center(a).cx - center(b).cx) < 30

    const next = EDGES.map(([from, to]) => {
      const fe = nodeRefs.current[from]
      const te = nodeRefs.current[to]
      if (!fe || !te) return null
      const f = center(fe)
      const t = center(te)
      if (stacked) {
        // vertical flow: bottom of `from` → top of `to`
        const x1 = f.cx
        const y1 = f.bottom
        const x2 = t.cx
        const y2 = t.top
        const mid = (y1 + y2) / 2
        return { d: `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}` }
      }
      // horizontal flow: right of `from` → left of `to`
      const x1 = f.right
      const y1 = f.cy
      const x2 = t.left
      const y2 = t.cy
      const mid = (x1 + x2) / 2
      return { d: `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}` }
    }).filter(Boolean)

    setPaths(next)
    setDims({ w: wrap.scrollWidth, h: wrap.scrollHeight })
  }

  useLayoutEffect(() => {
    recompute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const ro = new ResizeObserver(() => recompute())
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', recompute)
    // fonts can shift layout after load
    const t = setTimeout(recompute, 300)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recompute)
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openNode = NODES.find((n) => n.id === open)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <SectionLabel>เวิร์กโฟลว์เอเจนต์ (สไตล์ n8n / Power Automate)</SectionLabel>
          <h2 className="text-[20px] font-bold text-ink">7 ขั้นตอน ทำงานเองทุกสัปดาห์</h2>
        </div>
        <LivePill label="รัน: จันทร์ 07:00" />
      </div>

      <Card className="overflow-hidden">
        {/* n8n-style dotted-grid canvas with measured SVG connectors behind the nodes */}
        <div ref={wrapRef} className="canvas-grid relative p-4 sm:p-5">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            width={dims.w}
            height={dims.h}
            style={{ overflow: 'visible' }}
            aria-hidden="true"
          >
            <defs>
              <marker
                id="wf-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" fill="#ec2127" />
              </marker>
            </defs>
            {paths.map((p, i) => (
              <g key={i}>
                <path d={p.d} fill="none" stroke="#e8e8ee" strokeWidth="3" />
                <path
                  d={p.d}
                  fill="none"
                  stroke="#ec2127"
                  strokeWidth="2"
                  className="flow-line"
                  markerEnd="url(#wf-arrow)"
                />
                {!reduced && (
                  <circle r="3.4" fill="#ec2127">
                    <animateMotion dur="1.6s" repeatCount="indefinite" path={p.d} />
                  </circle>
                )}
              </g>
            ))}
          </svg>

          {/* nodes laid out in columns (desktop) / stacked (mobile) */}
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            {COLUMNS.map((col, ci) => (
              <div key={ci} className="flex flex-col items-center gap-4 sm:flex-1">
                {col.map((id) => {
                  const node = NODES.find((n) => n.id === id)
                  return (
                    <Node
                      key={id}
                      node={node}
                      active={open === id}
                      onClick={() => setOpen(id)}
                      nodeRef={(el) => (nodeRefs.current[id] = el)}
                      runOrder={RUN_ORDER[id] ?? 0}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* detail of the selected node */}
      {openNode && (
        <Card className="anim-fadeUp p-5">
          <div className="flex items-start gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${KIND_STYLE[openNode.kind].ring}14`, color: KIND_STYLE[openNode.kind].ring }}
            >
              {(() => {
                const OpenIcon = NODE_ICON[openNode.id]
                return OpenIcon ? <OpenIcon className="h-6 w-6" aria-hidden="true" /> : null
              })()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-bold text-ink">{openNode.title}</h3>
                <Tag color={KIND_STYLE[openNode.kind].ring}>{KIND_STYLE[openNode.kind].chip}</Tag>
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{openNode.detail}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cloud px-3 py-1.5 text-[12px] font-medium text-ink-soft">
                <span className="inline-flex items-center gap-1 text-ink-soft/70">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  Implementation:
                </span>
                <code className="text-ink">{openNode.tech}</code>
              </div>
            </div>
          </div>
        </Card>
      )}

      <p className="text-[12px] leading-relaxed text-ink-soft/80">
        เส้นทึบสีแดงคือเส้นทางข้อมูลที่กำลัง “ไหล” ระหว่างขั้นตอน · โหนด{' '}
        <span className="font-semibold text-true">AI Forecast</span> คือหัวใจของเอเจนต์ ·
        แตะที่โหนดเพื่อดูรายละเอียดแต่ละขั้นตอน
      </p>
    </div>
  )
}
