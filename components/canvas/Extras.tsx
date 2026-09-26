"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox, Sparkles } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"
import { useRoom } from "@/lib/store"

export function Beanbag() {
  return (
    <group position={[-2.6, 0, 2.9]} rotation-y={0.6}>
      <mesh position={[0, 0.45, 0]} scale={[1, 0.62, 1]}>
        <sphereGeometry args={[0.85, 32, 24]} />
        <meshStandardMaterial color="#3a8fb7" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.72, 0.3]} scale={[0.85, 0.35, 0.6]}>
        <sphereGeometry args={[0.6, 24, 16]} />
        <meshStandardMaterial color="#347fa3" roughness={0.9} />
      </mesh>
      {/* controller */}
      <group position={[0.1, 0.92, 0.1]} rotation={[-0.2, 0.4, 0.1]}>
        <RoundedBox args={[0.34, 0.07, 0.18]} radius={0.03}>
          <meshStandardMaterial color="#e9e6ff" roughness={0.4} />
        </RoundedBox>
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, 0, 0.08]} scale={[1, 0.6, 1]}>
            <sphereGeometry args={[0.07, 12, 10]} />
            <meshStandardMaterial color="#e9e6ff" roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.08, 0.005, 0.02]} />
          <meshBasicMaterial color={[0.4, 1.2, 3]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

export function DiscoBall() {
  const ref = useRef<THREE.Group>(null)
  const spot = useRef<THREE.PointLight>(null)
  useFrame(({ clock }, dt) => {
    if (!ref.current) return
    const party = useRoom.getState().party
    easing.damp(ref.current.position, "y", party ? 5.2 : 9, 0.5, dt)
    ref.current.rotation.y += dt * 1.2
    ref.current.visible = ref.current.position.y < 8.8
    if (spot.current) {
      spot.current.intensity = party ? 18 : 0
      spot.current.color.setHSL((clock.elapsedTime * 0.7) % 1, 1, 0.6)
    }
  })
  return (
    <group ref={ref} position={[0.6, 9, -1.4]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.6, 4]} />
        <meshStandardMaterial color="#999" />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.38, 2]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.08} flatShading />
      </mesh>
      <pointLight ref={spot} position={[0, -0.6, 0]} distance={9} decay={1.2} intensity={0} />
    </group>
  )
}

export function Dust() {
  const lightsOn = useRoom((s) => s.lightsOn)
  return <Sparkles count={45} scale={[9, 5, 9]} position={[0, 3, -0.5]} size={2.2} speed={0.25} opacity={lightsOn ? 0.5 : 0.25} color="#ffd9a8" />
}

export function FloorPlant() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.02
  })
  const leaves = [
    [0, 0.2, 0.9], [2.1, 0.5, 0.75], [4.2, 0.35, 0.85], [1.1, 0.9, 0.55], [3.1, 0.8, 0.6], [5.3, 0.6, 0.7], [0.4, 1.1, 0.35],
  ]
  return (
    <group position={[-4.2, 0, 4.2]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.38, 0.3, 0.7, 20]} />
        <meshStandardMaterial color="#e9e6ff" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.69, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.36, 20]} />
        <meshStandardMaterial color="#2b1d14" />
      </mesh>
      <group ref={ref} position={[0, 0.7, 0]}>
        {leaves.map(([a, tilt, len], i) => (
          <group key={i} rotation={[0, a, tilt]}>
            <mesh position={[0, len * 0.5, 0]}>
              <cylinderGeometry args={[0.012, 0.018, len, 5]} />
              <meshStandardMaterial color="#2f7a52" />
            </mesh>
            <mesh position={[0.18, len + 0.05, 0]} rotation={[Math.PI / 2, 0, -0.5]} scale={[1, 1.4, 1]}>
              <circleGeometry args={[0.24, 12]} />
              <meshStandardMaterial color={i % 2 ? "#3f9e6a" : "#358c5c"} side={THREE.DoubleSide} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
