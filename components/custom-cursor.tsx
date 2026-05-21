"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100, my = -100
    let rx = -100, ry = -100
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const loop = () => {
      // dot follows instantly
      dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`

      // ring lerps
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onEnter = () => {
      dot.classList.add("hovering")
      ring.classList.add("hovering")
    }
    const onLeave = () => {
      dot.classList.remove("hovering")
      ring.classList.remove("hovering")
    }
    const onDown = () => ring.classList.add("clicking")
    const onUp   = () => ring.classList.remove("clicking")

    const updateInteractive = () => {
      document.querySelectorAll("a,button,[data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter)
        el.addEventListener("mouseleave", onLeave)
      })
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup",   onUp)
    updateInteractive()

    const observer = new MutationObserver(updateInteractive)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup",   onUp)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  )
}
