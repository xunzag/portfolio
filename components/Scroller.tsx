"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { RANGES, chapterAt, local } from "@/lib/chapters"
import { projects } from "@/lib/content"
import { scrollBus, useRoom, type Section } from "@/lib/store"
import { live } from "./world/live"
import { sample } from "./world/track"

gsap.ticker.lagSmoothing(0)

// Buttery scrolling (Lenis) → one scroll value per frame → camera + overlay.
export function Scroller() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
    const lenis = new Lenis({ lerp: reduced ? 1 : 0.075, wheelMultiplier: 0.9, touchMultiplier: 1.4, smoothWheel: !reduced })

    const update = () => {
      // chapters are measured in vh, so scroll is too
      const s = (lenis.scroll / window.innerHeight) * 100
      live.velocity = (lenis.velocity / window.innerHeight) * 100
      live.scroll = s
      live.frame = sample(s)

      const st = useRoom.getState()
      const { id, t } = chapterAt(s)
      const patch: Partial<ReturnType<typeof useRoom.getState>> = {}
      if (st.chapter !== id) patch.chapter = id
      const focus: Section | null =
        id === "about" && t > 0.18 ? "about" : id === "stack" && t > 0.22 ? "skills" : id === "life" ? "life" : id === "contact" ? "contact" : null
      if (st.focus !== focus) patch.focus = focus
      if (!st.roomBuilt && s > RANGES.ascend[0] + 20) patch.roomBuilt = true
      if (id === "work") {
        const p = Math.min(projects.length - 1, Math.floor(local(s, "work") * projects.length))
        if (p !== st.project) patch.project = p
      }
      if (Object.keys(patch).length) useRoom.setState(patch)
    }

    const tick = (time: number) => {
      lenis.raf(time * 1000)
      update()
    }
    gsap.ticker.add(tick)
    update()

    // hold the page still until the boot screen lifts
    if (useRoom.getState().phase === "loading") lenis.stop()
    const unsub = useRoom.subscribe((st, prev) => {
      if (st.phase === "room" && prev.phase !== "room") lenis.start()
    })

    scrollBus.to = (chapter) => {
      const [a, b] = RANGES[chapter]
      // land a little into the chapter so the camera has arrived
      const target = ((a + (b - a) * (chapter === "hero" ? 0 : chapter === "work" ? 0.04 : 0.42)) / 100) * window.innerHeight
      lenis.scrollTo(target, { duration: 2.4, easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) })
    }

    return () => {
      unsub()
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
  return null
}
