"use client"

import { useEffect } from "react"

export function MousePosition() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = Math.round((clientX / window.innerWidth) * 100)
      const y = Math.round((clientY / window.innerHeight) * 100)

      document.documentElement.style.setProperty("--mouse-x", `${x}%`)
      document.documentElement.style.setProperty("--mouse-y", `${y}%`)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return null
}

