"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*<>/|\\{}[]~"

/* ── useScramble hook ─────────────────────────────────────────── */
export function useScramble(target: string, trigger: boolean, speed = 40) {
  const [display, setDisplay] = useState(target)
  const frame   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const iteration = useRef(0)

  const scramble = useCallback(() => {
    if (frame.current) clearTimeout(frame.current)
    iteration.current = 0

    const step = () => {
      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < iteration.current) return target[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(""),
      )

      if (iteration.current < target.length) {
        iteration.current += 0.5
        frame.current = setTimeout(step, speed)
      } else {
        setDisplay(target)
      }
    }

    step()
  }, [target, speed])

  useEffect(() => {
    if (trigger) scramble()
    return () => { if (frame.current) clearTimeout(frame.current) }
  }, [trigger, scramble])

  return display
}

/* ── ScrambleText component ───────────────────────────────────── */
interface ScrambleTextProps {
  text: string
  as?: keyof JSX.IntrinsicElements
  className?: string
  speed?: number
  triggerOnMount?: boolean
  [key: string]: unknown
}

export function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
  speed = 35,
  triggerOnMount = false,
  ...rest
}: ScrambleTextProps) {
  const [hovered, setHovered] = useState(triggerOnMount)
  const display = useScramble(text, hovered, speed)

  useEffect(() => {
    if (triggerOnMount) {
      const t = setTimeout(() => setHovered(false), text.length * speed * 2)
      return () => clearTimeout(t)
    }
  }, [triggerOnMount, text, speed])

  return (
    // @ts-expect-error dynamic tag
    <Tag
      className={`cursor-default select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {display}
    </Tag>
  )
}
