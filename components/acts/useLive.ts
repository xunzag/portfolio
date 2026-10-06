import { useEffect, useRef } from "react"
import { onFrame } from "../live"

/** Per-frame callback driven by the scroller (no React renders). */
export function useLive(cb: (dt: number) => void) {
  const ref = useRef(cb)
  ref.current = cb
  useEffect(() => onFrame((dt) => ref.current(dt)), [])
}

/** Apply opacity + a small lift/blur to an element from a 0..1 presence value. */
export function present(el: HTMLElement | null, p: number, lift = 24, blur = 8) {
  if (!el) return
  const vis = p > 0.001
  el.style.visibility = vis ? "visible" : "hidden"
  if (!vis) return
  el.style.opacity = String(p)
  el.style.transform = `translate3d(0, ${(1 - p) * lift}px, 0)`
  el.style.filter = p > 0.995 ? "none" : `blur(${(1 - p) * blur}px)`
}
