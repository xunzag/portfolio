"use client"

import { useEffect, useRef } from "react"

/* actual code symbols — feels legit, not just katakana */
const CODE_CHARS = [
  "const", "let", "=>", "async", "await", "return",
  "function", "import", "export", "interface", "type",
  "useState", "useEffect", "useRef", "useCallback",
  "{}", "[]", "()", "===", "!==", "&&", "||", "??",
  ".map", ".filter", ".reduce", ".then", ".catch",
  "<div>", "</>", "React", "Next", "Node",
  "0", "1", "true", "false", "null", "undefined",
  "//", "/*", "*/", "#", "$", "//TODO",
  "git", "npm", "docker", "kubectl", "sudo",
]

interface Column {
  x: number
  y: number
  speed: number
  chars: string[]
  length: number
  opacity: number
  hue: number
}

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const FONT_SIZE  = 11
    const COL_WIDTH  = 72
    let columns: Column[] = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight

      const numCols = Math.floor(canvas.width / COL_WIDTH)
      columns = Array.from({ length: numCols }, (_, i) => ({
        x: i * COL_WIDTH + Math.random() * 20,
        y: Math.random() * -canvas.height,
        speed: 0.3 + Math.random() * 0.5,
        chars: Array.from({ length: 8 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]),
        length: 4 + Math.floor(Math.random() * 6),
        opacity: 0.04 + Math.random() * 0.06,
        hue: 260 + Math.random() * 60, // purple-ish band
      }))
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', 'Fira Code', monospace`

      for (const col of columns) {
        for (let j = 0; j < col.chars.length; j++) {
          const alpha = col.opacity * (1 - j / col.chars.length)
          if (alpha < 0.005) continue
          ctx.fillStyle = `hsla(${col.hue}, 80%, 65%, ${alpha})`
          ctx.fillText(col.chars[j], col.x, col.y - j * (FONT_SIZE + 4))
        }

        col.y += col.speed

        /* refresh char occasionally */
        if (Math.random() < 0.015) {
          col.chars[Math.floor(Math.random() * col.chars.length)] =
            CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
        }

        /* reset when fully off-screen */
        if (col.y > canvas.height + col.length * (FONT_SIZE + 4)) {
          col.y = -col.length * (FONT_SIZE + 4)
          col.x = Math.floor(Math.random() * (canvas.width / COL_WIDTH)) * COL_WIDTH + Math.random() * 20
          col.speed  = 0.3 + Math.random() * 0.5
          col.opacity = 0.04 + Math.random() * 0.05
          col.hue    = 260 + Math.random() * 60
        }
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-5]"
      aria-hidden
    />
  )
}
