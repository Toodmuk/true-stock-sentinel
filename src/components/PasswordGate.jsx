import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Brand } from './ui.jsx'

// Soft client-side gate (same pattern as the True Service Flow site).
// Note: a client-side password is NOT real security — it just keeps casual
// visitors out of the prototype. Anyone can read it in the bundle.
const PASSWORD = 'Tng2026@'
const KEY = 'tss-unlocked-v1'

export default function PasswordGate({ children }) {
  const [ok, setOk] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)

  if (ok) return children

  const submit = (e) => {
    e.preventDefault()
    if (val.trim() === PASSWORD) {
      try {
        localStorage.setItem(KEY, '1')
      } catch {
        /* ignore */
      }
      setOk(true)
    } else {
      setErr(true)
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-cloud px-6">
      <form
        onSubmit={submit}
        className="anim-pop w-full max-w-[360px] rounded-2xl border border-line bg-white p-6 shadow-card"
      >
        <div className="flex justify-center">
          <Brand />
        </div>
        <h1 className="mt-5 text-center text-[18px] font-bold text-ink">
          Sign in to True Stock Sentinel
        </h1>
        <p className="mt-1 text-center text-[13px] leading-relaxed text-ink-soft">
          Agentic AI for automated stock monitoring — enter your password to continue
        </p>

        <label htmlFor="tss-pw" className="sr-only">Password</label>
        <div
          className={`mt-5 flex items-center gap-2 rounded-xl border bg-cloud px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-true/40 ${
            err ? 'border-true' : 'border-line'
          }`}
        >
          <Lock className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
          <input
            id="tss-pw"
            type="password"
            autoFocus
            autoComplete="current-password"
            aria-invalid={err}
            aria-describedby={err ? 'tss-pw-err' : undefined}
            value={val}
            onChange={(e) => {
              setVal(e.target.value)
              setErr(false)
            }}
            placeholder="Password"
            className="w-full bg-transparent text-[16px] text-ink outline-none"
          />
        </div>
        {err && (
          <p id="tss-pw-err" role="alert" className="mt-2 text-[12px] font-medium text-true">Incorrect password, please try again</p>
        )}

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-true py-3 text-[15px] font-bold text-white shadow-sm transition active:scale-[0.98]"
        >
          Sign in
        </button>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-mute">
          True Stock Sentinel · True Corporation
        </p>
      </form>
    </div>
  )
}
