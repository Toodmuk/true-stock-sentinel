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
  { icon: Package, label: 'ตรวจสต็อก' },
  { icon: Globe, label: 'สแกนโปรโมชัน' },
  { icon: Brain, label: 'พยากรณ์ดีมานด์' },
  { icon: MessageSquare, label: 'แจ้งเตือน LINE' },
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
            เอเจนต์ AI ที่ “เฝ้าสต็อก” ของแต่ละ True Shop ทุกสัปดาห์ —
            พยากรณ์ล่วงหน้าว่าสินค้าจะหมดก่อนแคมเปญหรือไม่ แล้วเตือนผู้จัดการผ่าน LINE
            ก่อนที่ยอดขายจะหลุดมือ
          </p>
        </div>

        {/* the loop */}
        <div className="px-6 py-5 sm:px-8">
          <SectionLabel>วงจรการทำงานของเอเจนต์</SectionLabel>
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
        <SectionLabel>เรื่องจริงที่เป็นจุดเริ่มต้น</SectionLabel>
        <h2 className="text-[20px] font-bold text-ink">
          วันที่ลูกค้าเดินออกไปซื้อ iPad จาก AIS
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-5">
          <div className="hidden h-full w-1 rounded-full bg-true sm:block" />
          <div className="space-y-3 text-[14px] leading-relaxed text-ink-soft">
            <p>
              ช่วงโปร <strong className="text-ink">“Back to School”</strong> True Shop สาขาหนึ่ง
              จัดโปร iPad ราคาพิเศษ ลูกค้าเข้ามาเยอะกว่าปกติเพราะเป็นช่วงเปิดเทอม
            </p>
            <p>
              แต่ <strong className="text-true">iPad หมดสต็อก</strong> ก่อนสุดสัปดาห์
              พนักงานเพิ่งรู้ตอนลูกค้ามาถามหน้าร้าน เติมของไม่ทัน
            </p>
            <p>
              สุดท้ายลูกค้าเดินไปซื้อ iPad จาก{' '}
              <strong className="text-ink">AIS (คู่แข่ง)</strong> แทน —
              ยอดขายหลุดมือ ทั้งที่ดีมานด์มาเองถึงหน้าร้านแล้ว
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-true/20 bg-true-soft px-4 py-3 text-[14px] leading-relaxed text-ink">
          <strong className="text-true">Sentinel มีไว้เพื่อไม่ให้เรื่องนี้เกิดขึ้นอีก</strong> —
          ระบบจะพยากรณ์ว่าสินค้าจะหมด <em>ก่อน</em> แคมเปญจะมาถึง แล้วบอกผู้จัดการให้เติมของทัน
        </div>
      </Card>

      {/* why agentic */}
      <div>
        <SectionLabel>ทำไมต้องมี — และทำไมถึงเรียกว่า “Agentic AI”</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Eye,
              title: 'Perceive — รับรู้',
              body: 'ตรวจจับสัญญาณจากระบบนิเวศ เช่น แคมเปญเปิดเทอม การเปิดตัวสินค้า หรือโปรของคู่แข่ง',
            },
            {
              icon: Brain,
              title: 'Reason — คิด',
              body: 'พยากรณ์ว่าดีมานด์จะเพิ่มขึ้นเท่าไหร่ เทียบกับสต็อกและอัตราการขายปัจจุบัน',
            },
            {
              icon: Scale,
              title: 'Decide — ตัดสินใจ',
              body: 'คำนวณ days-of-cover และให้คะแนนความเสี่ยงต่อ SKU ว่าตัวไหนจะหมดก่อน',
            },
            {
              icon: Hand,
              title: 'Act — ลงมือ',
              body: 'ร่างรายงานพร้อมจำนวนที่ควรเติม แล้วส่งเข้า LINE ของผู้จัดการโดยตรง',
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
          ไม่ใช่แค่ “นับสต็อก” แบบ automation ทั่วไป — แต่มันรับรู้บริบท คิดเอง ตัดสินใจ
          แล้วลงมือสื่อสารกับคนที่ต้องรู้
        </p>
      </div>
    </div>
  )
}
