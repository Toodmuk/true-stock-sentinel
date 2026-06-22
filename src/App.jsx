import { useState } from 'react'
import PasswordGate from './components/PasswordGate.jsx'
import { Brand, LivePill } from './components/ui.jsx'
import Intro from './components/Intro.jsx'
import Workflow from './components/Workflow.jsx'
import Forecast from './components/Forecast.jsx'
import LineReport from './components/LineReport.jsx'
import Impact from './components/Impact.jsx'

const TABS = [
  { id: 'intro', label: 'แนวคิด', icon: '🎯', el: Intro },
  { id: 'workflow', label: 'เวิร์กโฟลว์', icon: '🔗', el: Workflow },
  { id: 'forecast', label: 'พยากรณ์ AI', icon: '🧠', el: Forecast },
  { id: 'line', label: 'รายงาน LINE', icon: '💬', el: LineReport },
  { id: 'impact', label: 'ผลลัพธ์', icon: '📈', el: Impact },
]

function Shell() {
  const [tab, setTab] = useState('intro')
  const Active = TABS.find((t) => t.id === tab).el

  return (
    <div className="flex min-h-full flex-col bg-cloud">
      {/* header */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Brand />
          <div className="hidden sm:block">
            <LivePill />
          </div>
        </div>
        {/* tab bar — horizontal scroll on small screens */}
        <nav className="mx-auto w-full max-w-5xl px-2 sm:px-6">
          <div className="no-scrollbar -mb-px flex gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const active = t.id === tab
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold transition ${
                    active
                      ? 'border-true text-true'
                      : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  <span className="text-[15px]">{t.icon}</span>
                  {t.label}
                </button>
              )
            })}
          </div>
        </nav>
      </header>

      {/* content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div key={tab} className="anim-fadeIn">
          <Active />
        </div>
      </main>

      {/* footer */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-1 px-4 py-4 text-[11px] text-ink-soft/70 sm:flex-row sm:items-center sm:px-6">
          <span>ต้นแบบแนวคิด · True Next Gen — ไม่ใช่ระบบจริง ข้อมูลเป็นตัวอย่างเพื่อการนำเสนอ</span>
          <span>True Stock Sentinel · Agentic AI</span>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <PasswordGate>
      <Shell />
    </PasswordGate>
  )
}
