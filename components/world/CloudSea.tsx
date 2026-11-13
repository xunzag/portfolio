"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { MOON_DIR } from "./Sky"

// An endless sea of clouds far below the islands. One plane that follows the
// camera; the clouds themselves are world-anchored noise, lit by the moon,
// with slow pulses of light rolling through them like distant storms.
const vert = /* glsl */ `
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`
const frag = /* glsl */ `
  uniform float uTime; uniform vec3 uMoon; uniform float uOct;
  varying vec3 vW;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { if (float(i) >= uOct) break; v += a * noise(p); p = p * 2.03 + 11.0; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 p = vW.xz * 0.012;
    vec2 flow = vec2(uTime * 0.012, uTime * 0.006);
    float warp = fbm(p * 0.6 - flow);
    float c = fbm(p + warp * 1.3 + flow);
    float puff = smoothstep(0.28, 0.78, c);
    vec3 V = normalize(cameraPosition - vW);
    float dist = length(cameraPosition.xz - vW.xz);

    vec3 deep = vec3(0.012, 0.006, 0.04);
    vec3 top = vec3(0.16, 0.08, 0.3);
    vec3 col = mix(deep, top, puff);
    // moonlight rakes across the tops, strongest looking towards the moon
    float toward = pow(max(dot(normalize(-V.xz), normalize(uMoon.xz)), 0.0), 6.0);
    col += vec3(0.75, 0.45, 0.95) * pow(puff, 2.5) * (0.08 + toward * 0.55);
    // storms far inside
    vec2 cell = floor(p * 0.5);
    float flick = pow(max(0.0, sin(uTime * (0.6 + hash(cell) * 1.4) + hash(cell + 3.0) * 30.0)), 24.0);
    col += vec3(0.6, 0.4, 1.0) * flick * smoothstep(0.5, 0.8, c) * 0.8;
    // dissolve into the horizon glow
    float far = smoothstep(120.0, 620.0, dist);
    col = mix(col, vec3(0.07, 0.02, 0.12) * (0.5 + toward), far);
    gl_FragColor = vec4(col, 1.0 - smoothstep(560.0, 760.0, dist));
    #include <colorspace_fragment>
  }
`

export function CloudSea() {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const high = useRoom((s) => s.quality === "high")
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uMoon: { value: MOON_DIR.clone() }, uOct: { value: 5 } }), [])
  useFrame(({ clock, camera }) => {
    const u = mat.current?.uniforms
    if (u) {
      u.uTime.value = clock.elapsedTime
      u.uOct.value = high ? 4 : 3
    }
    // always a long way beneath whatever island we're at
    mesh.current?.position.set(camera.position.x, camera.position.y - 26, camera.position.z)
  })
  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} renderOrder={-9} frustumCulled={false}>
      <planeGeometry args={[1600, 1600]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
