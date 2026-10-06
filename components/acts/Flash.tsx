"use client"

import { useRef } from "react"
import { RANGES, band, ss } from "@/lib/acts"
import { live } from "../live"
import { view } from "../stage/view"
import { useLive } from "./useLive"

// White-hot flashes between acts (into the monitor, into the eclipse).
export function Flash() {
  const el = useRef<HTMLDivElement>(null)
  const black = useRef<HTMLDivElement>(null)
  const glyph = useRef<HTMLSpanElement>(null)
  useLive(() => {
    // the cut to black before the eclipse: one held frame, one kanji
    const f0 = RANGES.finale[0]
    const s = live.scroll
    const b = band(s, f0 - 30, f0 - 10, f0 + 12, f0 + 24)
    if (black.current) {
      black.current.style.opacity = b.toFixed(3)
      black.current.style.visibility = b > 0.001 ? "visible" : "hidden"
    }
    if (glyph.current) {
      const g = band(s, f0 - 14, f0 - 6, f0 + 6, f0 + 16)
      glyph.current.style.opacity = g.toFixed(3)
      glyph.current.style.transform = `scale(${1.25 - ss(f0 - 14, f0 + 16, s) * 0.25})`
      glyph.current.style.filter = `blur(${(1 - g) * 12}px)`
    }
    if (!el.current) return
    const v = view(live.scroll)
    el.current.style.opacity = v.flash.toFixed(3)
    // the monitor glows cold, the eclipse burns
    el.current.style.background = live.scroll < RANGES.arsenal[0] ? "radial-gradient(circle at 50% 50%, #ffffff, #bfe6ff 60%, #6aa8ff)" : "radial-gradient(circle at 50% 50%, #ffffff, #ffc9c0 50%, #ff3a2a)"
  })
  return (
    <>
      <div ref={el} className="pointer-events-none fixed inset-0 z-[15] opacity-0" aria-hidden />
      <div ref={black} className="pointer-events-none invisible fixed inset-0 z-[15] grid place-items-center bg-black" aria-hidden>
        <span ref={glyph} className="font-jp text-[min(34vh,40vw)] font-light leading-none text-blood [text-shadow:0_0_60px_rgba(224,36,47,0.6)]">
          蝕
        </span>
      </div>
    </>
  )
}
