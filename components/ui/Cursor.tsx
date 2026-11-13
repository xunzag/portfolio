"use client"

import { useEffect, useRef } from "react"
import { sound } from "@/lib/sound"

// A glowing point with a trailing ring. Over anything clickable in the DOM the
// ring opens up and the element leans towards the pointer; the 3D world sets
// body.style.cursor = "pointer" for its own buttons and the ring reacts to that too.
const INTERACTIVE = "a, button, input, textarea, select, label"

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    document.documentElement.classList.add("has-cursor")
    const s = { x: -100, y: -100, rx: -100, ry: -100, scale: 1, over: false }
    let magnet: HTMLElement | null = null
    const move = (e: PointerEvent) => {
      s.x = e.clientX
      s.y = e.clientY
    }
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE) as HTMLElement | null
      if (el && el !== magnet) sound.tick()
      if (magnet && magnet !== el) magnet.style.transform = ""
      magnet = el && !el.matches("input, textarea, select") ? el : null
      s.over = !!el
    }
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const k = 1 - Math.exp(-dt * 18)
      s.rx += (s.x - s.rx) * k
      s.ry += (s.y - s.ry) * k
      const hot = s.over || document.body.style.cursor === "pointer"
      s.scale += ((hot ? 1.9 : 1) - s.scale) * (1 - Math.exp(-dt * 14))
      if (dot.current) dot.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) scale(${s.scale})`
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        magnet.style.transform = `translate(${((s.x - (r.left + r.width / 2)) * 0.2).toFixed(1)}px, ${((s.y - (r.top + r.height / 2)) * 0.2).toFixed(1)}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerover", over, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", over)
      document.documentElement.classList.remove("has-cursor")
    }
  }, [])

  return (
    <div className="cursor-layer pointer-events-none fixed left-0 top-0 z-[60]" aria-hidden>
      <div ref={dot} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-[#ff7fd8] shadow-[0_0_10px_#ff4fd8]" />
      <div ref={ring} className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-white/50 mix-blend-difference" />
    </div>
  )
}
