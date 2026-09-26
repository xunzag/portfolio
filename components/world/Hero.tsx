"use client"

import { Suspense, useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useAnimations, useGLTF } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"
import { local } from "@/lib/chapters"
import { rng } from "@/lib/rng"
import { live } from "./live"

useGLTF.preload("/models/guts.glb")

// Guts, crouched in the rain in the middle of the neon highway.
export function Hero() {
  const key = useRef<THREE.SpotLight>(null)
  const target = useMemo(() => new THREE.Object3D(), [])
  useFrame(({ clock }) => {
    // lightning-ish flicker every few seconds
    const t = clock.elapsedTime % 7
    if (key.current) key.current.intensity = 70 + (t > 6.6 && Math.sin(t * 90) > 0 ? 160 : 0)
  })
  return (
    <group>
      <primitive object={target} position={[0, 0.8, 0]} />
      <Suspense fallback={null}>
        <Guts position={[0, 0, 0]} />
      </Suspense>
      <Brand />
      <Embers />
      {/* key light from above + neon rims from behind */}
      <spotLight
        ref={key}
        target={target}
        position={[1.5, 9, 3]}
        angle={0.42}
        penumbra={0.8}
        intensity={70}
        distance={20}
        decay={1.5}
        color="#ffe2d0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-2.6, 2.2, -2.2]} color="#ff2d6f" intensity={30} distance={8} decay={1.6} />
      <pointLight position={[2.8, 2.6, -1.6]} color="#2dd8ff" intensity={30} distance={8} decay={1.6} />
      <pointLight position={[0, 0.4, 0]} color="#ff3b1f" intensity={6} distance={3} decay={1.8} />
    </group>
  )
}

function Guts(props: import("@react-three/fiber").ThreeElements["group"]) {
  const gltf = useGLTF("/models/guts.glb")
  const root = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Material[]>([])

  const scene = useMemo(() => {
    const s = SkeletonUtils.clone(gltf.scene) as THREE.Group
    // file faces +X; turn him to stare down the highway (-Z)
    s.rotation.y = Math.PI / 2
    s.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(s)
    const k = 2.7 / (box.max.y - box.min.y)
    s.scale.setScalar(k)
    s.updateMatrixWorld(true)
    const b2 = new THREE.Box3().setFromObject(s)
    s.position.y -= b2.min.y
    eyes.current = []
    s.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      m.frustumCulled = false
      const mat = m.material as THREE.MeshStandardMaterial
      if (/ojos/i.test(mat.name)) {
        const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 0.35, 0.25), toneMapped: false, transparent: true, map: mat.map })
        m.material = glow
        eyes.current.push(glow)
      } else {
        mat.envMapIntensity = 1.6
      }
    })
    return s
  }, [gltf.scene])

  const { actions, names } = useAnimations(gltf.animations, scene)
  useEffect(() => {
    const a = names.length ? actions[names[0]] : null
    a?.reset().play()
    return () => {
      a?.stop()
    }
  }, [actions, names])

  useFrame(({ clock }) => {
    if (!root.current) return
    // slow heavy breathing + a lunge forward as you start scrolling
    const t = clock.elapsedTime
    const h = local(live.scroll, "hero")
    root.current.position.y = Math.sin(t * 1.4) * 0.012
    root.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.004)
    root.current.position.z = -h * h * 1.2
    const pulse = 0.75 + Math.sin(t * 3) * 0.25
    eyes.current.forEach((m) => (m as THREE.MeshBasicMaterial).color.setRGB(6 * pulse, 0.35, 0.25))
  })

  return (
    <group {...props}>
      <group ref={root}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

// The Brand, glowing on the wet asphalt under him.
function Brand() {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const tex = useMemo(() => {
    const c = document.createElement("canvas")
    c.width = c.height = 512
    const g = c.getContext("2d")!
    g.translate(256, 256)
    g.strokeStyle = "#ff2a2a"
    g.lineCap = "round"
    g.shadowColor = "#ff0000"
    g.shadowBlur = 30
    const stroke = (w: number) => {
      g.lineWidth = w
      g.beginPath()
      // central stem
      g.moveTo(0, -200)
      g.lineTo(0, 190)
      // three branches on each side, curling upward
      for (const [y, len] of [
        [-40, 150],
        [40, 125],
        [115, 95],
      ]) {
        for (const s of [-1, 1]) {
          g.moveTo(0, y)
          g.quadraticCurveTo(s * len * 0.55, y - 10, s * len, y - 75)
        }
      }
      // hook at the base
      g.moveTo(0, 190)
      g.quadraticCurveTo(-50, 215, -70, 170)
      g.stroke()
    }
    stroke(26)
    g.shadowBlur = 0
    g.strokeStyle = "#ffd0c0"
    stroke(6)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  useFrame(({ clock }) => {
    if (!mat.current) return
    const h = 1 - local(live.scroll, "hero")
    const beat = Math.pow(Math.max(0, Math.sin(clock.elapsedTime * 2.2)), 8)
    mat.current.opacity = (0.55 + beat * 0.45) * Math.max(0.25, h)
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 0.2]} userData={{ noShadow: true }}>
      <planeGeometry args={[4.6, 4.6]} />
      <meshBasicMaterial ref={mat} map={tex} transparent color={[2.2, 1, 1]} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

// Embers drifting up around him (GPU-animated points).
const emberV = /* glsl */ `
  uniform float uTime;
  attribute float aSeed;
  varying float vA;
  void main() {
    vec3 p = position;
    float life = fract(uTime * (0.12 + aSeed * 0.1) + aSeed * 7.0);
    p.y += life * 6.0;
    p.x += sin(uTime * (1.0 + aSeed) + aSeed * 20.0) * 0.35 * life;
    p.z += cos(uTime * 0.8 + aSeed * 11.0) * 0.35 * life;
    vA = sin(life * 3.14159) * (0.6 + 0.4 * sin(uTime * 12.0 + aSeed * 50.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (18.0 + aSeed * 22.0) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`
const emberF = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA;
    gl_FragColor = vec4(vec3(3.0, 1.1, 0.35) * a, a);
  }
`

function Embers() {
  const geo = useMemo(() => {
    const r = rng(66)
    const n = 180
    const pos = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2
      const d = 0.3 + r() * 2.6
      pos.set([Math.cos(a) * d, r() * 0.6, Math.sin(a) * d], i * 3)
      seed[i] = r()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1))
    return g
  }, [])
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame(({ clock }) => (uniforms.uTime.value = clock.elapsedTime))
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial vertexShader={emberV} fragmentShader={emberF} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}
