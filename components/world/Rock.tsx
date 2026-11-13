"use client"

import { useMemo, useRef } from "react"
import { useFrame, type ThreeElements } from "@react-three/fiber"
import * as THREE from "three"
import { rng } from "@/lib/rng"
import { MOON_DIR } from "./Sky"

/** Scene fog, shared with the custom shaders so they sink into the same night. */
export const FOG_COLOR = "#0d0620"
export const FOG_DENSITY = 0.0085

export function rockGeometry(radius: number, seed: number) {
  const g = new THREE.IcosahedronGeometry(1, 4)
  const r = rng(seed * 97)
  const p = g.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const jitter = new Map<string, number>()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`
    if (!jitter.has(key)) jitter.set(key, 0.82 + r() * 0.36)
    const j = jitter.get(key)!
    if (v.y > 0) v.y *= 0.18
    else v.y *= 2.3 + (1 - Math.abs(v.x)) * 0.6
    v.multiplyScalar(j)
    p.setXYZ(i, v.x * radius, v.y * radius, v.z * radius)
  }
  g.computeVertexNormals()
  return g
}

const NOISE = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float tri(vec3 p) { return (noise(p.xy) + noise(p.yz + 17.0) + noise(p.zx + 31.0)) / 3.0; }
`
const FOG = /* glsl */ `
  uniform vec3 uFog; uniform float uFogD;
  vec3 fogged(vec3 c, float depth) { float f = 1.0 - exp(-uFogD * uFogD * depth * depth); return mix(c, uFog, f); }
`

// Dark faceted stone: moonlit on top, with veins of light running through it
// that gather and pulse towards the stalactite tips.
const rockV = /* glsl */ `
  varying vec3 vW; varying vec3 vL; varying float vDepth;
  void main() {
    vL = position;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`
const rockF = /* glsl */ `
  uniform vec3 uRim; uniform vec3 uMoon; uniform float uTime; uniform float uRadius;
  varying vec3 vW; varying vec3 vL; varying float vDepth;
  ${NOISE}
  ${FOG}
  void main() {
    vec3 N = normalize(cross(dFdx(vW), dFdy(vW)));
    vec3 V = normalize(cameraPosition - vW);
    float n = tri(vL * 1.1);
    vec3 base = mix(vec3(0.016, 0.01, 0.04), vec3(0.06, 0.04, 0.12), n);
    float moon = max(dot(N, uMoon), 0.0);
    float fill = max(dot(N, normalize(vec3(-0.6, 0.2, 0.7))), 0.0);
    vec3 col = base * (0.35 + moon * 2.6 * vec3(0.8, 0.85, 1.0) + fill * 0.7 * vec3(1.0, 0.45, 0.8) + max(N.y, 0.0) * 0.5);
    // veins of light
    float depthDown = clamp(-vL.y / (uRadius * 2.4), 0.0, 1.0);
    float v = abs(tri(vL * 0.55 + 4.0) - 0.5);
    float vein = smoothstep(0.035, 0.0, v) * (0.25 + depthDown * 1.6);
    float pulse = 0.6 + 0.4 * sin(uTime * 1.2 - vL.y * 0.8);
    col += uRim * vein * pulse * 2.4;
    // tips glow, edges catch the moon
    col += uRim * pow(depthDown, 3.0) * 0.9;
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += vec3(0.35, 0.3, 0.7) * fres * 0.5;
    gl_FragColor = vec4(fogged(col, vDepth), 1.0);
  }
`

// The platform on top: black glass etched with slowly turning rings of runes.
const topV = /* glsl */ `
  varying vec2 vUv; varying float vDepth; varying vec3 vW;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`
const topF = /* glsl */ `
  uniform vec3 uRim; uniform float uTime; uniform float uSeed;
  varying vec2 vUv; varying float vDepth; varying vec3 vW;
  ${NOISE}
  ${FOG}
  float ring(float r, float at, float w) { return smoothstep(w, 0.0, abs(r - at)); }
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float a = atan(p.y, p.x);
    vec3 V = normalize(cameraPosition - vW);
    // glassy black with a moonlit sheen at grazing angles
    float graze = pow(1.0 - max(V.y, 0.0), 4.0);
    vec3 col = vec3(0.012, 0.008, 0.03) + vec3(0.25, 0.2, 0.5) * graze * 0.35;
    float glow = 0.0;
    glow += ring(r, 0.955, 0.012) * 1.6;
    glow += ring(r, 0.9, 0.006);
    // dashed rune rings turning against each other
    float d1 = step(0.5, fract((a + uTime * 0.06) * 12.0 / 6.2832 + uSeed));
    glow += ring(r, 0.8, 0.02) * d1 * 0.9;
    float d2 = step(0.35, fract((a - uTime * 0.09) * 36.0 / 6.2832));
    glow += ring(r, 0.66, 0.008) * d2 * 0.8;
    float glyph = step(0.55, noise(vec2(floor((a + uTime * 0.03) * 28.0 / 6.2832) + uSeed * 9.0, 3.0)));
    glow += ring(r, 0.73, 0.03) * glyph * 0.55;
    // spokes + a soft heart
    float spokes = smoothstep(0.012, 0.0, abs(fract(a * 6.0 / 6.2832 + 0.5) - 0.5) * r) * step(0.2, r) * step(r, 0.62);
    glow += spokes * 0.35;
    glow += ring(r, 0.2, 0.006) * 0.8 + exp(-r * 5.0) * 0.35;
    float breathe = 0.75 + 0.25 * sin(uTime * 1.3 + uSeed * 6.0);
    col += uRim * glow * breathe * 2.6;
    gl_FragColor = vec4(fogged(col, vDepth), 1.0);
  }
`

/** A floating island: faceted rock below, rune-etched platform on top. */
export function Island({
  radius = 3,
  seed = 1,
  rim = "#b18cff",
  shadow = false,
  ...props
}: { radius?: number; seed?: number; rim?: string; shadow?: boolean; top?: string } & ThreeElements["group"]) {
  const geo = useMemo(() => rockGeometry(radius, seed), [radius, seed])
  const shared = () => ({ uFog: { value: new THREE.Color(FOG_COLOR) }, uFogD: { value: FOG_DENSITY }, uTime: { value: 0 }, uRim: { value: new THREE.Color(rim) } })
  const rockU = useMemo(() => ({ ...shared(), uMoon: { value: MOON_DIR.clone() }, uRadius: { value: radius } }), [rim, radius]) // eslint-disable-line react-hooks/exhaustive-deps
  const topU = useMemo(() => ({ ...shared(), uSeed: { value: (seed * 0.37) % 1 } }), [rim, seed]) // eslint-disable-line react-hooks/exhaustive-deps
  const rock = useRef<THREE.ShaderMaterial>(null)
  const top = useRef<THREE.ShaderMaterial>(null)
  useFrame(({ clock }) => {
    if (rock.current) rock.current.uniforms.uTime.value = clock.elapsedTime
    if (top.current) top.current.uniforms.uTime.value = clock.elapsedTime
  })
  const y = radius * 0.18
  return (
    <group {...props}>
      <mesh geometry={geo}>
        <shaderMaterial ref={rock} vertexShader={rockV} fragmentShader={rockF} uniforms={rockU} />
      </mesh>
      <mesh position={[0, y - 0.08, 0]}>
        <cylinderGeometry args={[radius * 0.97, radius * 0.9, 0.36, 64, 1, true]} />
        <meshStandardMaterial color="#0a0714" roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, y + 0.1, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[radius * 0.97, 64]} />
        <shaderMaterial ref={top} vertexShader={topV} fragmentShader={topF} uniforms={topU} />
      </mesh>
      {shadow && (
        <mesh position={[0, y + 0.11, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[radius * 0.97, 48]} />
          <shadowMaterial transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  )
}
