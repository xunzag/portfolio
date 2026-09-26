"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"
import { animes } from "@/lib/content"
import { useRoom } from "@/lib/store"
import { Hotspot } from "./Hotspot"

const TILTS = [0.03, -0.04, 0.02, -0.02, 0.05, -0.03]

export function PosterWall() {
  const textures = useTexture(animes.map((a) => a.image))
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace))

  return (
    <Hotspot id="life" label="Anime & hobbies" hint="4" labelPosition={[-4.6, 5.3, -2.85]} lift={0}>
      <group position={[-5.17, 0, -2.85]} rotation-y={Math.PI / 2}>
        {animes.map((a, i) => {
          const col = i % 3
          const row = Math.floor(i / 3)
          return (
            <Poster
              key={a.title}
              texture={textures[i]}
              index={i}
              position={[(col - 1) * 1.05, 4.3 - row * 1.45, 0]}
              tilt={TILTS[i]}
            />
          )
        })}
        {/* string lights across the top */}
        <FairyLights />
      </group>
      <Guitar />
    </Hotspot>
  )
}

function Poster({ texture, position, tilt, index }: { texture: THREE.Texture; position: [number, number, number]; tilt: number; index: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }, dt) => {
    if (!ref.current) return
    const { hovered, focus } = useRoom.getState()
    const lit = hovered === "life" || focus === "life"
    // posters pop off the wall one after another when the wall is active
    const wave = lit ? 0.08 + Math.sin(clock.elapsedTime * 2 + index) * 0.015 : 0
    easing.damp(ref.current.position, "z", wave, 0.2, dt)
  })
  return (
    <group position={position} rotation-z={tilt}>
      <group ref={ref}>
        <mesh position={[0, 0, 0.005]}>
          <boxGeometry args={[0.9, 1.26, 0.02]} />
          <meshStandardMaterial color="#0d0b18" />
        </mesh>
        <mesh position={[0, 0, 0.017]}>
          <planeGeometry args={[0.84, 1.2]} />
          <meshStandardMaterial map={texture} roughness={0.55} />
        </mesh>
        {/* tape */}
        <mesh position={[0, 0.6, 0.02]} rotation-z={0.1}>
          <planeGeometry args={[0.2, 0.06]} />
          <meshStandardMaterial color="#f3e9c6" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  )
}

function FairyLights() {
  const bulbs = useRef<THREE.MeshBasicMaterial[]>([])
  useFrame(({ clock }) => {
    const { party, lightsOn } = useRoom.getState()
    const t = clock.elapsedTime
    bulbs.current.forEach((m, i) => {
      const on = 0.6 + 0.4 * Math.sin(t * (party ? 8 : 1.5) + i * 1.3)
      if (party) m.color.setHSL((t * 0.3 + i * 0.07) % 1, 1, 0.6).multiplyScalar(2.5 * on)
      else m.color.setRGB(2.4 * on, 1.6 * on, 0.7 * on).multiplyScalar(lightsOn ? 1 : 1.4)
    })
  })
  const n = 14
  return (
    <group position={[0, 5.3, 0.05]}>
      {Array.from({ length: n }, (_, i) => {
        const x = -1.75 + (i / (n - 1)) * 3.5
        const y = -Math.sin((i / (n - 1)) * Math.PI) * 0.22
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              toneMapped={false}
              ref={(m) => {
                if (m) bulbs.current[i] = m
              }}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function Guitar() {
  const body = "#c0392b"
  return (
    <group position={[-4.75, 0.02, -0.55]} rotation={[0, Math.PI / 2, 0]}>
      <group rotation-x={-0.22} position={[0, 0, 0.3]}>
        <mesh position={[0, 0.55, 0]} scale={[1, 1.15, 0.35]}>
          <sphereGeometry args={[0.36, 24, 18]} />
          <meshStandardMaterial color={body} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.02, 0]} scale={[1, 1, 0.35]}>
          <sphereGeometry args={[0.27, 24, 18]} />
          <meshStandardMaterial color={body} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.8, 0.13]}>
          <circleGeometry args={[0.1, 24]} />
          <meshStandardMaterial color="#120c0c" />
        </mesh>
        <mesh position={[0, 1.65, 0.02]}>
          <boxGeometry args={[0.1, 1.1, 0.05]} />
          <meshStandardMaterial color="#5b3d2a" />
        </mesh>
        <mesh position={[0, 2.28, 0.02]}>
          <boxGeometry args={[0.16, 0.24, 0.05]} />
          <meshStandardMaterial color="#2a1c12" />
        </mesh>
        {[-0.03, -0.01, 0.01, 0.03].map((x) => (
          <mesh key={x} position={[x, 1.45, 0.05]}>
            <boxGeometry args={[0.004, 1.9, 0.004]} />
            <meshStandardMaterial color="#e8e2d0" metalness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
