"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { beats } from "@/lib/acts"
import { sound } from "@/lib/sound"
import { scrollBus, useRoom } from "@/lib/store"
import { cut } from "../cut"
import { live } from "../live"
import { useLive } from "./useLive"

// Drag across the screen (or swipe sideways on a phone) to cut to the next
// beat of the film. The stroke leaves a white-hot trail; the WebGL CutEffect
// splits the frozen frame along it.

type P = { x: number; y: number; t: number }

export function Slash() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const trail = useRef<P[]>([])
  const flash = useRef<{ a: P; b: P; t: number } | null>(null)
  const waitSince = useRef(0)

  useEffect(() => {
    let down: P | null = null
    let touch = false
    const blocked = (e: PointerEvent) =>
      (e.target as HTMLElement | null)?.closest?.("a, button, input, textarea, select, label, form, [data-noslash]") != null

    const onDown = (e: PointerEvent) => {
      const st = useRoom.getState()
      if (st.phase !== "room" || st.terminalOpen || cut.has || e.button !== 0 || blocked(e)) return
      touch = e.pointerType === "touch"
      down = { x: e.clientX, y: e.clientY, t: performance.now() }
      trail.current = [down]
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      trail.current.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      if (trail.current.length > 40) trail.current.shift()
    }
    const onUp = (e: PointerEvent) => {
      if (!down) return
      const b = { x: e.clientX, y: e.clientY, t: performance.now() }
      // judge the flick, not the whole drag: from the first point of the last 500ms
      const a = trail.current.find((p) => b.t - p.t < 500) ?? down
      down = null
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      const dt = b.t - a.t
      const w = window.innerWidth
      const h = window.innerHeight
      // touch: only clearly sideways swipes (vertical is scrolling)
      const ok = touch ? Math.abs(dx) > w * 0.35 && Math.abs(dx) > Math.abs(dy) * 1.8 && dt < 520 : dist > Math.max(170, Math.min(w, h) * 0.2) && dt < 520
      if (ok) slash(a, b)
    }

    const slash = (a: P, b: P) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const asp = w / h
      // line through the stroke in aspect-corrected uv (y up)
      const ax = (a.x / w) * asp
      const ay = 1 - a.y / h
      const bx = (b.x / w) * asp
      const by = 1 - b.y / h
      const len = Math.hypot(bx - ax, by - ay) || 1
      const tx = (bx - ax) / len
      const ty = (by - ay) / len
      cut.a = [(ax + bx) / 2 / asp, (ay + by) / 2]
      cut.n = [-ty, tx]
      cut.pending = true
      waitSince.current = performance.now()
      // extend the visible slash across the whole screen
      const ex = (b.x - a.x) / Math.hypot(b.x - a.x, b.y - a.y)
      const ey = (b.y - a.y) / Math.hypot(b.x - a.x, b.y - a.y)
      const far = Math.hypot(w, h)
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2
      flash.current = { a: { x: mx - ex * far, y: my - ey * far, t: 0 }, b: { x: mx + ex * far, y: my + ey * far, t: 0 }, t: performance.now() }
      document.documentElement.classList.add("cutting")
      sound.slash()
      navigator.vibrate?.(14)
    }

    window.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })
    window.addEventListener("pointercancel", () => (down = null))
    return () => {
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  const go = () => {
    const s = live.scroll
    const next = beats().find((b) => b > s + 6) ?? 0
    scrollBus.jump(next)
    cut.has = 1
    cut.open = 0
    gsap.killTweensOf(cut)
    // ?slowcut slows the cut down for inspection
    const slow = location.search.includes("slowcut") ? 10 : 1
    gsap.to(cut, {
      open: 1,
      duration: 1.05 * slow,
      delay: 0.14 * slow, // hit-stop: the frozen frame holds for a beat before it falls apart
      ease: "power3.inOut",
      onUpdate: () => {
        if (cut.open > 0.35) document.documentElement.classList.remove("cutting")
      },
      onComplete: () => {
        cut.has = 0
        cut.open = 0
      },
    })
  }

  useLive(() => {
    // the effect froze the frame → now cut to the next beat
    if (cut.snapped) {
      cut.snapped = false
      go()
    } else if (cut.pending && performance.now() - waitSince.current > 300) {
      // no frame rendered (hidden tab, lost context): still honour the slash
      cut.pending = false
      go()
    }

    const c = canvas.current
    if (!c) return
    const dpr = Math.min(2, window.devicePixelRatio)
    if (c.width !== Math.round(innerWidth * dpr)) {
      c.width = Math.round(innerWidth * dpr)
      c.height = Math.round(innerHeight * dpr)
    }
    const g = c.getContext("2d")!
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, innerWidth, innerHeight)
    const now = performance.now()
    // the blade's trail while dragging
    const pts = trail.current.filter((p) => now - p.t < 220)
    if (pts.length > 1) {
      g.lineCap = "round"
      g.lineJoin = "round"
      for (const [width, color, blur] of [
        [7, "rgba(255,40,50,0.55)", 22],
        [2, "rgba(255,245,240,0.95)", 6],
      ] as const) {
        g.lineWidth = width
        g.strokeStyle = color
        g.shadowColor = "#ff2030"
        g.shadowBlur = blur
        g.beginPath()
        pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)))
        g.stroke()
      }
    }
    // the cut line flares and fades
    const f = flash.current
    if (f) {
      const k = (now - f.t) / 420
      if (k > 1) flash.current = null
      else {
        g.shadowColor = "#ff2a20"
        g.shadowBlur = 30
        g.lineWidth = 3 * (1 - k) + 0.5
        g.strokeStyle = `rgba(255,250,245,${1 - k})`
        g.beginPath()
        g.moveTo(f.a.x, f.a.y)
        g.lineTo(f.b.x, f.b.y)
        g.stroke()
      }
    }
    g.shadowBlur = 0
  })

  return <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-[16] h-full w-full" aria-hidden />
}
