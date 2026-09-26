"use client"

import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { RoundedBoxGeometry } from "three-stdlib"
import { easing } from "maath"
import gsap from "gsap"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { projects } from "@/lib/content"
import { Hotspot } from "./Hotspot"
import { useMat } from "./materials"
import { createScreen, phoneTexture } from "./textures"
import { BlobShadow } from "./Extras"
import { live } from "../world/live"
import { zones } from "../world/track"

export function Desk() {
  const m = useMat()
  return (
    <group>
      {/* desk: thick walnut slab on dark steel frame */}
      <RoundedBox args={[4.4, 0.1, 1.7]} radius={0.035} smoothness={4} position={[0.5, 1.5, -4.2]} material={m.walnut} castShadow receiveShadow />
      {[-1.55, 2.55].map((x) => (
        <group key={x} position={[x, 0, -4.2]}>
          {/* sled-style legs */}
          <mesh position={[0, 0.72, 0.62]} material={m.darkMetal} castShadow>
            <boxGeometry args={[0.07, 1.44, 0.07]} />
          </mesh>
          <mesh position={[0, 0.72, -0.62]} material={m.darkMetal} castShadow>
            <boxGeometry args={[0.07, 1.44, 0.07]} />
          </mesh>
          <mesh position={[0, 0.035, 0]} material={m.darkMetal}>
            <boxGeometry args={[0.07, 0.07, 1.3]} />
          </mesh>
          <mesh position={[0, 1.4, 0]} material={m.darkMetal}>
            <boxGeometry args={[0.07, 0.07, 1.3]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.5, 1.4, -4.85]} material={m.darkMetal}>
        <boxGeometry args={[4.1, 0.07, 0.07]} />
      </mesh>
      {/* felt desk mat */}
      <RoundedBox args={[2.8, 0.012, 1.0]} radius={0.006} position={[0.55, 1.556, -3.85]} receiveShadow>
        <meshStandardMaterial color="#17142e" roughness={1} normalMap={m.fabric.normalMap!} />
      </RoundedBox>

      <Monitor />
      <Hotspot id="keyboard" label="Terminal" hint="ctrl + `" labelPosition={[0.5, 1.9, -3.72]} onActivate={() => useRoom.getState().setTerminal(true)}>
        <Keyboard />
      </Hotspot>
      <Mouse />
      <Mug />
      <Hotspot id="lamp" label="Lights" hint="click" labelPosition={[-1.1, 3.1, -4.35]} onActivate={() => useRoom.getState().toggleLights()}>
        <Lamp />
      </Hotspot>
      <Hotspot id="contact" label="Contact" hint="5" labelPosition={[2.25, 2.4, -3.8]}>
        <Phone />
      </Hotspot>
      <Headphones />
      <Chair />
    </group>
  )
}

// ── Monitor ──────────────────────────────────────────────────────────

function Monitor() {
  const m = useMat()
  const screen = useMemo(() => createScreen(), [])
  const images = useRef<HTMLImageElement[]>([])
  const state = useRef({ key: "", reveal: 1 })
  const glow = useRef<THREE.MeshBasicMaterial>(null)

  useEffect(() => {
    images.current = projects.map((p) => {
      const img = new Image()
      img.src = p.image
      return img
    })
    return () => screen.texture.dispose()
  }, [screen])

  useFrame(({ clock }, dt) => {
    if (!zones(live.scroll).room) return
    const { focus, project, party } = useRoom.getState()
    const st = state.current
    if (focus === "work") {
      const img = images.current[project]
      const key = `p${project}`
      if (st.key !== key) {
        st.key = key
        st.reveal = 0
      }
      if (img?.complete && img.naturalWidth && st.reveal <= 1) {
        const p = projects[project]
        st.reveal = Math.min(1.0001, st.reveal + dt * 2.4)
        screen.paintImage(img, (p.links.live ?? p.links.github ?? "").replace(/^https?:\/\//, ""), p.accent, Math.min(st.reveal, 1))
      }
    } else {
      st.key = ""
      screen.paintCode(dt)
    }
    if (glow.current) {
      if (party) glow.current.color.setHSL((clock.elapsedTime * 0.5) % 1, 1, 0.5).multiplyScalar(2)
      else glow.current.color.setRGB(0.45, 0.8, 2.2)
    }
  })

  return (
    <Hotspot id="work" label="Projects" hint="1" labelPosition={[0.65, 3.6, -4.5]}>
      <group position={[0.65, 0, -4.62]}>
        {/* aluminium stand */}
        <RoundedBox args={[0.75, 0.025, 0.45]} radius={0.012} position={[0, 1.57, 0.08]} material={m.aluminium} castShadow />
        <RoundedBox args={[0.14, 0.9, 0.04]} radius={0.015} position={[0, 2.0, -0.08]} rotation-x={-0.08} material={m.aluminium} castShadow />
        {/* thin-bezel panel */}
        <RoundedBox args={[2.78, 1.52, 0.06]} radius={0.02} smoothness={4} position={[0, 2.62, 0]} material={m.plasticBlack} castShadow />
        <mesh position={[0, 2.625, 0.031]}>
          <planeGeometry args={[2.7, 1.44]} />
          <meshBasicMaterial map={screen.texture} toneMapped={false} />
        </mesh>
        {/* glossy glass layer picks up environment reflections */}
        <mesh position={[0, 2.625, 0.033]} material={m.screenGlass}>
          <planeGeometry args={[2.7, 1.44]} />
        </mesh>
        {/* bias lighting */}
        <mesh position={[0, 2.62, -0.05]} userData={{ noShadow: true }}>
          <planeGeometry args={[3.1, 1.8]} />
          <meshBasicMaterial ref={glow} transparent opacity={0.22} toneMapped={false} />
        </mesh>
      </group>
    </Hotspot>
  )
}

// ── Keyboard: rounded caps + RGB bleeding from underneath ─────────────

const keyGeo = new RoundedBoxGeometry(0.082, 0.04, 0.082, 2, 0.012)

function Keyboard() {
  const m = useMat()
  const caps = useRef<THREE.InstancedMesh>(null)
  const glow = useRef<THREE.InstancedMesh>(null)
  const color = useMemo(() => new THREE.Color(), [])
  const pulse = useRef(0)
  const layout = useMemo(() => {
    const out: [number, number, number][] = [] // col, row, width
    for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) out.push([c, r, 1])
    return out
  }, [])

  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    layout.forEach(([c, r], i) => {
      o.position.set(-0.66 + c * 0.1 + (r % 2) * 0.02, 0.05, -0.15 + r * 0.1)
      o.updateMatrix()
      caps.current!.setMatrixAt(i, o.matrix)
      o.position.y = 0.03
      o.scale.set(1.25, 0.2, 1.25)
      o.updateMatrix()
      glow.current!.setMatrixAt(i, o.matrix)
      o.scale.set(1, 1, 1)
    })
    caps.current!.instanceMatrix.needsUpdate = true
    glow.current!.instanceMatrix.needsUpdate = true
  }, [layout])

  // a ripple runs across the keys whenever the selected project changes
  useEffect(() => useRoom.subscribe((s, p) => s.project !== p.project && (pulse.current = 1)), [])

  useFrame(({ clock }, dt) => {
    if (!glow.current || !zones(live.scroll).room) return
    const { party } = useRoom.getState()
    const t = clock.elapsedTime
    pulse.current = Math.max(0, pulse.current - dt * 1.5)
    layout.forEach(([c, r], i) => {
      const hue = (c * 0.04 + r * 0.03 - t * (party ? 0.6 : 0.1)) % 1
      const ripple = pulse.current * Math.max(0, 1 - Math.abs(c - (1 - pulse.current) * 14) / 2)
      color.setHSL((hue + 1) % 1, 0.9, 0.5).multiplyScalar(1.4 + ripple * 3 + (party ? 1 : 0))
      glow.current!.setColorAt(i, color)
    })
    glow.current.instanceColor!.needsUpdate = true
  })

  return (
    <group position={[0.45, 1.56, -3.72]}>
      <RoundedBox args={[1.52, 0.045, 0.52]} radius={0.018} material={m.aluminium} castShadow receiveShadow />
      <instancedMesh ref={glow} args={[keyGeo, undefined, layout.length]} userData={{ noShadow: true }}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={caps} args={[keyGeo, m.plasticBlack, layout.length]} castShadow />
      <mesh position={[0, 0.05, 0.25]} material={m.plasticBlack} castShadow>
        <primitive object={new RoundedBoxGeometry(0.6, 0.04, 0.082, 2, 0.012)} attach="geometry" />
      </mesh>
    </group>
  )
}

function Mouse() {
  const m = useMat()
  return (
    <group position={[1.6, 1.56, -3.65]}>
      <RoundedBox args={[0.55, 0.008, 0.48]} radius={0.004} receiveShadow>
        <meshStandardMaterial color="#231e44" roughness={1} normalMap={m.fabric.normalMap!} />
      </RoundedBox>
      <mesh position={[0, 0.035, 0]} scale={[0.6, 0.32, 1]} material={m.plasticWhite} castShadow>
        <sphereGeometry args={[0.1, 32, 24]} />
      </mesh>
      <mesh position={[0, 0.066, -0.05]}>
        <boxGeometry args={[0.01, 0.01, 0.045]} />
        <meshBasicMaterial color={[0.4, 1.8, 2.4]} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Mug() {
  const m = useMat()
  const puffs = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const g = puffs.current
    if (!g) return
    g.children.forEach((c, i) => {
      const t = (clock.elapsedTime * 0.3 + i / g.children.length) % 1
      c.position.set(Math.sin(t * 6 + i) * 0.05 * t, t * 0.6, Math.cos(t * 5 + i) * 0.04 * t)
      c.scale.setScalar(0.03 + t * 0.09)
      ;((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.16
    })
  })
  const profile = useMemo(
    () => [new THREE.Vector2(0, 0), new THREE.Vector2(0.105, 0), new THREE.Vector2(0.115, 0.02), new THREE.Vector2(0.12, 0.26), new THREE.Vector2(0.11, 0.26), new THREE.Vector2(0.105, 0.03), new THREE.Vector2(0, 0.03)],
    [],
  )
  return (
    <group position={[-0.95, 1.556, -3.7]}>
      <mesh material={m.ceramic} castShadow>
        <latheGeometry args={[profile, 40]} />
      </mesh>
      <mesh position={[0, 0.215, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.106, 32]} />
        <meshPhysicalMaterial color="#2a140a" roughness={0.05} clearcoat={1} />
      </mesh>
      <mesh position={[0.125, 0.14, 0]} material={m.ceramic} castShadow>
        <torusGeometry args={[0.06, 0.016, 12, 24, Math.PI]} />
      </mesh>
      <group ref={puffs} position={[0, 0.25, 0]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} userData={{ noShadow: true }}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshBasicMaterial color="#ffffff" transparent depthWrite={false} opacity={0} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ── Lamp: a Pixar-style desk lamp whose head follows your cursor ──────

function Lamp() {
  const m = useMat()
  const bulb = useRef<THREE.MeshBasicMaterial>(null)
  const light = useRef<THREE.SpotLight>(null)
  const head = useRef<THREE.Group>(null)
  const target = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock, pointer }, dt) => {
    const { lightsOn, party, focus, phase } = useRoom.getState()
    const on = lightsOn ? 1 : 0
    if (light.current) {
      easing.damp(light.current, "intensity", on * 28, 0.12, dt)
      if (party) light.current.color.setHSL((clock.elapsedTime * 0.6) % 1, 1, 0.6)
      else light.current.color.set("#ffc27a")
    }
    if (bulb.current) bulb.current.color.setRGB(4 * on + 0.15, 2.8 * on + 0.12, 1.4 * on + 0.1)
    if (head.current) {
      const track = phase === "room" && !focus
      easing.damp(head.current.rotation, "y", track ? -pointer.x * 0.7 : 0, 0.25, dt)
      easing.damp(head.current.rotation, "z", 0.35 + (track ? pointer.y * 0.35 : 0) + Math.sin(clock.elapsedTime * 0.8) * 0.02, 0.25, dt)
    }
  })

  return (
    <group position={[-1.3, 1.556, -4.5]}>
      <mesh position={[0, 0.03, 0]} material={m.darkMetal} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.06, 32]} />
      </mesh>
      <mesh position={[0.1, 0.45, 0]} rotation-z={-0.35} material={m.darkMetal} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.9, 12]} />
      </mesh>
      <mesh position={[0.25, 0.86, 0]} material={m.brass}>
        <sphereGeometry args={[0.04, 16, 12]} />
      </mesh>
      <group position={[0.25, 0.86, 0]}>
        <mesh position={[0.3, 0.12, 0]} rotation-z={-1.2} material={m.darkMetal} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 12]} />
        </mesh>
        <group ref={head} position={[0.62, 0.24, 0]}>
          <mesh material={m.brass}>
            <sphereGeometry args={[0.035, 12, 10]} />
          </mesh>
          <group rotation-z={Math.PI * 0.85}>
            <mesh castShadow>
              <coneGeometry args={[0.18, 0.28, 32, 1, true]} />
              <meshPhysicalMaterial color="#ffb547" side={THREE.DoubleSide} metalness={0.3} roughness={0.35} clearcoat={0.8} />
            </mesh>
            <mesh position={[0, 0.02, 0]} userData={{ noShadow: true }}>
              <sphereGeometry args={[0.07, 20, 16]} />
              <meshBasicMaterial ref={bulb} toneMapped={false} />
            </mesh>
            <primitive object={target} position={[0, -2, 0]} />
            <spotLight ref={light} target={target} position={[0, 0.02, 0]} angle={0.75} penumbra={0.8} distance={8} decay={1.5} intensity={28} />
          </group>
        </group>
      </group>
    </group>
  )
}

// ── Phone: buzzes on its dock, lifts and faces you on Contact ─────────

function Phone() {
  const m = useMat()
  const tex = useMemo(() => phoneTexture(), [])
  const lift = useRef<THREE.Group>(null)
  const buzz = useRef<THREE.Group>(null)
  const glow = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }, dt) => {
    const active = useRoom.getState().focus === "contact"
    const t = clock.elapsedTime % (active ? 2.5 : 6)
    if (lift.current) {
      easing.damp(lift.current.position, "y", active ? 0.62 : 0.36, 0.3, dt)
      easing.damp(lift.current.position, "z", active ? 0.25 : -0.02, 0.3, dt)
      easing.damp(lift.current.rotation, "x", active ? 0.05 : -0.18, 0.3, dt)
      easing.damp(lift.current.rotation, "y", active ? 0.5 : 0, 0.3, dt)
    }
    if (buzz.current) buzz.current.rotation.z = t < 0.6 ? Math.sin(t * 90) * 0.03 : 0
    if (glow.current) glow.current.color.setScalar(t < 1.5 || active ? 1.5 : 1)
  })
  return (
    <group position={[2.25, 1.556, -3.85]} rotation-y={-0.35}>
      <RoundedBox args={[0.42, 0.08, 0.32]} radius={0.03} position={[0, 0.04, 0]} material={m.darkMetal} castShadow />
      <group ref={lift} position={[0, 0.36, -0.02]} rotation-x={-0.18}>
        <group ref={buzz}>
          <RoundedBox args={[0.34, 0.66, 0.035]} radius={0.045} smoothness={4} material={m.plasticBlack} castShadow />
          <mesh position={[0, 0, 0.0185]}>
            <planeGeometry args={[0.31, 0.62]} />
            <meshBasicMaterial ref={glow} map={tex} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.019]} material={m.screenGlass}>
            <planeGeometry args={[0.31, 0.62]} />
          </mesh>
          {/* camera bump */}
          <RoundedBox args={[0.12, 0.12, 0.02]} radius={0.02} position={[0.08, 0.22, -0.025]} material={m.aluminium} />
        </group>
      </group>
    </group>
  )
}

function Headphones() {
  const m = useMat()
  return (
    <group position={[-0.25, 1.64, -4.55]} rotation={[0, 0.3, 0]}>
      <mesh rotation-x={Math.PI / 2} material={m.aluminium} castShadow>
        <torusGeometry args={[0.2, 0.018, 12, 32, Math.PI]} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <group key={x} position={[x, 0, 0]} rotation-z={Math.PI / 2}>
          <mesh material={m.leather} castShadow>
            <cylinderGeometry args={[0.095, 0.095, 0.075, 28]} />
          </mesh>
          <mesh position={[0, x > 0 ? -0.04 : 0.04, 0]} material={m.plasticWhite}>
            <cylinderGeometry args={[0.07, 0.07, 0.01, 28]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Chair: leather gaming chair. Click it for a spin. ─────────────────

function Chair() {
  const m = useMat()
  const seat = useRef<THREE.Group>(null)
  const spin = useRef({ extra: 0 })
  useFrame(({ clock }) => {
    if (seat.current) seat.current.rotation.y = 0.45 + Math.sin(clock.elapsedTime * 0.35) * 0.12 + spin.current.extra
  })
  const onSpin = () => gsap.to(spin.current, { extra: spin.current.extra + Math.PI * 2, duration: 1.6, ease: "power3.out" })

  return (
    <Hotspot id="chair" label="Spin me" labelPosition={[0.6, 2.7, -2.1]} onActivate={onSpin}>
      <group position={[0.6, 0, -2.45]}>
        <BlobShadow position={[0, 0, 0]} scale={[1.6, 1.6]} opacity={0.7} />
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2
          return (
            <group key={i} rotation-y={a}>
              <mesh position={[0.3, 0.12, 0]} rotation-z={0.08} material={m.chrome} castShadow>
                <boxGeometry args={[0.6, 0.05, 0.07]} />
              </mesh>
              <mesh position={[0.58, 0.06, 0]} rotation-x={Math.PI / 2} material={m.rubber} castShadow>
                <torusGeometry args={[0.035, 0.022, 8, 16]} />
              </mesh>
            </group>
          )
        })}
        <mesh position={[0, 0.45, 0]} material={m.chrome} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.66, 20]} />
        </mesh>
        <group ref={seat}>
          <RoundedBox args={[1.0, 0.17, 0.95]} radius={0.08} smoothness={4} position={[0, 0.86, 0]} material={m.leather} castShadow receiveShadow />
          <RoundedBox args={[0.98, 1.35, 0.17]} radius={0.08} smoothness={4} position={[0, 1.58, 0.5]} rotation-x={0.12} material={m.leather} castShadow />
          <RoundedBox args={[0.32, 1.12, 0.18]} radius={0.06} position={[0, 1.58, 0.505]} rotation-x={0.12} material={m.leatherAccent} />
          {/* headrest pillow */}
          <RoundedBox args={[0.5, 0.2, 0.14]} radius={0.07} position={[0, 2.1, 0.44]} rotation-x={0.12} material={m.leatherAccent} castShadow />
          {[-0.52, 0.52].map((x) => (
            <group key={x}>
              <mesh position={[x, 1.0, 0.1]} material={m.darkMetal}>
                <boxGeometry args={[0.04, 0.26, 0.04]} />
              </mesh>
              <RoundedBox args={[0.1, 0.05, 0.55]} radius={0.02} position={[x, 1.14, 0.05]} material={m.rubber} castShadow />
            </group>
          ))}
        </group>
      </group>
    </Hotspot>
  )
}
