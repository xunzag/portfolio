"use client"

import { Suspense, useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { animes, hobbies } from "@/lib/content"
import { RANGES } from "@/lib/chapters"
import { Type } from "./Type"
import { usePresence, useReveal } from "./presence"
import { useRoom } from "@/lib/store"
import { live } from "./live"
import { zones } from "./track"
import { rng } from "@/lib/rng"
import { Model } from "./Model"
import { REALM } from "./track"

// Floating islands in a violet dusk — the anime / life chapter.
const ISLANDS: { pos: [number, number, number]; r: number; slot?: number }[] = [
  { pos: [0, 0, 0], r: 5.2 },
  { pos: [11, 1.5, 4], r: 2.6, slot: 1 },
  { pos: [-8, 3, 9], r: 2.4, slot: 2 },
  { pos: [-3, -1, -12], r: 2.8, slot: 3 },
  { pos: [14, 6, -9], r: 1.4 },
  { pos: [-15, 7, -3], r: 1.2 },
]

export function Realm() {
  return (
    <group position={REALM}>
      <hemisphereLight args={["#ffc2ec", "#2a1250", 1.1]} />
      <directionalLight position={[20, 25, 10]} intensity={2.2} color="#ffd6f0" />
      {ISLANDS.map((isl, i) => (
        <Island key={i} {...isl} seed={i + 1} />
      ))}
      <Sakura position={[1.2, 0, -1]} />
      <Torii position={[-1.6, 0, 3.2]} rotation-y={0.5} />
      <PosterRing />
      <HobbyRing />
      <RealmTitle />
      <Petals />
      <Lanterns />
    </group>
  )
}

function rockGeometry(radius: number, seed: number) {
  const g = new THREE.IcosahedronGeometry(1, 3)
  const r = rng(seed * 97)
  const p = g.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const jitter = new Map<string, number>()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`
    if (!jitter.has(key)) jitter.set(key, 0.85 + r() * 0.3)
    const j = jitter.get(key)!
    if (v.y > 0) v.y *= 0.25
    else v.y *= 2.2 + (1 - Math.abs(v.x)) * 0.6
    v.multiplyScalar(j)
    p.setXYZ(i, v.x * radius, v.y * radius, v.z * radius)
  }
  g.computeVertexNormals()
  return g
}

function Island({ pos, r, slot, seed }: { pos: [number, number, number]; r: number; slot?: number; seed: number }) {
  const ref = useRef<THREE.Group>(null)
  const geo = useMemo(() => rockGeometry(r, seed), [r, seed])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 0.5 + seed) * 0.35
  })
  return (
    <group ref={ref} position={pos}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color="#4a3a6a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, r * 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[r * 0.96, r * 0.9, 0.2, 40]} />
        <meshStandardMaterial color="#e889c8" roughness={0.8} />
      </mesh>
      {slot && <CharacterSlot index={slot} y={r * 0.2 + 0.1} />}
    </group>
  )
}

// A user GLB if present, otherwise a holographic standee of an anime poster.
function CharacterSlot({ index, y }: { index: number; y: number }) {
  const file = `char-${index}.glb`
  const has = useRoom((s) => s.models.includes(file))
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.4 + index) * 0.5
  })
  return (
    <group ref={ref} position={[0, y, 0]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.9, 1.05, 48]} />
        <meshBasicMaterial color={[1.2, 2.4, 3.2]} toneMapped={false} transparent opacity={0.8} />
      </mesh>
      {has ? (
        <Suspense fallback={null}>
          <Model url={`/models/${file}`} height={3.2} />
        </Suspense>
      ) : (
        <Standee image={animes[(index - 1) % animes.length].image} />
      )}
    </group>
  )
}

const holoV = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`
const holoF = /* glsl */ `
  uniform sampler2D uMap; uniform float uTime; varying vec2 vUv;
  void main() {
    vec3 c = texture2D(uMap, vUv).rgb;
    float scan = 0.85 + 0.15 * sin(vUv.y * 400.0 - uTime * 8.0);
    float fade = smoothstep(0.0, 0.25, vUv.y);
    vec3 tint = mix(c, c * vec3(0.7, 0.9, 1.3), 0.35);
    gl_FragColor = vec4(tint * scan * 1.2 + vec3(0.2, 0.5, 1.0) * (1.0 - fade) * 0.4, 0.92 * (0.35 + 0.65 * fade));
    #include <colorspace_fragment>
  }
`

function Standee({ image }: { image: string }) {
  const tex = useTexture(image)
  tex.colorSpace = THREE.SRGBColorSpace
  const uniforms = useMemo(() => ({ uMap: { value: tex }, uTime: { value: 0 } }), [tex])
  useFrame(({ clock }) => (uniforms.uTime.value = clock.elapsedTime))
  return (
    <mesh position={[0, 1.45, 0]}>
      <planeGeometry args={[1.9, 2.7]} />
      <shaderMaterial vertexShader={holoV} fragmentShader={holoF} uniforms={uniforms} transparent side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

// All six posters orbit the central island like floating cards.
function PosterRing() {
  const textures = useTexture(animes.map((a) => a.image))
  const ring = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 0.08
  })
  return (
    <group ref={ring} position={[0, 5.5, 0]}>
      {animes.map((a, i) => {
        const ang = (i / animes.length) * Math.PI * 2
        textures[i].colorSpace = THREE.SRGBColorSpace
        return (
          <group key={a.title} position={[Math.sin(ang) * 8.5, Math.sin(i * 1.3) * 1.2, Math.cos(ang) * 8.5]} rotation-y={ang}>
            <mesh>
              <planeGeometry args={[2.2, 3.1]} />
              <meshBasicMaterial map={textures[i]} toneMapped={false} side={THREE.DoubleSide} color={[1.05, 1.05, 1.05]} />
            </mesh>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[2.35, 3.25]} />
              <meshBasicMaterial color={[2.2, 1.2, 3]} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            <group position={[0, -1.85, 0.02]}>
              <Type weight="bold" fontSize={0.26} anchorX="center" glow={1.4}>
                {a.title}
              </Type>
              <Type weight="semi" fontSize={0.13} letterSpacing={0.14} anchorX="center" position={[0, -0.36, 0]} color="#ffcf7f" glow={1.6}>
                {`RATED ${a.rating}   /   FAV: ${a.fav.toUpperCase()}`}
              </Type>
              <Type weight="light" fontSize={0.14} anchorX="center" textAlign="center" position={[0, -0.62, 0]} color="#ffe0f2" maxWidth={2.6} lineHeight={1.35}>
                {`"${a.quote}"`}
              </Type>
            </group>
          </group>
        )
      })}
    </group>
  )
}

function Sakura(props: import("@react-three/fiber").ThreeElements["group"]) {
  const blossoms = useMemo(() => {
    const r = rng(21)
    return Array.from({ length: 26 }, () => ({
      p: [(r() - 0.5) * 4.4, 3.6 + r() * 2.2, (r() - 0.5) * 4.4] as [number, number, number],
      s: 0.55 + r() * 0.6,
      c: r() > 0.5 ? "#ffb7dd" : "#ff8fc8",
    }))
  }, [])
  return (
    <group {...props}>
      <mesh position={[0, 1.6, 0]} rotation-z={0.08} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 3.4, 10]} />
        <meshStandardMaterial color="#3a2330" roughness={0.9} />
      </mesh>
      {[
        [0.9, 2.9, 0.2, -0.8],
        [-0.8, 3.1, -0.3, 0.9],
        [0.1, 3.2, 0.9, 0.2],
      ].map(([x, y, z, rz], i) => (
        <mesh key={i} position={[x / 2, y, z / 2]} rotation-z={rz} castShadow>
          <cylinderGeometry args={[0.07, 0.12, 1.8, 8]} />
          <meshStandardMaterial color="#3a2330" roughness={0.9} />
        </mesh>
      ))}
      {blossoms.map((b, i) => (
        <mesh key={i} position={b.p} scale={b.s} castShadow>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color={b.c} roughness={0.7} flatShading emissive={b.c} emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

function Torii(props: import("@react-three/fiber").ThreeElements["group"]) {
  const red = <meshStandardMaterial color="#e0322f" roughness={0.45} emissive="#5a0808" emissiveIntensity={0.4} />
  return (
    <group {...props}>
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 2.8, 16]} />
          {red}
        </mesh>
      ))}
      <mesh position={[0, 2.95, 0]} castShadow>
        <boxGeometry args={[3.2, 0.2, 0.3]} />
        {red}
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[2.6, 0.14, 0.22]} />
        {red}
      </mesh>
      <mesh position={[0, 3.12, 0]}>
        <boxGeometry args={[3.6, 0.12, 0.4]} />
        <meshStandardMaterial color="#1a1018" />
      </mesh>
    </group>
  )
}

function Petals() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = useRoom((s) => (s.quality === "high" ? 500 : 220))
  const data = useMemo(() => {
    const r = rng(5)
    return Array.from({ length: count }, () => ({
      x: (r() - 0.5) * 50,
      y: r() * 30 - 8,
      z: (r() - 0.5) * 50,
      sp: 0.6 + r() * 1.2,
      rot: r() * 6,
      sway: r() * 6,
    }))
  }, [count])
  const o = useMemo(() => new THREE.Object3D(), [])
  useLayoutEffect(() => {
    const c = new THREE.Color()
    data.forEach((_, i) => ref.current!.setColorAt(i, c.set(i % 3 ? "#ffc2e0" : "#ff8fc8")))
    ref.current!.instanceColor!.needsUpdate = true
  }, [data])
  useFrame(({ clock }, dt) => {
    const m = ref.current
    if (!m || !zones(live.scroll).realm) return
    const t = clock.elapsedTime
    data.forEach((p, i) => {
      p.y -= p.sp * dt
      if (p.y < -10) p.y = 22
      o.position.set(p.x + Math.sin(t * 0.8 + p.sway) * 1.2, p.y, p.z + Math.cos(t * 0.6 + p.sway) * 1.2)
      o.rotation.set(t * p.sp + p.rot, t * 0.7 + p.rot, 0)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[0.16, 0.11]} />
      <meshStandardMaterial side={THREE.DoubleSide} roughness={0.6} emissive="#ff7fbf" emissiveIntensity={0.35} />
    </instancedMesh>
  )
}

function Lanterns() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(() => {
    const r = rng(8)
    return Array.from({ length: 36 }, () => ({ x: (r() - 0.5) * 44, y: r() * 26 - 6, z: (r() - 0.5) * 44, sp: 0.3 + r() * 0.5, ph: r() * 6 }))
  }, [])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame(({ clock }, dt) => {
    const m = ref.current
    if (!m || !zones(live.scroll).realm) return
    data.forEach((l, i) => {
      l.y += l.sp * dt
      if (l.y > 22) l.y = -8
      o.position.set(l.x + Math.sin(clock.elapsedTime * 0.3 + l.ph) * 0.8, l.y, l.z)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, data.length]} frustumCulled={false}>
      <cylinderGeometry args={[0.18, 0.24, 0.42, 10]} />
      <meshBasicMaterial color={[3, 1.5, 0.6]} toneMapped={false} />
    </instancedMesh>
  )
}

// Hobbies orbit lower and the other way round.
function HobbyRing() {
  const textures = useTexture(hobbies.map((h) => h.image))
  const ring = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.y -= dt * 0.06
  })
  return (
    <group ref={ring} position={[0, -1.2, 0]}>
      {hobbies.map((h, i) => {
        const ang = (i / hobbies.length) * Math.PI * 2 + 0.4
        textures[i].colorSpace = THREE.SRGBColorSpace
        return (
          <group key={h.title} position={[Math.sin(ang) * 13, Math.cos(i * 2.1) * 0.8, Math.cos(ang) * 13]} rotation-y={ang}>
            <mesh>
              <circleGeometry args={[1.25, 48]} />
              <meshBasicMaterial map={textures[i]} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, -0.02]}>
              <ringGeometry args={[1.25, 1.36, 64]} />
              <meshBasicMaterial color={[1.4, 2.6, 3.2]} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            <group position={[0, -1.6, 0.02]}>
              <Type weight="bold" fontSize={0.3} anchorX="center" glow={1.4}>
                {h.title}
              </Type>
              <Type weight="semi" fontSize={0.13} letterSpacing={0.12} anchorX="center" position={[0, -0.4, 0]} color="#8fe3ff" glow={1.6}>
                {`${h.detail.toUpperCase()}   /   SINCE ${h.since}`}
              </Type>
              <Type weight="light" fontSize={0.15} anchorX="center" textAlign="center" position={[0, -0.66, 0]} color="#e6f7ff" maxWidth={3}>
                {`"${h.quote}"`}
              </Type>
            </group>
          </group>
        )
      })}
    </group>
  )
}

function RealmTitle() {
  const [a, b] = RANGES.life
  const on = usePresence(a + 40, b, 40, 30)
  const g = useRef<THREE.Group>(null)
  useReveal(g, on, 1)
  const look = useRef<THREE.Group>(null)
  useFrame(({ camera }) => {
    // always face the orbiting camera
    if (look.current) look.current.quaternion.copy(camera.quaternion)
  })
  return (
    <group ref={look} position={[0, 11.5, 0]}>
      <group ref={g}>
        <group>
          <Type weight="semi" fontSize={0.3} letterSpacing={0.3} anchorX="center" color="#ffb7dd" glow={2}>
            {"06   LIFE"}
          </Type>
        </group>
        <group position={[0, -0.5, 0]}>
          <Type weight="bold" fontSize={1.5} letterSpacing={-0.03} anchorX="center" glow={1.5}>
            {"Off the clock"}
          </Type>
        </group>
        <group position={[0, -2.3, 0]}>
          <Type weight="light" fontSize={0.34} anchorX="center" color="#ffe0f2">
            {"Anime I'd rewatch forever, and what I do when the laptop closes."}
          </Type>
        </group>
      </group>
    </group>
  )
}
