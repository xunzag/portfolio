"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { RANGES, band, ss } from "@/lib/acts"
import { rng } from "@/lib/rng"
import { useRoom } from "@/lib/store"
import { live } from "../live"

// Everything here lives in camera space, so it floats "in front of" whatever
// is on screen — the paintings, the void, or the finale — and costs nothing on
// the CPU: positions are computed in the vertex shader from a seed and time.

// how much of each particle kind every part of the film gets
function mix(s: number) {
  const [w0] = RANGES.work
  const [a0, a1] = RANGES.arsenal
  const [f0] = RANGES.finale
  return {
    leaves: 1 - ss(w0 - 60, w0 - 10, s),
    embers: 0.5 * (1 - ss(w0 - 60, w0, s)) + band(s, a0 - 40, a0, a1 - 30, a1) + ss(f0, f0 + 20, s),
    ash: band(s, a0 - 40, a0 + 10, a1 - 30, a1) * 0.8 + ss(f0, f0 + 20, s),
  }
}

const leafV = /* glsl */ `
  uniform float uTime; uniform float uAspect; uniform float uWind;
  attribute vec4 aSeed;
  varying vec2 vUv; varying float vShade; varying float vA;
  mat3 rot(vec3 a) {
    vec3 s = sin(a), c = cos(a);
    return mat3(c.y * c.z, c.y * s.z, -s.y,
                s.x * s.y * c.z - c.x * s.z, s.x * s.y * s.z + c.x * c.z, s.x * c.y,
                c.x * s.y * c.z + s.x * s.z, c.x * s.y * s.z - s.x * c.z, c.x * c.y);
  }
  void main() {
    vUv = uv;
    float z = -(1.6 + aSeed.z * 11.0);
    float hw = -z * 0.62 * uAspect + 1.0, hh = -z * 0.48 + 0.6;
    float sp = 0.18 + aSeed.w * 0.22;
    float y = hh - mod(uTime * sp + aSeed.y * 2.0 * hh, 2.0 * hh);
    float x = mod(aSeed.x * 2.0 * hw + uTime * (0.25 + uWind) + sin(uTime * 0.7 + aSeed.w * 30.0) * 0.6 + hw, 2.0 * hw) - hw;
    vec3 a = vec3(uTime * (0.8 + aSeed.w), uTime * (0.6 + aSeed.x), uTime * 0.4 + aSeed.y * 6.0);
    mat3 R = rot(a);
    vec3 p = R * vec3(position.xy * (0.11 + aSeed.w * 0.07), 0.0);
    vShade = 0.55 + 0.45 * abs((R * vec3(0.0, 0.0, 1.0)).z);
    vA = smoothstep(1.4, 2.6, -z);
    gl_Position = projectionMatrix * vec4(p + vec3(x, y, z), 1.0);
  }
`
const leafF = /* glsl */ `
  uniform float uAmt;
  varying vec2 vUv; varying float vShade; varying float vA;
  void main() {
    vec2 p = vUv - 0.5;
    p.y += 0.06;
    float th = atan(p.x, p.y);
    // five-lobed momiji leaf
    float lobes = pow(abs(cos(2.5 * th)), 2.2);
    float r = 0.2 + 0.24 * lobes;
    float leaf = smoothstep(r, r - 0.03, length(p));
    float stem = smoothstep(0.012, 0.0, abs(p.x)) * step(p.y, 0.0) * step(-0.36, p.y);
    float a = max(leaf, stem);
    if (a < 0.02) discard;
    float vein = smoothstep(0.02, 0.0, abs(sin(th * 2.5)) * length(p));
    vec3 col = mix(vec3(0.75, 0.05, 0.08), vec3(1.0, 0.28, 0.16), smoothstep(0.35, 0.0, length(p)));
    col *= (1.0 - vein * 0.35) * vShade * (gl_FrontFacing ? 1.0 : 0.6);
    gl_FragColor = vec4(col * 1.3, a * uAmt * vA);
  }
`

const pointV = /* glsl */ `
  uniform float uTime; uniform float uAspect; uniform float uRise; uniform float uSize; uniform float uDpr;
  attribute vec4 aSeed;
  varying float vA; varying float vS;
  void main() {
    float z = -(1.2 + aSeed.z * 14.0);
    float hw = -z * 0.62 * uAspect + 0.5, hh = -z * 0.48 + 0.4;
    float sp = (0.1 + aSeed.w * 0.25) * uRise;
    float y = mod(aSeed.y * 2.0 * hh + uTime * sp + hh, 2.0 * hh) - hh;
    float x = aSeed.x * 2.0 * hw - hw + sin(uTime * (0.5 + aSeed.w) + aSeed.y * 40.0) * 0.25;
    vec4 mv = vec4(x, y, z, 1.0);
    vA = smoothstep(1.2, 2.4, -z) * (0.55 + 0.45 * sin(uTime * (3.0 + aSeed.w * 6.0) + aSeed.x * 50.0));
    vS = aSeed.w;
    gl_PointSize = min(22.0, uSize * uDpr * (0.6 + aSeed.w) / -z);
    gl_Position = projectionMatrix * mv;
  }
`
const emberF = /* glsl */ `
  uniform float uAmt;
  varying float vA; varying float vS;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA * uAmt;
    gl_FragColor = vec4(mix(vec3(3.0, 0.7, 0.2), vec3(3.0, 0.25, 0.12), vS) * a, a);
  }
`
const ashF = /* glsl */ `
  uniform float uAmt;
  varying float vA; varying float vS;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float d = length(q * vec2(1.0, 1.8));
    float a = smoothstep(0.5, 0.2, d) * (0.35 + 0.3 * vS) * uAmt * smoothstep(0.0, 0.3, vA + 0.3);
    gl_FragColor = vec4(vec3(0.5, 0.42, 0.45) * a, a);
  }
`

function seeds(n: number, seed: number) {
  const r = rng(seed)
  const a = new Float32Array(n * 4)
  for (let i = 0; i < a.length; i++) a[i] = r()
  return a
}

export function Particles() {
  const high = useRoom((s) => s.quality === "high")
  const nLeaves = high ? 70 : 36
  const nEmbers = high ? 260 : 120
  const nAsh = high ? 320 : 140

  const leafGeo = useMemo(() => {
    const g = new THREE.InstancedBufferGeometry()
    const base = new THREE.PlaneGeometry(1, 1)
    g.index = base.index
    g.setAttribute("position", base.attributes.position)
    g.setAttribute("uv", base.attributes.uv)
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds(nLeaves, 5), 4))
    g.instanceCount = nLeaves
    return g
  }, [nLeaves])
  const pts = (n: number, s: number) => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds(n, s), 4))
    return g
  }
  const emberGeo = useMemo(() => pts(nEmbers, 9), [nEmbers])
  const ashGeo = useMemo(() => pts(nAsh, 13), [nAsh])

  const common = () => ({ uTime: { value: 0 }, uAspect: { value: 1 }, uAmt: { value: 0 }, uDpr: { value: 1 } })
  const leafU = useMemo(() => ({ ...common(), uWind: { value: 0 } }), [])
  const emberU = useMemo(() => ({ ...common(), uRise: { value: 1 }, uSize: { value: 60 } }), [])
  const ashU = useMemo(() => ({ ...common(), uRise: { value: -0.5 }, uSize: { value: 70 } }), [])

  const mats = [useRef<THREE.ShaderMaterial>(null), useRef<THREE.ShaderMaterial>(null), useRef<THREE.ShaderMaterial>(null)]
  const objs = [useRef<THREE.Object3D>(null), useRef<THREE.Object3D>(null), useRef<THREE.Object3D>(null)]

  useFrame(({ clock, size, viewport }) => {
    const m = mix(live.scroll)
    const t = clock.elapsedTime
    const amts = [m.leaves, m.embers, m.ash]
    // R3F copies the uniforms prop, so write through the live materials
    for (let i = 0; i < 3; i++) {
      const u = mats[i].current?.uniforms
      const o = objs[i].current
      if (!u || !o) continue
      const amt = amts[i]
      o.visible = amt > 0.002
      u.uTime.value = t
      u.uAspect.value = size.width / size.height
      u.uAmt.value = amt
      u.uDpr.value = viewport.dpr
      // scrolling stirs the wind
      if (i === 0) u.uWind.value += (Math.min(2, Math.abs(live.velocity) / 40) - u.uWind.value) * 0.05
    }
  })

  return (
    <group>
      <mesh ref={objs[0] as React.RefObject<THREE.Mesh>} geometry={leafGeo} frustumCulled={false} renderOrder={5}>
        <shaderMaterial ref={mats[0]} vertexShader={leafV} fragmentShader={leafF} uniforms={leafU} transparent depthWrite={false} depthTest={false} side={THREE.DoubleSide} />
      </mesh>
      <points ref={objs[1] as React.RefObject<THREE.Points>} geometry={emberGeo} frustumCulled={false} renderOrder={6}>
        <shaderMaterial ref={mats[1]} vertexShader={pointV} fragmentShader={emberF} uniforms={emberU} transparent depthWrite={false} depthTest={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={objs[2] as React.RefObject<THREE.Points>} geometry={ashGeo} frustumCulled={false} renderOrder={6}>
        <shaderMaterial ref={mats[2]} vertexShader={pointV} fragmentShader={ashF} uniforms={ashU} transparent depthWrite={false} depthTest={false} />
      </points>
    </group>
  )
}
