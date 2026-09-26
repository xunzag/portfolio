"use client"

import { useEffect, useMemo } from "react"
import { useAnimations, useGLTF } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"

/** A user GLB, auto-scaled to `height`, sat on the ground, centred, first clip looping. */
export function Model({ url, height, rotationY = 0 }: { url: string; height: number; rotationY?: number }) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => {
    const s = SkeletonUtils.clone(gltf.scene) as THREE.Group
    s.rotation.y = rotationY
    s.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(s)
    s.scale.setScalar(height / (box.max.y - box.min.y || 1))
    s.updateMatrixWorld(true)
    const b2 = new THREE.Box3().setFromObject(s)
    const c = b2.getCenter(new THREE.Vector3())
    s.position.set(-c.x, -b2.min.y, -c.z)
    s.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.frustumCulled = false
      const mat = m.material as THREE.MeshStandardMaterial
      if (mat && "envMapIntensity" in mat) mat.envMapIntensity = 1.4
    })
    return s
  }, [gltf.scene, height, rotationY])
  const { actions, names } = useAnimations(gltf.animations, scene)
  useEffect(() => {
    const a = names.length ? actions[names[0]] : null
    a?.reset().play()
    return () => {
      a?.stop()
    }
  }, [actions, names])
  return <primitive object={scene} />
}
