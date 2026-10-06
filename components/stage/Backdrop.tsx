"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { live } from "../live"
import { view } from "./view"

// "Inside the monitor": a deep black-violet void with a drifting perspective
// grid, slow crimson/violet auroras and scanlines. Lives behind the case files.

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }
`
const frag = /* glsl */ `
  uniform float uTime; uniform float uAlpha; uniform vec2 uMouse; uniform float uAspect; uniform float uScroll; uniform float uVel;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.0; a *= 0.5; } return s; }
  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    vec3 c = vec3(0.012, 0.008, 0.02);
    // floor grid receding to a horizon
    float hz = -0.18;
    if (p.y < hz) {
      float z = 0.35 / (hz - p.y);
      vec2 g = vec2(p.x * z, z + uScroll * 0.06);
      vec2 gl = abs(fract(g * 1.2) - 0.5) / fwidth(g * 1.2);
      float line = 1.0 - min(min(gl.x, gl.y), 1.0);
      c += vec3(0.55, 0.08, 0.15) * line * 0.22 * smoothstep(9.0, 0.6, z);
    }
    // auroras
    float a1 = fbm(p * 1.6 + vec2(uTime * 0.05, -uTime * 0.03));
    float a2 = fbm(p * 2.3 - vec2(uTime * 0.04, uTime * 0.02) + 7.0);
    c += vec3(0.5, 0.04, 0.12) * pow(a1, 4.0) * 0.45 * smoothstep(0.7, -0.3, p.y);
    c += vec3(0.22, 0.08, 0.5) * pow(a2, 4.0) * 0.35;
    // horizon glow
    c += vec3(0.7, 0.08, 0.15) * exp(-abs(p.y - hz) * 22.0) * 0.12;
    // pointer glow
    vec2 m = uMouse * vec2(uAspect, 1.0) * 0.5;
    c += vec3(0.4, 0.1, 0.35) * exp(-length(p - m) * 5.0) * 0.06;
    // scanlines + speed streaks
    c *= 0.9 + 0.1 * sin(vUv.y * 1400.0);
    c += vec3(0.6, 0.2, 0.4) * smoothstep(0.985, 1.0, hash(vec2(floor(vUv.y * 300.0), floor(uTime * 20.0)))) * min(1.0, abs(uVel) / 60.0) * 0.5;
    // values are linear: keep the void genuinely black
    gl_FragColor = vec4(c * c * 4.0 * uAlpha, 1.0);
    #include <colorspace_fragment>
  }
`

export function Backdrop() {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAlpha: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uAspect: { value: 1 }, uScroll: { value: 0 }, uVel: { value: 0 } }),
    [],
  )
  useFrame(({ clock, size }) => {
    const v = view(live.scroll)
    const on = v.backdrop > 0.002 && v.bright < 0.999
    if (mesh.current) mesh.current.visible = on
    const u = mat.current?.uniforms as typeof uniforms | undefined
    if (!on || !u) return
    u.uTime.value = clock.elapsedTime
    u.uAlpha.value = v.backdrop
    u.uMouse.value.set(live.mouse.sx, live.mouse.sy)
    u.uAspect.value = size.width / size.height
    u.uScroll.value = live.scroll
    u.uVel.value = live.velocity
  })
  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-11}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} depthTest={false} toneMapped={false} />
    </mesh>
  )
}
