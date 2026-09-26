"use client"

import { useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import * as THREE from "three"
import { live } from "./live"

// The camera is a pure function of the (already smoothed) scroll position,
// plus a small damped cursor parallax so it always feels alive.
export function ScrollRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const para = useMemo(() => ({ x: 0, y: 0, shift: 0 }), [])
  const right = useMemo(() => new THREE.Vector3(), [])
  const up = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ pointer }, dt) => {
    const f = live.frame
    const aspect = size.width / size.height
    const desktop = size.width >= 900

    easing.damp(para, "x", pointer.x, 0.6, dt)
    easing.damp(para, "y", pointer.y, 0.6, dt)

    camera.position.copy(f.pos)
    camera.lookAt(f.target)
    // parallax in camera space, proportional to distance to the subject
    const d = Math.min(8, f.pos.distanceTo(f.target))
    right.setFromMatrixColumn(camera.matrix, 0)
    up.setFromMatrixColumn(camera.matrix, 1)
    camera.position.addScaledVector(right, para.x * d * 0.03).addScaledVector(up, para.y * d * 0.02)
    camera.lookAt(f.target)
    camera.rotateZ(f.roll)

    const fov = aspect < 1 ? Math.min(100, f.fov * (1.1 + (1 - aspect) * 0.9)) : f.fov
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    easing.damp(para, "shift", desktop ? f.shift : 0, 0.25, dt)
    const px = para.shift * size.width
    if (Math.abs(px) > 0.5) camera.setViewOffset(size.width, size.height, px, 0, size.width, size.height)
    else if (camera.view) camera.clearViewOffset()
  })
  return null
}
