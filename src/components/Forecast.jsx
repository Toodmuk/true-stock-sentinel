import { Globe, Tablet, Smartphone, Router, Signal, Package } from 'lucide-react'
import { SKUS, CAMPAIGN, SHOP } from '../data/mock.js'
import { Card, SectionLabel, Tag, RISK, LivePill, CountUp } from './ui.jsx'

// device glyph per SKU (keyed by id so mock.js stays data-only) — lucide, to
// match the icon language used across the rest of the app
const SKU_ICON = {
  'ipad-a16': Tablet,
  'ip15-128': Smartphone,
  'wifi6-router': Router,
  'sim-5g': Signal,
}

// One row of the reasoning chain: label → value
function Step({ n, label, value, accent }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
        style={{ background: accent }}
      >
        {n}
      </span>
      <span className="flex-1 text-[13px] text-ink-soft">{label}</span>
      <span className="tnum text-[13px] font-bold text-ink">{value}</span>
    </div>
  )
}

function ForecastCard({ sku }) {
  const r = RISK[sku.risk]
  const dailyDemand = Math.round((sku.forecastDemand / 7) * 10) / 10
  const SkuIcon = SKU_ICON[sku.id] || Package
  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center justify-between gap-2 px-5 py-3"
        style={{ background: r.soft }}
      >
        <div className="flex items-center gap-2">
          <SkuIcon className="h-5 w-5 shrink-0" style={{ color: r.color }} strokeWidth={2} aria-hidden="true" />
          <div>
            <div className="text-[14px] font-bold text-ink">{sku.name}</div>
            <div className="text-[11px] text-ink-soft">{sku.category}</div>
          </div>
        </div>
        <Tag color={r.color}>
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: r.color }}
            aria-hidden="true"
          />
          {r.label}
        </Tag>
      </div>

      <div className="space-y-2.5 px-5 py-4">
        <div className="stagger space-y-2.5">
          <Step n="1" label="สต็อกคงเหลือตอนนี้" value={`${sku.onHand} ชิ้น`} accent={r.color} />
          <Step n="2" label="ขายเฉลี่ยปกติ" value={`${sku.sellThrough}/สัปดาห์`} accent={r.color} />
          <Step
            n="3"
            label={`ตัวคูณดีมานด์จากโปร (×${sku.promoUplift})`}
            value={`${sku.forecastDemand}/สัปดาห์`}
            accent={r.color}
          />
          <Step n="4" label="= อัตราขายช่วงโปร" value={`~${dailyDemand}/วัน`} accent={r.color} />
        </div>

        <div className="!mt-3 rounded-xl border border-line bg-cloud p-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft/70">
                Days of cover
              </div>
              <div className="tnum text-[28px] font-bold leading-none" style={{ color: r.color }}>
                <CountUp to={sku.cover} decimals={1} />
                <span className="ml-1 text-[14px] font-medium text-ink-soft">วัน</span>
              </div>
            </div>
            {sku.recommendRestock > 0 ? (
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft/70">
                  แนะนำเติม
                </div>
                <div className="tnum text-[20px] font-bold text-ink">
                  +<CountUp to={sku.recommendRestock} />
                </div>
              </div>
            ) : (
              <div className="text-[12px] font-semibold text-[#16a34a]">ไม่ต้องเติมเพิ่ม</div>
            )}
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
            {sku.risk === 'critical' && (
              <>
                <strong className="text-true">จะหมดก่อนสุดสัปดาห์</strong> ที่ยอดขายพุ่ง 3 เท่า —{' '}
              </>
            )}
            {sku.reason}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default function Forecast() {
  const sorted = [...SKUS].sort((a, b) => a.cover - b.cover)
  return (
    <div className="stagger space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <SectionLabel>การให้เหตุผลของเอเจนต์ (AI Forecast)</SectionLabel>
          <h2 className="text-[20px] font-bold text-ink">โชว์การคิดแบบโปร่งใส</h2>
        </div>
        <LivePill label="วิเคราะห์ล่าสุด: วันนี้" />
      </div>

      {/* the decision rule the agent applies — makes "it decides, not just counts" legible */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[12px] shadow-card">
        <span className="font-semibold text-ink-soft">เกณฑ์ตัดสินใจ (days of cover):</span>
        {[
          { c: RISK.critical.color, t: '< 5 วัน · เติมด่วน' },
          { c: RISK.watch.color, t: '5–9 วัน · เฝ้าระวัง' },
          { c: RISK.healthy.color, t: '9+ วัน · เพียงพอ' },
        ].map((x) => (
          <span key={x.t} className="inline-flex items-center gap-1.5 font-medium text-ink">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} aria-hidden="true" />
            {x.t}
          </span>
        ))}
      </div>

      {/* the detected signal */}
      <Card className="border-true/20 bg-true-soft p-5">
        <div className="flex items-start gap-3">
          <Globe className="h-6 w-6 shrink-0 text-true" aria-hidden="true" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-bold text-ink">
                สัญญาณที่ตรวจพบ: {CAMPAIGN.name}
              </span>
              <Tag>{CAMPAIGN.window}</Tag>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{CAMPAIGN.insight}</p>
            <p className="mt-1 text-[12px] text-ink-soft/80">
              ที่มา: {CAMPAIGN.source} · ความเชื่อมั่น {CAMPAIGN.confidence}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.map((sku) => (
          <ForecastCard key={sku.id} sku={sku} />
        ))}
      </div>

      <Card className="p-4">
        <p className="text-[12px] leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">หมายเหตุความเชื่อมั่น:</span> การพยากรณ์อิงจากอัตราการขายย้อนหลัง 8 สัปดาห์
          และตัวคูณดีมานด์ของแคมเปญในอดีตที่ใกล้เคียงกัน ({SHOP.weekendNote.toLowerCase()})
          เอเจนต์จะปรับตัวคูณใหม่ทุกครั้งหลังจบแคมเปญ เพื่อให้แม่นขึ้นเรื่อย ๆ
        </p>
      </Card>
    </div>
  )
}
