"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRoom } from "@/lib/store"

/** Where the moon hangs: dead ahead of the journey, low over the horizon. */
export const MOON_DIR = new THREE.Vector3(0.34, 0.3, -1).normalize()

// Midnight over a sea of clouds: indigo zenith, a violet-magenta horizon,
// a huge moon with a halo, aurora ribbons, a band of stars.
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
  uniform float uParty;
  uniform vec3 uMoon;
  varying vec3 vDir;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
  vec3 hue(float h) { return clamp(abs(mod(h * 6.0 + vec3(0, 4, 2), 6.0) - 3.0) - 1.0, 0.0, 1.0); }

  void main() {
    vec3 d = normalize(vDir);
    float y = d.y;
    vec2 sph = vec2(atan(d.z, d.x), asin(clamp(y, -1.0, 1.0)));
    float toMoon = max(dot(d, uMoon), 0.0);

    // night gradient
    vec3 col = mix(vec3(0.028, 0.01, 0.075), vec3(0.002, 0.003, 0.012), smoothstep(-0.05, 0.6, y));
    // the horizon burns violet, hotter towards the moon
    float hz = pow(1.0 - clamp(abs(y), 0.0, 1.0), 9.0);
    col += mix(vec3(0.22, 0.05, 0.32), vec3(0.75, 0.2, 0.55), pow(toMoon, 3.0)) * hz * 0.38;

    // stars + a milky band
    vec2 sg = sph * 110.0;
    float h = hash(floor(sg));
    float st = step(0.985, h) * smoothstep(0.4, 0.0, length(fract(sg) - 0.5)) * smoothstep(0.0, 0.25, y);
    st *= 0.55 + 0.45 * sin(uTime * (1.0 + h * 3.0) + h * 40.0);
    float band = fbm(vec2(sph.x * 1.3 + sph.y * 2.2, sph.y * 3.0 - sph.x)) * smoothstep(0.1, 0.5, y);
    col += vec3(0.8, 0.85, 1.0) * st * (0.7 + band * 1.6);
    col += vec3(0.12, 0.07, 0.25) * pow(band, 3.0) * 0.5;

    // aurora ribbons
    float rib = smoothstep(0.52, 0.95, fbm(vec2(sph.x * 2.5 + uTime * 0.02, y * 3.0 + noise(sph * 2.0 + uTime * 0.01) * 2.0)));
    vec3 aur = mix(vec3(0.5, 0.2, 1.0), vec3(0.1, 0.85, 0.8), noise(sph * 1.5 + 3.0));
    aur = mix(aur, hue(fract(uTime * 0.1 + sph.x * 0.1)), uParty);
    col += aur * rib * smoothstep(0.04, 0.28, y) * (1.0 - smoothstep(0.5, 0.9, y)) * 0.55;

    // the moon: cratered disc, hard limb, wide halo
    float ang = acos(clamp(dot(d, uMoon), -1.0, 1.0));
    float R = 0.085;
    float disc = smoothstep(R, R - 0.004, ang);
    vec3 mt = normalize(cross(uMoon, vec3(0.0, 1.0, 0.0)));
    vec3 mb = cross(mt, uMoon);
    vec2 mp = vec2(dot(d, mt), dot(d, mb)) / R;
    float crater = disc > 0.0 ? fbm(mp * 3.0 + 7.0) * 0.6 + noise(mp * 9.0) * 0.25 : 0.0;
    vec3 moonCol = mix(vec3(0.75, 0.68, 0.95), vec3(1.0, 0.94, 1.0), crater) * (0.75 + 0.5 * sqrt(max(0.0, 1.0 - dot(mp, mp))));
    col = mix(col, moonCol * 1.9, disc);
    col += vec3(0.75, 0.5, 1.0) * exp(-max(ang - R, 0.0) * 9.0) * 0.4 * (1.0 - disc);
    col += vec3(0.5, 0.25, 0.8) * exp(-ang * 2.6) * 0.14;

    // below the horizon it just falls to black (the cloud sea covers it)
    col *= smoothstep(-0.45, 0.0, y) * 0.8 + 0.2;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

export function Sky() {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uParty: { value: 0 }, uMoon: { value: MOON_DIR.clone() } }), [])
  useFrame(({ clock, camera }, dt) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uTime.value = clock.elapsedTime
    const party = useRoom.getState().party ? 1 : 0
    u.uParty.value += (party - u.uParty.value) * Math.min(1, dt * 2)
    mesh.current?.position.copy(camera.position)
  })
  return (
    <mesh ref={mesh} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[500, 48, 32]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} side={THREE.BackSide} depthWrite={false} depthTest={false} toneMapped={false} />
    </mesh>
  )
}
