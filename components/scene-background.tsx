"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import * as THREE from "three"

/* ── Aurora shader plane ─────────────────────────────────────── */
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

// Classic 2D simplex noise by Ian McEwan
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                          dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x  = a0.x * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float t  = uTime * 0.08;

  // Layered noise for aurora ribbons
  float n1 = snoise(vec2(uv.x * 2.5 + t * 0.6,  uv.y * 1.2 - t * 0.4)) * 0.5 + 0.5;
  float n2 = snoise(vec2(uv.x * 1.8 - t * 0.5,  uv.y * 2.0 + t * 0.3)) * 0.5 + 0.5;
  float n3 = snoise(vec2(uv.x * 3.0 + t * 0.2,  uv.y * 0.8 + t * 0.7)) * 0.5 + 0.5;

  // Colour palette: purple → blue → cyan
  vec3 c1 = vec3(0.42, 0.06, 0.78); // deep purple
  vec3 c2 = vec3(0.12, 0.28, 0.88); // blue
  vec3 c3 = vec3(0.00, 0.62, 0.78); // cyan

  vec3 color = mix(c1, c2, n1);
  color = mix(color, c3, n2 * 0.45);

  // Brightness bands (aurora curtains)
  float bands = snoise(vec2(uv.x * 4.0 + t, uv.y * 0.5)) * 0.5 + 0.5;
  color *= 0.6 + bands * 0.8;

  // Screen-edge fade so it blends into black borders
  float vign = smoothstep(0.0, 0.55, uv.x) * smoothstep(1.0, 0.45, uv.x)
             * smoothstep(0.0, 0.40, uv.y) * smoothstep(1.0, 0.60, uv.y);

  // Very subtle — portfolio, not a screensaver
  float brightness = 0.09 + n3 * 0.07;
  color *= brightness * vign;

  gl_FragColor = vec4(color, 1.0);
}
`

function AuroraPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width + 2, viewport.height + 2, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ── Floating particle cloud (subtle depth layer) ────────────── */
function ParticleCloud() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, count } = useMemo(() => {
    const count = 400
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
    }
    return { positions, count }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.012
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.008) * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a855f7"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  )
}

/* ── Exported scene ──────────────────────────────────────────── */
export function SceneBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={[1, 1.5]}
      >
        <AuroraPlane />
        <ParticleCloud />
        <Stars
          radius={60}
          depth={30}
          count={1200}
          factor={3}
          saturation={0.4}
          fade
          speed={0.4}
        />
      </Canvas>
    </div>
  )
}
