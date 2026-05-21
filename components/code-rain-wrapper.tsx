"use client"

import dynamic from "next/dynamic"

const CodeRain = dynamic(
  () => import("@/components/code-rain").then((m) => m.CodeRain),
  { ssr: false },
)

export function CodeRainWrapper() {
  return <CodeRain />
}
