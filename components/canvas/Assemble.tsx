"use client"

import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import type { Group } from "three"
import { useRoom } from "@/lib/store"

// Keep timelines in real time even when a frame hitches (GPU warm-up, shader compile).
gsap.ticker.lagSmoothing(0)

type Mode = "drop" | "rise" | "pop" | "unfoldX" | "unfoldZ"

// Plays one piece of the intro "the room builds itself" sequence.
// Children render at their resting transform; this group animates *into* identity.
export function Assemble({ children, mode = "drop", delay = 0, pivot = [0, 0, 0] }: { children: ReactNode; mode?: Mode; delay?: number; pivot?: [number, number, number] }) {
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const played = useRef(false)

  // Hidden start pose (applied immediately so nothing flashes before the intro).
  useEffect(() => {
    const g = outer.current!
    if (mode === "drop") g.position.y = 7
    if (mode === "rise") g.position.y = -4
    if (mode === "pop") g.scale.setScalar(0.001)
    if (mode === "unfoldX") g.rotation.x = -Math.PI / 2
    if (mode === "unfoldZ") g.rotation.z = Math.PI / 2
    g.visible = false
  }, [mode])

  useEffect(() => {
    const run = () => {
      if (played.current) return
      played.current = true
      const g = outer.current!
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      g.visible = true
      if (reduced) {
        g.position.set(0, 0, 0)
        g.rotation.set(0, 0, 0)
        g.scale.setScalar(1)
        return
      }
      const d = 0.35 + delay
      if (mode === "drop") gsap.to(g.position, { y: 0, duration: 0.9, delay: d, ease: "bounce.out" })
      if (mode === "rise") gsap.to(g.position, { y: 0, duration: 1.1, delay: d, ease: "expo.out" })
      if (mode === "pop") gsap.to(g.scale, { x: 1, y: 1, z: 1, duration: 0.8, delay: d, ease: "back.out(2.2)" })
      if (mode === "unfoldX") gsap.to(g.rotation, { x: 0, duration: 1.1, delay: d, ease: "elastic.out(1, 0.75)" })
      if (mode === "unfoldZ") gsap.to(g.rotation, { z: 0, duration: 1.1, delay: d, ease: "elastic.out(1, 0.75)" })
    }
    // The room builds itself the moment the camera starts flying up to it.
    if (useRoom.getState().roomBuilt) run()
    return useRoom.subscribe((s) => {
      if (s.roomBuilt) run()
    })
  }, [mode, delay])

  // Pivot lets walls hinge from their bottom edge.
  return (
    <group position={pivot}>
      <group ref={outer}>
        <group ref={inner} position={[-pivot[0], -pivot[1], -pivot[2]]}>
          {children}
        </group>
      </group>
    </group>
  )
}
