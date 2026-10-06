"use client"

import { useEffect, useRef } from "react"
import { sound } from "@/lib/sound"
import { live } from "../live"
import { useLive } from "../acts/useLive"

// A small brush-point cursor with a trailing ring. Over anything clickable the
// ring opens up and the element leans magnetically toward the pointer.

const INTERACTIVE = "a, button, input, textarea, select, label, [data-magnetic]"

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLSpanElement>(null)
  const state = useRef({ x: -100, y: -100, rx: -100, ry: -100, over: false, scale: 1, enabled: false })
  const magnet = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    if (!fine) return
    state.current.enabled = true
    document.documentElement.classList.add("has-cursor")
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE) as HTMLElement | null
      if (el && el !== magnet.current) sound.tick()
      if (magnet.current && magnet.current !== el) magnet.current.style.transform = ""
      magnet.current = el && !el.matches("input, textarea, select") ? el : null
      state.current.over = !!el
    }
    window.addEventListener("pointerover", over, { passive: true })
    return () => {
      window.removeEventListener("pointerover", over)
      document.documentElement.classList.remove("has-cursor")
    }
  }, [])

  useLive((dt) => {
    const s = state.current
    if (!s.enabled) return
    s.x = live.px.x
    s.y = live.px.y
    const k = 1 - Math.exp(-dt * 18)
    s.rx += (s.x - s.rx) * k
    s.ry += (s.y - s.ry) * k
    s.scale += ((s.over ? 1.9 : 1) - s.scale) * (1 - Math.exp(-dt * 14))
    if (dot.current) dot.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`
    if (ring.current) ring.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) scale(${s.scale})`
    if (hint.current) hint.current.style.opacity = s.over || Math.abs(live.velocity) > 4 ? "0" : "0.55"
    // magnetic pull: the hovered element leans toward the pointer
    const m = magnet.current
    if (m) {
      const r = m.getBoundingClientRect()
      const dx = (s.x - (r.left + r.width / 2)) * 0.22
      const dy = (s.y - (r.top + r.height / 2)) * 0.22
      m.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
    }
  })

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[60] hidden [.has-cursor_&]:block" aria-hidden>
      <div ref={dot} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-blood shadow-[0_0_10px_#ff2a3a]" />
      <div ref={ring} className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-white/40 mix-blend-difference">
        <span ref={hint} className="smallcaps absolute left-10 top-2.5 whitespace-nowrap !text-[8px] text-white transition-opacity duration-300">
          drag to slash
        </span>
      </div>
    </div>
  )
}
