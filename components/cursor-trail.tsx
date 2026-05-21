"use client"

import { useEffect, useRef } from "react"

interface TrailDot {
  x: number
  y: number
  age: number
  maxAge: number
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailRef  = useRef<TrailDot[]>([])
  const mouseRef  = useRef({ x: -200, y: -200 })
  const hueRef    = useRef(270) // start purple
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      hueRef.current = (hueRef.current + 0.5) % 360
    }
    window.addEventListener("mousemove", onMove, { passive: true })

    let lastX = -200, lastY = -200

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x, y } = mouseRef.current
      const dx = x - lastX
      const dy = y - lastY
      const dist = Math.sqrt(dx * dx + dy * dy)

      /* emit new dots when mouse moves */
      if (dist > 3) {
        const steps = Math.min(Math.floor(dist / 4), 6)
        for (let s = 0; s < steps; s++) {
          const fx = lastX + (dx / steps) * s
          const fy = lastY + (dy / steps) * s
          trailRef.current.push({
            x: fx,
            y: fy,
            age: 0,
            maxAge: 28 + Math.random() * 14,
          })
        }
        lastX = x
        lastY = y
      }

      const hue = hueRef.current

      /* draw + age dots */
      trailRef.current = trailRef.current.filter((dot) => {
        dot.age++
        if (dot.age >= dot.maxAge) return false

        const life    = 1 - dot.age / dot.maxAge
        const radius  = life * 5 + 1

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)

        const h1 = (hue + (dot.age / dot.maxAge) * 60) % 360
        ctx.fillStyle = `hsla(${h1}, 90%, 65%, ${life * 0.7})`
        ctx.fill()

        return true
      })

      /* cap trail length */
      if (trailRef.current.length > 200) {
        trailRef.current = trailRef.current.slice(-200)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9990]"
      aria-hidden
    />
  )
}
