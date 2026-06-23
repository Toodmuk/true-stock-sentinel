// Data for the True Stock Sentinel app.
// Numbers are internally consistent so the agentic reasoning reads as real:
// forecastDemand = sellThrough * promoUplift, and
// daysOfCover = onHand / (forecastDemand / 7).

// --- The shop the agent is watching ---
export const SHOP = {
  name: 'True Shop CentralWorld',
  code: 'TS-CTW-014',
  manager: 'Naphat (Store Manager)',
  trafficPerDay: '200–300 visitors/day',
  weekendNote: 'Weekend sales run ~3× a weekday',
}

// --- The detected ecosystem signal that triggers the reasoning ---
export const CAMPAIGN = {
  name: 'Back to School 2026',
  window: '24 Jun – 6 Jul',
  source: 'Marketing campaign calendar + competitor promo pages',
  insight:
    'Back-to-school demand for iPad and laptops spikes, especially entry-price models bundled with 0% installment plans',
  confidence: 'High',
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
    category: 'Tablet',
    onHand: 8,
    sellThrough: 3, // avg units/week in a normal week
    promoUplift: 4, // ×demand expected from Back to School
    reason: 'Top back-to-school pick, paired with a 10-month 0% installment plan',
    emoji: '📱',
  }),
  buildSku({
    id: 'ip15-128',
    name: 'iPhone 15 128GB',
    category: 'Smartphone',
    onHand: 14,
    sellThrough: 5,
    promoUplift: 2.2,
    reason: 'Demand lifted by 5G plan bundles and trade-in offers during the promo',
    emoji: '📲',
  }),
  buildSku({
    id: 'wifi6-router',
    name: 'True Smart WiFi 6 Router',
    category: 'Home internet device',
    onHand: 26,
    sellThrough: 4,
    promoUplift: 1.3,
    reason: 'Steady demand, largely unaffected by the back-to-school campaign',
    emoji: '📶',
  }),
  buildSku({
    id: 'sim-5g',
    name: '5G Prepaid SIM (Student pack)',
    category: 'SIM',
    onHand: 320,
    sellThrough: 90,
    promoUplift: 1.6,
    reason: 'Very high SIM stock, comfortably covers back-to-school demand',
    emoji: '📇',
  }),
]

// --- Workflow canvas nodes (n8n / Power Automate style) ---
export const NODES = [
  {
    id: 'trigger',
    icon: '⏰',
    title: 'Schedule Trigger',
    subtitle: 'Every Monday 07:00',
    kind: 'trigger',
    detail:
      'A timer kicks off the workflow automatically at the start of each week, before the store opens, so the manager has the report ready before the shift begins.',
    tech: 'Cron / Schedule node — weekly schedule',
  },
  {
    id: 'stock',
    icon: '📦',
    title: 'Pull Stock Levels',
    subtitle: 'Per-store inventory',
    kind: 'data',
    detail:
      'Pulls on-hand quantity per SKU and recent sell-through rates from the store inventory system.',
    tech: 'HTTP Request → Inventory API',
  },
  {
    id: 'scan',
    icon: '🌐',
    title: 'Scan Ecosystem',
    subtitle: 'Detect campaigns / promos',
    kind: 'data',
    detail:
      'Scans the marketing campaign calendar, product-launch news, and competitor promos to find the signals that will drive demand — like Back to School, iPhone launches, and payday offers.',
    tech: 'Internal campaign API + competitor sites',
  },
  {
    id: 'forecast',
    icon: '🧠',
    title: 'AI Forecast',
    subtitle: 'The heart of the agent',
    kind: 'agent',
    detail:
      'Takes baseline demand × the campaign multiplier, compares it against on-hand stock and the sell-through rate, then computes days of cover and scores the risk for each SKU.',
    tech: 'AI reasoning step — perceive → reason → decide',
  },
  {
    id: 'decision',
    icon: '⚖️',
    title: 'Risk Decision',
    subtitle: 'Split at-risk / safe',
    kind: 'decision',
    detail:
      'Conditional logic: if days of cover < 5 → red flag (restock urgently), 5–9 → watch, more than that → safe.',
    tech: 'IF / Switch node — branch by risk score',
  },
  {
    id: 'line',
    icon: '💬',
    title: 'Send LINE Report',
    subtitle: 'Alert the store manager',
    kind: 'action',
    detail:
      'Summarizes everything into a message with a recommended restock quantity and sends it straight to the manager on LINE — the channel they use every day.',
    tech: 'LINE Messaging API / LINE Notify',
  },
  {
    id: 'log',
    icon: '📊',
    title: 'Log to Dashboard',
    subtitle: 'Record + keep watching',
    kind: 'action',
    detail:
      'Logs the forecast to a central dashboard, and if several stores hit critical risk at once, escalates to the area manager.',
    tech: 'Database + escalation rules',
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
  time: 'Mon 07:02',
  greeting: 'Good morning, Naphat ☀️ Your weekly stock report is in.',
  campaignLine: `Detected the “${CAMPAIGN.name}” campaign (${CAMPAIGN.window}) — demand for some items is expected to spike.`,
  atRisk: [
    {
      emoji: '📱',
      name: 'iPad (A16) 128GB',
      msg: '8 left · expected ~12/week during the promo → out of stock in ~4.7 days (before the weekend)',
      action: 'Recommend restocking +20 units before Thursday',
    },
  ],
  watch: [
    {
      emoji: '📲',
      name: 'iPhone 15 128GB',
      msg: '14 left → about 8.9 days of cover',
      action: 'Keep watching, no restock needed yet',
    },
  ],
  healthy: 'Home internet devices and 5G SIMs are well stocked ✅',
  cta: 'Tap for details and to reorder stock',
}

// --- Before / After impact ---
export const IMPACT = {
  before: {
    title: 'Without Sentinel',
    tone: 'bad',
    points: [
      'You learn stock is out when a customer asks at the counter',
      'iPad sells out during the back-to-school promo — too late to restock',
      'The customer walks over and buys an iPad from AIS instead',
      'Lost sale and a customer handed to a competitor',
    ],
  },
  after: {
    title: 'With Sentinel',
    tone: 'good',
    points: [
      'Get a heads-up ~5 days before the promo starts',
      'Restock +20 iPads in time for the weekend',
      'Customers get what they want at True, no need to go elsewhere',
      'Close the sale and keep the customer',
    ],
  },
  values: [
    { icon: '🛡️', text: 'Keep sales from slipping to competitors (AIS)' },
    { icon: '📈', text: 'Restock decisions backed by data, not guesswork' },
    { icon: '🧘', text: 'Managers no longer check stock by hand — the system does it' },
  ],
}
