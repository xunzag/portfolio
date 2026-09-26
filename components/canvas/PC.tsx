"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, RoundedBox } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { duckQuotes, toolbelt } from "@/lib/content"
import { Hotspot } from "./Hotspot"
import { useMat } from "./materials"

const rgb = new THREE.Color()

// A glass-sided tower. On "Stack" the door swings open and the components
// float out into an exploded view while the toolbelt orbits around it.
export function PC() {
  const m = useMat()
  const fans = useRef<THREE.Group>(null)
  const door = useRef<THREE.Group>(null)
  const parts = useRef<(THREE.Group | null)[]>([])
  const strips = useRef<THREE.MeshBasicMaterial[]>([])
  const light = useRef<THREE.PointLight>(null)
  const open = useRoom((s) => s.focus === "skills")

  useFrame(({ clock }, dt) => {
    const { party, focus } = useRoom.getState()
    const active = focus === "skills"
    const t = clock.elapsedTime
    const speed = active ? 16 : party ? 22 : 6
    fans.current?.children.forEach((f, i) => {
      const blades = f.getObjectByName("blades")
      if (blades) blades.rotation.z -= dt * speed * (1 + i * 0.05)
    })
    strips.current.forEach((mat, i) => {
      rgb.setHSL((t * (party ? 0.5 : 0.08) + i * 0.12) % 1, 1, 0.55).multiplyScalar(2.4)
      mat.color.copy(rgb)
    })
    if (light.current) {
      rgb.setHSL((t * (party ? 0.5 : 0.08)) % 1, 1, 0.55)
      light.current.color.copy(rgb)
      easing.damp(light.current, "intensity", active ? 6 : 2.6, 0.3, dt)
    }
    if (door.current) easing.damp(door.current.rotation, "y", active ? -1.75 : 0, 0.45, dt)
    parts.current.forEach((p, i) => {
      if (!p) return
      const out = active ? 0.55 + i * 0.28 : 0
      easing.damp(p.position, "x", out, 0.35 + i * 0.06, dt)
      easing.damp(p.position, "y", active ? Math.sin(t * 1.2 + i) * 0.05 + 0.15 * i : 0, 0.3, dt)
      easing.damp(p.rotation, "y", active ? Math.sin(t * 0.6 + i) * 0.25 : 0, 0.4, dt)
    })
  })

  const addStrip = (mat: THREE.MeshBasicMaterial | null) => {
    if (mat && !strips.current.includes(mat)) strips.current.push(mat)
  }
  const part = (i: number) => (g: THREE.Group | null) => {
    parts.current[i] = g
  }

  return (
    <group>
      <Hotspot id="skills" label="Tech stack" hint="3" labelPosition={[4.15, 1.3, -3.2]}>
        <group position={[3.35, 0, -4.0]}>
          {/* chassis */}
          <RoundedBox args={[1.0, 2.1, 1.9]} radius={0.04} smoothness={4} position={[0, 1.05, 0]} material={m.darkMetal} castShadow receiveShadow />
          <mesh position={[0.41, 1.05, 0]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[1.75, 1.95]} />
            <meshStandardMaterial color="#07060f" roughness={0.8} />
          </mesh>
          {/* motherboard */}
          <mesh position={[0.43, 1.2, -0.1]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[1.3, 1.4]} />
            <meshStandardMaterial color="#14241d" roughness={0.5} metalness={0.3} />
          </mesh>

          {/* exploding parts: GPU, RAM, cooler, PSU */}
          <group ref={part(0)}>
            <RoundedBox args={[0.22, 0.24, 1.25]} radius={0.03} position={[0.4, 0.75, 0.05]} material={m.aluminium} castShadow />
            <mesh position={[0.515, 0.75, 0.05]}>
              <boxGeometry args={[0.01, 0.04, 1.15]} />
              <meshBasicMaterial ref={addStrip} toneMapped={false} />
            </mesh>
            {[-0.3, 0.3].map((z) => (
              <mesh key={z} position={[0.52, 0.75, 0.05 + z]} rotation-z={Math.PI / 2} material={m.plasticBlack}>
                <cylinderGeometry args={[0.1, 0.1, 0.01, 24]} />
              </mesh>
            ))}
          </group>
          <group ref={part(1)}>
            {[0, 1, 2, 3].map((i) => (
              <group key={i} position={[0.45, 1.45, -0.55 + i * 0.09]}>
                <mesh material={m.darkMetal}>
                  <boxGeometry args={[0.09, 0.34, 0.025]} />
                </mesh>
                <mesh position={[0, 0.18, 0]}>
                  <boxGeometry args={[0.095, 0.03, 0.028]} />
                  <meshBasicMaterial ref={addStrip} toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>
          <group ref={part(2)}>
            <mesh position={[0.46, 1.5, 0.25]} rotation-z={Math.PI / 2} material={m.chrome} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.12, 36]} />
            </mesh>
            <mesh position={[0.53, 1.5, 0.25]} rotation-z={Math.PI / 2}>
              <torusGeometry args={[0.16, 0.012, 8, 40]} />
              <meshBasicMaterial ref={addStrip} toneMapped={false} />
            </mesh>
          </group>
          <group ref={part(3)}>
            <RoundedBox args={[0.5, 0.35, 0.6]} radius={0.03} position={[0.2, 0.22, -0.55]} material={m.plasticBlack} castShadow />
          </group>

          {/* hinged tempered-glass door (hinge on the front edge) */}
          <group position={[0.505, 1.05, 0.93]}>
            <group ref={door}>
              <mesh position={[0, 0, -0.9]} rotation-y={Math.PI / 2} material={m.glass}>
                <planeGeometry args={[1.8, 2.0]} />
              </mesh>
              <mesh position={[0.01, 0, -0.9]} userData={{ noShadow: true }}>
                <boxGeometry args={[0.01, 2.0, 0.02]} />
                <meshBasicMaterial ref={addStrip} toneMapped={false} />
              </mesh>
            </group>
          </group>

          {/* front fans */}
          <group ref={fans} position={[0, 0, 0.955]}>
            {[0.45, 1.05, 1.65].map((y) => (
              <group key={y} position={[0, y, 0]}>
                <mesh>
                  <torusGeometry args={[0.26, 0.02, 10, 48]} />
                  <meshBasicMaterial ref={addStrip} toneMapped={false} />
                </mesh>
                <group name="blades">
                  {Array.from({ length: 9 }, (_, i) => (
                    <mesh key={i} rotation={[0.35, 0, (i / 9) * Math.PI * 2]} position={[0, 0, 0.005]}>
                      <boxGeometry args={[0.07, 0.42, 0.006]} />
                      <meshStandardMaterial color="#1b1830" transparent opacity={0.8} roughness={0.3} />
                    </mesh>
                  ))}
                </group>
                <mesh position={[0, 0, 0.012]} material={m.plasticBlack}>
                  <circleGeometry args={[0.07, 24]} />
                </mesh>
              </group>
            ))}
          </group>
          <mesh position={[0, 2.03, 0.9]} userData={{ noShadow: true }}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <meshBasicMaterial color={[0.5, 3, 1.5]} toneMapped={false} />
          </mesh>
          <pointLight ref={light} position={[1.1, 1.1, 0.4]} intensity={2.6} distance={4} decay={1.8} />
          {open && <StackOrbit />}
        </group>
      </Hotspot>
      <Duck />
    </group>
  )
}

function StackOrbit() {
  const ring = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 0.25
  })
  return (
    <group ref={ring} position={[0.4, 1.3, 0]}>
      {toolbelt.map((name, i) => {
        const a = (i / toolbelt.length) * Math.PI * 2
        const r = 1.9
        return (
          <Html key={name} position={[Math.cos(a) * r, Math.sin(i * 1.7) * 0.6, Math.sin(a) * r]} center zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
            <span
              className="chip-in block whitespace-nowrap rounded-full border border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[11px] text-ink backdrop-blur"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {name}
            </span>
          </Html>
        )
      })}
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
    ref.current.position.y = 2.1 + Math.max(0, Math.sin(squash.current * Math.PI)) * 0.35
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
        setQuote(duckQuotes[Math.floor(Math.random() * duckQuotes.length)])
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setQuote(null), 2600)
      }}
    >
      <group ref={ref} position={[3.35, 2.1, -3.7]}>
        <mesh position={[0, 0.14, 0]} scale={[1.15, 0.85, 1]} castShadow>
          <sphereGeometry args={[0.16, 32, 24]} />
          <meshPhysicalMaterial color="#ffd23f" roughness={0.25} clearcoat={0.8} />
        </mesh>
        <mesh position={[0, 0.32, 0.08]} castShadow>
          <sphereGeometry args={[0.1, 32, 24]} />
          <meshPhysicalMaterial color="#ffd23f" roughness={0.25} clearcoat={0.8} />
        </mesh>
        <mesh position={[0, 0.3, 0.2]} rotation-x={Math.PI / 2} scale={[1.3, 1, 0.5]}>
          <coneGeometry args={[0.05, 0.1, 16]} />
          <meshPhysicalMaterial color="#ff8c42" roughness={0.3} clearcoat={0.6} />
        </mesh>
        {[-0.045, 0.045].map((x) => (
          <mesh key={x} position={[x, 0.35, 0.17]}>
            <sphereGeometry args={[0.017, 10, 10]} />
            <meshPhysicalMaterial color="#111" roughness={0.1} clearcoat={1} />
          </mesh>
        ))}
        <mesh position={[0, 0.2, -0.17]} rotation-x={-0.6}>
          <coneGeometry args={[0.06, 0.12, 12]} />
          <meshPhysicalMaterial color="#ffd23f" roughness={0.25} clearcoat={0.8} />
        </mesh>
        {quote && (
          <Html position={[0, 0.7, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-2xl rounded-bl-sm bg-amber px-3 py-2 font-mono text-xs font-semibold text-bg shadow-lg">{quote}</div>
          </Html>
        )}
      </group>
    </Hotspot>
  )
}
