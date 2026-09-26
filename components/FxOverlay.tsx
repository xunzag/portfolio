"use client"

import { useEffect, useRef } from "react"
import { TOTAL_VH } from "@/lib/chapters"
import { live } from "./world/live"

// Screen-space effects that ride on scroll: warp flash between worlds,
// speed lines when you scroll fast, and a thin progress bar.
export function FxOverlay() {
  const flash = useRef<HTMLDivElement>(null)
  const lines = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    let speed = 0
    const loop = () => {
      const f = live.frame
      if (flash.current) flash.current.style.opacity = String(f.flash)
      const moving = f.chapter === "work" || f.chapter === "portal"
      const target = moving ? Math.min(1, Math.abs(live.velocity) * 0.09) : 0
      speed += (target - speed) * 0.12
      if (lines.current) lines.current.style.opacity = String(speed * 0.55 + (f.chapter === "portal" ? f.t * f.t * 0.6 : 0))
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, live.scroll / (TOTAL_VH - 100))})`
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <>
      <div ref={lines} aria-hidden className="speed-lines pointer-events-none fixed inset-0 z-[5] opacity-0" />
      <div
        ref={flash}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[6] opacity-0"
        style={{ background: "radial-gradient(circle at 50% 50%, #ffffff 0%, #f3d9ff 35%, #b59bff 70%, #6a4cff 100%)" }}
      />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[2px] bg-white/5">
        <div ref={bar} className="h-full origin-left bg-gradient-to-r from-[#ff4fd8] via-violet to-cyan" style={{ transform: "scaleX(0)" }} />
      </div>
    </>
  )
}
