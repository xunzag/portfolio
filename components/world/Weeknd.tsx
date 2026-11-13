"use client"

import { Suspense, useLayoutEffect, useMemo, useRef } from "react"
import { useFrame, type ThreeElements } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { sound } from "@/lib/sound"
import { Model } from "./Model"
import { Island } from "./Rock"
import { Type } from "./Type"

useGLTF.preload("/models/weeknd.glb")

const BARS = 40

// A monument to the soundtrack of every late-night build: a giant bust on its
// own island, washed in red, ringed by an equaliser that moves with the beat.
export function Weeknd(props: ThreeElements["group"]) {
  const turn = useRef<THREE.Group>(null)
  const bars = useRef<THREE.InstancedMesh>(null)
  const rings = useRef<THREE.Group>(null)
  const key = useRef<THREE.PointLight>(null)
  const o = useMemo(() => new THREE.Object3D(), [])
  const world = useMemo(() => new THREE.Vector3(), [])
  const R = 4.3

  useLayoutEffect(() => {
    const c = new THREE.Color()
    for (let i = 0; i < BARS; i++) bars.current!.setColorAt(i, c.setRGB(3.2, 0.25 + (i % 5) * 0.08, 0.45))
    bars.current!.instanceColor!.needsUpdate = true
  }, [])

  useFrame(({ camera, clock }, dt) => {
    const t = clock.elapsedTime
    const beat = sound.beat(t)
    if (turn.current) {
      // he slowly turns to keep an eye on you
      turn.current.getWorldPosition(world)
      const want = Math.atan2(camera.position.x - world.x, camera.position.z - world.z)
      let d = want - turn.current.rotation.y
      d = Math.atan2(Math.sin(d), Math.cos(d))
      turn.current.rotation.y += d * Math.min(1, dt * 0.9)
      turn.current.position.y = 1.2 + Math.sin(t * 0.6) * 0.18
    }
    if (bars.current) {
      for (let i = 0; i < BARS; i++) {
        const a = (i / BARS) * Math.PI * 2
        // a fake spectrum: each bar has its own rhythm, all of them kick on the beat
        const n = 0.5 + 0.5 * Math.sin(t * (2.2 + (i % 7) * 0.6) + i * 1.7)
        const h = 0.25 + n * 0.9 + beat * (0.6 + ((i * 7) % 5) * 0.35)
        o.position.set(Math.cos(a) * R, 0.95 + h / 2, Math.sin(a) * R)
        o.rotation.set(0, -a, 0)
        o.scale.set(1, h, 1)
        o.updateMatrix()
        bars.current.setMatrixAt(i, o.matrix)
      }
      bars.current.instanceMatrix.needsUpdate = true
    }
    if (rings.current)
      rings.current.children.forEach((r, i) => {
        const k = (t * 0.35 + i / 3) % 1
        r.scale.setScalar(1 + k * 2.2 + beat * 0.08)
        ;((r as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.7
      })
    if (key.current) key.current.intensity = 90 + beat * 160
  })

  return (
    <group {...props}>
      <Island radius={5} seed={77} rim="#ff2a4a" />
      <group ref={turn} position={[0, 1.2, 0]}>
        <Suspense fallback={null}>
          <Model url="/models/weeknd.glb" height={8.2} />
        </Suspense>
      </group>
      <instancedMesh ref={bars} args={[undefined, undefined, BARS]} frustumCulled={false}>
        <boxGeometry args={[0.2, 1, 0.08]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <group ref={rings} position={[0, 1.02, 0]} rotation-x={-Math.PI / 2}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <ringGeometry args={[4.7, 4.76, 96]} />
            <meshBasicMaterial color={[3, 0.3, 0.5]} toneMapped={false} transparent depthWrite={false} />
          </mesh>
        ))}
      </group>
      {/* After Hours: hard red key from below, a cold rim from behind */}
      <pointLight ref={key} position={[0, 2.2, 4.5]} color="#ff1f3d" intensity={90} distance={16} decay={1.5} />
      <pointLight position={[-4, 9, -4]} color="#5f8cff" intensity={60} distance={16} decay={1.5} />
      <group position={[0, 10.9, 0]}>
        <Billboarded>
          <Type weight="semi" fontSize={0.26} letterSpacing={0.34} anchorX="center" color="#ff6f8a" glow={2.2}>
            {"NOW PLAYING"}
          </Type>
          <Type weight="bold" fontSize={0.62} anchorX="center" position={[0, -0.42, 0]} glow={1.5}>
            {"The Weeknd, on repeat"}
          </Type>
        </Billboarded>
      </group>
    </group>
  )
}

function Billboarded({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ camera }) => ref.current?.quaternion.copy(camera.quaternion))
  return <group ref={ref}>{children}</group>
}
