import { IMPACT } from '../data/mock.js'
import { Card, SectionLabel } from './ui.jsx'

function StoryCol({ data }) {
  const good = data.tone === 'good'
  const accent = good ? '#16a34a' : '#e2231a'
  const soft = good ? '#f0fdf4' : '#fef2f2'
  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center gap-2 px-5 py-3"
        style={{ background: soft, color: accent }}
      >
        <span className="text-lg">{good ? '✅' : '⚠️'}</span>
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
    <div className="space-y-6">
      <div>
        <SectionLabel>ผลลัพธ์ · ก่อน vs หลัง</SectionLabel>
        <h2 className="text-[20px] font-bold text-ink">จากเสียลูกค้าให้คู่แข่ง → ปิดการขายได้</h2>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <StoryCol data={IMPACT.before} />
        {/* arrow between columns */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-true shadow-card sm:flex">
          →
        </div>
        <StoryCol data={IMPACT.after} />
      </div>

      <div>
        <SectionLabel>คุณค่าหลัก</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          {IMPACT.values.map((v) => (
            <Card key={v.text} className="p-4">
              <div className="text-2xl">{v.icon}</div>
              <p className="mt-2 text-[14px] font-semibold leading-relaxed text-ink">{v.text}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* headline metric */}
      <Card className="overflow-hidden">
        <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { big: '~5 วัน', small: 'เตือนล่วงหน้าก่อนของหมด' },
            { big: '0', small: 'ยอดขายที่หลุดไปคู่แข่งเพราะของหมด' },
            { big: 'อัตโนมัติ', small: 'ผู้จัดการไม่ต้องนั่งเช็คสต็อกเอง' },
          ].map((m) => (
            <div key={m.small} className="px-5 py-5 text-center">
              <div className="text-[24px] font-bold text-true">{m.big}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-ink-soft">{m.small}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* production note */}
      <Card className="border-line bg-cloud p-5">
        <SectionLabel>ต่อยอดสู่ระบบจริง (Production note)</SectionLabel>
        <p className="text-[13px] leading-relaxed text-ink-soft">
          ในเวอร์ชันจริง เอเจนต์นี้จะเชื่อมกับ{' '}
          <strong className="text-ink">API คลังสินค้าของ True</strong> เพื่อดึงสต็อกและอัตราการขายจริง,
          ดึงปฏิทินแคมเปญจากทีมการตลาด, และส่งรายงานผ่าน{' '}
          <strong className="text-ink">LINE Messaging API / LINE Notify</strong>. ตัวเวิร์กโฟลว์ทั้งหมด
          รันได้บน <strong className="text-ink">n8n</strong> หรือ{' '}
          <strong className="text-ink">Microsoft Power Automate</strong> โดยไม่ต้องเขียนโค้ดใหม่ทั้งระบบ —
          เริ่มนำร่องได้ทีละสาขา แล้วค่อยขยายทั้งเครือข่าย True Shop
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
