"use client"

import { useRef, type ReactNode } from "react"
import { useFrame, type ThreeEvent, type ThreeElements } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { Select } from "@react-three/postprocessing"
import { easing } from "maath"
import type { Group } from "three"
import { useRoom, type Section } from "@/lib/store"

type Id = Section | "lamp" | "duck" | "keyboard" | "chair"

const setCursor = (c: string) => {
  document.body.style.cursor = c
}

export function Hotspot({
  id,
  label,
  hint,
  labelPosition = [0, 1, 0],
  onActivate,
  children,
  lift = 0.04,
  ...props
}: {
  id: Id
  label?: string
  hint?: string
  labelPosition?: [number, number, number]
  onActivate?: () => void
  children: ReactNode
  lift?: number
} & Omit<ThreeElements["group"], "id">) {
  const inner = useRef<Group>(null)
  const hovered = useRoom((s) => s.hovered === id)
  const interactive = useRoom((s) => s.phase === "room" && s.focus === null)

  useFrame((_, dt) => {
    if (!inner.current) return
    easing.damp(inner.current.position, "y", hovered ? lift : 0, 0.15, dt)
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const s = useRoom.getState()
    if (s.phase !== "room" || s.focus) return
    s.setHovered(id)
    setCursor("pointer")
  }
  const out = () => {
    if (useRoom.getState().hovered === id) useRoom.getState().setHovered(null)
    setCursor("auto")
  }
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const s = useRoom.getState()
    if (s.phase !== "room") return
    setCursor("auto")
    if (onActivate) return onActivate()
    if (!s.focus) s.setFocus(id as Section)
  }

  return (
    <group {...props} onPointerOver={over} onPointerOut={out} onClick={click}>
      <group ref={inner}>
        <Select enabled={hovered && interactive}>{children}</Select>
      </group>
      {label && hovered && interactive && (
        <Html position={labelPosition} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full glass px-3 py-1.5 text-xs font-medium text-ink shadow-[0_0_30px_rgba(139,123,255,0.35)]">
            {label}
            {hint && <span className="ml-2 font-mono text-[10px] text-muted">{hint}</span>}
          </div>
        </Html>
      )}
    </group>
  )
}
