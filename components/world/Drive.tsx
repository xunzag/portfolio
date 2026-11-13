"use client"

import { Suspense, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { live } from "./live"
import { Model } from "./Model"
import { FOG_COLOR, FOG_DENSITY } from "./Rock"
import { ROAD_SPAN, carAt, road } from "./track"

useGLTF.preload("/models/alfa.glb")

/** which way the model's nose points in its own file (radians about Y) */
const CAR_YAW = 0

// ── The road: a ribbon of black glass with running lights ──────────────
const roadV = /* glsl */ `
  attribute float aLen;
  varying vec2 vUv; varying float vLen; varying vec3 vW; varying float vDepth;
  void main() {
    vUv = uv; vLen = aLen;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`
const roadF = /* glsl */ `
  uniform float uTime; uniform vec3 uCar; uniform vec3 uCarDir; uniform float uSpeed;
  uniform vec3 uFog; uniform float uFogD;
  varying vec2 vUv; varying float vLen; varying vec3 vW; varying float vDepth;
  void main() {
    float x = abs(vUv.x - 0.5) * 2.0;
    vec3 a = vec3(1.0, 0.25, 0.75), b = vec3(0.25, 0.8, 1.0);
    vec3 neon = mix(a, b, 0.5 + 0.5 * sin(vLen * 0.05));
    // glass deck
    vec3 col = vec3(0.012, 0.008, 0.03);
    float alpha = 0.72;
    // kerb lights with pulses racing ahead
    float edge = smoothstep(0.05, 0.0, abs(x - 0.95));
    float run = pow(fract(vLen * 0.06 - uTime * 0.35), 6.0);
    col += neon * edge * (0.7 + run * 2.2);
    alpha += edge;
    // lane dashes
    float dash = step(0.55, fract(vLen * 0.28)) * smoothstep(0.035, 0.0, abs(x - 0.0));
    col += vec3(0.9, 0.85, 1.0) * dash * 0.9;
    // faint cross ribs so speed reads
    col += neon * smoothstep(0.06, 0.0, abs(fract(vLen * 0.5) - 0.5)) * 0.06 * (1.0 - x);
    // the headlights' pool on the deck in front of the car
    vec3 d = vW - uCar;
    float fwd = dot(d, uCarDir);
    float side = length(d - uCarDir * fwd);
    float pool = smoothstep(1.5, 3.5, fwd) * exp(-fwd * 0.22) * exp(-side * side * 0.9);
    col += vec3(1.0, 0.9, 0.7) * pool * 0.35;
    alpha += pool * 0.3;
    // brake/under glow just behind
    col += vec3(1.0, 0.1, 0.25) * exp(-dot(d, d) * 0.35) * 0.6;
    float f = 1.0 - exp(-uFogD * uFogD * vDepth * vDepth);
    gl_FragColor = vec4(mix(col, uFog, f), clamp(alpha, 0.0, 1.0) * (1.0 - f * 0.6));
  }
`

function Road() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const geo = useMemo(() => {
    const SEG = 900
    const W = 1.9
    const pos = new Float32Array((SEG + 1) * 6)
    const uv = new Float32Array((SEG + 1) * 4)
    const len = new Float32Array((SEG + 1) * 2)
    const idx: number[] = []
    const p = new THREE.Vector3()
    const t = new THREE.Vector3()
    const r = new THREE.Vector3()
    const prev = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    let L = 0
    for (let i = 0; i <= SEG; i++) {
      const u = ROAD_SPAN[0] + ((ROAD_SPAN[1] - ROAD_SPAN[0]) * i) / SEG
      road.getPoint(u, p)
      road.getTangent(u, t)
      r.crossVectors(t, up).normalize()
      if (i) L += p.distanceTo(prev)
      prev.copy(p)
      pos.set([p.x - r.x * W, p.y - 0.02, p.z - r.z * W, p.x + r.x * W, p.y - 0.02, p.z + r.z * W], i * 6)
      uv.set([0, i / SEG, 1, i / SEG], i * 4)
      len.set([L, L], i * 2)
      if (i < SEG) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2))
    g.setAttribute("aLen", new THREE.BufferAttribute(len, 1))
    g.setIndex(idx)
    return g
  }, [])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCar: { value: new THREE.Vector3() },
      uCarDir: { value: new THREE.Vector3(0, 0, -1) },
      uSpeed: { value: 0 },
      uFog: { value: new THREE.Color(FOG_COLOR) },
      uFogD: { value: FOG_DENSITY },
    }),
    [],
  )
  useFrame(({ clock }) => {
    const u = mat.current?.uniforms
    if (!u) return
    const c = carAt(live.scroll)
    u.uTime.value = clock.elapsedTime
    u.uCar.value.copy(c.pos)
    u.uCarDir.value.copy(c.dir)
    u.uSpeed.value = c.speed
  })
  return (
    <mesh geometry={geo} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={roadV} fragmentShader={roadF} uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

// ── The car ────────────────────────────────────────────────────────────
const beamF = /* glsl */ `
  varying vec2 vUv;
  void main() {
    // vUv.y: 0 at the lamp → 1 at the far end of the cone
    float a = pow(1.0 - vUv.y, 2.6) * 0.22;
    gl_FragColor = vec4(vec3(1.0, 0.93, 0.78) * a, a);
  }
`
const beamV = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

function Car() {
  const g = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const trails = useRef<THREE.Group>(null)
  const look = useMemo(() => new THREE.Vector3(), [])
  const sm = useMemo(() => ({ speed: 0 }), [])
  useFrame(({ clock }, dt) => {
    if (!g.current) return
    const c = carAt(live.scroll)
    g.current.position.copy(c.pos)
    look.copy(c.pos).add(c.dir)
    g.current.lookAt(look)
    sm.speed += (Math.min(1, Math.abs(c.speed) * 0.5) - sm.speed) * Math.min(1, dt * 6)
    const t = clock.elapsedTime
    if (body.current) {
      // idle shiver, squat under acceleration
      body.current.position.y = Math.sin(t * 38) * 0.004 + Math.sin(t * 2.1) * 0.006
      body.current.rotation.x = -sm.speed * 0.025
    }
    if (trails.current) {
      trails.current.scale.z = 0.05 + sm.speed * 1
      trails.current.visible = sm.speed > 0.02
    }
  })
  return (
    <group ref={g}>
      {/* lookAt points +Z at the target, so everything below is built facing +Z */}
      <group ref={body}>
        <Suspense fallback={null}>
          <Model url="/models/alfa.glb" height={1.02} rotationY={CAR_YAW} />
        </Suspense>
      </group>
      {/* headlight cones */}
      {[-0.52, 0.52].map((x) => (
        <mesh key={x} position={[x, 0.5, 2.0 + 4.5]} rotation-x={-Math.PI / 2 - 0.03}>
          <coneGeometry args={[1.5, 9, 20, 1, true]} />
          <shaderMaterial vertexShader={beamV} fragmentShader={beamF} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
      {[-0.52, 0.52].map((x) => (
        <mesh key={x} position={[x, 0.5, 2.02]}>
          <sphereGeometry args={[0.09, 12, 8]} />
          <meshBasicMaterial color={[6, 5.2, 3.6]} toneMapped={false} />
        </mesh>
      ))}
      {/* tail lights + light trails that stretch with speed */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.56, -2.08]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshBasicMaterial color={[6, 0.4, 0.5]} toneMapped={false} />
        </mesh>
      ))}
      <group ref={trails} position={[0, 0.56, -2.1]}>
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0, -5]} rotation-x={Math.PI / 2}>
            <planeGeometry args={[0.07, 10]} />
            <shaderMaterial
              vertexShader={beamV}
              fragmentShader={`varying vec2 vUv; void main(){ float a = pow(vUv.y, 2.0); gl_FragColor = vec4(vec3(1.0, 0.08, 0.2) * a * 3.0, a); }`}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function Drive() {
  return (
    <>
      <Road />
      <Car />
    </>
  )
}
