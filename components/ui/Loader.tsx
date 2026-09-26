"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useProgress } from "@react-three/drei"
import { useRoom } from "@/lib/store"

// The loading screen is a tiny game so nobody bounces while the world downloads:
// desktop races Farhan's 120 WPM, phones catch falling sakura petals.
// "Enter" appears as soon as the world is ready; idle visitors are let in automatically.

const FARHAN_WPM = 120
const LINES = [
  "const farhan = new Developer({ fuel: 'chai' })",
  "git commit -m 'ship it, fix it in prod'",
  "npm run build && deploy --to the-moon",
  "if (bug) { askTheRubberDuck() }",
  "while (alive) { code(); eat(); sleep(6) }",
]

export function Loader() {
  const { progress, active } = useProgress()
  const phase = useRoom((s) => s.phase)
  const [ready, setReady] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const [touch, setTouch] = useState<boolean | null>(null)
  const enter = () => useRoom.getState().setPhase("room")
  const play = useCallback(() => setEngaged(true), [])

  const sawLoading = useRef(false)
  const [minTime, setMinTime] = useState(false)
  if (active) sawLoading.current = true

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768)
    const min = setTimeout(() => setMinTime(true), 2500)
    const bail = setTimeout(() => setReady(true), 15000)
    return () => {
      clearTimeout(min)
      clearTimeout(bail)
    }
  }, [])

  // ready = downloads actually started and finished (not just "nothing queued yet")
  useEffect(() => {
    if (minTime && sawLoading.current && !active && progress >= 100) {
      const t = setTimeout(() => setReady(true), 300)
      return () => clearTimeout(t)
    }
  }, [active, progress, minTime])

  // idle visitors walk straight in once it's ready; players decide when to leave
  useEffect(() => {
    if (!ready || engaged || phase !== "loading") return
    const t = setTimeout(enter, 3500)
    return () => clearTimeout(t)
  }, [ready, engaged, phase])

  const pct = ready ? 100 : Math.round(progress)

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 overflow-hidden bg-[radial-gradient(ellipse_at_50%_120%,#3a1f5c_0%,#150b26_55%,#07051a_100%)]"
          exit={{ clipPath: "circle(0% at 50% 50%)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
          style={{ clipPath: "circle(150% at 50% 50%)" }}
        >
          {touch === null ? null : touch ? <PetalGame onPlay={play} /> : <TypeRace onPlay={play} ready={ready} />}

          {/* footer: progress + enter */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 pb-6 sm:px-[6vw] sm:pb-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
              <p className="hidden sm:block">farhan babar · portfolio</p>
              <div className="mt-2 h-px w-40 overflow-hidden bg-white/10 sm:w-56">
                <motion.div className="h-full bg-gradient-to-r from-[#ff4fd8] to-cyan" animate={{ width: `${pct}%` }} transition={{ ease: "easeOut" }} />
              </div>
              <p className="mt-2 text-[10px] normal-case tracking-normal text-muted/80">{ready ? "world ready" : `building the world… ${pct}%`}</p>
            </div>
            <AnimatePresence>
              {ready && (
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={enter}
                  className="focus-ring pointer-events-auto shrink-0 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg shadow-[0_0_40px_rgba(255,79,216,0.45)] transition hover:scale-105"
                >
                  Enter the world →
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Desktop: beat my WPM ──────────────────────────────────────────────

function TypeRace({ onPlay, ready }: { onPlay: () => void; ready: boolean }) {
  const line = useMemo(() => LINES[Math.floor(Math.random() * LINES.length)], [])
  const [typed, setTyped] = useState("")
  const [start, setStart] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const [done, setDone] = useState<{ wpm: number; acc: number } | null>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    input.current?.focus()
    const id = setInterval(() => setNow(performance.now()), 100)
    return () => clearInterval(id)
  }, [])

  const correct = [...typed].filter((c, i) => c === line[i]).length
  const minutes = start ? Math.max(1 / 600, ((done ? now : performance.now()) - start) / 60000) : 0
  const liveWpm = start ? Math.round(correct / 5 / minutes) : 0

  const onChange = (v: string) => {
    if (done) return
    if (!start && v.length) {
      setStart(performance.now())
      onPlay()
    }
    const next = v.slice(0, line.length)
    setTyped(next)
    if (next.length === line.length) {
      const mins = (performance.now() - (start ?? performance.now())) / 60000
      const ok = [...next].filter((c, i) => c === line[i]).length
      const wpm = Math.round(ok / 5 / Math.max(mins, 1 / 600))
      const acc = Math.round((ok / line.length) * 100)
      setDone({ wpm, acc })
      useRoom.setState({ loaderScore: { kind: "wpm", value: wpm } })
    }
  }

  const beat = done && done.wpm > FARHAN_WPM
  void now

  // finished + world ready: Enter walks in
  useEffect(() => {
    if (!done || !ready) return
    const k = (e: KeyboardEvent) => e.key === "Enter" && useRoom.getState().setPhase("room")
    window.addEventListener("keydown", k)
    return () => window.removeEventListener("keydown", k)
  }, [done, ready])

  return (
    <div className="flex h-full flex-col items-center justify-center px-6" onClick={() => input.current?.focus()}>
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff7fc8]">while the world loads</p>
      <h1 className="mt-3 text-center text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-none tracking-tight">
        Beat my <span className="bg-gradient-to-r from-[#ff4fd8] to-cyan bg-clip-text text-transparent">{FARHAN_WPM} WPM</span>
      </h1>
      <p className="mt-3 text-sm text-muted">{start ? "go go go" : "start typing — the clock starts on your first key"}</p>

      <div className="relative mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 font-mono text-[clamp(1rem,1.8vw,1.35rem)] leading-relaxed shadow-[0_0_80px_-20px_rgba(177,140,255,0.5)]">
        {[...line].map((ch, i) => {
          const t = typed[i]
          const cls = t === undefined ? "text-white/35" : t === ch ? "text-ink" : "bg-red-500/30 text-red-300"
          return (
            <span key={i} className={`relative ${cls}`}>
              {i === typed.length && !done && <span className="absolute -left-[1px] top-[0.15em] h-[1.1em] w-[2px] animate-pulse bg-[#ff7fc8]" />}
              {ch === " " ? " " : ch}
            </span>
          )
        })}
        <input
          ref={input}
          value={typed}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0"
          aria-label="Type the line of code shown"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      <div className="mt-8 flex items-end gap-10 font-mono">
        <Stat label="you" value={done ? done.wpm : liveWpm} accent={beat ? "#6fffc0" : "#ffffff"} />
        <Stat label="farhan" value={FARHAN_WPM} accent="#ff7fc8" />
        {done && <Stat label="accuracy" value={`${done.acc}%`} accent="#8fd8ff" />}
      </div>

      <AnimatePresence>
        {done && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center text-lg">
            {beat ? "Okay, you're hired. 🫡" : done.wpm > 80 ? "Not bad at all — close the gap." : "The duck believes in you. 🦆"}
            {ready && <span className="ml-2 font-mono text-xs text-muted">press ⏎ to enter</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-semibold tabular-nums sm:text-5xl" style={{ color: accent, textShadow: `0 0 30px ${accent}66` }}>
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted">{label}</p>
    </div>
  )
}

// ── Phones: catch the petals ──────────────────────────────────────────

type Petal = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; hue: number; caught: number }
type Pop = { x: number; y: number; t: number }

function PetalGame({ onPlay }: { onPlay: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const played = useRef(false)

  useEffect(() => {
    const c = canvas.current!
    const g = c.getContext("2d")!
    const dpr = Math.min(2, window.devicePixelRatio)
    let w = 0
    let h = 0
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
    }
    resize()
    window.addEventListener("resize", resize)
    const petals: Petal[] = []
    const pops: Pop[] = []
    const spawn = () =>
      petals.push({ x: Math.random() * w, y: -20, vx: (Math.random() - 0.5) * 30, vy: 40 + Math.random() * 60, r: 9 + Math.random() * 8, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 3, hue: Math.random(), caught: 0 })
    let last = performance.now()
    let acc = 0
    let raf = 0
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      acc += dt
      if (acc > 0.28) {
        acc = 0
        spawn()
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, w, h)
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        p.x += (p.vx + Math.sin(t / 700 + p.hue * 10) * 25) * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        if (p.y > h + 30) {
          petals.splice(i, 1)
          continue
        }
        g.save()
        g.translate(p.x, p.y)
        g.rotate(p.rot)
        g.shadowColor = "#ff7fc8"
        g.shadowBlur = 14
        g.fillStyle = p.hue > 0.5 ? "#ffc2e0" : "#ff8fc8"
        g.beginPath()
        g.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2)
        g.fill()
        g.restore()
      }
      for (let i = pops.length - 1; i >= 0; i--) {
        const q = pops[i]
        q.t += dt
        if (q.t > 0.5) {
          pops.splice(i, 1)
          continue
        }
        g.strokeStyle = `rgba(255,190,240,${1 - q.t * 2})`
        g.lineWidth = 2
        g.beginPath()
        g.arc(q.x, q.y, 10 + q.t * 70, 0, Math.PI * 2)
        g.stroke()
        g.fillStyle = `rgba(255,255,255,${1 - q.t * 2})`
        g.font = "600 16px system-ui"
        g.fillText("+1", q.x + 8, q.y - 10 - q.t * 40)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const tap = (e: PointerEvent) => {
      const rect = c.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        if (Math.hypot(p.x - x, p.y - y) < p.r + 26) {
          petals.splice(i, 1)
          pops.push({ x: p.x, y: p.y, t: 0 })
          scoreRef.current += 1
          setScore(scoreRef.current)
          useRoom.setState({ loaderScore: { kind: "petals", value: scoreRef.current } })
          if (!played.current) {
            played.current = true
            onPlay()
          }
          navigator.vibrate?.(8)
          break
        }
      }
    }
    c.addEventListener("pointerdown", tap)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      c.removeEventListener("pointerdown", tap)
    }
  }, [onPlay])

  return (
    <div className="relative h-full">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full touch-none" aria-label="Tap the falling petals to catch them" />
      <div className="pointer-events-none absolute inset-x-0 top-[18%] text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff7fc8]">while the world loads</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Catch the petals</h1>
        <p className="mt-2 text-sm text-muted">tap them before they fall 🌸</p>
        <p className="mt-6 text-6xl font-semibold tabular-nums [text-shadow:0_0_30px_#ff7fc8]">{score}</p>
      </div>
    </div>
  )
}
