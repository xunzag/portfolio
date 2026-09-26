"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { RANGES } from "@/lib/chapters"
import { skillGroups } from "@/lib/content"
import { Type } from "./Type"
import { usePresence, useReveal } from "./presence"

// A floating hologram beside the PC: skill bars grow in as the case opens.
export function SkillHolo() {
  const [a, b] = RANGES.stack
  const on = usePresence(a + 110, b, 50, 40)
  const g = useRef<THREE.Group>(null)
  const bars = useRef<THREE.Mesh[]>([])
  useReveal(g, on, 0.4)
  useFrame(({ clock }) => {
    const v = on.current ?? 0
    bars.current.forEach((m, i) => {
      if (!m) return
      const lvl = m.userData.level as number
      const grow = Math.min(1, Math.max(0, v * 1.5 - i * 0.04))
      m.scale.x = Math.max(0.001, grow * lvl)
      m.position.x = (grow * lvl * 2.4) / 2
      ;(m.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(clock.elapsedTime * 3 + i) * 0.15
    })
    if (g.current) g.current.position.y = 3.1 + Math.sin(clock.elapsedTime * 0.7) * 0.05
  })
  let n = 0
  return (
    <group position={[3.2, 0, 4.4]} rotation-y={Math.PI / 2 - 0.18} scale={0.85}>
      <group ref={g}>
        <group>
          <Type weight="semi" fontSize={0.13} letterSpacing={0.22} color="#b18cff" glow={1.8}>
            {"05   STACK"}
          </Type>
          <Type weight="bold" fontSize={0.42} position={[0, -0.22, 0]} glow={1.3}>
            {"What's inside\nthe machine"}
          </Type>
        </group>
        {skillGroups.map((grp, gi) => (
          <group key={grp.name} position={[0, -1.35 - gi * 1.45, 0]}>
            <Type weight="semi" fontSize={0.12} letterSpacing={0.18} color={grp.color} glow={1.8}>
              {grp.name.toUpperCase()}
            </Type>
            {grp.items.map((s, k) => {
              const idx = n++
              return (
                <group key={s.name} position={[0, -0.26 - k * 0.27, 0]}>
                  <Type fontSize={0.13} color="#d6d0f5">
                    {s.name}
                  </Type>
                  <group position={[1.55, -0.07, 0]}>
                    <mesh position={[1.2, 0, -0.01]}>
                      <planeGeometry args={[2.4, 0.05]} />
                      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
                    </mesh>
                    <mesh
                      ref={(m) => {
                        if (m) bars.current[idx] = m
                      }}
                      userData={{ level: s.level / 100 }}
                    >
                      <planeGeometry args={[2.4, 0.07]} />
                      <meshBasicMaterial color={new THREE.Color(grp.color).multiplyScalar(2.4)} toneMapped={false} transparent />
                    </mesh>
                  </group>
                  <Type weight="semi" fontSize={0.11} position={[4.1, 0, 0]} color="#9a95b8">
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
