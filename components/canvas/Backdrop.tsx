"use client"

import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRoom } from "@/lib/store"

// A huge inverted sphere with a slow aurora so there's never dead black space
// around the diorama, whatever the screen shape.
const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uParty;
  varying vec3 vDir;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
  vec3 hue(float h) { return clamp(abs(mod(h * 6.0 + vec3(0, 4, 2), 6.0) - 3.0) - 1.0, 0.0, 1.0); }
  void main() {
    vec3 d = normalize(vDir);
    float y = d.y;
    vec2 uv = vec2(atan(d.z, d.x) * 1.2, y * 2.5);
    float t = uTime * 0.03;
    float band = fbm(uv * 1.3 + vec2(t, -t * 0.6));
    float ribbons = smoothstep(0.45, 0.9, fbm(vec2(uv.x * 2.0 + t * 2.0, uv.y * 0.6 + band * 2.0)));
    vec3 base = mix(vec3(0.025, 0.016, 0.06), vec3(0.006, 0.005, 0.015), smoothstep(-0.2, 0.7, y));
    vec3 violet = vec3(0.38, 0.26, 0.95);
    vec3 cyan = vec3(0.16, 0.62, 0.95);
    vec3 aur = mix(violet, cyan, band);
    aur = mix(aur, hue(fract(uTime * 0.1 + uv.x * 0.1)), uParty);
    float mask = smoothstep(-0.35, 0.15, y) * (1.0 - smoothstep(0.35, 0.95, y));
    vec3 col = base + aur * ribbons * mask * 0.32;
    // warm horizon glow under the room
    col += vec3(0.3, 0.1, 0.4) * pow(1.0 - abs(y + 0.15), 10.0) * 0.28;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

export function Backdrop() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uParty: { value: 0 } }), [])
  useFrame(({ clock }, dt) => {
    uniforms.uTime.value = clock.elapsedTime
    const target = useRoom.getState().party ? 1 : 0
    uniforms.uParty.value += (target - uniforms.uParty.value) * Math.min(1, dt * 2)
  })
  return (
    <mesh scale={120} userData={{ noShadow: true }} renderOrder={-1}>
      <sphereGeometry args={[1, 48, 32]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} side={THREE.BackSide} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
