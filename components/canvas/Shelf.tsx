"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { profile } from "@/lib/content"
import { Hotspot } from "./Hotspot"
import { rng } from "./textures"

const FRAME = "#5b3d2a"
const PALETTE = ["#8b7bff", "#4cc9ff", "#ff6b8b", "#ffb547", "#3ee39a", "#e9e6ff", "#c77dff", "#2a2548", "#ff8c42"]

// Local shelf space: x = depth (towards room), z = width along the wall, y = up.
const W = 2.9
const H = 4.4
const D = 0.8
const LEVELS = [0.1, 1.15, 2.2, 3.25]

export function Shelf() {
  return (
    <Hotspot id="about" label="About me" hint="2" labelPosition={[-4.4, 4.9, 1.35]}>
      <group position={[-4.78, 0, 1.35]}>
        {/* sides, top, back */}
        {[-W / 2, W / 2].map((z) => (
          <mesh key={z} position={[0, H / 2, z]}>
            <boxGeometry args={[D, H, 0.08]} />
            <meshStandardMaterial color={FRAME} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, H, 0]}>
          <boxGeometry args={[D + 0.06, 0.08, W + 0.1]} />
          <meshStandardMaterial color={FRAME} roughness={0.7} />
        </mesh>
        <mesh position={[-D / 2 + 0.02, H / 2, 0]}>
          <boxGeometry args={[0.03, H, W]} />
          <meshStandardMaterial color="#3a2718" roughness={0.9} />
        </mesh>
        {LEVELS.map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[D, 0.06, W]} />
            <meshStandardMaterial color={FRAME} roughness={0.7} />
          </mesh>
        ))}
        <Books />
        <PhotoFrame />
        <Trophy position={[0.05, 3.28, -0.95]} />
        <Camera position={[0.05, H + 0.04, -0.7]} />
        <Globe position={[0.05, 2.23, 0.95]} />
        <Plant position={[0, H + 0.04, 0.9]} />
      </group>
    </Hotspot>
  )
}

function Books() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const books = useMemo(() => {
    const r = rng(42)
    const out: { pos: THREE.Vector3; scale: THREE.Vector3; tilt: number; color: string }[] = []
    LEVELS.forEach((y, level) => {
      // leave room for trinkets on some shelves
      const start = level === 3 ? -0.55 : -W / 2 + 0.1
      const end = level === 1 || level === 2 ? 0.55 : level === 3 ? W / 2 - 0.1 : W / 2 - 0.1
      let z = start
      while (z < end - 0.1) {
        const w = 0.07 + r() * 0.08
        const h = 0.62 + r() * 0.3
        const tilt = r() > 0.9 ? 0.18 : 0
        out.push({
          pos: new THREE.Vector3(0.02 + r() * 0.06, y + 0.03 + h / 2, z + w / 2),
          scale: new THREE.Vector3(0.5 + r() * 0.15, h, w),
          tilt,
          color: PALETTE[Math.floor(r() * PALETTE.length)],
        })
        z += w + 0.012 + (tilt ? 0.08 : 0)
      }
    })
    return out
  }, [])

  useLayoutEffect(() => {
    const m = new THREE.Object3D()
    const c = new THREE.Color()
    books.forEach((b, i) => {
      m.position.copy(b.pos)
      m.scale.copy(b.scale)
      m.rotation.set(b.tilt, 0, 0)
      m.updateMatrix()
      ref.current!.setMatrixAt(i, m.matrix)
      ref.current!.setColorAt(i, c.set(b.color))
    })
    ref.current!.instanceMatrix.needsUpdate = true
    ref.current!.instanceColor!.needsUpdate = true
  }, [books])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, books.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.75} />
    </instancedMesh>
  )
}

function PhotoFrame() {
  const tex = useTexture(profile.photo)
  tex.colorSpace = THREE.SRGBColorSpace
  return (
    <group position={[0.05, 1.57, 1.0]} rotation={[0, Math.PI / 2, 0.08]}>
      <RoundedBox args={[0.62, 0.76, 0.05]} radius={0.015}>
        <meshStandardMaterial color="#e9e6ff" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.027]}>
        <planeGeometry args={[0.5, 0.64]} />
        <meshStandardMaterial map={tex} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Trophy(props: G) {
  return (
    <group {...props}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.22, 0.1, 0.22]} />
        <meshStandardMaterial color="#1b1830" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.2, 12]} />
        <meshStandardMaterial color="#ffc94a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.14, 0.05, 0.22, 20]} />
        <meshStandardMaterial color="#ffc94a" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Camera(props: G) {
  return (
    <group {...props} rotation-y={Math.PI / 2 - 0.4}>
      <RoundedBox args={[0.42, 0.26, 0.16]} radius={0.03} position={[0, 0.13, 0]}>
        <meshStandardMaterial color="#141126" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.13, 0.13]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.09, 0.1, 0.14, 24]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.13, 0.201]}>
        <circleGeometry args={[0.07, 24]} />
        <meshStandardMaterial color="#223a7a" metalness={1} roughness={0.05} />
      </mesh>
    </group>
  )
}

function Globe(props: G) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.4
  })
  return (
    <group {...props}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.06, 16]} />
        <meshStandardMaterial color="#1b1830" />
      </mesh>
      <mesh ref={ref} position={[0, 0.3, 0]} rotation-z={0.4}>
        <icosahedronGeometry args={[0.2, 1]} />
        <meshStandardMaterial color="#4cc9ff" flatShading roughness={0.5} />
      </mesh>
    </group>
  )
}

function Plant(props: G) {
  return (
    <group {...props}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.16, 0.12, 0.28, 16]} />
        <meshStandardMaterial color="#e9e6ff" />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.12, 0.45, Math.sin(a) * 0.12]} rotation={[Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6]}>
            <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
            <meshStandardMaterial color="#3f9e6a" roughness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

type G = import("@react-three/fiber").ThreeElements["group"]
