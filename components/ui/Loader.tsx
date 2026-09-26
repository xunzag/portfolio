"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useProgress } from "@react-three/drei"
import { useRoom } from "@/lib/store"

const BOOT = ["igniting the engine", "wiring the neon", "wetting the asphalt", "waking the rubber duck 🦆", "syncing anime watchlist"]

// Auto-dismissing boot screen: no click needed, never blocks longer than 9s.
export function Loader() {
  const { progress, active } = useProgress()
  const phase = useRoom((s) => s.phase)
  const [line, setLine] = useState(0)
  const [minDone, setMinDone] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setLine((n) => (n + 1) % BOOT.length), 420)
    const t = setTimeout(() => setMinDone(true), 1600)
    const bail = setTimeout(() => useRoom.getState().setPhase("room"), 9000)
    return () => {
      clearInterval(id)
      clearTimeout(t)
      clearTimeout(bail)
    }
  }, [])

  useEffect(() => {
    if (phase === "loading" && minDone && !active && (progress >= 100 || progress === 0)) {
      const t = setTimeout(() => useRoom.getState().setPhase("room"), 250)
      return () => clearTimeout(t)
    }
  }, [phase, minDone, active, progress])

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex items-end justify-between bg-bg px-5 pb-8 sm:px-[6vw] sm:pb-12"
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted">farhan-os · booting</p>
            <AnimatePresence mode="wait">
              <motion.p key={line} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-2 font-mono text-sm text-cyan">
                › {BOOT[line]}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="font-semibold tabular-nums tracking-tighter text-[clamp(4rem,14vw,11rem)] leading-none">
            {Math.round(progress)}
            <span className="text-violet">%</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
