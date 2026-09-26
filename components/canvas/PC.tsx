"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, RoundedBox } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { duckQuotes } from "@/lib/content"
import { Hotspot } from "./Hotspot"

const rgb = new THREE.Color()

export function PC() {
  const fans = useRef<THREE.Group>(null)
  const strips = useRef<THREE.MeshBasicMaterial[]>([])
  const light = useRef<THREE.PointLight>(null)

  useFrame(({ clock }, dt) => {
    const { party, focus } = useRoom.getState()
    const t = clock.elapsedTime
    const speed = focus === "skills" ? 14 : party ? 20 : 6
    fans.current?.children.forEach((f, i) => {
      const blades = f.getObjectByName("blades")
      if (blades) blades.rotation.z -= dt * speed * (1 + i * 0.05)
    })
    strips.current.forEach((m, i) => {
      rgb.setHSL((t * (party ? 0.5 : 0.08) + i * 0.12) % 1, 1, 0.55).multiplyScalar(2.2)
      m.color.copy(rgb)
    })
    if (light.current) {
      rgb.setHSL((t * (party ? 0.5 : 0.08)) % 1, 1, 0.55)
      light.current.color.copy(rgb)
    }
  })

  const addStrip = (m: THREE.MeshBasicMaterial | null) => {
    if (m && !strips.current.includes(m)) strips.current.push(m)
  }

  return (
    <group>
      <Hotspot id="skills" label="Tech stack" hint="3" labelPosition={[4.15, 1.3, -3.2]}>
        <group position={[3.35, 0, -4.0]}>
          {/* case shell */}
          <RoundedBox args={[1.0, 2.1, 1.9]} radius={0.05} position={[0, 1.05, 0]}>
            <meshStandardMaterial color="#121022" metalness={0.5} roughness={0.35} />
          </RoundedBox>
          {/* hollow look: dark interior panel inset on the glass side */}
          <mesh position={[0.41, 1.05, 0]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[1.75, 1.95]} />
            <meshStandardMaterial color="#07060f" />
          </mesh>
          {/* motherboard + GPU + RAM visible through glass */}
          <mesh position={[0.43, 1.2, -0.1]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[1.3, 1.4]} />
            <meshStandardMaterial color="#1a2b24" roughness={0.6} />
          </mesh>
          <RoundedBox args={[0.2, 0.22, 1.2]} radius={0.03} position={[0.4, 0.75, 0.05]}>
            <meshStandardMaterial color="#2c2a3e" metalness={0.6} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0.51, 0.75, 0.05]}>
            <boxGeometry args={[0.01, 0.04, 1.1]} />
            <meshBasicMaterial ref={addStrip} toneMapped={false} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0.45, 1.45, -0.55 + i * 0.09]}>
              <boxGeometry args={[0.1, 0.35, 0.03]} />
              <meshBasicMaterial ref={addStrip} toneMapped={false} />
            </mesh>
          ))}
          {/* CPU cooler */}
          <mesh position={[0.46, 1.5, 0.25]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 24]} />
            <meshStandardMaterial color="#d8d4f0" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0.53, 1.5, 0.25]} rotation-z={Math.PI / 2}>
            <torusGeometry args={[0.16, 0.012, 8, 32]} />
            <meshBasicMaterial ref={addStrip} toneMapped={false} />
          </mesh>
          {/* tempered glass */}
          <mesh position={[0.505, 1.05, 0]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[1.8, 2.0]} />
            <meshStandardMaterial color="#9fb6ff" transparent opacity={0.12} roughness={0.05} metalness={0.9} depthWrite={false} />
          </mesh>
          {/* front fans */}
          <group ref={fans} position={[0, 0, 0.955]}>
            {[0.45, 1.05, 1.65].map((y) => (
              <group key={y} position={[0, y, 0]}>
                <mesh>
                  <torusGeometry args={[0.26, 0.022, 8, 40]} />
                  <meshBasicMaterial ref={addStrip} toneMapped={false} />
                </mesh>
                <group name="blades">
                  {Array.from({ length: 7 }, (_, i) => (
                    <mesh key={i} rotation-z={(i / 7) * Math.PI * 2} position={[0, 0, 0.005]}>
                      <boxGeometry args={[0.07, 0.42, 0.01]} />
                      <meshStandardMaterial color="#1b1830" transparent opacity={0.85} />
                    </mesh>
                  ))}
                </group>
                <mesh position={[0, 0, 0.01]}>
                  <circleGeometry args={[0.07, 20]} />
                  <meshStandardMaterial color="#0c0a18" />
                </mesh>
              </group>
            ))}
          </group>
          {/* power LED */}
          <mesh position={[0, 2.03, 0.9]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={[0.5, 3, 1.5]} toneMapped={false} />
          </mesh>
          <pointLight ref={light} position={[1.1, 1.1, 0.4]} intensity={2.4} distance={3.5} decay={1.8} />
        </group>
      </Hotspot>
      <Duck />
    </group>
  )
}

function Duck() {
  const ref = useRef<THREE.Group>(null)
  const squash = useRef(0)
  const [quote, setQuote] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useFrame(({ clock }, dt) => {
    if (!ref.current) return
    squash.current = Math.max(0, squash.current - dt * 2.5)
    const s = Math.sin(squash.current * Math.PI * 3) * squash.current
    ref.current.scale.set(1 + s * 0.3, 1 - s * 0.35, 1 + s * 0.3)
    easing.damp(ref.current.rotation, "y", -0.6 + Math.sin(clock.elapsedTime * 0.5) * 0.25, 0.4, dt)
  })

  return (
    <Hotspot
      id="duck"
      label="Rubber duck"
      hint="debug"
      labelPosition={[3.35, 2.95, -3.7]}
      onActivate={() => {
        squash.current = 1
        const q = duckQuotes[Math.floor(Math.random() * duckQuotes.length)]
        setQuote(q)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setQuote(null), 2600)
      }}
    >
      <group ref={ref} position={[3.35, 2.1, -3.7]} scale={1}>
        <mesh position={[0, 0.14, 0]} scale={[1.15, 0.85, 1]}>
          <sphereGeometry args={[0.16, 20, 16]} />
          <meshStandardMaterial color="#ffd23f" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.32, 0.08]}>
          <sphereGeometry args={[0.1, 20, 16]} />
          <meshStandardMaterial color="#ffd23f" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.3, 0.2]} rotation-x={Math.PI / 2} scale={[1.3, 1, 0.5]}>
          <coneGeometry args={[0.05, 0.1, 12]} />
          <meshStandardMaterial color="#ff8c42" />
        </mesh>
        {[-0.045, 0.045].map((x) => (
          <mesh key={x} position={[x, 0.35, 0.17]}>
            <sphereGeometry args={[0.017, 8, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
        <mesh position={[0, 0.2, -0.17]} rotation-x={-0.6}>
          <coneGeometry args={[0.06, 0.12, 10]} />
          <meshStandardMaterial color="#ffd23f" />
        </mesh>
        {quote && (
          <Html position={[0, 0.7, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-2xl rounded-bl-sm bg-amber px-3 py-2 font-mono text-xs font-semibold text-bg shadow-lg">
              {quote}
            </div>
          </Html>
        )}
      </group>
    </Hotspot>
  )
}
