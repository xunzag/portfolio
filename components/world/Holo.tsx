"use client"

import { useMemo, useRef, useState } from "react"
import { useFrame, type ThreeElements } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"
import { Type } from "./Type"

// ── Holographic screen ─────────────────────────────────────────────────
const holoV = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const holoF = /* glsl */ `
  uniform sampler2D uMap; uniform float uTime; uniform vec3 uAccent; uniform float uOn; uniform float uAspect;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    // reveal: scanline wipe from the top
    float reveal = step(1.0 - uOn * 1.05, uv.y);
    float beam = smoothstep(0.03, 0.0, abs(uv.y - (1.0 - uOn * 1.05))) * step(uOn, 0.99);
    float glitch = step(0.985, fract(sin(floor(uTime * 10.0)) * 43758.5)) * 0.015;
    uv.x += glitch * sin(uv.y * 90.0);
    // cover-fit the image
    vec2 c = uv - 0.5; c.y *= uAspect; c += 0.5;
    vec3 img = vec3(texture2D(uMap, c + vec2(0.0015, 0.0)).r, texture2D(uMap, c).g, texture2D(uMap, c - vec2(0.0015, 0.0)).b);
    float scan = 0.9 + 0.1 * sin(uv.y * 600.0 + uTime * 5.0);
    vec2 e = min(vUv, 1.0 - vUv);
    float edge = smoothstep(0.012, 0.0, min(e.x, e.y));
    vec3 col = img * scan * 1.05 * reveal + uAccent * (edge * 2.5 + beam * 3.0);
    float a = max(reveal, beam) * (0.35 + 0.65 * uOn) + edge * uOn;
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`

export function HoloScreen({ map, accent, width, height, on, ...props }: { map: THREE.Texture; accent: string; width: number; height: number; on: React.RefObject<number> } & ThreeElements["group"]) {
  const uniforms = useMemo(() => {
    const img = map.image as { width: number; height: number } | undefined
    const imgAspect = img ? img.width / img.height : 16 / 9
    return {
      uMap: { value: map },
      uTime: { value: 0 },
      uAccent: { value: new THREE.Color(accent) },
      uOn: { value: 0 },
      uAspect: { value: imgAspect / (width / height) },
    }
  }, [map, accent, width, height])
  const mat = useRef<THREE.ShaderMaterial>(null)
  useFrame(({ clock }) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uTime.value = clock.elapsedTime
    u.uOn.value = on.current ?? 0
  })
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <shaderMaterial ref={mat} vertexShader={holoV} fragmentShader={holoF} uniforms={uniforms} transparent toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* corner brackets */}
      {[
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
      ].map(([sx, sy], i) => (
        <group key={i} position={[(sx * width) / 2, (sy * height) / 2, 0.01]}>
          <mesh position={[(-sx * 0.35) / 2, 0, 0]}>
            <planeGeometry args={[0.35, 0.035]} />
            <meshBasicMaterial color={new THREE.Color(accent).multiplyScalar(3)} toneMapped={false} />
          </mesh>
          <mesh position={[0, (-sy * 0.35) / 2, 0]}>
            <planeGeometry args={[0.035, 0.35]} />
            <meshBasicMaterial color={new THREE.Color(accent).multiplyScalar(3)} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Clickable glowing 3D pill button ───────────────────────────────────
export function Button3D({ label, href, accent = "#b18cff", primary, onClick, ...props }: { label: string; href?: string; accent?: string; primary?: boolean; onClick?: () => void } & ThreeElements["group"]) {
  const ref = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  const width = 0.24 + label.length * 0.125
  useFrame((_, dt) => {
    if (!ref.current) return
    easing.damp3(ref.current.scale, hover ? 1.08 : 1, 0.12, dt)
    easing.damp(ref.current.position, "z", hover ? 0.12 : 0, 0.12, dt)
  })
  const bg = useMemo(() => new THREE.Color(primary ? accent : "#150f26").multiplyScalar(primary ? (hover ? 2.2 : 1.4) : 1), [accent, primary, hover])
  return (
    <group {...props}>
      <group
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = "auto"
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
          else if (href) window.open(href, href.startsWith("mailto:") || href.endsWith(".pdf") ? "_self" : "_blank", "noopener")
        }}
      >
        <RoundedBox args={[width, 0.42, 0.06]} radius={0.2} smoothness={4} position={[width / 2, -0.21, 0]}>
          <meshBasicMaterial color={bg} toneMapped={false} transparent opacity={primary ? 1 : 0.85} />
        </RoundedBox>
        <RoundedBox args={[width + 0.03, 0.45, 0.04]} radius={0.21} smoothness={4} position={[width / 2, -0.21, -0.012]}>
          <meshBasicMaterial color={new THREE.Color(accent).multiplyScalar(hover ? 3 : 1.6)} toneMapped={false} />
        </RoundedBox>
        <Type weight="bold" fontSize={0.15} letterSpacing={0.08} anchorX="center" anchorY="middle" position={[width / 2, -0.21, 0.04]} color={primary ? "#0b0816" : "#ffffff"} glow={primary ? 1 : 1.3}>
          {label}
        </Type>
      </group>
    </group>
  )
}
