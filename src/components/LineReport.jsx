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
            <span className="text-[18px]">‹</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[15px]">
              🤖
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold leading-tight">
                {LINE_REPORT.botName}
              </div>
              <div className="truncate text-[10px] text-white/80">Official Account · บอท</div>
            </div>
            <span className="text-[15px]">☰</span>
          </div>
          {/* chat body */}
          <div className="space-y-2.5 px-3 py-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

// A LINE-style incoming bubble (left aligned, white)
function Bubble({ children, time }) {
  return (
    <div className="flex items-end gap-1.5">
      <div className="anim-msg max-w-[86%] rounded-2xl rounded-tl-md bg-white px-3 py-2.5 shadow-sm">
        {children}
      </div>
      {time && <span className="mb-0.5 text-[9px] text-white/80">{time}</span>}
    </div>
  )
}

export default function LineReport() {
  const r = LINE_REPORT
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>ผลลัพธ์ที่ผู้จัดการได้รับจริง</SectionLabel>
        <h2 className="text-[20px] font-bold text-ink">รายงานเข้า LINE ของผู้จัดการสาขา</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-soft">
          ผู้จัดการ True Shop สื่อสารผ่าน LINE เป็นหลักทุกวัน เอเจนต์จึงส่งรายงานเข้า LINE โดยตรง —
          อ่านง่าย กดต่อได้ทันที ไม่ต้องเปิดระบบหลังบ้าน
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <PhoneFrame>
          <Bubble time={r.time}>
            <p className="text-[13px] leading-relaxed text-ink">{r.greeting}</p>
          </Bubble>

          <Bubble>
            <p className="text-[12px] leading-relaxed text-ink-soft">
              📍 {SHOP.name}
              <br />
              🌐 {r.campaignLine}
            </p>
          </Bubble>

          {/* at-risk card bubble */}
          <Bubble>
            <div className="w-full">
              <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-true">
                🔴 ต้องเติมด่วน ({r.atRisk.length} รายการ)
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
          <Bubble>
            <div className="w-full space-y-1.5">
              <div className="text-[12px] font-bold text-[#d97706]">🟠 เฝ้าระวัง</div>
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
          <Bubble>
            <button
              className="w-full rounded-xl py-2 text-[13px] font-bold text-white shadow-sm"
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
              icon: '⏰',
              title: 'มาถึงก่อนร้านเปิด',
              body: 'ส่งทุกเช้าวันจันทร์ 07:00 ผู้จัดการเห็นภาพรวมก่อนเริ่มงาน มีเวลาสั่งเติมของ',
            },
            {
              icon: '🎯',
              title: 'จัดลำดับความสำคัญให้แล้ว',
              body: 'แดง = ต้องทำวันนี้, ส้ม = จับตา, เขียว = ปล่อยได้ ผู้จัดการไม่ต้องไล่อ่านทั้งสต็อก',
            },
            {
              icon: '🔢',
              title: 'บอกจำนวนที่ควรเติมเป๊ะ ๆ',
              body: '“เติม +20 เครื่อง ก่อนพฤหัสฯ” — เป็นคำสั่งที่ลงมือได้เลย ไม่ใช่แค่แจ้งเตือนลอย ๆ',
            },
            {
              icon: '💬',
              title: 'อยู่ในเครื่องมือที่ใช้จริง',
              body: 'ไม่ต้องล็อกอินแดชบอร์ดใหม่ ทุกอย่างมาที่ LINE ที่ผู้จัดการเปิดอยู่แล้ว',
            },
          ].map((c) => (
            <Card key={c.title} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{c.icon}</span>
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
