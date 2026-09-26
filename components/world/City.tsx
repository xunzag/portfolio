"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshReflectorMaterial, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { projects } from "@/lib/content"
import { useRoom } from "@/lib/store"
import { rng } from "../canvas/textures"
import { live } from "./live"
import { ROAD_LENGTH, billboardSide, billboardZ } from "./track"

export const FOG = new THREE.Color("#0b0718")
const Z0 = 30
const Z1 = -ROAD_LENGTH - 90

export function City() {
  return (
    <group>
      <Ground />
      <Road />
      <Buildings />
      <StreetLights />
      <NeonSigns />
      <Billboards />
      <Traffic />
      <Rain />
    </group>
  )
}

// ── Ground + road ─────────────────────────────────────────────────────

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, (Z0 + Z1) / 2]}>
      <planeGeometry args={[400, Z0 - Z1 + 200]} />
      <meshStandardMaterial color="#07060c" roughness={0.9} />
    </mesh>
  )
}

function Road() {
  const quality = useRoom((s) => s.quality)
  const len = Z0 - Z1
  const mid = (Z0 + Z1) / 2
  const dashes = useRef<THREE.InstancedMesh>(null)
  const count = Math.floor(len / 6) * 2

  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    let i = 0
    for (let z = Z0; z > Z1 && i < count; z -= 6) {
      for (const x of [-2.6, 2.6]) {
        o.position.set(x, 0.012, z)
        o.updateMatrix()
        dashes.current!.setMatrixAt(i++, o.matrix)
      }
    }
    dashes.current!.count = i
    dashes.current!.instanceMatrix.needsUpdate = true
  }, [count])

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, mid]}>
        <planeGeometry args={[15.6, len]} />
        {quality === "high" ? (
          <MeshReflectorMaterial
            color="#141220"
            roughness={0.38}
            metalness={0.3}
            blur={[260, 60]}
            resolution={512}
            mixBlur={1.4}
            mixStrength={3.2}
            mirror={0.85}
            depthScale={0.4}
            minDepthThreshold={0.3}
            maxDepthThreshold={1.4}
          />
        ) : (
          <meshStandardMaterial color="#12101c" roughness={0.3} metalness={0.4} />
        )}
      </mesh>
      <instancedMesh ref={dashes} args={[undefined, undefined, count]} rotation-x={0}>
        <boxGeometry args={[0.16, 0.01, 2.6]} />
        <meshBasicMaterial color={[1.4, 1.3, 1.2]} toneMapped={false} />
      </instancedMesh>
      {/* neon curb rails */}
      {[
        [-7.9, [0.2, 2.2, 4.2]],
        [7.9, [4, 0.4, 2.6]],
      ].map(([x, c]) => (
        <mesh key={String(x)} position={[x as number, 0.08, mid]}>
          <boxGeometry args={[0.1, 0.1, len]} />
          <meshBasicMaterial color={c as [number, number, number]} toneMapped={false} />
        </mesh>
      ))}
      {/* sidewalks */}
      {[-10.4, 10.4].map((x) => (
        <mesh key={x} position={[x, 0.12, mid]}>
          <boxGeometry args={[4.8, 0.24, len]} />
          <meshStandardMaterial color="#0e0c16" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ── Buildings: one instanced draw call, windows computed in the shader ──

const bVertex = /* glsl */ `
  attribute float aSeed;
  varying vec3 vWorld;
  varying vec3 vN;
  varying float vSeed;
  varying float vDepth;
  void main() {
    vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
    vSeed = aSeed;
    vec4 mv = viewMatrix * wp;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`
const bFragment = /* glsl */ `
  uniform float uTime;
  uniform float uParty;
  uniform vec3 uFog;
  uniform float uFogDensity;
  varying vec3 vWorld;
  varying vec3 vN;
  varying float vSeed;
  varying float vDepth;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 n = normalize(vN);
    vec3 col = vec3(0.03, 0.026, 0.06);
    if (abs(n.y) < 0.5) {
      vec2 f = abs(n.x) > 0.5 ? vec2(vWorld.z, vWorld.y) : vec2(vWorld.x, vWorld.y);
      vec2 cell = f / vec2(1.5, 2.1);
      vec2 id = floor(cell);
      vec2 g = fract(cell);
      float win = step(0.16, g.x) * step(g.x, 0.84) * step(0.22, g.y) * step(g.y, 0.78);
      float h = hash(mod(id, vec2(89.0, 97.0)) + floor(vSeed * 50.0));
      float lit = step(0.6, h);
      float blink = step(0.015, fract(h * 91.7 + uTime * 0.03 * step(0.985, h)));
      vec3 wc = mix(vec3(1.0, 0.7, 0.38), vec3(0.45, 0.72, 1.0), step(0.78, fract(h * 13.0)));
      wc = mix(wc, vec3(1.0, 0.28, 0.85), step(0.92, fract(h * 7.0)));
      wc = mix(wc, 0.5 + 0.5 * cos(6.2831 * (uTime * 0.4 + h + vec3(0.0, 0.33, 0.67))), uParty);
      col += win * lit * blink * wc * 1.25;
      col += win * (1.0 - lit) * vec3(0.03, 0.035, 0.07);
      col *= 0.6 + 0.4 * smoothstep(0.0, 50.0, vWorld.y);
    }
    // neon spill from the street
    col += vec3(0.55, 0.12, 0.7) * exp(-vWorld.y * 0.22) * 0.22;
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth);
    col = mix(col, uFog, fog);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

function Buildings() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const { matrices, seeds } = useMemo(() => {
    const r = rng(1337)
    const list: THREE.Matrix4[] = []
    const o = new THREE.Object3D()
    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        let z = Z0 + 10
        while (z > Z1 - 40) {
          const w = 7 + r() * 9
          const d = 7 + r() * 9
          const near = row === 0
          const h = near ? 12 + r() * 30 : 25 + r() * (row === 1 ? 55 : 85)
          const x = side * (15.5 + row * 17 + r() * 3 + w / 2)
          o.position.set(x, 0, z - d / 2)
          o.scale.set(w, h, d)
          o.updateMatrix()
          list.push(o.matrix.clone())
          z -= d + 1.5 + r() * 4
        }
      }
    }
    // the far skyline beyond the end of the road
    for (let i = 0; i < 40; i++) {
      const w = 10 + r() * 14
      o.position.set(-120 + i * 6.2 + r() * 3, 0, Z1 - 60 - r() * 60)
      o.scale.set(w, 40 + r() * 120, w)
      o.updateMatrix()
      list.push(o.matrix.clone())
    }
    return { matrices: list, seeds: new Float32Array(list.map(() => r())) }
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1)
    g.translate(0, 0.5, 0)
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1))
    return g
  }, [seeds])

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uParty: { value: 0 }, uFog: { value: FOG }, uFogDensity: { value: 0.0105 } }),
    [],
  )

  useLayoutEffect(() => {
    matrices.forEach((m, i) => ref.current!.setMatrixAt(i, m))
    ref.current!.instanceMatrix.needsUpdate = true
    ref.current!.computeBoundingSphere()
  }, [matrices])

  useFrame(({ clock }, dt) => {
    uniforms.uTime.value = clock.elapsedTime
    const target = useRoom.getState().party ? 1 : 0
    uniforms.uParty.value += (target - uniforms.uParty.value) * Math.min(1, dt * 3)
  })

  return (
    <instancedMesh ref={ref} args={[geo, undefined, matrices.length]} frustumCulled={false}>
      <shaderMaterial vertexShader={bVertex} fragmentShader={bFragment} uniforms={uniforms} />
    </instancedMesh>
  )
}

// ── Street lights ─────────────────────────────────────────────────────

function StreetLights() {
  const poles = useRef<THREE.InstancedMesh>(null)
  const heads = useRef<THREE.InstancedMesh>(null)
  const spots = useMemo(() => {
    const out: [number, number][] = []
    for (let z = Z0 - 5; z > Z1; z -= 18) out.push([-8.9, z], [8.9, z - 9])
    return out
  }, [])
  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    spots.forEach(([x, z], i) => {
      o.position.set(x, 3.2, z)
      o.scale.set(1, 1, 1)
      o.updateMatrix()
      poles.current!.setMatrixAt(i, o.matrix)
      o.position.set(x - Math.sign(x) * 1.1, 6.35, z)
      o.updateMatrix()
      heads.current!.setMatrixAt(i, o.matrix)
    })
    poles.current!.instanceMatrix.needsUpdate = true
    heads.current!.instanceMatrix.needsUpdate = true
  }, [spots])
  return (
    <group>
      <instancedMesh ref={poles} args={[undefined, undefined, spots.length]} frustumCulled={false}>
        <cylinderGeometry args={[0.07, 0.1, 6.4, 8]} />
        <meshStandardMaterial color="#1a1826" metalness={0.8} roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, spots.length]} frustumCulled={false}>
        <boxGeometry args={[2.4, 0.1, 0.35]} />
        <meshBasicMaterial color={[2.2, 1.6, 1.1]} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

// ── Neon signs (canvas-drawn kanji, flickering) ───────────────────────

const SIGNS = [
  { text: "開発者", color: "#ff3fd0" },
  { text: "ネオン", color: "#3fd8ff" },
  { text: "コード", color: "#ffb13f" },
  { text: "夜の街", color: "#9d7bff" },
  { text: "ラーメン", color: "#ff5a5a" },
  { text: "未来", color: "#3fffb0" },
  { text: "東京", color: "#ff3fd0" },
  { text: "電脳", color: "#3fd8ff" },
]

function signTexture(text: string, color: string) {
  const c = document.createElement("canvas")
  c.width = 128
  c.height = 512
  const g = c.getContext("2d")!
  g.fillStyle = "rgba(10,6,20,0.85)"
  g.fillRect(0, 0, 128, 512)
  g.strokeStyle = color
  g.lineWidth = 6
  g.shadowColor = color
  g.shadowBlur = 18
  g.strokeRect(8, 8, 112, 496)
  g.fillStyle = "#fff"
  g.font = "700 92px 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', sans-serif"
  g.textAlign = "center"
  g.textBaseline = "middle"
  const chars = [...text]
  const step = 480 / chars.length
  chars.forEach((ch, i) => {
    g.shadowBlur = 24
    g.fillText(ch, 64, 16 + step * (i + 0.5))
  })
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function NeonSigns() {
  const list = useMemo(() => {
    const r = rng(99)
    const out: { pos: [number, number, number]; rot: number; tex: THREE.Texture; phase: number }[] = []
    for (let i = 0; i < 18; i++) {
      const s = SIGNS[i % SIGNS.length]
      const side = i % 2 ? 1 : -1
      out.push({
        pos: [side * 15.3, 6 + r() * 12, 10 - i * 14 - r() * 6],
        rot: side < 0 ? Math.PI / 2 : -Math.PI / 2,
        tex: signTexture(s.text, s.color),
        phase: r() * 10,
      })
    }
    return out
  }, [])
  const mats = useRef<THREE.MeshBasicMaterial[]>([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    mats.current.forEach((m, i) => {
      const p = list[i].phase
      const flick = (t + p) % 9 < 0.3 && Math.sin(t * 60 + p) > 0 ? 0.3 : 1
      m.color.setScalar(1.8 * flick)
    })
  })
  return (
    <group>
      {list.map((s, i) => (
        <group key={i} position={s.pos} rotation-y={s.rot}>
          <mesh>
            <planeGeometry args={[1.8, 7.2]} />
            <meshBasicMaterial
              ref={(m) => {
                if (m) mats.current[i] = m
              }}
              map={s.tex}
              toneMapped={false}
              transparent
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Holographic project billboards ────────────────────────────────────

const holoVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const holoFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec3 uAccent;
  uniform float uActive;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float glitch = step(0.985, fract(sin(floor(uTime * 12.0)) * 43758.5)) * 0.02;
    uv.x += glitch * sin(uv.y * 80.0);
    vec3 img = vec3(
      texture2D(uMap, uv + vec2(0.002, 0.0)).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, uv - vec2(0.002, 0.0)).b
    );
    float scan = 0.88 + 0.12 * sin(uv.y * 700.0 + uTime * 6.0);
    float sweep = smoothstep(0.03, 0.0, abs(fract(uv.y - uTime * 0.25) - 0.5)) * 0.25;
    vec2 e = min(uv, 1.0 - uv);
    float edge = smoothstep(0.03, 0.0, min(e.x, e.y));
    vec3 col = img * scan * (0.9 + 0.35 * uActive) + uAccent * (sweep + edge * 1.6);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

function Billboards() {
  const textures = useTexture(projects.map((p) => p.image))
  const mats = useRef<THREE.ShaderMaterial[]>([])
  useFrame(({ clock }) => {
    const current = useRoom.getState().project
    const inWork = useRoom.getState().chapter === "work"
    mats.current.forEach((m, i) => {
      m.uniforms.uTime.value = clock.elapsedTime + i
      const target = inWork && i === current ? 1 : 0
      m.uniforms.uActive.value += (target - m.uniforms.uActive.value) * 0.08
    })
  })
  return (
    <group>
      {projects.map((p, i) => {
        const side = billboardSide(i)
        const z = billboardZ(i, projects.length)
        const ry = side < 0 ? Math.PI / 2 - 0.5 : -(Math.PI / 2 - 0.5)
        textures[i].colorSpace = THREE.SRGBColorSpace
        return (
          <group key={p.slug} position={[side * 11.8, 0, z]} rotation-y={ry}>
            {[-3.6, 3.6].map((x) => (
              <mesh key={x} position={[x, 3.5, -0.3]}>
                <boxGeometry args={[0.3, 7, 0.3]} />
                <meshStandardMaterial color="#1a1826" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
            <mesh position={[0, 9.6, -0.15]}>
              <boxGeometry args={[9.8, 5.8, 0.25]} />
              <meshStandardMaterial color="#0c0a14" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, 9.6, 0]}>
              <planeGeometry args={[9.4, 5.3]} />
              <shaderMaterial
                ref={(m) => {
                  if (m) mats.current[i] = m
                }}
                vertexShader={holoVertex}
                fragmentShader={holoFragment}
                uniforms={{ uMap: { value: textures[i] }, uTime: { value: 0 }, uAccent: { value: new THREE.Color(p.accent) }, uActive: { value: 0 } }}
                toneMapped={false}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ── Traffic: streaks of head/tail lights in both directions ───────────

function Traffic() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const cars = useMemo(() => {
    const r = rng(7)
    return Array.from({ length: 70 }, (_, i) => {
      const lane = [-5.4, -2.2, 2.2, 5.4][i % 4]
      const toward = lane < 0 // left lanes drive towards the camera (headlights)
      return { lane, z: Z0 - r() * (Z0 - Z1), speed: (toward ? 1 : -1) * (26 + r() * 22), toward }
    })
  }, [])
  useLayoutEffect(() => {
    const c = new THREE.Color()
    cars.forEach((car, i) => {
      ref.current!.setColorAt(i, car.toward ? c.setRGB(2.6, 2.5, 2.3) : c.setRGB(3.2, 0.25, 0.3))
    })
    ref.current!.instanceColor!.needsUpdate = true
  }, [cars])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    const camZ = live.frame.pos.z
    cars.forEach((car, i) => {
      car.z += car.speed * dt
      // wrap traffic in a window around the camera
      if (car.z > camZ + 60) car.z -= 260
      if (car.z < camZ - 200) car.z += 260
      o.position.set(car.lane, 0.35, car.z)
      o.scale.set(1, 1, 1)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cars.length]} frustumCulled={false}>
      <boxGeometry args={[0.14, 0.05, 6]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.9} />
    </instancedMesh>
  )
}

// ── Rain: GPU-animated streaks that follow the camera ─────────────────

const rainVertex = /* glsl */ `
  attribute float aEnd;
  uniform float uTime;
  uniform vec3 uCam;
  varying float vA;
  void main() {
    vec3 p = position;
    float speed = 38.0 + fract(p.x * 13.7) * 16.0;
    p.y = mod(p.y - uTime * speed, 40.0) - 4.0;
    p.x = uCam.x + mod(p.x - uCam.x + 40.0, 80.0) - 40.0;
    p.z = uCam.z + mod(p.z - uCam.z + 60.0, 120.0) - 60.0;
    p.y += uCam.y * 0.0;
    p.y -= aEnd * 0.9;
    p.x -= aEnd * 0.12;
    vA = 1.0 - aEnd;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  }
`
const rainFragment = /* glsl */ `
  varying float vA;
  void main() { gl_FragColor = vec4(vec3(0.7, 0.75, 1.0), 0.28 * vA); }
`

function Rain() {
  const count = useRoom((s) => (s.quality === "high" ? 3500 : 1500))
  const geo = useMemo(() => {
    const r = rng(3)
    const pos = new Float32Array(count * 6)
    const end = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      const x = r() * 80 - 40
      const y = r() * 40
      const z = r() * 120 - 60
      pos.set([x, y, z, x, y, z], i * 6)
      end.set([0, 1], i * 2)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    g.setAttribute("aEnd", new THREE.BufferAttribute(end, 1))
    return g
  }, [count])
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uCam: { value: new THREE.Vector3() } }), [])
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uCam.value.copy(live.frame.pos)
  })
  return (
    <lineSegments geometry={geo} frustumCulled={false}>
      <shaderMaterial vertexShader={rainVertex} fragmentShader={rainFragment} uniforms={uniforms} transparent depthWrite={false} />
    </lineSegments>
  )
}
