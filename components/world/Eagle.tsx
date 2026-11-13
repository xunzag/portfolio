"use client"

import { Suspense, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { PROJECT_VH, RANGES } from "@/lib/chapters"
import { live } from "./live"

useGLTF.preload("/models/eagle.glb")

/** +1 if the model's beak points down +Z in its file, -1 if down -Z */
const NOSE = 1
const SPAN = 2.9

// The mechanical eagle is your guide: it circles over Guts at the start, then
// flies with the camera for the whole journey — surging ahead when you scroll,
// holding station in a corner of the frame when you stop to read.
export function Eagle() {
  return (
    <Suspense fallback={null}>
      <Bird />
    </Suspense>
  )
}

const REST: Record<string, number> = { about: -0.08, facts: 0.75, stack: -0.1, portal: 0.6, life: 0.7, contact: 0.8 }
const PERCH = new THREE.Vector3(5.2, 4.6, -0.5)
const tmp = new THREE.Vector3()

function Bird() {
  const gltf = useGLTF("/models/eagle.glb")
  const flap = useMemo(() => ({ value: 0 }), [])

  // Bake every part into one known space (x = wingspan, y = up), then let the
  // vertex shader bend the wings: the model has no rig, so the flap is procedural.
  const model = useMemo(() => {
    const root = new THREE.Group()
    gltf.scene.updateMatrixWorld(true)
    const box = new THREE.Box3()
    const parts: THREE.Mesh[] = []
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const g = new THREE.BufferGeometry()
      for (const name of ["position", "normal", "uv"] as const) {
        const a = m.geometry.getAttribute(name) as THREE.BufferAttribute | undefined
        if (!a) continue
        const out = new Float32Array(a.count * a.itemSize)
        for (let i = 0; i < a.count; i++) for (let k = 0; k < a.itemSize; k++) out[i * a.itemSize + k] = a.getComponent(i, k)
        g.setAttribute(name, new THREE.BufferAttribute(out, a.itemSize))
      }
      if (m.geometry.index) g.setIndex(m.geometry.index.clone())
      g.applyMatrix4(m.matrixWorld)
      g.computeBoundingBox()
      box.union(g.boundingBox!)
      const mat = (m.material as THREE.MeshStandardMaterial).clone()
      mat.envMapIntensity = 2.2
      // it has to read against a night sky: lift its own glow
      mat.emissiveIntensity = 3
      if (!mat.emissiveMap) mat.emissive = new THREE.Color("#2a1a4a")
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uFlap = flap
        sh.uniforms.uHalf = { value: 1 }
        sh.vertexShader = sh.vertexShader
          .replace("#include <common>", "#include <common>\nuniform float uFlap; uniform float uHalf;")
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
             {
               // hinge at the shoulders; the further out along the wing, the more it swings
               float w = max(abs(transformed.x) / uHalf - 0.12, 0.0);
               float a = uFlap * (0.35 + w * 0.9);
               float r = w * uHalf;
               transformed.y += r * sin(a) - w * w * uHalf * 0.25 * cos(uFlap * 2.0);
               transformed.x -= sign(transformed.x) * r * (1.0 - cos(a));
             }`,
          )
        mat.userData.shader = sh
      }
      const mesh = new THREE.Mesh(g, mat)
      mesh.frustumCulled = false
      parts.push(mesh)
    })
    const half = Math.max(box.max.x, -box.min.x)
    parts.forEach((p) => {
      const m = p.material as THREE.MeshStandardMaterial
      const prev = m.onBeforeCompile
      m.onBeforeCompile = (sh, r) => {
        prev(sh, r)
        sh.uniforms.uHalf.value = half
      }
      root.add(p)
    })
    const c = box.getCenter(new THREE.Vector3())
    root.position.set(-c.x, -c.y, -c.z)
    const wrap = new THREE.Group()
    wrap.add(root)
    wrap.scale.setScalar(SPAN / (half * 2))
    // make the beak point down the group's +Z (what lookAt aims)
    wrap.rotation.y = NOSE > 0 ? 0 : Math.PI
    return wrap
  }, [gltf.scene, flap])

  const g = useRef<THREE.Group>(null)
  const bank = useRef<THREE.Group>(null)
  const st = useMemo(
    () => ({ pos: PERCH.clone(), vel: new THREE.Vector3(), target: new THREE.Vector3(), look: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3(), phase: 0, roll: 0, busy: 0, side: -1, init: false }),
    [],
  )

  useFrame(({ camera, clock }, dt) => {
    if (!g.current) return
    const t = clock.elapsedTime
    const s = live.scroll
    const d = Math.min(dt, 0.05)
    const perched = s < 18

    camera.getWorldDirection(st.fwd)
    st.right.setFromMatrixColumn(camera.matrixWorld, 0)
    st.up.setFromMatrixColumn(camera.matrixWorld, 1)
    if (perched) {
      // before the journey starts it circles high over Guts
      st.target.set(Math.cos(t * 0.45) * 5.2, 4.6 + Math.sin(t * 0.6) * 0.4, Math.sin(t * 0.45) * 5.2 - 0.5)
    } else {
      // a slow figure-of-eight across the top of the frame, a few metres ahead
      // Always in view, never on the content: it holds station in an upper
      // corner of the frame (the side away from the text), and swoops to the
      // middle to lead the way whenever you scroll.
      const moving = Math.abs(live.velocity) > 0.25
      st.busy += ((moving ? 1 : 0) - st.busy) * Math.min(1, d * (moving ? 3 : 1.1))
      const cam = camera as THREE.PerspectiveCamera
      const lead = 13 + st.busy * 3
      const hh = lead * Math.tan((cam.fov * Math.PI) / 360)
      const hw = hh * cam.aspect
      const f = live.frame
      // where along the top edge there's empty sky in each chapter (-1 left … 1 right)
      let side = REST[f.chapter] ?? 0
      if (f.chapter === "work") side = Math.floor((s - RANGES.work[0]) / PROJECT_VH) % 2 === 0 ? -0.8 : 0.8
      st.side += (side - st.side) * Math.min(1, d * 1.2)
      const restX = st.side * Math.max(0, hw - SPAN * 0.75)
      const restY = hh - SPAN * 0.42
      st.target
        .copy(camera.position)
        .addScaledVector(st.fwd, lead)
        .addScaledVector(st.right, restX * (1 - st.busy * 0.75) + Math.sin(t * 0.5) * 0.35)
        .addScaledVector(st.up, restY * (1 - st.busy * 0.35) + Math.sin(t * 0.8) * 0.2)
    }
    if (!st.init) {
      st.pos.copy(st.target)
      st.init = true
    }
    // critically-damped chase, so it glides rather than snaps
    const k = perched ? 3 : 2.2
    st.vel.addScaledVector(st.target.clone().sub(st.pos), k * k * d).multiplyScalar(Math.exp(-2 * k * d))
    // jumping between worlds (the portal) would otherwise leave it far behind
    if (st.pos.distanceTo(st.target) > 60) {
      st.pos.copy(st.target)
      st.vel.set(0, 0, 0)
    }
    st.pos.addScaledVector(st.vel, d)
    if (!perched) {
      // never let it fall far behind, and never let the camera fly through it
      tmp.copy(st.pos).sub(st.target).clampLength(0, 3.5)
      st.pos.copy(st.target).add(tmp)
      const ahead = tmp.copy(st.pos).sub(camera.position).dot(st.fwd)
      if (ahead < 6) st.pos.addScaledVector(st.fwd, 6 - ahead)
    }
    g.current.position.copy(st.pos)
    g.current.position.y += perched ? 0 : Math.sin(t * 1.7) * 0.12

    // face where it's going; when hovering, face the way the camera travels
    const speed = st.vel.length()
    st.look.copy(st.pos)
    if (perched) st.look.addScaledVector(st.vel, 1)
    else st.look.addScaledVector(st.fwd, 1).addScaledVector(st.vel, 0.12)
    g.current.lookAt(st.look)
    if (bank.current) {
      const lateral = st.vel.dot(st.right)
      st.roll += (THREE.MathUtils.clamp(-lateral * 0.12, -0.7, 0.7) - st.roll) * Math.min(1, d * 4)
      bank.current.rotation.z = st.roll
      bank.current.rotation.x = perched ? 0 : THREE.MathUtils.clamp(-st.vel.dot(st.up) * 0.05, -0.4, 0.4)
    }
    // wingbeat: lazy when gliding, urgent when you scroll
    const rate = perched ? 3.4 : 3.2 + Math.min(9, speed * 0.9 + Math.abs(live.velocity) * 0.12)
    st.phase += rate * d
    flap.value = Math.sin(st.phase) * 0.42 + 0.05
  })

  return (
    <group ref={g}>
      <group ref={bank}>
        <primitive object={model} />
        {/* a soft halo so the silhouette never gets lost */}
        <mesh position={[0, 0, -0.3]}>
          <planeGeometry args={[SPAN * 1.5, SPAN * 1.5]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            toneMapped={false}
            vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
            fragmentShader={`varying vec2 vUv; void main(){ float r = length(vUv - 0.5) * 2.0; float a = pow(max(0.0, 1.0 - r), 2.5) * 0.35; gl_FragColor = vec4(vec3(0.55, 0.75, 1.0) * a, a); }`}
          />
        </mesh>
      </group>
    </group>
  )
}
