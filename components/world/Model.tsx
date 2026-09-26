"use client"

import { useEffect, useMemo } from "react"
import { useAnimations, useGLTF } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"

/**
 * Drop-in slot for a user-supplied .glb. It is cloned, auto-scaled so its
 * longest horizontal side (or height) matches `size`, sat on the ground and
 * centred, and its first animation clip (if any) loops.
 */
export function Model({ url, size, fit = "height", rotationY = 0 }: { url: string; size: number; fit?: "height" | "length"; rotationY?: number }) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => {
    const clone = SkeletonUtils.clone(gltf.scene) as THREE.Group
    clone.rotation.y = rotationY
    clone.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(clone)
    const dim = box.getSize(new THREE.Vector3())
    const current = fit === "height" ? dim.y : Math.max(dim.x, dim.z)
    const k = size / (current || 1)
    clone.scale.setScalar(k)
    clone.updateMatrixWorld(true)
    const b2 = new THREE.Box3().setFromObject(clone)
    const c = b2.getCenter(new THREE.Vector3())
    clone.position.set(-c.x, -b2.min.y, -c.z)
    clone.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })
    return clone
  }, [gltf.scene, size, fit, rotationY])

  const { actions, names } = useAnimations(gltf.animations, scene)
  useEffect(() => {
    const first = names.length ? actions[names[0]] : null
    first?.reset().fadeIn(0.4).play()
    return () => {
      first?.fadeOut(0.3)
    }
  }, [actions, names])

  return <primitive object={scene} />
}
