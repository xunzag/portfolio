"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useProgress } from "@react-three/drei"
import { useRoom } from "@/lib/store"

const BOOT = [
  "[ ok ] mounting /home/farhan",
  "[ ok ] brewing chai ☕",
  "[ ok ] untangling headphone cable",
  "[ ok ] waking up the rubber duck 🦆",
  "[ ok ] syncing anime watchlist",
  "[ ok ] compiling the room — shaders, lights, vibes",
]

export function Loader() {
  const { progress, active } = useProgress()
  const phase = useRoom((s) => s.phase)
  const setPhase = useRoom((s) => s.setPhase)
  const [lines, setLines] = useState(0)
  const [minTimeDone, setMinTimeDone] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setLines((n) => Math.min(n + 1, BOOT.length)), 260)
    const t = setTimeout(() => setMinTimeDone(true), 1500)
    return () => {
      clearInterval(id)
      clearTimeout(t)
    }
  }, [])

  const loaded = (!active && progress >= 100) || (minTimeDone && progress === 0 && !active)
  useEffect(() => {
    if (phase === "loading" && loaded && minTimeDone) setPhase("ready")
  }, [loaded, minTimeDone, phase, setPhase])

  // Never trap anyone behind the loader.
  useEffect(() => {
    const t = setTimeout(() => {
      if (useRoom.getState().phase === "loading") setPhase("ready")
    }, 9000)
    return () => clearTimeout(t)
  }, [setPhase])

  const pct = Math.round(phase === "loading" ? progress : 100)

  return (
    <AnimatePresence>
      {(phase === "loading" || phase === "ready") && (
        <motion.div
          key="loader"
          className="absolute inset-0 z-50 flex items-center justify-center bg-bg/80 px-4 backdrop-blur-sm"
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <div className="w-full max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">farhan-os v2.0 · booting</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Farhan <span className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">Babar</span>
            </h1>
            <p className="mt-2 text-muted">Full stack developer. Welcome to my room.</p>

            <div className="mt-8 space-y-1 font-mono text-xs text-muted" aria-hidden>
              {BOOT.slice(0, lines).map((l) => (
                <motion.p key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="text-mint">{l.slice(0, 6)}</span>
                  {l.slice(6)}
                </motion.p>
              ))}
            </div>

            <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-violet to-cyan" animate={{ width: `${pct}%` }} transition={{ ease: "easeOut" }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[11px] text-muted">
              <span>{phase === "ready" ? "ready" : "loading assets"}</span>
              <span>{pct}%</span>
            </div>

            <AnimatePresence>
              {phase === "ready" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                  <button
                    autoFocus
                    onClick={() => setPhase("intro")}
                    className="focus-ring group relative w-full overflow-hidden rounded-xl bg-ink px-6 py-4 text-base font-semibold text-bg transition hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <span className="relative z-10">Enter the room →</span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-violet/0 via-violet/30 to-violet/0 transition duration-700 group-hover:translate-x-full" />
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">
                    Click objects to explore · keys <span className="kbd">1</span>–<span className="kbd">5</span> · <span className="kbd">Esc</span> to step back
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
