"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { projects } from "@/lib/content"
import { useRoom } from "@/lib/store"
import { rng } from "../canvas/textures"
import { live } from "./live"
import { ABOUT, FACTS, ROOM_ORIGIN, projectStation } from "./track"

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

const rimV = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying float vY;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    vY = position.y;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const rimF = /* glsl */ `
  uniform vec3 uRim; uniform vec3 uBase;
  varying vec3 vN; varying vec3 vV; varying float vY;
  void main() {
    float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.5);
    vec3 col = uBase * (0.55 + 0.45 * max(vN.y, 0.0)) + uRim * f * 2.2;
    col += uRim * smoothstep(-0.2, -2.5, vY) * 0.35; // glowing underside
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

/** Crystal-rimmed floating island. Cheap: one unlit shader, no lights needed. */
export function Island({ radius = 3, seed = 1, rim = "#b18cff", base = "#1b1330", top = "#2a1f45", ...props }: { radius?: number; seed?: number; rim?: string; base?: string; top?: string } & import("@react-three/fiber").ThreeElements["group"]) {
  const geo = useMemo(() => rockGeometry(radius, seed), [radius, seed])
  const uniforms = useMemo(() => ({ uRim: { value: new THREE.Color(rim) }, uBase: { value: new THREE.Color(base) } }), [rim, base])
  return (
    <group {...props}>
      <mesh geometry={geo}>
        <shaderMaterial vertexShader={rimV} fragmentShader={rimF} uniforms={uniforms} />
      </mesh>
      <mesh position={[0, radius * 0.18 + 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 0.97, radius * 0.95, 0.06, 48]} />
        <meshStandardMaterial color={top} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, radius * 0.18 + 0.045, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[radius * 0.93, radius * 0.97, 64]} />
        <meshBasicMaterial color={new THREE.Color(rim).multiplyScalar(2.5)} toneMapped={false} />
      </mesh>
    </group>
  )
}

// ── The dream world ───────────────────────────────────────────────────

export function Dream() {
  return (
    <group>
      <CloudSea />
      <LightPath />
      <Crystals />
      <Island radius={4.2} seed={3} position={[0, -0.78, 0.3]} rim="#ff3fa0" />
      {projects.map((_, i) => {
        const st = projectStation(i)
        return <Island key={i} radius={2.4} seed={10 + i} position={[st.center.x, st.center.y - 3.4, st.center.z]} rim={projects[i].accent} />
      })}
      <Island radius={5.5} seed={31} position={[ABOUT.x, ABOUT.y - 4.9, ABOUT.z]} rim="#7fd8ff" />
      <Island radius={3.2} seed={37} position={[FACTS.x, FACTS.y - 5.8, FACTS.z]} rim="#ffcf7f" />
      {/* the room's floating slab gets a matching rim */}
      <Island radius={7.4} seed={41} position={[ROOM_ORIGIN.x, ROOM_ORIGIN.y - 2.45, ROOM_ORIGIN.z]} rim="#9d7bff" />
    </group>
  )
}

// A luminous sea of clouds far below everything.
const seaV = /* glsl */ `
  varying vec3 vW;
  void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`
const seaF = /* glsl */ `
  uniform float uTime; uniform vec3 uCam; uniform float uParty;
  varying vec3 vW;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a*noise(p); p *= 2.02; a *= 0.5; } return v; }
  void main() {
    vec2 p = vW.xz * 0.035;
    float n = fbm(p + vec2(uTime * 0.02, uTime * 0.012));
    float m = fbm(p * 2.3 - vec2(uTime * 0.015, 0.0) + n);
    vec3 deep = vec3(0.05, 0.02, 0.12);
    vec3 pink = vec3(0.95, 0.35, 0.75);
    vec3 cyan = vec3(0.25, 0.65, 1.0);
    vec3 col = mix(deep, mix(pink, cyan, smoothstep(0.35, 0.75, m)), smoothstep(0.35, 0.85, n) * 0.85);
    col += vec3(1.0, 0.8, 1.0) * pow(smoothstep(0.62, 0.95, m), 3.0) * 0.6;
    col = mix(col, 0.5 + 0.5 * cos(6.28 * (uTime * 0.1 + n + vec3(0.0, 0.33, 0.67))), uParty * 0.6);
    float d = length(vW.xz - uCam.xz);
    float fade = 1.0 - smoothstep(60.0, 260.0, d);
    gl_FragColor = vec4(col * (0.35 + 0.65 * fade), 1.0);
    #include <colorspace_fragment>
  }
`

function CloudSea() {
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uParty: { value: 0 } }), [])
  useFrame(({ clock }, dt) => {
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uCam.value.copy(live.frame.pos)
    const party = useRoom.getState().party ? 1 : 0
    uniforms.uParty.value += (party - uniforms.uParty.value) * Math.min(1, dt * 2)
    if (mesh.current) {
      mesh.current.position.x = live.frame.pos.x
      mesh.current.position.z = live.frame.pos.z
    }
  })
  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} position={[0, -14, 0]}>
      <planeGeometry args={[700, 700, 1, 1]} />
      <shaderMaterial vertexShader={seaV} fragmentShader={seaF} uniforms={uniforms} toneMapped={false} />
    </mesh>
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
    pts.push(new THREE.Vector3(ROOM_ORIGIN.x + 4, ROOM_ORIGIN.y - 1, ROOM_ORIGIN.z + 12))
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
    vA = 0.4 + 0.6 * sin(uTime * 2.0 + aSeed * 40.0);
    vS = aSeed;
    gl_PointSize = (12.0 + aSeed * 30.0) / -mv.z;
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
