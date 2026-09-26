"use client"

import { Suspense, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"
import { RANGES, local } from "@/lib/chapters"
import { useRoom } from "@/lib/store"
import { live } from "./live"
import { bikeZ } from "./track"
import { Model } from "./Model"

// The hero vehicle: rides the highway as you scroll through Work.
export function Bike() {
  const hasModel = useRoom((s) => s.models.includes("biker.glb"))
  const root = useRef<THREE.Group>(null)
  const lean = useRef<THREE.Group>(null)
  const wheels = useRef<THREE.Group[]>([])
  const trail = useRef<THREE.Mesh>(null)
  const beam = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)
  const state = useRef({ z: 0, speed: 0 })
  const beamTarget = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }, dt) => {
    const s = live.scroll
    const z = bikeZ(s)
    const st = state.current
    const raw = dt > 0 ? Math.abs(z - st.z) / dt : 0
    st.speed += (Math.min(raw, 80) - st.speed) * Math.min(1, dt * 6)
    st.z = z
    if (!root.current) return
    root.current.position.z = z
    root.current.visible = s < RANGES.ascend[1] - 8
    const t = local(s, "work")
    if (lean.current) {
      easing.damp(lean.current.rotation, "z", -Math.sin(t * Math.PI * 7) * 0.1 * Math.min(1, st.speed / 20), 0.3, dt)
      lean.current.position.y = Math.sin(clock.elapsedTime * 11) * 0.006 * Math.min(1, st.speed / 10)
    }
    const spin = (st.speed / 0.36) * dt + dt * 0.3
    wheels.current.forEach((w) => w && (w.rotation.x -= spin))
    if (trail.current) {
      const len = 0.1 + Math.min(16, st.speed * 0.45)
      trail.current.scale.z = len
      trail.current.position.z = 1.1 + len / 2
      ;(trail.current.material as THREE.MeshBasicMaterial).opacity = Math.min(1, st.speed / 6)
    }
    if (beam.current) (beam.current.material as THREE.MeshBasicMaterial).opacity = 0.16 + Math.sin(clock.elapsedTime * 30) * 0.005
    if (ring.current) {
      const h = 1 - local(s, "hero")
      ring.current.scale.setScalar(1 + (1 - h) * 0.6)
      ;(ring.current.material as THREE.MeshBasicMaterial).opacity = h
    }
  })

  const trailTex = useMemo(() => {
    const c = document.createElement("canvas")
    c.width = 4
    c.height = 128
    const g = c.getContext("2d")!
    const grd = g.createLinearGradient(0, 0, 0, 128)
    grd.addColorStop(0, "rgba(255,40,60,1)")
    grd.addColorStop(0.3, "rgba(255,30,80,0.55)")
    grd.addColorStop(1, "rgba(255,0,120,0)")
    g.fillStyle = grd
    g.fillRect(0, 0, 4, 128)
    return new THREE.CanvasTexture(c)
  }, [])

  return (
    <group>
      {/* hero stage ring */}
      <mesh ref={ring} rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.9, 3.05, 96]} />
        <meshBasicMaterial color={[3, 0.5, 2.4]} toneMapped={false} transparent />
      </mesh>
      <group ref={root}>
        <group ref={lean}>
          {hasModel ? (
            <Suspense fallback={<LightCycle wheels={wheels} />}>
              <Model url="/models/biker.glb" size={2.7} fit="length" rotationY={Math.PI} />
            </Suspense>
          ) : (
            <LightCycle wheels={wheels} />
          )}
        </group>
        {/* the iconic red light trail */}
        <mesh ref={trail} position={[0, 0.8, 1.2]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[0.18, 1]} />
          <meshBasicMaterial map={trailTex} color={[3, 0.4, 0.6]} transparent depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
        {/* headlight beam */}
        <mesh ref={beam} position={[0, 0.72, -4.2]} rotation-x={-Math.PI / 2 + 0.06}>
          <coneGeometry args={[1.6, 6, 32, 1, true]} />
          <meshBasicMaterial color="#cfe6ff" transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
        {/* underglow + neon rim lights that ride along */}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
          <planeGeometry args={[1.6, 3.6]} />
          <meshBasicMaterial color={[2.2, 0.2, 1.6]} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <pointLight position={[-1.6, 1.4, 0.4]} color="#ff3fd0" intensity={9} distance={7} decay={1.6} />
        <pointLight position={[1.6, 1.6, -0.6]} color="#3fd8ff" intensity={9} distance={7} decay={1.6} />
        <primitive object={beamTarget} position={[0, 0, -12]} />
        <spotLight position={[0, 0.8, -1.4]} angle={0.5} penumbra={0.7} intensity={40} distance={30} color="#dbe9ff" target={beamTarget} />
      </group>
    </group>
  )
}

// Stylised Akira-style cycle built from primitives (stand-in for biker.glb).
function LightCycle({ wheels }: { wheels: React.RefObject<THREE.Group[]> }) {
  const red = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#d4141f", roughness: 0.22, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 }), [])
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#16141e", metalness: 0.7, roughness: 0.35 }), [])
  const rubber = useMemo(() => new THREE.MeshStandardMaterial({ color: "#09080d", roughness: 0.85 }), [])
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 1, roughness: 0.12 }), [])
  const addWheel = (i: number) => (g: THREE.Group | null) => {
    if (g && wheels.current) wheels.current[i] = g
  }

  return (
    <group>
      {[
        [0, 0.38, 0.98],
        [0, 0.38, -1.02],
      ].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <group ref={addWheel(i)}>
            <mesh rotation-y={Math.PI / 2} material={rubber} castShadow>
              <torusGeometry args={[0.3, 0.1, 16, 40]} />
            </mesh>
            <mesh rotation-y={Math.PI / 2}>
              <torusGeometry args={[0.23, 0.014, 8, 40]} />
              <meshBasicMaterial color={[3.4, 0.3, 0.5]} toneMapped={false} />
            </mesh>
            {Array.from({ length: 5 }, (_, k) => (
              <mesh key={k} rotation-x={(k / 5) * Math.PI * 2} material={chrome}>
                <boxGeometry args={[0.03, 0.44, 0.04]} />
              </mesh>
            ))}
            <mesh rotation-z={Math.PI / 2} material={chrome}>
              <cylinderGeometry args={[0.07, 0.07, 0.2, 16]} />
            </mesh>
          </group>
          {/* fender */}
          <mesh position={[0, 0.12, 0]} rotation-y={Math.PI / 2} material={red}>
            <torusGeometry args={[0.44, 0.07, 10, 24, Math.PI * 0.9]} />
          </mesh>
        </group>
      ))}

      {/* long low fairing */}
      <mesh position={[0, 0.66, -0.05]} rotation-x={Math.PI / 2} scale={[0.82, 1, 0.75]} material={red} castShadow>
        <capsuleGeometry args={[0.34, 1.5, 12, 24]} />
      </mesh>
      <mesh position={[0, 0.7, -0.98]} scale={[0.78, 0.72, 1]} material={red} castShadow>
        <sphereGeometry args={[0.4, 32, 24]} />
      </mesh>
      {/* white racing stripes */}
      {[-0.285, 0.285].map((x) => (
        <mesh key={x} position={[x, 0.7, -0.1]} rotation-z={x > 0 ? -0.1 : 0.1}>
          <boxGeometry args={[0.01, 0.05, 1.7]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.3} />
        </mesh>
      ))}
      {/* tail */}
      <RoundedBox args={[0.46, 0.3, 0.7]} radius={0.12} position={[0, 0.86, 0.72]} rotation-x={-0.18} material={red} castShadow />
      {/* seat */}
      <RoundedBox args={[0.4, 0.1, 0.72]} radius={0.05} position={[0, 1.0, 0.25]} castShadow>
        <meshStandardMaterial color="#111016" roughness={0.6} />
      </RoundedBox>
      {/* windshield */}
      <mesh position={[0, 1.0, -0.78]} rotation-x={-0.9} scale={[0.72, 1, 0.5]}>
        <sphereGeometry args={[0.36, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#1b2a55" transparent opacity={0.5} roughness={0.05} clearcoat={1} />
      </mesh>
      {/* handlebars + forks */}
      <mesh position={[0, 1.02, -0.6]} rotation-z={Math.PI / 2} material={dark}>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 10]} />
      </mesh>
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.66, -0.9]} rotation-x={0.35} material={chrome}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 10]} />
        </mesh>
      ))}
      {/* engine block + exhaust */}
      <RoundedBox args={[0.42, 0.3, 0.6]} radius={0.06} position={[0, 0.42, 0.05]} material={dark} />
      <mesh position={[0.24, 0.42, 0.75]} rotation-x={Math.PI / 2 - 0.1} material={chrome}>
        <cylinderGeometry args={[0.05, 0.065, 0.7, 14]} />
      </mesh>
      {/* headlight + taillight */}
      <mesh position={[0, 0.74, -1.33]}>
        <circleGeometry args={[0.1, 24]} />
        <meshBasicMaterial color={[5, 5, 5.5]} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.9, 1.08]}>
        <boxGeometry args={[0.32, 0.05, 0.02]} />
        <meshBasicMaterial color={[5, 0.3, 0.4]} toneMapped={false} />
      </mesh>
    </group>
  )
}
