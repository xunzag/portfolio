"use client"

import { Suspense, useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useAnimations, useGLTF } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"
import { clamp01, easeInOutSine, local } from "@/lib/acts"
import { live } from "../live"
import { view } from "./view"

useGLTF.preload("/models/guts.glb")

// Act IV — the Eclipse. The one real 3D set piece: Guts on black stone under a
// burning eclipse, the Brand glowing at his feet. The camera drifts down from
// the sky to stand beside him while you read the contact section.

const ECLIPSE = new THREE.Vector3(7, 10, -48)

type Key = [t: number, pos: [number, number, number], look: [number, number, number], fov: number]
const KEYS: Key[] = [
  [0.0, [0.4, 7.5, 14], [2, 7, -40], 38],
  [0.12, [0.0, 3.2, 10], [1.2, 3.5, -20], 40],
  [0.5, [-2.6, 1.7, 7.2], [0.9, 1.5, 0], 38],
  [1.0, [2.2, 1.35, 5.6], [-1.15, 1.45, 0], 36],
]
const tmp = { p: new THREE.Vector3(), l: new THREE.Vector3(), a: new THREE.Vector3(), b: new THREE.Vector3() }

function cameraAt(t: number, cam: THREE.PerspectiveCamera, mx: number, my: number) {
  let j = 0
  while (j < KEYS.length - 2 && t >= KEYS[j + 1][0]) j++
  const A = KEYS[j]
  const B = KEYS[j + 1]
  const u = easeInOutSine(clamp01((t - A[0]) / (B[0] - A[0])))
  tmp.p.lerpVectors(tmp.a.fromArray(A[1]), tmp.b.fromArray(B[1]), u)
  tmp.l.lerpVectors(tmp.a.fromArray(A[2]), tmp.b.fromArray(B[2]), u)
  tmp.p.x += mx * 0.35
  tmp.p.y += my * 0.2
  cam.position.copy(tmp.p)
  cam.lookAt(tmp.l)
  const fov = A[3] + (B[3] - A[3]) * u
  if (Math.abs(cam.fov - fov) > 0.01) {
    cam.fov = fov
    cam.updateProjectionMatrix()
  }
}

export function Finale() {
  const group = useRef<THREE.Group>(null)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  useFrame(() => {
    const v = view(live.scroll)
    const on = v.finale > 0.001
    if (group.current) group.current.visible = on
    if (on) {
      cameraAt(local(live.scroll, "finale"), camera, live.mouse.sx, live.mouse.sy)
    } else if (camera.position.lengthSq() > 0 || camera.fov !== 45) {
      // the paintings and particles expect a neutral camera
      camera.position.set(0, 0, 0)
      camera.rotation.set(0, 0, 0)
      camera.fov = 45
      camera.updateProjectionMatrix()
    }
  })
  return (
    <group ref={group} visible={false}>
      <Sky />
      <Eclipse />
      <Ground />
      <Brand />
      <Suspense fallback={null}>
        <Guts />
      </Suspense>
      <hemisphereLight args={["#3a0a12", "#000000", 0.6]} />
      <directionalLight position={[ECLIPSE.x, ECLIPSE.y, ECLIPSE.z]} intensity={2.2} color="#ff3a2a" />
      <directionalLight position={[-3, 4, 8]} intensity={0.55} color="#9db4ff" />
      <pointLight position={[0, 0.3, 0.6]} intensity={5} distance={4} decay={1.6} color="#ff2a10" />
    </group>
  )
}

// ── sky + eclipse ──────────────────────────────────────────────────────
function Sky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uSun: { value: ECLIPSE.clone().normalize() }, uTime: { value: 0 } },
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uSun; uniform float uTime; varying vec3 vDir;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
          void main(){
            vec3 d = normalize(vDir);
            float s = max(0.0, dot(d, uSun));
            float h = clamp(d.y, -0.2, 1.0);
            vec3 c = mix(vec3(0.03, 0.003, 0.006), vec3(0.002, 0.001, 0.003), smoothstep(0.0, 0.4, h));
            vec2 q = vec2(atan(d.x, d.z) * 3.0, d.y * 6.0);
            float cl = noise(q * 2.0 + vec2(uTime * 0.02, 0.0)) * noise(q * 5.0 - vec2(uTime * 0.03, 0.0));
            c += vec3(0.3, 0.02, 0.03) * pow(s, 10.0) * (0.5 + cl);
            c += vec3(0.12, 0.01, 0.015) * cl * smoothstep(0.5, 0.0, h) * 0.5;
            gl_FragColor = vec4(c * 0.3, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [],
  )
  useFrame(({ clock }) => (mat.uniforms.uTime.value = clock.elapsedTime))
  return (
    <mesh material={mat} scale={200} frustumCulled={false} renderOrder={-5}>
      <sphereGeometry args={[1, 32, 16]} />
    </mesh>
  )
}

function Eclipse() {
  const ref = useRef<THREE.Mesh>(null)
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uTime; varying vec2 vUv;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
          void main(){
            vec2 p = (vUv - 0.5) * 2.0;
            float r = length(p);
            float a = atan(p.y, p.x);
            float beat = pow(max(0.0, sin(uTime * 1.9)), 6.0);
            float R = 0.36;
            float ring = exp(-pow((r - R) / (0.012 + beat * 0.008), 2.0));
            float rays = noise(vec2(a * 9.0, r * 4.0 - uTime * 0.5)) * noise(vec2(a * 23.0, uTime * 0.3));
            float corona = exp(-max(0.0, r - R) * 6.0) * (0.35 + rays * 1.2) * step(R, r);
            vec3 col = vec3(2.2, 0.25, 0.12) * ring * (1.0 + beat * 1.2) + vec3(0.7, 0.05, 0.04) * corona;
            float disk = smoothstep(R + 0.004, R - 0.004, r);
            float alpha = max(disk, clamp(ring + corona, 0.0, 1.0)) * smoothstep(1.0, 0.7, r);
            gl_FragColor = vec4(mix(col, vec3(0.0), disk), alpha);
          }`,
      }),
    [],
  )
  useFrame(({ clock, camera }) => {
    mat.uniforms.uTime.value = clock.elapsedTime
    ref.current?.quaternion.copy(camera.quaternion)
  })
  return (
    <mesh ref={ref} position={ECLIPSE} material={mat} renderOrder={-4}>
      <planeGeometry args={[34, 34]} />
    </mesh>
  )
}

// ── black stone ground ─────────────────────────────────────────────────
function Ground() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uTime; varying vec3 vP;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
          void main(){
            vec2 p = vP.xy;
            float r = length(p);
            float n = noise(p * 1.5) * 0.6 + noise(p * 6.0) * 0.4;
            vec3 c = vec3(0.02, 0.012, 0.014) * (0.6 + n);
            // crimson pool of light under him, and the eclipse's glow on wet stone
            c += vec3(0.35, 0.03, 0.02) * exp(-r * 0.9) * (0.8 + 0.2 * sin(uTime * 1.9));
            c += vec3(0.25, 0.02, 0.02) * smoothstep(0.0, -30.0, p.y) * 0.4 * n;
            // cracks of ember light
            float crack = smoothstep(0.03, 0.0, abs(noise(p * 0.9) - 0.5)) * exp(-r * 0.25);
            c += vec3(1.2, 0.2, 0.05) * crack * (0.5 + 0.5 * sin(uTime * 2.0 + r));
            // fade into the dark
            c *= smoothstep(40.0, 6.0, r);
            // contact shadow
            c *= 0.35 + 0.65 * smoothstep(0.2, 1.1, r);
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [],
  )
  useFrame(({ clock }) => (mat.uniforms.uTime.value = clock.elapsedTime))
  return (
    <mesh rotation-x={-Math.PI / 2} material={mat}>
      <circleGeometry args={[60, 64]} />
    </mesh>
  )
}

// The Brand of Sacrifice, burning into the stone under him.
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
      g.moveTo(0, -200)
      g.lineTo(0, 190)
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
    const beat = Math.pow(Math.max(0, Math.sin(clock.elapsedTime * 1.9)), 8)
    mat.current.opacity = 0.45 + beat * 0.55
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0.15]}>
      <planeGeometry args={[3.6, 3.6]} />
      <meshBasicMaterial ref={mat} map={tex} transparent color={[2.4, 1, 1]} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

// ── Guts ───────────────────────────────────────────────────────────────
function Guts() {
  const gltf = useGLTF("/models/guts.glb")
  const root = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.MeshBasicMaterial[]>([])

  const scene = useMemo(() => {
    const s = SkeletonUtils.clone(gltf.scene) as THREE.Group
    // turn him to face the camera's final resting spot
    s.rotation.y = -2.5
    s.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(s)
    s.scale.setScalar(2.7 / (box.max.y - box.min.y))
    s.updateMatrixWorld(true)
    const b2 = new THREE.Box3().setFromObject(s)
    s.position.y -= b2.min.y
    eyes.current = []
    s.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.frustumCulled = false
      const mat = m.material as THREE.MeshStandardMaterial
      if (/ojos/i.test(mat.name)) {
        const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 0.35, 0.25), toneMapped: false, transparent: true, map: mat.map })
        m.material = glow
        eyes.current.push(glow)
      } else {
        mat.envMapIntensity = 0.6
      }
    })
    return s
  }, [gltf.scene])

  const { actions, names } = useAnimations(gltf.animations, scene)
  useEffect(() => {
    const a = names.length ? actions[names[0]] : null
    a?.reset().play()
    return () => void a?.stop()
  }, [actions, names])

  useFrame(({ clock }) => {
    if (!root.current) return
    const t = clock.elapsedTime
    root.current.position.y = Math.sin(t * 1.4) * 0.012
    const pulse = 0.75 + Math.sin(t * 3) * 0.25
    eyes.current.forEach((m) => m.color.setRGB(6 * pulse, 0.35, 0.25))
  })

  return (
    <group ref={root}>
      <primitive object={scene} />
    </group>
  )
}

