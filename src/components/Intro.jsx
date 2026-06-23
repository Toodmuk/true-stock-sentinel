import {
  Package,
  Globe,
  Brain,
  MessageSquare,
  ArrowRight,
  Eye,
  Scale,
  Hand,
} from 'lucide-react'
import { Card, Tag, SectionLabel } from './ui.jsx'

const LOOP = [
  { icon: Package, label: 'Check Stock' },
  { icon: Globe, label: 'Scan Promotions' },
  { icon: Brain, label: 'Forecast Demand' },
  { icon: MessageSquare, label: 'LINE Alert' },
]

export default function Intro() {
  return (
    <div className="stagger space-y-6">
      {/* hero */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-true to-true-dark px-6 py-8 text-white sm:px-8 sm:py-10">
          {/* faint radar backdrop */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-20">
            <svg viewBox="0 0 100 100" className="radar-sweep h-full w-full">
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d="M50 50 L50 0 A50 50 0 0 1 95 35 Z" fill="url(#rg)" />
            </svg>
          </div>
          <Tag color="#ffffff">
            <span className="text-white">Agentic AI · True Next Gen</span>
          </Tag>
          <h1 className="mt-3 text-[28px] font-bold leading-tight sm:text-[34px]">
            True Stock Sentinel
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-[16px]">
            An AI agent that monitors stock levels across every True Shop each week —
            forecasting whether inventory will run out before a campaign hits, and alerting
            the branch manager via LINE before a single sale is lost.
          </p>
        </div>

        {/* the loop */}
        <div className="px-6 py-5 sm:px-8">
          <SectionLabel>Agent Loop</SectionLabel>
          <div className="flex flex-wrap items-center gap-2">
            {LOOP.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-line bg-cloud px-3 py-2">
                  <s.icon className="h-5 w-5 text-true" aria-hidden="true" />
                  <span className="text-[13px] font-semibold text-ink">{s.label}</span>
                </div>
                {i < LOOP.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-true" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* origin story */}
      <Card className="p-6 sm:p-8">
        <SectionLabel>A Real Story from the Shop Floor · The Origin</SectionLabel>
        <h2 className="text-[20px] font-bold text-ink">
          The Day a Customer Walked Out to Buy an iPad from AIS
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-5">
          <div className="hidden h-full w-1 rounded-full bg-true sm:block" />
          <div className="space-y-3 text-[14px] leading-relaxed text-ink-soft">
            <p>
              During the <strong className="text-ink">&quot;Back to School&quot;</strong> promotion, one True Shop
              ran a special iPad deal. Foot traffic surged — it was the start of the school term.
            </p>
            <p>
              But <strong className="text-true">iPads ran out of stock</strong> before the weekend was over.
              Staff only found out when a customer asked at the counter — there was no time to reorder.
            </p>
            <p>
              The customer walked out and bought an iPad from{' '}
              <strong className="text-ink">AIS (a competitor)</strong> instead —
              a lost sale, even though the demand had walked right through the door.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-true/20 bg-true-soft px-4 py-3 text-[14px] leading-relaxed text-ink">
          <strong className="text-true">Sentinel exists so this never happens again.</strong>{' '}
          The system forecasts stockouts <em>before</em> a campaign arrives and notifies the manager in time to restock.
        </div>
      </Card>

      {/* why agentic */}
      <div>
        <SectionLabel>Why It Exists — and Why It&apos;s &quot;Agentic AI&quot;</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Eye,
              title: 'Perceive',
              body: 'Detects signals from the ecosystem — back-to-school campaigns, product launches, or competitor promotions.',
            },
            {
              icon: Brain,
              title: 'Reason',
              body: 'Forecasts how much demand will spike and compares it against current stock levels and sell-through rate.',
            },
            {
              icon: Scale,
              title: 'Decide',
              body: 'Calculates days-of-cover and assigns a risk score per SKU — identifying which items will run out first.',
            },
            {
              icon: Hand,
              title: 'Act',
              body: 'Drafts a report with exact restock quantities and delivers it directly to the branch manager via LINE.',
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
        <p className="mt-3 text-[12px] leading-relaxed text-ink-soft/80">
          This is not just stock-counting automation — the agent reads context, reasons independently,
          makes decisions, and proactively communicates with the right people.
        </p>
      </div>
    </div>
  )
}
