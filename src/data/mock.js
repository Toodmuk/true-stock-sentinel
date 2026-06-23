// Mock data for the True Stock Sentinel prototype.
// Numbers are illustrative but internally consistent so the "agentic reasoning"
// reads as real: forecastDemand = sellThrough * promoUplift, and
// daysOfCover = onHand / (forecastDemand / 7).

// --- The shop the agent is watching ---
export const SHOP = {
  name: 'True Shop เซ็นทรัลเวิลด์',
  code: 'TS-CTW-014',
  manager: 'คุณนภัส (ผู้จัดการสาขา)',
  trafficPerDay: '200–300 คน/วัน',
  weekendNote: 'ยอดขายเสาร์–อาทิตย์ ~3 เท่าของวันธรรมดา',
}

// --- The detected ecosystem signal that triggers the reasoning ---
export const CAMPAIGN = {
  name: 'Back to School 2026',
  window: '24 มิ.ย. – 6 ก.ค.',
  source: 'ปฏิทินแคมเปญการตลาด + หน้าโปรโมชันคู่แข่ง',
  insight:
    'ช่วงเปิดเทอม ดีมานด์ iPad / โน้ตบุ๊กพุ่งสูงเป็นพิเศษ โดยเฉพาะรุ่นราคาเริ่มต้นที่ผูกโปรผ่อน 0%',
  confidence: 'สูง (เชิงอธิบาย)',
}

// helper for consistent derived numbers
const perWeekDemand = (sellThrough, uplift) => Math.round(sellThrough * uplift)
const daysOfCover = (onHand, weeklyDemand) =>
  Math.round((onHand / (weeklyDemand / 7)) * 10) / 10

function buildSku(s) {
  const forecastDemand = perWeekDemand(s.sellThrough, s.promoUplift)
  const cover = daysOfCover(s.onHand, forecastDemand)
  // recommend restocking up to ~2 weeks of forecast demand, rounded to 5
  const target = forecastDemand * 2
  const recommendRestock = Math.max(0, Math.ceil((target - s.onHand) / 5) * 5)
  let risk = 'healthy'
  if (cover < 5) risk = 'critical'
  else if (cover < 9) risk = 'watch'
  return { ...s, forecastDemand, cover, recommendRestock, risk }
}

// --- Per-SKU inventory snapshot + forecast ---
export const SKUS = [
  buildSku({
    id: 'ipad-a16',
    name: 'iPad (A16) Wi-Fi 128GB',
    category: 'แท็บเล็ต',
    onHand: 8,
    sellThrough: 3, // avg units/week in a normal week
    promoUplift: 4, // ×demand expected from Back to School
    reason: 'รุ่นยอดนิยมช่วงเปิดเทอม + โปรผ่อน 0% นาน 10 เดือน',
    emoji: '📱',
  }),
  buildSku({
    id: 'ip15-128',
    name: 'iPhone 15 128GB',
    category: 'สมาร์ตโฟน',
    onHand: 14,
    sellThrough: 5,
    promoUplift: 2.2,
    reason: 'ดีมานด์เพิ่มจากแพ็กเกจ 5G + เทรดอินช่วงโปร',
    emoji: '📲',
  }),
  buildSku({
    id: 'wifi6-router',
    name: 'True Smart WiFi 6 Router',
    category: 'อุปกรณ์เน็ตบ้าน',
    onHand: 26,
    sellThrough: 4,
    promoUplift: 1.3,
    reason: 'ดีมานด์คงที่ ไม่ได้รับผลจากแคมเปญเปิดเทอมมากนัก',
    emoji: '📶',
  }),
  buildSku({
    id: 'sim-5g',
    name: 'ซิม 5G เติมเงิน (แพ็กนักเรียน)',
    category: 'ซิม',
    onHand: 320,
    sellThrough: 90,
    promoUplift: 1.6,
    reason: 'สต็อกซิมสูงมาก รองรับดีมานด์เปิดเทอมได้สบาย',
    emoji: '📇',
  }),
]

// --- Workflow canvas nodes (n8n / Power Automate style) ---
export const NODES = [
  {
    id: 'trigger',
    icon: '⏰',
    title: 'Schedule Trigger',
    subtitle: 'ทุกวันจันทร์ 07:00',
    kind: 'trigger',
    detail:
      'ตัวจับเวลาเริ่มเวิร์กโฟลว์อัตโนมัติทุกต้นสัปดาห์ ก่อนร้านเปิด ผู้จัดการจะได้รายงานพร้อมก่อนเริ่มงาน',
    tech: 'Cron / Schedule node — ตั้งเวลาแบบรายสัปดาห์',
  },
  {
    id: 'stock',
    icon: '📦',
    title: 'Pull Stock Levels',
    subtitle: 'ดึงสต็อกรายสาขา',
    kind: 'data',
    detail:
      'ดึงจำนวนคงเหลือต่อ SKU และอัตราการขาย (sell-through) ย้อนหลังจากระบบคลังของสาขา',
    tech: 'HTTP Request → Inventory API (mock ในต้นแบบนี้)',
  },
  {
    id: 'scan',
    icon: '🌐',
    title: 'Scan Ecosystem',
    subtitle: 'ตรวจจับแคมเปญ/โปรโมชัน',
    kind: 'data',
    detail:
      'สแกนปฏิทินแคมเปญการตลาด ข่าวเปิดตัวสินค้า และโปรของคู่แข่ง เพื่อหา “สัญญาณ” ที่จะดันดีมานด์ เช่น Back to School, เปิดตัว iPhone, โปรวันเงินเดือนออก',
    tech: 'API แคมเปญภายใน + เว็บคู่แข่ง',
  },
  {
    id: 'forecast',
    icon: '🧠',
    title: 'AI Forecast',
    subtitle: 'หัวใจของ Agent',
    kind: 'agent',
    detail:
      'นำดีมานด์ปกติ × ตัวคูณจากแคมเปญ เทียบกับสต็อกคงเหลือ + อัตราการขาย → คำนวณ “วันที่สต็อกจะหมด (days of cover)” และให้คะแนนความเสี่ยงต่อ SKU',
    tech: 'AI reasoning step — perceive → reason → decide',
  },
  {
    id: 'decision',
    icon: '⚖️',
    title: 'Risk Decision',
    subtitle: 'แยกเสี่ยง / ปลอดภัย',
    kind: 'decision',
    detail:
      'ตัดสินใจแบบมีเงื่อนไข: ถ้า days of cover < 5 วัน → ติดธงแดง (ต้องเติมด่วน), 5–9 วัน → เฝ้าระวัง, มากกว่านั้น → ปลอดภัย',
    tech: 'IF / Switch node — branch ตามคะแนนความเสี่ยง',
  },
  {
    id: 'line',
    icon: '💬',
    title: 'Send LINE Report',
    subtitle: 'แจ้งผู้จัดการสาขา',
    kind: 'action',
    detail:
      'สรุปเป็นข้อความพร้อมคำแนะนำจำนวนที่ควรเติม ส่งเข้า LINE ของผู้จัดการโดยตรง (ช่องทางที่ผู้จัดการใช้จริงทุกวัน)',
    tech: 'LINE Messaging API / LINE Notify',
  },
  {
    id: 'log',
    icon: '📊',
    title: 'Log to Dashboard',
    subtitle: 'บันทึก + เฝ้าระวังต่อ',
    kind: 'action',
    detail:
      'บันทึกผลการพยากรณ์ลงแดชบอร์ดส่วนกลาง และถ้าเป็นความเสี่ยงระดับวิกฤติหลายสาขา จะ escalate ให้ผู้จัดการเขต',
    tech: 'Database + เงื่อนไข escalate',
  },
]

// edges of the graph: [fromId, toId]
export const EDGES = [
  ['trigger', 'stock'],
  ['trigger', 'scan'],
  ['stock', 'forecast'],
  ['scan', 'forecast'],
  ['forecast', 'decision'],
  ['decision', 'line'],
  ['decision', 'log'],
]

// --- The mock LINE report content ---
export const LINE_REPORT = {
  botName: 'True Stock Sentinel',
  time: 'จันทร์ 07:02',
  greeting: 'สวัสดีตอนเช้าครับคุณนภัส ☀️ รายงานสต็อกประจำสัปดาห์มาแล้ว',
  campaignLine: `พบแคมเปญ “${CAMPAIGN.name}” (${CAMPAIGN.window}) — คาดดีมานด์บางรายการพุ่งสูง`,
  atRisk: [
    {
      emoji: '📱',
      name: 'iPad (A16) 128GB',
      msg: 'เหลือ 8 เครื่อง · คาดขาย ~12/สัปดาห์ช่วงโปร → สต็อกหมดใน ~4.7 วัน (ก่อนเสาร์-อาทิตย์)',
      action: 'แนะนำเติม +20 เครื่อง ก่อนพฤหัสฯ',
    },
  ],
  watch: [
    {
      emoji: '📲',
      name: 'iPhone 15 128GB',
      msg: 'เหลือ 14 เครื่อง → คุ้มราว 8.9 วัน',
      action: 'เฝ้าระวัง ยังไม่ต้องเติม',
    },
  ],
  healthy: 'อุปกรณ์เน็ตบ้าน + ซิม 5G สต็อกเพียงพอ ✅',
  cta: 'กดดูรายละเอียดและสั่งเติมสต็อก',
}

// --- Before / After impact ---
export const IMPACT = {
  before: {
    title: 'ก่อนมี Sentinel',
    tone: 'bad',
    points: [
      'รู้ว่าของหมดตอนลูกค้ามาถามหน้าร้าน',
      'iPad หมดช่วงโปรเปิดเทอม — เติมไม่ทัน',
      'ลูกค้าเดินไปซื้อ iPad จาก AIS แทน',
      'ยอดขายหลุดมือ + เสียลูกค้าให้คู่แข่ง',
    ],
  },
  after: {
    title: 'หลังมี Sentinel',
    tone: 'good',
    points: [
      'ได้รับเตือนล่วงหน้า ~5 วันก่อนโปรเริ่ม',
      'เติม iPad +20 เครื่องทันก่อนสุดสัปดาห์',
      'ลูกค้าได้ของที่ True ไม่ต้องไปคู่แข่ง',
      'ปิดการขายได้ + รักษาลูกค้าไว้',
    ],
  },
  values: [
    { icon: '🛡️', text: 'กันยอดขายหลุดไปคู่แข่ง (AIS)' },
    { icon: '📈', text: 'ตัดสินใจเติมสต็อกแบบมีข้อมูล ไม่ใช่เดา' },
    { icon: '🧘', text: 'ผู้จัดการไม่ต้องนั่งเช็คสต็อกเอง ระบบทำให้' },
  ],
}
