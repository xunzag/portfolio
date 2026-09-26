"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { live } from "./live"

// One sky dome that follows the camera and blends between the three moods:
// neon night (city + room), pink dusk over a sea of clouds (realm), sunrise (contact).
const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uRealm;
  uniform float uSun;
  uniform float uParty;
  varying vec3 vDir;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
  vec3 hue(float h) { return clamp(abs(mod(h * 6.0 + vec3(0, 4, 2), 6.0) - 3.0) - 1.0, 0.0, 1.0); }

  void main() {
    vec3 d = normalize(vDir);
    float y = d.y;
    vec2 sph = vec2(atan(d.z, d.x), asin(clamp(y, -1.0, 1.0)));

    // stars (fade near horizon)
    vec2 sg = sph * vec2(90.0, 90.0);
    float st = step(0.992, hash(floor(sg))) * smoothstep(0.35, 0.0, length(fract(sg) - 0.5)) * smoothstep(0.02, 0.3, y);
    st *= 0.6 + 0.4 * sin(uTime * 2.0 + hash(floor(sg)) * 40.0);

    // ── neon night
    vec3 night = mix(vec3(0.11, 0.035, 0.16), vec3(0.008, 0.006, 0.02), smoothstep(-0.05, 0.55, y));
    night += vec3(0.75, 0.2, 0.7) * pow(1.0 - clamp(abs(y), 0.0, 1.0), 10.0) * 0.6;
    float rib = smoothstep(0.5, 0.95, fbm(vec2(sph.x * 2.5 + uTime * 0.02, y * 3.0 + fbm(sph * 2.0) * 2.0)));
    vec3 aur = mix(vec3(0.35, 0.25, 0.95), vec3(0.15, 0.6, 0.95), fbm(sph * 1.5));
    aur = mix(aur, hue(fract(uTime * 0.1 + sph.x * 0.1)), uParty);
    night += aur * rib * smoothstep(0.05, 0.3, y) * (1.0 - smoothstep(0.6, 0.95, y)) * 0.5;
    night += st;

    // ── realm dusk over a sea of clouds
    vec3 dusk = mix(vec3(0.3, 0.15, 0.45), vec3(0.045, 0.02, 0.11), smoothstep(-0.05, 0.75, y));
    float m = length(vec2(sph.x - 1.1, sph.y - 0.32) * vec2(1.0, 1.0));
    dusk += vec3(1.0, 0.95, 0.9) * smoothstep(0.075, 0.07, m) + vec3(1.0, 0.6, 0.85) * smoothstep(0.5, 0.0, m) * 0.18;
    float cl = fbm(vec2(sph.x * 3.0 + uTime * 0.01, y * 10.0));
    vec3 clouds = mix(vec3(0.16, 0.08, 0.28), vec3(0.34, 0.19, 0.46), cl);
    dusk = mix(dusk, clouds, smoothstep(0.02, -0.18, y) * 0.9);
    dusk += st * smoothstep(0.35, 0.6, y);

    // ── sunrise
    vec3 sunrise = mix(vec3(1.0, 0.52, 0.3), vec3(0.14, 0.18, 0.42), smoothstep(-0.05, 0.5, y));
    sunrise = mix(sunrise, vec3(0.05, 0.04, 0.09), smoothstep(0.0, -0.2, y));
    vec3 sd = normalize(vec3(0.15, 0.07, -1.0));
    float sa = max(dot(d, sd), 0.0);
    sunrise += vec3(1.0, 0.75, 0.45) * pow(sa, 900.0) * 3.0 + vec3(1.0, 0.45, 0.3) * pow(sa, 12.0) * 0.6;

    vec3 col = mix(night, dusk, uRealm);
    col = mix(col, sunrise, uSun);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

export function Sky() {
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uRealm: { value: 1 }, uSun: { value: 0 }, uParty: { value: 0 } }), [])
  useFrame(({ clock, camera }, dt) => {
    const f = live.frame
    uniforms.uTime.value = clock.elapsedTime
    // the whole journey now lives in the realm's dusk
    const realm = 1
    const sun = 0
    // cuts are hidden by the flash, so these can snap quickly
    uniforms.uRealm.value += (realm - uniforms.uRealm.value) * Math.min(1, dt * 8)
    uniforms.uSun.value += (sun - uniforms.uSun.value) * Math.min(1, dt * 8)
    const party = useRoom.getState().party ? 1 : 0
    uniforms.uParty.value += (party - uniforms.uParty.value) * Math.min(1, dt * 2)
    mesh.current?.position.copy(camera.position)
  })
  return (
    <mesh ref={mesh} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[500, 48, 32]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} side={THREE.BackSide} depthWrite={false} depthTest={false} toneMapped={false} />
    </mesh>
  )
}
