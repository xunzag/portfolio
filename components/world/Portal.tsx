"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { local } from "@/lib/chapters"
import { live } from "./live"
import { PORTAL } from "./track"
import { Type } from "./Type"

// A huge anime-style gate of light. The camera flies straight through the vortex.
const vortexV = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const vortexF = /* glsl */ `
  uniform float uTime; uniform float uPull;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;
    float a = atan(p.y, p.x);
    float swirl = a + 3.0 / (r + 0.25) - uTime * (0.8 + uPull * 3.0);
    float bands = noise(vec2(swirl * 2.0, r * 6.0 - uTime * 2.0)) * 0.7 + noise(vec2(swirl * 5.0, r * 14.0)) * 0.3;
    vec3 pink = vec3(1.0, 0.35, 0.8), cyan = vec3(0.3, 0.85, 1.0), white = vec3(1.0, 0.95, 1.0);
    vec3 col = mix(pink, cyan, smoothstep(0.3, 0.8, bands));
    col = mix(col, white, smoothstep(0.35, 0.0, r) * (0.6 + uPull));
    float alpha = smoothstep(1.0, 0.7, r) * (0.55 + bands * 0.6);
    gl_FragColor = vec4(col * (1.2 + uPull * 2.0 + (1.0 - r) * 1.5), alpha);
  }
`

export function Portal() {
  const disk = useRef<THREE.ShaderMaterial>(null)
  const ring = useRef<THREE.Group>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPull: { value: 0 } }), [])
  const runes = useMemo(() => Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2), [])

  useFrame(({ clock }) => {
    const u = disk.current?.uniforms
    const pull = local(live.scroll, "portal")
    if (u) {
      u.uTime.value = clock.elapsedTime
      u.uPull.value = pull * pull
    }
    if (ring.current) ring.current.rotation.z = clock.elapsedTime * 0.12 + pull * 2
  })

  return (
    <group position={PORTAL}>
      <mesh>
        <circleGeometry args={[6, 96]} />
        <shaderMaterial ref={disk} vertexShader={vortexV} fragmentShader={vortexF} uniforms={uniforms} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <group ref={ring}>
        <mesh>
          <torusGeometry args={[6.1, 0.09, 16, 160]} />
          <meshBasicMaterial color={[3, 1.6, 4]} toneMapped={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[6.6, 0.025, 8, 160]} />
          <meshBasicMaterial color={[1.4, 2.8, 3.4]} toneMapped={false} />
        </mesh>
        {runes.map((ang, i) => (
          <mesh key={i} position={[Math.cos(ang) * 6.95, Math.sin(ang) * 6.95, 0]} rotation-z={ang}>
            <boxGeometry args={[0.08, i % 3 === 0 ? 0.6 : 0.3, 0.02]} />
            <meshBasicMaterial color={[3, 2, 3.6]} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <group position={[0, 8.4, 0]}>
        <Type weight="semi" fontSize={0.3} letterSpacing={0.4} anchorX="center" color="#ffb7ec" glow={2.2}>
          {"06   THROUGH THE GATE"}
        </Type>
        <Type weight="bold" fontSize={1.05} anchorX="center" position={[0, -0.5, 0]} glow={1.6}>
          {"Enough code. Here's what I love."}
        </Type>
      </group>
    </group>
  )
}
