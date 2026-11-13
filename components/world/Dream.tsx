"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { projects } from "@/lib/content"
import { useRoom } from "@/lib/store"
import { rng } from "@/lib/rng"
import { live } from "./live"
import { ABOUT, FACTS, PORTAL, ROAD_END, STACK, projectStation } from "./track"
import { Island } from "./Rock"

// ── The dream world ───────────────────────────────────────────────────

export function Dream() {
  return (
    <group>
      <LightPath />
      <Crystals />
      <Island radius={4.2} seed={3} position={[0, -0.87, 0.3]} rim="#ff3fa0" shadow />
      {projects.map((_, i) => {
        const st = projectStation(i)
        return <Island key={i} radius={2.7} seed={10 + i} position={[st.park.x, st.park.y - 0.62, st.park.z]} rim={projects[i].accent} />
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
    // picks up where the road ends and carries on to the gate
    const pts = [
      new THREE.Vector3(ROAD_END.x, ROAD_END.y, ROAD_END.z - 2),
      new THREE.Vector3(ABOUT.x * 0.5, ABOUT.y - 2.4, ABOUT.z - 14),
      new THREE.Vector3(FACTS.x * 0.5, FACTS.y - 3, FACTS.z + 12),
      new THREE.Vector3(STACK.x + 2, STACK.y - 3, STACK.z + 12),
      new THREE.Vector3(PORTAL.x, PORTAL.y - 2.5, PORTAL.z + 22),
    ]
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal")
    return new THREE.TubeGeometry(curve, 300, 0.06, 6, false)
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
      p: new THREE.Vector3((r() - 0.5) * 80, -6 + r() * 34, 20 - r() * (30 - PORTAL.z)),
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
