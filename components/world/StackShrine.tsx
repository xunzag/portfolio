"use client"

import { Suspense, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Billboard, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { RANGES } from "@/lib/chapters"
import { skillGroups, toolbelt } from "@/lib/content"
import { Type } from "./Type"
import { usePresence, useReveal } from "./presence"
import { STACK } from "./track"

useGLTF.preload("/models/relic-blade.glb")

// The Storm Blade hovers over the island; the toolbelt orbits it; skill bars of light grow beside it.
export function StackShrine() {
  const [a, b] = RANGES.stack
  const on = usePresence(a + 40, b, 50, 40)
  const g = useRef<THREE.Group>(null)
  const bars = useRef<THREE.Mesh[]>([])
  const ring = useRef<THREE.Group>(null)
  useReveal(g, on, 0.6)
  useFrame(({ clock }, dt) => {
    const v = on.current ?? 0
    bars.current.forEach((m, i) => {
      if (!m) return
      const lvl = m.userData.level as number
      const grow = Math.min(1, Math.max(0, v * 1.6 - i * 0.05))
      m.scale.x = Math.max(0.001, grow * lvl)
      m.position.x = (grow * lvl * 3) / 2
    })
    if (ring.current) {
      ring.current.rotation.y += dt * 0.18
      ring.current.scale.setScalar(0.4 + v * 0.6)
    }
  })

  let n = 0
  return (
    <group position={STACK}>
      <Type weight="bold" fontSize={9} anchorX="center" anchorY="middle" position={[0, 1.5, -5]} color="#b18cff" opacity={0.07}>
        {"05"}
      </Type>
      <Suspense fallback={null}>
        <Blade />
      </Suspense>
      <group ref={ring} position={[0, 0.6, 0]}>
        {toolbelt.map((name, i) => {
          const ang = (i / toolbelt.length) * Math.PI * 2
          return (
            <Billboard key={name} position={[Math.cos(ang) * 3.6, Math.sin(i * 1.9) * 1.1, Math.sin(ang) * 3.6]}>
              <Type weight="semi" fontSize={0.26} anchorX="center" anchorY="middle" glow={1.8} color={i % 3 === 0 ? "#b18cff" : i % 3 === 1 ? "#7fd8ff" : "#ff8fd8"}>
                {name}
              </Type>
            </Billboard>
          )
        })}
      </group>
      <group ref={g}>
        <group position={[-8.6, 3.4, 0]}>
          <Type weight="semi" fontSize={0.18} letterSpacing={0.26} color="#b18cff" glow={2}>
            {"05   STACK"}
          </Type>
          <Type weight="bold" fontSize={0.95} letterSpacing={-0.035} lineHeight={0.92} position={[0, -0.34, 0]} glow={1.5}>
            {"Forged\nwith"}
          </Type>
          <Type weight="light" fontSize={0.2} lineHeight={1.5} position={[0, -2.35, 0]} color="#d6d0f5" maxWidth={3.8}>
            {"Every tool here has shipped real products for real clients. The bars are my honest self-rating."}
          </Type>
        </group>
        {skillGroups.map((grp, gi) => (
          <group key={grp.name} position={[4.4, 3.4 - gi * 2.1, 0]}>
            <Type weight="semi" fontSize={0.16} letterSpacing={0.2} color={grp.color} glow={2}>
              {grp.name.toUpperCase()}
            </Type>
            {grp.items.map((s, k) => {
              const idx = n++
              return (
                <group key={s.name} position={[0, -0.36 - k * 0.38, 0]}>
                  <Type fontSize={0.17} color="#e6e0ff">
                    {s.name}
                  </Type>
                  <group position={[2.05, -0.1, 0]}>
                    <mesh position={[1.5, 0, -0.01]}>
                      <planeGeometry args={[3, 0.05]} />
                      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
                    </mesh>
                    <mesh
                      ref={(m) => {
                        if (m) bars.current[idx] = m
                      }}
                      userData={{ level: s.level / 100 }}
                    >
                      <planeGeometry args={[3, 0.09]} />
                      <meshBasicMaterial color={new THREE.Color(grp.color).multiplyScalar(2.6)} toneMapped={false} transparent />
                    </mesh>
                  </group>
                  <Type weight="semi" fontSize={0.14} position={[5.25, 0, 0]} color="#b9b3e6">
                    {`${s.level}%`}
                  </Type>
                </group>
              )
            })}
          </group>
        ))}
      </group>
    </group>
  )
}

function Blade() {
  const gltf = useGLTF("/models/relic-blade.glb")
  const ref = useRef<THREE.Group>(null)
  const scene = useMemo(() => {
    const s = gltf.scene.clone(true)
    // file lies along X; stand it upright, 5 units tall
    s.rotation.z = Math.PI / 2
    s.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(s)
    s.scale.setScalar(5 / (box.max.y - box.min.y))
    s.updateMatrixWorld(true)
    const b2 = new THREE.Box3().setFromObject(s)
    const c = b2.getCenter(new THREE.Vector3())
    s.position.sub(c)
    s.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) (m.material as THREE.MeshStandardMaterial).envMapIntensity = 2
    })
    return s
  }, [gltf.scene])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.y = t * 0.35
    ref.current.position.y = 0.8 + Math.sin(t * 0.9) * 0.15
  })
  return (
    <group ref={ref}>
      <primitive object={scene} />
      <pointLight position={[0, 0, 1.5]} color="#9fb4ff" intensity={8} distance={8} decay={1.6} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -2.9, 0]}>
        <ringGeometry args={[0.9, 1.05, 64]} />
        <meshBasicMaterial color={[1.4, 1.2, 3.2]} toneMapped={false} />
      </mesh>
    </group>
  )
}
