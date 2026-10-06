"use client"

import { useRef } from "react"
import { RANGES } from "@/lib/acts"
import { live } from "../live"
import { view } from "../stage/view"
import { useLive } from "./useLive"

// White-hot flashes between acts (into the monitor, into the eclipse).
export function Flash() {
  const el = useRef<HTMLDivElement>(null)
  useLive(() => {
    if (!el.current) return
    const v = view(live.scroll)
    el.current.style.opacity = v.flash.toFixed(3)
    // the monitor glows cold, the eclipse burns
    el.current.style.background = live.scroll < RANGES.arsenal[0] ? "radial-gradient(circle at 50% 50%, #ffffff, #bfe6ff 60%, #6aa8ff)" : "radial-gradient(circle at 50% 50%, #ffffff, #ffc9c0 50%, #ff3a2a)"
  })
  return <div ref={el} className="pointer-events-none fixed inset-0 z-[15] opacity-0" aria-hidden />
}
