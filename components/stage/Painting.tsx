"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { live } from "../live"
import { IMG_ASPECT, frame, view } from "./view"

// A painting rendered as a 2.5D diorama: every pixel is pushed by its depth
// (Depth Anything V2) so the pointer and the scroll move near and far layers
// at different speeds. On top, cheap image-space effects bring it to life:
// flickering fire, breathing cursed energy, twinkling city lights, glowing
// eyes, lightning and a pulsing eclipse.

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }
`

const frag = /* glsl */ `
  uniform sampler2D uMap; uniform sampler2D uDepth;
  uniform vec2 uFocus; uniform vec2 uView; uniform float uDolly; uniform vec2 uPar;
  uniform float uTime; uniform float uKind; uniform float uBright;
  uniform vec2 uMouse; uniform float uLights; uniform float uParty; uniform float uT;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }

  // image coords are y-down; textures are y-up
  vec3 tex(vec2 p) { return texture2D(uMap, vec2(p.x, 1.0 - p.y)).rgb; }
  float dep(vec2 p) { return texture2D(uDepth, vec2(p.x, 1.0 - p.y)).r; }
  float glow(vec2 p, vec2 c, float r) { vec2 d = (p - c) * vec2(${IMG_ASPECT.toFixed(4)}, 1.0); return exp(-dot(d, d) / (r * r)); }

  vec3 hue(vec3 c, float a) {
    const vec3 k = vec3(0.57735);
    float ca = cos(a);
    return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - ca);
  }

  void main() {
    // where this pixel lands in the painting before depth
    vec2 base = uFocus + vec2(vUv.x - 0.5, 0.5 - vUv.y) * uView;
    // invert the depth push with a few fixed-point steps
    vec2 uv = base;
    float d = dep(uv);
    for (int i = 0; i < 6; i++) {
      d = dep(uv);
      float s = 1.0 / (1.0 - uDolly * d * d * 0.92);
      uv = uFocus + (base - uFocus - uPar * (d - 0.4)) / s;
    }
    uv = clamp(uv, vec2(0.0005), vec2(0.9995));
    vec3 c = tex(uv);
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    float t = uTime;

    // pointer "torch": the scene brightens where you look
    float torch = glow(uv, uMouse, 0.16);
    c *= 1.0 + torch * 0.45;

    if (uKind < 0.5) {
      // ── Act I painting ──
      // fire light (castle, lanterns, embers)
      float warm = smoothstep(0.1, 0.35, c.r - c.b) * smoothstep(0.18, 0.55, lum);
      float flick = fbm(uv * vec2(9.0, 5.0) + vec2(0.0, -t * 1.6));
      c += c * warm * (flick - 0.35) * 1.1;
      // cursed energy (purple) breathes and crawls
      float purple = smoothstep(0.05, 0.2, c.b - c.g) * smoothstep(0.03, 0.18, c.r - c.g) * smoothstep(0.12, 0.45, lum);
      float crawl = fbm(uv * 14.0 + vec2(t * 0.4, -t * 0.7));
      c += vec3(0.55, 0.3, 1.0) * purple * (0.25 + 0.75 * crawl) * (0.6 + 0.4 * sin(t * 2.3));
      // city lights twinkle (local highlights in the far city)
      float local = lum - dot(texture2D(uMap, vec2(uv.x, 1.0 - uv.y), 4.0).rgb, vec3(0.299, 0.587, 0.114));
      float tw = hash(floor(uv * 520.0));
      float on = 0.5 + 0.5 * sin(t * (1.0 + tw * 4.0) + tw * 40.0);
      c += c * smoothstep(0.06, 0.22, local) * (1.0 - smoothstep(0.45, 0.7, d)) * (on - 0.4) * 1.3;
      // lightning behind the clouds
      float cyc = mod(t, 9.0);
      float bolt = step(7.9, cyc) * (0.6 + 0.4 * sin(cyc * 70.0)) * (1.0 - smoothstep(7.9, 8.6, cyc));
      float sky = (1.0 - smoothstep(0.08, 0.3, d)) * (1.0 - smoothstep(0.25, 0.65, uv.y));
      c += vec3(0.6, 0.65, 1.0) * sky * bolt * (0.15 + lum * 2.2);
      // eyes: Eren (teal), Hisoka (gold)
      c += vec3(0.25, 0.9, 1.0) * glow(uv, vec2(0.51, 0.102), 0.012) * (0.7 + 0.5 * sin(t * 1.7));
      c += vec3(1.0, 0.75, 0.3) * glow(uv, vec2(0.7925, 0.386), 0.008) * (0.4 + 0.4 * sin(t * 2.1 + 1.0));
      // the monitors: code light flickers onto him
      float mon = smoothstep(0.012, 0.0, max(abs(uv.x - 0.49) - 0.14, abs(uv.y - 0.77) - 0.085));
      float scan = 0.85 + 0.15 * sin(uv.y * 900.0 - t * 12.0);
      c *= mix(1.0, scan * (0.95 + 0.1 * noise(vec2(t * 8.0, 0.0))) * (0.6 + 0.4 * uLights + 0.25 * uT), mon);
      c += vec3(0.25, 0.5, 1.0) * glow(uv, vec2(0.49, 0.78), 0.12) * 0.12 * uLights;
    } else {
      // ── Act III painting ──
      // the eclipse: a burning ring that pulses like a heartbeat
      vec2 e = (uv - vec2(0.126, 0.055)) * vec2(${IMG_ASPECT.toFixed(4)}, 1.0);
      float r = length(e);
      float beat = pow(max(0.0, sin(t * 1.9)), 6.0);
      float ring = exp(-pow((r - 0.053) / (0.005 + beat * 0.003), 2.0));
      float corona = exp(-max(0.0, r - 0.053) * 22.0) * step(0.05, r);
      float rays = fbm(vec2(atan(e.y, e.x) * 5.0, r * 12.0 - t * 0.6));
      c += vec3(1.0, 0.12, 0.08) * (ring * (1.2 + beat * 1.5) + corona * rays * (0.5 + beat * 0.6));
      // blood-red sky smoulders
      float red = smoothstep(0.08, 0.3, c.r - max(c.g, c.b)) * smoothstep(0.12, 0.45, lum);
      c += c * red * (fbm(uv * 7.0 + vec2(t * 0.15, -t * 0.4)) - 0.4) * 1.2;
      // Ryuk's eye in the dark
      float blink = smoothstep(0.0, 0.08, abs(mod(t, 6.5) - 3.2));
      c += vec3(1.0, 0.06, 0.05) * glow(uv, vec2(0.9285, 0.179), 0.022) * (0.6 + 0.3 * sin(t * 1.3)) * blink;
      // screens flicker
      float purple = smoothstep(0.05, 0.2, c.b - c.g) * smoothstep(0.12, 0.45, lum);
      c += c * purple * (noise(uv * 30.0 + t * 2.0) - 0.5) * 0.5;
    }

    if (uParty > 0.5) c = hue(c, t * 2.0 + uv.x * 6.0) * 1.15;
    // grade: deeper blacks, warm highlights
    c = pow(c, vec3(1.08));
    gl_FragColor = vec4(c, uBright);
    #include <colorspace_fragment>
  }
`

export function Painting() {
  // phones and weak GPUs get the 2k paintings, everyone else the full 3344px
  const hd = useRoom((s) => s.quality === "high")
  const k = hd ? "" : "-2k"
  const [heroMap, heroDepth, arsMap, arsDepth] = useTexture([`/art/hero${k}.webp`, "/art/hero-depth.webp", `/art/arsenal${k}.webp`, "/art/arsenal-depth.webp"])
  useMemo(() => {
    for (const t of [heroMap, arsMap]) {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    }
    for (const t of [heroMap, heroDepth, arsMap, arsDepth]) {
      t.generateMipmaps = true
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
    }
  }, [heroMap, heroDepth, arsMap, arsDepth])

  const uniforms = useMemo(
    () => ({
      uMap: { value: heroMap },
      uDepth: { value: heroDepth },
      uFocus: { value: new THREE.Vector2(0.5, 0.5) },
      uView: { value: new THREE.Vector2(1, 1) },
      uDolly: { value: 0 },
      uPar: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uKind: { value: 0 },
      uBright: { value: 1 },
      uMouse: { value: new THREE.Vector2(-9, -9) },
      uLights: { value: 1 },
      uParty: { value: 0 },
      uT: { value: 0 },
    }),
    [heroMap, heroDepth],
  )
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const size = useThree((s) => s.size)
  const lights = useRef(1)

  useFrame(({ clock }, dt) => {
    const v = view(live.scroll)
    // R3F copies the uniforms prop, so write through the live material
    const u = mat.current?.uniforms as typeof uniforms | undefined
    if (!u) return
    const f = frame(v, size.width, size.height)
    const visible = v.bright > 0.002
    if (mesh.current) mesh.current.visible = visible
    if (!visible) return
    const art = v.art === 0
    u.uMap.value = art ? heroMap : arsMap
    u.uDepth.value = art ? heroDepth : arsDepth
    u.uKind.value = v.art
    u.uFocus.value.set(f.fx, f.fy)
    u.uView.value.set(f.vw, f.vh)
    u.uDolly.value = v.dolly
    // parallax shrinks as we zoom in so close-ups don't swim
    const k = 0.022 / Math.sqrt(v.zoom)
    u.uPar.value.set(-live.mouse.sx * k, live.mouse.sy * k * 0.6)
    u.uTime.value = clock.elapsedTime
    u.uBright.value = v.bright
    u.uT.value = art ? v.heroT : v.arsenalT
    const st = useRoom.getState()
    lights.current += ((st.lightsOn ? 1 : 0) - lights.current) * Math.min(1, dt * 4)
    u.uLights.value = lights.current
    u.uParty.value = st.party ? 1 : 0
    // the torch only follows a real pointer
    const fine = live.px.x > -1e3
    u.uMouse.value.set(fine ? f.fx + (live.px.x / size.width - 0.5) * f.vw : -9, fine ? f.fy + (live.px.y / size.height - 0.5) * f.vh : -9)
  })

  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} depthTest={false} toneMapped={false} />
    </mesh>
  )
}
