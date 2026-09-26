import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { live } from "./live"

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * 0→1 while the scroll is inside [a, b] (in vh), easing in over `fadeIn` and
 * out over `fadeOut`. Returned as a ref so it never triggers React renders.
 */
export function usePresence(a: number, b: number, fadeIn = 40, fadeOut = 30) {
  const v = useRef(0)
  useFrame((_, dt) => {
    const s = live.scroll
    const target = smooth(a - fadeIn, a, s) * (1 - smooth(b, b + fadeOut, s))
    v.current += (target - v.current) * Math.min(1, dt * 5)
  })
  return v
}

/**
 * Fades every material under `group` by `p` (remembering each material's own
 * opacity) and lifts the group in from below. Staggers direct children.
 */
export function useReveal(group: React.RefObject<THREE.Group | null>, p: React.RefObject<number>, lift = 0.6) {
  const last = useRef(-1)
  useFrame(() => {
    const g = group.current
    const v = p.current ?? 0
    if (!g || Math.abs(v - last.current) < 0.002) return
    last.current = v
    g.visible = v > 0.01
    const kids = g.children
    kids.forEach((child, i) => {
      const k = Math.min(1, Math.max(0, v * 1.6 - (i / Math.max(1, kids.length)) * 0.6))
      const e = 1 - Math.pow(1 - k, 3)
      if (child.userData.baseY === undefined) child.userData.baseY = child.position.y
      child.position.y = child.userData.baseY - (1 - e) * lift
      child.traverse((o) => {
        const m = (o as THREE.Mesh).material as (THREE.Material & { opacity: number }) | undefined
        if (!m || Array.isArray(m)) return
        if (m.userData.baseOpacity === undefined) m.userData.baseOpacity = m.opacity
        m.transparent = true
        m.opacity = m.userData.baseOpacity * e
      })
    })
  })
}
