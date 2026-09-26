"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"
import { local } from "@/lib/chapters"
import { live } from "./live"
import { ROOF } from "./track"

// Contact: a rooftop above the highway as the sun comes up.
export function Rooftop() {
  const sun = useRef<THREE.DirectionalLight>(null)
  const beacon = useRef<THREE.MeshBasicMaterial>(null)
  const target = useMemo(() => new THREE.Object3D(), [])
  const signTex = useMemo(() => sign(), [])

  useFrame(({ clock }) => {
    const t = local(live.scroll, "contact")
    if (sun.current) sun.current.intensity = 0.4 + t * 2.6
    if (beacon.current) beacon.current.color.setRGB(clock.elapsedTime % 1.6 < 0.2 ? 5 : 0.4, 0.1, 0.15)
  })

  const dark = "#1b1726"
  return (
    <group position={ROOF}>
      <primitive object={target} position={[0, 0, -30]} />
      <directionalLight ref={sun} target={target} position={[6, 6, -40]} color="#ffb27a" intensity={1} />
      <hemisphereLight args={["#ffb9a3", "#1a1030", 0.7]} />

      {/* building under the roof */}
      <mesh position={[0, -ROOF.y / 2 - 0.5, 0]}>
        <boxGeometry args={[18, ROOF.y, 14]} />
        <meshStandardMaterial color="#0f0c18" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[18.4, 0.5, 14.4]} />
        <meshStandardMaterial color="#2a2436" roughness={0.85} />
      </mesh>
      {/* parapet */}
      {[
        [0, 0.45, 7.1, 18.4, 0.9, 0.25],
        [0, 0.45, -7.1, 18.4, 0.9, 0.25],
        [9.1, 0.45, 0, 0.25, 0.9, 14.4],
        [-9.1, 0.45, 0, 0.25, 0.9, 14.4],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={dark} roughness={0.8} />
        </mesh>
      ))}
      {/* AC units */}
      {[
        [-5.5, -3.5],
        [-3.4, -3.5],
        [5.8, 4.2],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <RoundedBox args={[1.6, 1.1, 1.3]} radius={0.06} position={[0, 0.55, 0]}>
            <meshStandardMaterial color="#8d8a9c" metalness={0.5} roughness={0.45} />
          </RoundedBox>
          <mesh position={[0, 0.8, 0.66]}>
            <circleGeometry args={[0.38, 24]} />
            <meshStandardMaterial color="#2a2833" metalness={0.6} />
          </mesh>
        </group>
      ))}
      {/* water tank */}
      <group position={[6, 0, -3.5]}>
        {[-0.8, 0.8].map((x) =>
          [-0.8, 0.8].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 1, z]}>
              <boxGeometry args={[0.12, 2, 0.12]} />
              <meshStandardMaterial color={dark} metalness={0.6} />
            </mesh>
          )),
        )}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 2.2, 28]} />
          <meshStandardMaterial color="#5a3f35" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.4, 0]}>
          <coneGeometry args={[1.4, 0.7, 28]} />
          <meshStandardMaterial color="#3d2b26" roughness={0.8} />
        </mesh>
      </group>
      {/* antenna with blinking beacon */}
      <mesh position={[-7, 3, 5]}>
        <cylinderGeometry args={[0.05, 0.08, 6, 8]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} />
      </mesh>
      <mesh position={[-7, 6.05, 5]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial ref={beacon} toneMapped={false} />
      </mesh>
      {/* neon sign facing the camera path */}
      <group position={[1.5, 2.3, -6.6]}>
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[7.4, 2.1, 0.12]} />
          <meshStandardMaterial color="#0d0a14" />
        </mesh>
        <mesh>
          <planeGeometry args={[7.2, 1.95]} />
          <meshBasicMaterial map={signTex} transparent toneMapped={false} color={[1.8, 1.8, 1.8]} />
        </mesh>
        {[-3, 3].map((x) => (
          <mesh key={x} position={[x, -1.6, -0.1]}>
            <boxGeometry args={[0.12, 1.4, 0.12]} />
            <meshStandardMaterial color={dark} />
          </mesh>
        ))}
      </group>
      {/* string lights across the roof */}
      <StringLights />
      {/* bench */}
      <group position={[-2, 0, 4]}>
        <RoundedBox args={[2.6, 0.12, 0.7]} radius={0.04} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#8a5a3b" roughness={0.6} />
        </RoundedBox>
        {[-1.1, 1.1].map((x) => (
          <mesh key={x} position={[x, 0.25, 0]}>
            <boxGeometry args={[0.1, 0.5, 0.6]} />
            <meshStandardMaterial color={dark} metalness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function StringLights() {
  const pts = useMemo(() => {
    const out: [number, number, number][] = []
    for (let i = 0; i <= 18; i++) {
      const t = i / 18
      out.push([-8.5 + t * 17, 3.2 - Math.sin(t * Math.PI) * 0.8, 6.8 - t * 12])
    }
    return out
  }, [])
  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color={[3, 2, 0.9]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function sign() {
  const c = document.createElement("canvas")
  c.width = 1024
  c.height = 280
  const g = c.getContext("2d")!
  g.textAlign = "center"
  g.textBaseline = "middle"
  const draw = (color: string, blur: number, width: number) => {
    g.shadowColor = color
    g.shadowBlur = blur
    g.strokeStyle = color
    g.lineWidth = width
    g.font = "800 120px system-ui, sans-serif"
    g.strokeText("OPEN FOR WORK", 512, 120)
    g.font = "600 44px ui-monospace, monospace"
    g.lineWidth = width * 0.5
    g.strokeText("say hi → farhan", 512, 222)
  }
  draw("#3fd8ff", 36, 10)
  draw("#bff3ff", 8, 4)
  draw("#ffffff", 0, 1.5)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
