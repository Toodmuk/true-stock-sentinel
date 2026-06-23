import { ChevronLeft, Menu, Clock, Target, Hash, MessageSquare } from 'lucide-react'
import { LINE_REPORT, SHOP } from '../data/mock.js'
import { Card, SectionLabel } from './ui.jsx'

const LINE_GREEN = '#06c755'

function PhoneFrame({ children }) {
  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div className="rounded-[2.4rem] border-[10px] border-ink bg-ink p-0 shadow-pop">
        <div className="relative overflow-hidden rounded-[1.7rem] bg-[#8aa6c8]">
          {/* notch */}
          <div className="absolute left-1/2 top-0 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-ink" />
          {/* LINE chat header */}
          <div
            className="flex items-center gap-2 px-4 pb-2.5 pt-7 text-white"
            style={{ background: LINE_GREEN }}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[15px]">
              🤖
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold leading-tight">
                {LINE_REPORT.botName}
              </div>
              <div className="truncate text-[10px] text-white/80">Official Account · Bot</div>
            </div>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </div>
          {/* chat body */}
          <div className="space-y-2.5 px-3 py-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

// A LINE-style incoming bubble (left aligned, white). `delay` staggers arrival
// so the report reads like a live push-notification stream.
function Bubble({ children, time, delay = 0 }) {
  return (
    <div className="flex items-end gap-1.5">
      <div
        className="anim-msg max-w-[86%] rounded-2xl rounded-tl-md bg-white px-3 py-2.5 shadow-sm"
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
      {time && <span className="mb-0.5 text-[9px] text-white/80">{time}</span>}
    </div>
  )
}

export default function LineReport() {
  const r = LINE_REPORT
  return (
    <div className="stagger space-y-5">
      <div>
        <SectionLabel>What the Manager Actually Receives</SectionLabel>
        <h2 className="text-[20px] font-bold text-ink">Report Delivered to the Branch Manager via LINE</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-soft">
          True Shop managers live in LINE every day. The agent delivers its report directly into LINE —
          easy to read, actionable with a tap, no back-office login required.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <PhoneFrame>
          <Bubble time={r.time} delay={0}>
            <p className="text-[13px] leading-relaxed text-ink">{r.greeting}</p>
          </Bubble>

          <Bubble delay={0.25}>
            <p className="text-[12px] leading-relaxed text-ink-soft">
              📍 {SHOP.name}
              <br />
              🌐 {r.campaignLine}
            </p>
          </Bubble>

          {/* at-risk card bubble */}
          <Bubble delay={0.5}>
            <div className="w-full">
              <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-true">
                🔴 Restock immediately ({r.atRisk.length} items)
              </div>
              {r.atRisk.map((it) => (
                <div
                  key={it.name}
                  className="rounded-xl border border-true/20 bg-true-soft p-2.5"
                >
                  <div className="text-[13px] font-bold text-ink">
                    {it.emoji} {it.name}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink-soft">{it.msg}</p>
                  <div className="mt-1.5 rounded-lg bg-white px-2 py-1 text-[12px] font-bold text-true">
                    👉 {it.action}
                  </div>
                </div>
              ))}
            </div>
          </Bubble>

          {/* watch + healthy */}
          <Bubble delay={0.75}>
            <div className="w-full space-y-1.5">
              <div className="text-[12px] font-bold text-[#d97706]">🟠 Monitor</div>
              {r.watch.map((it) => (
                <p key={it.name} className="text-[11px] leading-relaxed text-ink-soft">
                  {it.emoji} <strong className="text-ink">{it.name}</strong> — {it.msg} · {it.action}
                </p>
              ))}
              <p className="border-t border-line pt-1.5 text-[11px] leading-relaxed text-[#16a34a]">
                {r.healthy}
              </p>
            </div>
          </Bubble>

          {/* CTA button bubble */}
          <Bubble delay={1}>
            <button
              type="button"
              className="flex min-h-[44px] w-full items-center justify-center rounded-xl py-2 text-[13px] font-bold text-white shadow-sm"
              style={{ background: LINE_GREEN }}
            >
              {r.cta} →
            </button>
          </Bubble>
        </PhoneFrame>

        {/* annotations next to the phone */}
        <div className="stagger space-y-3">
          {[
            {
              icon: Clock,
              title: 'Arrives before the store opens',
              body: 'Sent every Monday at 07:00 — managers see the full picture before the day starts, with time to place restock orders.',
            },
            {
              icon: Target,
              title: 'Priorities already ranked',
              body: 'Red = act today, Orange = watch, Green = fine. No need to scroll through the entire stock list.',
            },
            {
              icon: Hash,
              title: 'Exact restock quantities',
              body: '”Order +20 units before Thursday” — a ready-to-act directive, not a vague alert.',
            },
            {
              icon: MessageSquare,
              title: 'Delivered where managers already work',
              body: 'No new dashboard to log into — everything arrives in the LINE app they already have open.',
            },
          ].map((c) => (
            <Card key={c.title} className="p-4">
              <div className="flex items-start gap-3">
                <c.icon className="h-6 w-6 shrink-0 text-true" aria-hidden="true" />
                <div>
                  <div className="text-[14px] font-bold text-ink">{c.title}</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{c.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
