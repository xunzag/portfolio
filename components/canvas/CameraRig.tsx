"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import * as THREE from "three"
import { useRoom, type Section } from "@/lib/store"

type Shot = { pos: [number, number, number]; target: [number, number, number] }

export const SHOTS: Record<"room" | "intro" | Section, Shot> = {
  intro: { pos: [26, 20, 26], target: [0, 1.5, -1] },
  room: { pos: [10.8, 8.2, 10.8], target: [-0.3, 2, -1.1] },
  work: { pos: [0.65, 2.72, -1.25], target: [0.65, 2.6, -4.6] },
  about: { pos: [-0.9, 2.75, 1.35], target: [-4.6, 2.35, 1.35] },
  skills: { pos: [6.2, 2.9, -0.9], target: [3.35, 1.25, -4.0] },
  life: { pos: [-0.6, 3.4, -2.2], target: [-4.9, 3.25, -2.2] },
  contact: { pos: [2.45, 2.45, -2.55], target: [2.25, 1.75, -3.8] },
}

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const pointer = useThree((s) => s.pointer)
  const look = useMemo(() => new THREE.Vector3(...SHOTS.intro.target), [])
  const goal = useMemo(() => new THREE.Vector3(), [])
  const goalLook = useMemo(() => new THREE.Vector3(), [])
  const offset = useMemo(() => ({ x: 0, y: 0 }), [])
  const introTime = useRef(0)

  useEffect(() => {
    camera.position.set(...SHOTS.intro.pos)
    camera.lookAt(look)
  }, [camera, look])

  useFrame((_, dt) => {
    const { phase, focus, setPhase } = useRoom.getState()
    dt = Math.min(dt, 0.25)
    const portrait = size.width < size.height
    const mobile = size.width < 900

    const shot = phase === "loading" || phase === "ready" ? SHOTS.intro : focus ? SHOTS[focus] : SHOTS.room
    goal.set(...shot.pos)
    goalLook.set(...shot.target)

    if (!focus && phase !== "loading" && phase !== "ready") {
      // Pull back on narrow screens so the whole room fits.
      if (portrait) goal.sub(goalLook).multiplyScalar(size.width / size.height < 0.6 ? 2.35 : 1.8).add(goalLook)
      // Gentle parallax so the room feels alive under the cursor.
      if (phase === "room") {
        goal.x += pointer.x * 0.9
        goal.z -= pointer.x * 0.9
        goal.y += pointer.y * 0.6
      }
    } else if (focus && portrait) {
      goal.sub(goalLook).multiplyScalar(1.9).add(goalLook)
    }

    const smooth = phase === "intro" ? 1.1 : 0.45
    easing.damp3(camera.position, goal, smooth, dt)
    easing.damp3(look, goalLook, smooth * 0.9, dt)
    camera.lookAt(look)

    if (phase === "intro") {
      introTime.current += dt
      if (camera.position.distanceTo(goal) < 1.2 || introTime.current > 3.2) setPhase("room")
    }

    // Shift the rendered frame so the focused object sits beside (not under) the panel.
    const panel = focus ? (mobile ? 0 : Math.min(600, size.width * 0.44)) : 0
    const sheet = focus && mobile ? size.height * 0.27 : 0
    easing.damp(offset, "x", panel / 2, 0.35, dt)
    easing.damp(offset, "y", sheet, 0.35, dt)
    if (Math.abs(offset.x) > 0.5 || Math.abs(offset.y) > 0.5) {
      camera.setViewOffset(size.width, size.height, offset.x, offset.y, size.width, size.height)
    } else if (camera.view) {
      camera.clearViewOffset()
    }
  })

  return null
}
