"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { RANGES, actAt, sections } from "@/lib/acts"
import { scrollBus, useRoom } from "@/lib/store"
import { live, runFrame } from "./live"

gsap.ticker.lagSmoothing(0)

// Buttery scrolling (Lenis) → one scroll value per frame → stage + DOM acts.
export function Scroller() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
    const lenis = new Lenis({ lerp: reduced ? 1 : 0.07, wheelMultiplier: 0.85, touchMultiplier: 1.3, smoothWheel: !reduced })

    const onMove = (e: PointerEvent) => {
      live.px.x = e.clientX
      live.px.y = e.clientY
      live.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      live.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onResize = () => {
      live.w = window.innerWidth
      live.h = window.innerHeight
    }
    onResize()
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("resize", onResize)

    let last = performance.now()
    const tick = (time: number) => {
      lenis.raf(time * 1000)
      const now = performance.now()
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      // acts are measured in vh, so scroll is too
      live.scroll = (lenis.scroll / window.innerHeight) * 100
      live.velocity = (lenis.velocity / window.innerHeight) * 100
      const k = 1 - Math.exp(-dt * 4)
      live.mouse.sx += (live.mouse.x - live.mouse.sx) * k
      live.mouse.sy += (live.mouse.y - live.mouse.sy) * k
      const act = actAt(live.scroll)
      if (useRoom.getState().act !== act) useRoom.setState({ act })
      runFrame(dt)
    }
    gsap.ticker.add(tick)

    // hold the page still until the boot screen lifts
    if (useRoom.getState().phase === "loading") lenis.stop()
    const unsub = useRoom.subscribe((st, prev) => {
      if (st.phase === "room" && prev.phase !== "room") lenis.start()
      if (st.terminalOpen !== prev.terminalOpen) st.terminalOpen ? lenis.stop() : lenis.start()
    })

    scrollBus.to = (id) => {
      let vh = 0
      if (id !== "top") {
        const sec = sections.find((x) => x.id === id)!
        const [a, b] = RANGES[sec.act]
        vh = a + (b - a) * sec.t
      }
      const dist = Math.abs(vh - live.scroll)
      lenis.scrollTo((vh / 100) * window.innerHeight, {
        duration: Math.min(4, 1.2 + dist / 600),
        easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
      })
    }

    // a slash cuts straight to a beat: no tween, the transition is the cut itself
    scrollBus.jump = (vh) => lenis.scrollTo((vh / 100) * window.innerHeight, { immediate: true, force: true })

    return () => {
      unsub()
      gsap.ticker.remove(tick)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("resize", onResize)
      lenis.destroy()
    }
  }, [])
  return null
}
