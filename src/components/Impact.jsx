import {
  CircleCheck,
  TriangleAlert,
  ShieldCheck,
  TrendingUp,
  Leaf,
  ArrowRight,
} from 'lucide-react'
import { IMPACT } from '../data/mock.js'
import { Card, SectionLabel, CountUp, Tag } from './ui.jsx'

// IMPACT.values index → lucide icon (replaces emoji at the render site; mock.js stays untouched)
const VALUE_ICON = [ShieldCheck, TrendingUp, Leaf]

function StoryCol({ data }) {
  const good = data.tone === 'good'
  const accent = good ? '#16a34a' : '#ec2127'
  const soft = good ? '#f0fdf4' : '#fef2f2'
  const StatusIcon = good ? CircleCheck : TriangleAlert
  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center gap-2 px-5 py-3"
        style={{ background: soft, color: accent }}
      >
        <StatusIcon className="h-5 w-5 shrink-0" style={{ color: accent }} aria-hidden="true" />
        <span className="text-[15px] font-bold">{data.title}</span>
      </div>
      <ul className="space-y-2.5 px-5 py-4">
        {data.points.map((p, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: accent }}
            />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function Impact() {
  return (
    <div className="stagger space-y-6">
      <div>
        <SectionLabel>Outcomes · Before vs. After</SectionLabel>
        <h2 className="text-[20px] font-bold text-ink">From Lost Sales to Closed Deals</h2>
      </div>

      {/* hero stat band — framed as expected/illustrative so the numbers aren't over-claimed */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-ink-mute">
            Expected Outcomes
          </span>
        </div>
        <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-5 py-6 text-center">
            <div className="tnum text-[34px] font-extrabold leading-none text-true">
              ~<CountUp to={5} />
            </div>
            <div className="mt-1.5 text-[12px] font-medium leading-relaxed text-ink-soft">
              Days of advance warning before stockout
            </div>
          </div>
          <div className="px-5 py-6 text-center">
            <div className="tnum text-[34px] font-extrabold leading-none text-true">
              <CountUp to={0} />
            </div>
            <div className="mt-1.5 text-[12px] font-medium leading-relaxed text-ink-soft">
              Target — sales lost to competitors due to stockouts
            </div>
          </div>
          <div className="px-5 py-6 text-center">
            <div className="tnum text-[34px] font-extrabold leading-none text-true">
              <CountUp to={100} suffix="%" />
            </div>
            <div className="mt-1.5 text-[12px] font-medium leading-relaxed text-ink-soft">
              Automated — managers never need to manually check stock
            </div>
          </div>
        </div>
      </Card>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <StoryCol data={IMPACT.before} />
        {/* arrow between columns */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-true shadow-card sm:flex">
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </div>
        <StoryCol data={IMPACT.after} />
      </div>

      <div>
        <SectionLabel>Core Value</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          {IMPACT.values.map((v, i) => {
            const Icon = VALUE_ICON[i]
            return (
              <Card key={v.text} className="p-4">
                {Icon && <Icon className="h-6 w-6 text-true" aria-hidden="true" />}
                <p className="mt-2 text-[14px] font-semibold leading-relaxed text-ink">{v.text}</p>
              </Card>
            )
          })}
        </div>
      </div>

      {/* integration integrations */}
      <Card className="border-line bg-cloud p-5">
        <SectionLabel>Production Integration</SectionLabel>
        <p className="text-[13px] leading-relaxed text-ink-soft">
          The agent connects to True's{' '}
          <strong className="text-ink">Inventory API</strong> to pull live stock and sell-through data,
          syncs the campaign calendar from the marketing team, and delivers reports via{' '}
          <strong className="text-ink">LINE Messaging API / LINE Notify</strong>. The entire workflow
          runs on <strong className="text-ink">n8n</strong> or{' '}
          <strong className="text-ink">Microsoft Power Automate</strong> — pilot one branch, then
          roll out across the full True Shop network.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Inventory API', 'Campaign Calendar', 'LINE Messaging API', 'n8n', 'Power Automate'].map(
            (t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink-soft"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </Card>
    </div>
  )
}
