"use client"

import { useRef } from "react"
import { live } from "../live"
import { frame, screenToImg, view } from "../stage/view"
import { useLive } from "./useLive"

// Hover a character in either painting and a quiet caption names them.
type Spot = { art: 0 | 1; box: [number, number, number, number]; name: string; from: string }

const SPOTS: Spot[] = [
  { art: 0, box: [0.17, 0.03, 0.35, 0.42], name: "Jin Sakai", from: "Ghost of Tsushima" },
  { art: 0, box: [0.39, 0.0, 0.58, 0.27], name: "Eren Yeager", from: "Attack on Titan" },
  { art: 0, box: [0.67, 0.0, 0.88, 0.33], name: "Johan Liebert", from: "Monster" },
  { art: 0, box: [0.58, 0.4, 0.74, 0.68], name: "Cursed energy", from: "Jujutsu Kaisen" },
  { art: 0, box: [0.75, 0.3, 1.0, 0.6], name: "Hisoka × Chrollo", from: "Hunter × Hunter" },
  { art: 0, box: [0.92, 0.72, 0.99, 0.87], name: "The night shift", from: "chief morale officer" },
  { art: 0, box: [0.41, 0.57, 0.6, 0.98], name: "Me, 3 a.m.", from: "shipping it" },
  { art: 1, box: [0.0, 0.17, 0.3, 0.92], name: "Guts", from: "Berserk" },
  { art: 1, box: [0.32, 0.0, 0.56, 0.42], name: "Sōsuke Aizen", from: "Bleach" },
  { art: 1, box: [0.64, 0.05, 0.86, 0.5], name: "Light Yagami", from: "Death Note" },
  { art: 1, box: [0.88, 0.08, 0.99, 0.3], name: "Ryuk", from: "watching" },
  { art: 1, box: [0.06, 0.0, 0.2, 0.12], name: "The Eclipse", from: "Berserk" },
]

export function ArtLabels() {
  const el = useRef<HTMLDivElement>(null)
  const name = useRef<HTMLSpanElement>(null)
  const from = useRef<HTMLSpanElement>(null)
  const shown = useRef<Spot | null>(null)
  const a = useRef(0)

  useLive((dt) => {
    const v = view(live.scroll)
    const ok = v.bright > 0.95 && v.zoom < 2.8 && Math.abs(live.velocity) < 25 && live.px.x > -1e3
    let hit: Spot | null = null
    if (ok) {
      const f = frame(v, live.w, live.h)
      const { u, v: vv } = screenToImg(live.px.x, live.px.y, f, live.w, live.h)
      hit = SPOTS.find((s) => s.art === v.art && u > s.box[0] && u < s.box[2] && vv > s.box[1] && vv < s.box[3]) ?? null
    }
    if (hit && hit !== shown.current) {
      shown.current = hit
      if (name.current) name.current.textContent = hit.name
      if (from.current) from.current.textContent = hit.from
    }
    a.current += ((hit ? 1 : 0) - a.current) * Math.min(1, dt * 8)
    if (!el.current) return
    el.current.style.opacity = a.current.toFixed(3)
    el.current.style.transform = `translate3d(${live.px.x + 18}px, ${live.px.y + 16}px, 0)`
  })

  return (
    <div ref={el} className="pointer-events-none fixed left-0 top-0 z-30 hidden opacity-0 sm:block" aria-hidden>
      <div className="flex items-center gap-2 border-l border-blood bg-black/55 px-3 py-1.5 backdrop-blur-sm">
        <span ref={name} className="font-serif text-base italic text-white" />
        <span ref={from} className="smallcaps !text-[9px] text-white/50" />
      </div>
    </div>
  )
}
