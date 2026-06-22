# True Stock Sentinel — ต้นแบบ Agentic AI ตรวจสต็อก

ต้นแบบ (prototype) **เอเจนต์ AI ที่เฝ้าสต็อกของ True Shop รายสัปดาห์** แล้วเตือนผู้จัดการผ่าน **LINE**
ก่อนของจะหมดช่วงโปรโมชัน — เพื่อไม่ให้เสียลูกค้าให้คู่แข่ง

**Live:** https://toodmuk.github.io/true-stock-sentinel/ — รหัส `Tng2026@`

## ปัญหาที่แก้ (เคสจริงจาก field)
ช่วง Back to School ร้านขาย iPad หมด — ลูกค้าเลยไปซื้อ iPad จาก **AIS** แทน. ยอดหลุดมือ + เสียลูกค้า

## ทำไมเป็น "Agentic AI" ไม่ใช่แค่ automation
เอเจนต์ทำครบวงจร: **perceive** (สแกนแคมเปญ/โปรในระบบนิเวศ) → **reason** (พยากรณ์ดีมานด์ × สต็อก →
days-of-cover) → **decide** (ให้คะแนนความเสี่ยง แยกแดง/ส้ม/เขียว) → **act** (ร่าง + ส่งรายงานเข้า LINE
พร้อมจำนวนที่ควรเติม)

## หน้าจอในเว็บ
- **แนวคิด** — เล่าเคส iPad → AIS + วงจรการทำงาน
- **เวิร์กโฟลว์** — node canvas สไตล์ n8n/Power Automate 7 ขั้นตอน (แตะดูรายละเอียดแต่ละ node)
- **พยากรณ์ AI** — โชว์การคำนวณ days-of-cover ต่อ SKU (iPad เสี่ยงหมดใน ~4.7 วัน → เติม +20)
- **รายงาน LINE** — mock ข้อความเข้า LINE ผู้จัดการสาขา (จัดลำดับ แดง/ส้ม/เขียว + คำสั่งที่ลงมือได้)
- **ผลลัพธ์** — before/after

## เทคนิค
- **Vite + React 18 + Tailwind v4**, รองรับทั้งมือถือ + จอใหญ่ (ฉายในห้องประชุม)
- `base: './'` ใน `vite.config.js` → ใช้ได้บน GitHub Pages (subpath)
- ข้อมูลสต็อก/ตัวเลขเป็น **ตัวอย่างจำลองที่สอดคล้องกันเอง** (`src/data/mock.js`) — โปรดักชันต่อ Inventory API + LINE Messaging API; รันบน n8n หรือ Power Automate ได้

## รัน / build / deploy
```bash
npm install
npm run dev
npm run build     # → dist/
```
Deploy: GitHub Pages — source บน `main`, build บน branch `gh-pages` (เสิร์ฟจาก branch นั้น)
