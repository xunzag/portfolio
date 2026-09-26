"use client"

import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { rng } from "@/lib/rng"
import { live } from "./live"

// Floating paper lanterns + drifting sakura petals that always surround the
// camera. Pure GPU (one draw call each) so they can live everywhere.

const lanternV = /* glsl */ `
  uniform float uTime; uniform vec3 uCam;
  attribute float aSeed;
  varying float vA; varying float vSeed;
  void main() {
    vec3 p = position;
    p.y += uTime * (0.35 + aSeed * 0.4);
    p.x += sin(uTime * 0.25 + aSeed * 20.0) * 1.2;
    p = uCam + mod(p - uCam + vec3(45.0, 30.0, 45.0), vec3(90.0, 60.0, 90.0)) - vec3(45.0, 30.0, 45.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vSeed = aSeed;
    float z = -mv.z;
    vA = (0.75 + 0.25 * sin(uTime * (1.5 + aSeed) + aSeed * 30.0)) * smoothstep(4.0, 12.0, z) * smoothstep(80.0, 40.0, z);
    gl_PointSize = min(48.0, (90.0 + aSeed * 110.0) / z);
    gl_Position = projectionMatrix * mv;
  }
`
const lanternF = /* glsl */ `
  varying float vA; varying float vSeed;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    // soft rounded-rectangle lantern body with a hot core
    vec2 d = abs(q) - vec2(0.13, 0.19);
    float box = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    float body = smoothstep(0.08, -0.02, box);
    float halo = smoothstep(0.5, 0.0, length(q)) * 0.35;
    vec3 warm = mix(vec3(1.0, 0.72, 0.38), vec3(1.0, 0.55, 0.55), vSeed);
    float a = (body + halo) * vA;
    gl_FragColor = vec4(warm * (body * 2.6 + halo * 1.4), a);
  }
`
const petalV = /* glsl */ `
  uniform float uTime; uniform vec3 uCam;
  attribute float aSeed;
  varying float vA; varying float vRot; varying float vSeed;
  void main() {
    vec3 p = position;
    p.y -= uTime * (0.5 + aSeed * 0.7);
    p.x += sin(uTime * 0.7 + aSeed * 40.0) * 1.4;
    p.z += cos(uTime * 0.5 + aSeed * 25.0) * 1.1;
    p = uCam + mod(p - uCam + vec3(30.0, 20.0, 30.0), vec3(60.0, 40.0, 60.0)) - vec3(30.0, 20.0, 30.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float z = -mv.z;
    vA = smoothstep(60.0, 20.0, z) * smoothstep(3.0, 9.0, z);
    vRot = uTime * (1.0 + aSeed * 2.0) + aSeed * 10.0;
    vSeed = aSeed;
    gl_PointSize = min(14.0, (22.0 + aSeed * 26.0) / z);
    gl_Position = projectionMatrix * mv;
  }
`
const petalF = /* glsl */ `
  varying float vA; varying float vRot; varying float vSeed;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float c = cos(vRot), s = sin(vRot);
    q = mat2(c, -s, s, c) * q;
    q.x *= 1.0 + 0.6 * abs(sin(vRot * 1.3)); // tumbling
    float petal = smoothstep(0.5, 0.35, length(q / vec2(0.45, 0.28)));
    vec3 col = mix(vec3(1.0, 0.78, 0.9), vec3(1.0, 0.55, 0.8), vSeed);
    gl_FragColor = vec4(col * 1.3, petal * vA * 0.75);
  }
`

function useField(count: number, spread: [number, number, number], seed: number) {
  return useMemo(() => {
    const r = rng(seed)
    const pos = new Float32Array(count * 3)
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(r() - 0.5) * spread[0], (r() - 0.5) * spread[1], (r() - 0.5) * spread[2]], i * 3)
      s[i] = r()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    g.setAttribute("aSeed", new THREE.BufferAttribute(s, 1))
    return g
  }, [count, spread, seed])
}

export function Atmosphere() {
  const high = useRoom((s) => s.quality === "high")
  const lanterns = useField(high ? 90 : 50, [90, 60, 90], 5)
  const petals = useField(high ? 900 : 400, [60, 40, 60], 9)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uCam: { value: new THREE.Vector3() } }), [])
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uCam.value.copy(live.frame.pos)
  })
  return (
    <>
      <points geometry={lanterns} frustumCulled={false}>
        <shaderMaterial vertexShader={lanternV} fragmentShader={lanternF} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points geometry={petals} frustumCulled={false}>
        <shaderMaterial vertexShader={petalV} fragmentShader={petalF} uniforms={uniforms} transparent depthWrite={false} />
      </points>
    </>
  )
}
