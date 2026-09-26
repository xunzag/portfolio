"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { projects } from "@/lib/content"
import { useRoom } from "@/lib/store"
import { rng } from "@/lib/rng"
import { live } from "./live"
import { ABOUT, FACTS, STACK, projectStation } from "./track"

// ── Shared: a floating rock island ─────────────────────────────────────
export function rockGeometry(radius: number, seed: number) {
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
    if (v.y > 0) v.y *= 0.18
    else v.y *= 2.3 + (1 - Math.abs(v.x)) * 0.6
    v.multiplyScalar(j)
    p.setXYZ(i, v.x * radius, v.y * radius, v.z * radius)
  }
  g.computeVertexNormals()
  return g
}

/** Pastel floating island in the realm's style, with a glowing rim in the station colour. */
export function Island({ radius = 3, seed = 1, rim = "#b18cff", top = "#d77ab8", ...props }: { radius?: number; seed?: number; rim?: string; top?: string } & import("@react-three/fiber").ThreeElements["group"]) {
  const geo = useMemo(() => rockGeometry(radius, seed), [radius, seed])
  return (
    <group {...props}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#4a3a6a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, radius * 0.18 + 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 0.97, radius * 0.93, 0.2, 48]} />
        <meshStandardMaterial color={top} roughness={0.8} />
      </mesh>
      <mesh position={[0, radius * 0.18 + 0.115, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[radius * 0.9, radius * 0.95, 64]} />
        <meshBasicMaterial color={new THREE.Color(rim).multiplyScalar(2.2)} toneMapped={false} />
      </mesh>
    </group>
  )
}

// ── The dream world ───────────────────────────────────────────────────

export function Dream() {
  return (
    <group>
      <LightPath />
      <Crystals />
      <Island radius={4.2} seed={3} position={[0, -0.78, 0.3]} rim="#ff3fa0" top="#5a3470" />
      {projects.map((_, i) => {
        const st = projectStation(i)
        return <Island key={i} radius={2.4} seed={10 + i} position={[st.center.x, st.center.y - 3.4, st.center.z]} rim={projects[i].accent} />
      })}
      <Island radius={5.5} seed={31} position={[ABOUT.x, ABOUT.y - 4.9, ABOUT.z]} rim="#7fd8ff" />
      <Island radius={3.2} seed={37} position={[FACTS.x, FACTS.y - 5.8, FACTS.z]} rim="#ffcf7f" />
      <Island radius={4.6} seed={41} position={[STACK.x, STACK.y - 4.2, STACK.z]} rim="#9d7bff" />
    </group>
  )
}

// A ribbon of flowing light connecting every station.
const pathV = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const pathF = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float flow = fract(vUv.x * 60.0 - uTime * 0.6);
    float pulse = smoothstep(0.0, 0.08, flow) * smoothstep(0.35, 0.08, flow);
    float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
    vec3 col = mix(vec3(0.7, 0.35, 1.0), vec3(0.3, 0.85, 1.0), sin(vUv.x * 12.0) * 0.5 + 0.5);
    float a = (0.25 + pulse * 1.4) * edge;
    gl_FragColor = vec4(col * a * 2.2, a);
  }
`

function LightPath() {
  const geo = useMemo(() => {
    const pts = [new THREE.Vector3(0, -0.2, 4), new THREE.Vector3(0, -0.2, -8)]
    projects.forEach((_, i) => {
      const st = projectStation(i)
      pts.push(new THREE.Vector3(st.center.x * 0.15, st.center.y - 1.6, st.center.z + 6))
    })
    pts.push(new THREE.Vector3(ABOUT.x * 0.5, ABOUT.y - 2.4, ABOUT.z + 12))
    pts.push(new THREE.Vector3(FACTS.x * 0.5, FACTS.y - 3, FACTS.z + 12))
    pts.push(new THREE.Vector3(STACK.x + 2, STACK.y - 3, STACK.z + 12))
    pts.push(new THREE.Vector3(0, 17.5, -330))
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal")
    return new THREE.TubeGeometry(curve, 600, 0.06, 6, false)
  }, [])
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame(({ clock }) => (uniforms.uTime.value = clock.elapsedTime))
  return (
    <mesh geometry={geo} frustumCulled={false}>
      <shaderMaterial vertexShader={pathV} fragmentShader={pathF} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </mesh>
  )
}

// Slowly tumbling glowing crystals scattered through the whole world.
function Crystals() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = useRoom((s) => (s.quality === "high" ? 140 : 70))
  const data = useMemo(() => {
    const r = rng(12)
    return Array.from({ length: count }, () => ({
      p: new THREE.Vector3((r() - 0.5) * 70, -6 + r() * 30, 20 - r() * 330),
      s: 0.15 + r() * r() * 0.9,
      spin: (r() - 0.5) * 0.8,
      ph: r() * 6,
      c: r(),
    }))
  }, [count])
  const o = useMemo(() => new THREE.Object3D(), [])
  useLayoutEffect(() => {
    const c = new THREE.Color()
    data.forEach((d, i) => {
      c.set(d.c < 0.4 ? "#b18cff" : d.c < 0.75 ? "#ff5fc8" : "#5fd8ff").multiplyScalar(1.8)
      ref.current!.setColorAt(i, c)
    })
    ref.current!.instanceColor!.needsUpdate = true
  }, [data])
  useFrame(({ clock }) => {
    const m = ref.current
    if (!m || !m.visible) return
    const t = clock.elapsedTime
    data.forEach((d, i) => {
      o.position.set(d.p.x, d.p.y + Math.sin(t * 0.5 + d.ph) * 0.4, d.p.z)
      o.rotation.set(t * d.spin, t * d.spin * 0.7 + d.ph, 0)
      o.scale.setScalar(d.s)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.85} />
    </instancedMesh>
  )
}

// Luminous dust that always surrounds the camera (GPU-animated).
const dustV = /* glsl */ `
  uniform float uTime; uniform vec3 uCam;
  attribute float aSeed;
  varying float vA; varying float vS;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.3 + aSeed * 30.0) * 0.8 + uTime * (0.1 + aSeed * 0.2);
    p = uCam + mod(p - uCam + 30.0, 60.0) - 30.0;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vA = (0.4 + 0.6 * sin(uTime * 2.0 + aSeed * 40.0)) * smoothstep(2.0, 7.0, -mv.z);
    vS = aSeed;
    gl_PointSize = min(10.0, (12.0 + aSeed * 30.0) / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const dustF = /* glsl */ `
  varying float vA; varying float vS;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA;
    vec3 c = mix(vec3(1.0, 0.55, 0.9), vec3(0.55, 0.85, 1.0), step(0.5, vS));
    gl_FragColor = vec4(c * a * 1.6, a);
  }
`

export function Dust() {
  const count = useRoom((s) => (s.quality === "high" ? 1400 : 600))
  const geo = useMemo(() => {
    const r = rng(77)
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(r() - 0.5) * 60, (r() - 0.5) * 60, (r() - 0.5) * 60], i * 3)
      seed[i] = r()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uCam: { value: new THREE.Vector3() } }), [])
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uCam.value.copy(live.frame.pos)
  })
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial vertexShader={dustV} fragmentShader={dustF} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}
