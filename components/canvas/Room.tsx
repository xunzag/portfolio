"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { neonSignTexture, rugTexture, woodTexture } from "./textures"

const WALL = "#27234a"
const WALL_SIDE = "#221f42"
const TRIM = "#171432"

export function RoomShell() {
  const wood = useMemo(() => woodTexture(), [])
  const rug = useMemo(() => rugTexture(), [])

  return (
    <group>
      {/* floor slab */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[10.4, 0.4, 10.4]} />
        <meshStandardMaterial color="#c9a27e" map={wood} roughness={0.75} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <boxGeometry args={[10.1, 1, 10.1]} />
        <meshStandardMaterial color="#120f26" roughness={1} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 3, -5.35]}>
        <boxGeometry args={[10.4, 6.4, 0.3]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      {/* left wall */}
      <mesh position={[-5.35, 3, 0]}>
        <boxGeometry args={[0.3, 6.4, 10.4]} />
        <meshStandardMaterial color={WALL_SIDE} roughness={0.95} />
      </mesh>

      {/* baseboards */}
      <mesh position={[0, 0.12, -5.17]}>
        <boxGeometry args={[10.4, 0.24, 0.06]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
      <mesh position={[-5.17, 0.12, 0]}>
        <boxGeometry args={[0.06, 0.24, 10.4]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>

      {/* rug */}
      <mesh rotation-x={-Math.PI / 2} position={[0.6, 0.01, -2.1]}>
        <circleGeometry args={[2.4, 64]} />
        <meshStandardMaterial map={rug} roughness={1} />
      </mesh>

      <LedStrip />
      <Window />
      <NeonSign />
      <Clock />
      <WallShelf />
    </group>
  )
}

// Neon strip along the top edge of the walls — glows through bloom.
function LedStrip() {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const color = useMemo(() => new THREE.Color(), [])
  useFrame(({ clock }) => {
    const { party, lightsOn } = useRoom.getState()
    const t = clock.elapsedTime
    if (party) color.setHSL((t * 0.4) % 1, 1, 0.55)
    else color.set("#8b7bff")
    color.multiplyScalar(lightsOn ? 2.2 : 1.1)
    mat.current?.color.copy(color)
  })
  return (
    <group>
      <mesh position={[0, 6.16, -5.18]}>
        <boxGeometry args={[10.4, 0.06, 0.06]} />
        <meshBasicMaterial ref={mat} toneMapped={false} />
      </mesh>
      <mesh position={[-5.18, 6.16, 0]}>
        <boxGeometry args={[0.06, 0.06, 10.4]} />
        <meshBasicMaterial color={[0.8, 0.65, 2]} toneMapped={false} />
      </mesh>
    </group>
  )
}

const skyVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const skyFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 uv = vUv;
    vec3 col = mix(vec3(0.16, 0.08, 0.32), vec3(0.02, 0.03, 0.12), uv.y);
    // stars
    vec2 g = floor(uv * vec2(60.0, 60.0));
    float h = hash(g);
    if (h > 0.975) {
      vec2 f = fract(uv * 60.0) - 0.5;
      float tw = 0.6 + 0.4 * sin(uTime * 2.0 + h * 60.0);
      col += smoothstep(0.18, 0.0, length(f)) * tw;
    }
    // shooting star
    float st = fract(uTime * 0.08);
    vec2 sp = vec2(1.2 - st * 1.6, 1.0 - st * 0.5);
    vec2 d = uv - sp;
    float along = dot(d, normalize(vec2(-0.95, -0.3)));
    float across = abs(dot(d, normalize(vec2(0.3, -0.95))));
    col += smoothstep(0.004, 0.0, across) * smoothstep(-0.18, 0.0, along) * smoothstep(0.01, 0.0, along) * step(st, 0.35) * 1.5;
    // moon
    float m = length((uv - vec2(0.74, 0.74)) * vec2(1.0, 1.1));
    col += vec3(1.0, 0.95, 0.85) * smoothstep(0.1, 0.095, m);
    col += vec3(0.5, 0.45, 0.9) * 0.35 * smoothstep(0.35, 0.08, m);
    // city skyline
    float x = uv.x * 18.0;
    float b = floor(x);
    float height = 0.12 + hash(vec2(b, 3.0)) * 0.28;
    if (uv.y < height) {
      col = vec3(0.03, 0.02, 0.08);
      vec2 w = fract(vec2(x * 3.0, uv.y * 40.0));
      float lit = step(0.72, hash(floor(vec2(x * 3.0, uv.y * 40.0))));
      float blink = step(0.2, fract(hash(vec2(b, floor(uv.y * 40.0))) + uTime * 0.02));
      col += vec3(1.0, 0.75, 0.35) * lit * blink * step(0.3, w.x) * step(0.35, w.y) * 0.9;
    }
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

function Window() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame(({ clock }) => (uniforms.uTime.value = clock.elapsedTime))
  const frame = "#15122b"
  return (
    <group position={[-3.2, 3.55, -5.18]}>
      <mesh>
        <planeGeometry args={[2.4, 2.4]} />
        <shaderMaterial uniforms={uniforms} vertexShader={skyVertex} fragmentShader={skyFragment} toneMapped={false} />
      </mesh>
      {/* frame */}
      {[
        [0, 1.25, 2.6, 0.12],
        [0, -1.25, 2.6, 0.12],
        [1.25, 0, 0.12, 2.6],
        [-1.25, 0, 0.12, 2.6],
        [0, 0, 0.06, 2.4],
        [0, 0, 2.4, 0.06],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.06]}>
          <boxGeometry args={[w, h, 0.12]} />
          <meshStandardMaterial color={frame} roughness={0.6} />
        </mesh>
      ))}
      {/* sill */}
      <mesh position={[0, -1.36, 0.2]}>
        <boxGeometry args={[2.9, 0.08, 0.45]} />
        <meshStandardMaterial color={frame} />
      </mesh>
      <Cactus position={[0.8, -1.32, 0.22]} />
      {/* curtain rod + curtains */}
      <mesh position={[0, 1.55, 0.28]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.03, 0.03, 3.6, 8]} />
        <meshStandardMaterial color="#8a7a5c" metalness={0.6} roughness={0.3} />
      </mesh>
      <Curtain position={[-1.55, 0.05, 0.28]} />
      <Curtain position={[1.55, 0.05, 0.28]} flip />
    </group>
  )
}

function Curtain({ flip, ...props }: { flip?: boolean } & JSX_Group) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.7 + (flip ? 1 : 0)) * 0.012
  })
  return (
    <group {...props}>
      <group ref={ref} position={[0, 1.45, 0]}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[(i - 2) * 0.13, -1.5, (i % 2) * 0.05]}>
            <cylinderGeometry args={[0.085, 0.1, 3, 10]} />
            <meshStandardMaterial color="#4a2f73" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Cactus(props: JSX_Group) {
  return (
    <group {...props}>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.18, 12]} />
        <meshStandardMaterial color="#c56a4a" />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <capsuleGeometry args={[0.07, 0.25, 4, 10]} />
        <meshStandardMaterial color="#3f9e6a" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.36, 0]} rotation-z={-0.9}>
        <capsuleGeometry args={[0.035, 0.1, 4, 8]} />
        <meshStandardMaterial color="#3f9e6a" roughness={0.7} />
      </mesh>
    </group>
  )
}

function NeonSign() {
  const tex = useMemo(() => neonSignTexture("Farhan Babar", "< full stack developer />"), [])
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    if (!mat.current) return
    const t = clock.elapsedTime
    // occasional authentic neon flicker
    const flicker = Math.sin(t * 50) > 0.2 && t % 7 < 0.25 ? 0.35 : 1
    const { party } = useRoom.getState()
    if (party) mat.current.color.setHSL((t * 0.5) % 1, 1, 0.7).multiplyScalar(2)
    else mat.current.color.setRGB(1.7 * flicker, 1.7 * flicker, 1.7 * flicker)
  })
  return (
    <mesh position={[0.65, 4.75, -5.17]}>
      <planeGeometry args={[3.6, 0.9]} />
      <meshBasicMaterial ref={mat} map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

function Clock() {
  const hour = useRef<THREE.Group>(null)
  const minute = useRef<THREE.Group>(null)
  const second = useRef<THREE.Group>(null)
  useFrame(() => {
    const d = new Date()
    const s = d.getSeconds() + d.getMilliseconds() / 1000
    const m = d.getMinutes() + s / 60
    const h = (d.getHours() % 12) + m / 60
    if (second.current) second.current.rotation.z = -(s / 60) * Math.PI * 2
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2
  })
  return (
    <group position={[3.6, 4.55, -5.15]}>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 40]} />
        <meshStandardMaterial color="#efe9ff" roughness={0.4} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, -0.01]}>
        <torusGeometry args={[0.5, 0.04, 8, 40]} />
        <meshStandardMaterial color="#1b1638" metalness={0.4} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(a) * 0.4, Math.cos(a) * 0.4, 0.045]} rotation-z={-a}>
            <boxGeometry args={[0.02, i % 3 === 0 ? 0.09 : 0.05, 0.01]} />
            <meshStandardMaterial color="#1b1638" />
          </mesh>
        )
      })}
      <HandPivot pivotRef={hour} len={0.22} w={0.035} color="#1b1638" z={0.05} />
      <HandPivot pivotRef={minute} len={0.33} w={0.022} color="#1b1638" z={0.055} />
      <HandPivot pivotRef={second} len={0.36} w={0.01} color="#ff4fd8" z={0.06} />
      <mesh position={[0, 0, 0.065]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
        <meshStandardMaterial color="#ff4fd8" />
      </mesh>
    </group>
  )
}

function HandPivot({ pivotRef, len, w, color, z }: { pivotRef: React.Ref<THREE.Group>; len: number; w: number; color: string; z: number }) {
  return (
    <group ref={pivotRef} position={[0, 0, z]}>
      <mesh position={[0, len / 2 - 0.04, 0]}>
        <boxGeometry args={[w, len, 0.008]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

// Floating wall shelf on the back wall with a few trinkets.
function WallShelf() {
  return (
    <group position={[3.4, 3.35, -5.0]}>
      <RoundedBox args={[1.9, 0.08, 0.36]} radius={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial color="#6b4a33" roughness={0.7} />
      </RoundedBox>
      {/* mini succulent */}
      <mesh position={[-0.6, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.16, 12]} />
        <meshStandardMaterial color="#e8e2f7" />
      </mesh>
      <mesh position={[-0.6, 0.25, 0]}>
        <icosahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#4fae7c" flatShading />
      </mesh>
      {/* stacked books */}
      {["#ff6b6b", "#4cc9ff", "#ffb547"].map((c, i) => (
        <mesh key={c} position={[0.1, 0.07 + i * 0.07, 0]} rotation-y={i * 0.2}>
          <boxGeometry args={[0.5, 0.06, 0.3]} />
          <meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      ))}
      {/* tiny rubik cube */}
      <mesh position={[0.65, 0.14, 0]} rotation-y={0.5}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        {["#ff4d4d", "#ffd23f", "#3ee39a", "#4cc9ff", "#ffffff", "#ff8c42"].map((c, i) => (
          <meshStandardMaterial key={c} attach={`material-${i}`} color={c} roughness={0.4} />
        ))}
      </mesh>
    </group>
  )
}

type JSX_Group = import("@react-three/fiber").ThreeElements["group"]
