"use client"

import dynamic from "next/dynamic"

const SceneBackground = dynamic(
  () => import("@/components/scene-background").then((m) => m.SceneBackground),
  { ssr: false },
)

export function SceneWrapper() {
  return <SceneBackground />
}
