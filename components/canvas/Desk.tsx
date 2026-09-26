"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { projects } from "@/lib/content"
import { Hotspot } from "./Hotspot"
import { createScreen, phoneTexture } from "./textures"

const DESK = "#2d2a52"
const WOOD = "#7a5439"

export function Desk() {
  return (
    <group>
      {/* desk top + legs */}
      <RoundedBox args={[4.4, 0.12, 1.7]} radius={0.04} position={[0.5, 1.5, -4.2]}>
        <meshStandardMaterial color={WOOD} roughness={0.55} />
      </RoundedBox>
      {[-1.6, 2.6].map((x) => (
        <mesh key={x} position={[x, 0.72, -4.2]}>
          <boxGeometry args={[0.1, 1.44, 1.5]} />
          <meshStandardMaterial color={DESK} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.5, 1.1, -4.9]}>
        <boxGeometry args={[4.1, 0.5, 0.05]} />
        <meshStandardMaterial color={DESK} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* desk mat */}
      <RoundedBox args={[2.8, 0.015, 1.0]} radius={0.007} position={[0.55, 1.565, -3.85]}>
        <meshStandardMaterial color="#17142e" roughness={0.95} />
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
      <Hotspot id="contact" label="Contact" hint="5" labelPosition={[2.25, 2.35, -3.8]}>
        <Phone />
      </Hotspot>
      <Headphones />
      <Chair />
    </group>
  )
}

function Monitor() {
  const screen = useMemo(() => createScreen(), [])
  const images = useRef<HTMLImageElement[]>([])
  const shown = useRef("")

  useEffect(() => {
    images.current = projects.map((p) => {
      const img = new Image()
      img.src = p.image
      return img
    })
    return () => screen.texture.dispose()
  }, [screen])

  useFrame((_, dt) => {
    const { focus, project } = useRoom.getState()
    if (focus === "work") {
      const img = images.current[project]
      const key = `p${project}`
      if (img?.complete && img.naturalWidth && shown.current !== key) {
        const p = projects[project]
        screen.paintImage(img, (p.links.live ?? p.links.github ?? "").replace(/^https?:\/\//, ""), p.accent)
        shown.current = key
      }
    } else {
      shown.current = ""
      screen.paintCode(dt)
    }
  })

  return (
    <Hotspot id="work" label="Projects" hint="1" labelPosition={[0.65, 3.55, -4.5]}>
      <group position={[0.65, 0, -4.6]}>
        {/* stand */}
        <mesh position={[0, 1.58, 0.05]}>
          <boxGeometry args={[0.7, 0.03, 0.4]} />
          <meshStandardMaterial color="#1b1830" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.95, -0.05]}>
          <boxGeometry args={[0.12, 0.75, 0.06]} />
          <meshStandardMaterial color="#1b1830" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* body */}
        <RoundedBox args={[2.75, 1.5, 0.1]} radius={0.03} position={[0, 2.6, 0]}>
          <meshStandardMaterial color="#0d0b1a" roughness={0.4} metalness={0.3} />
        </RoundedBox>
        <mesh position={[0, 2.62, 0.052]}>
          <planeGeometry args={[2.62, 1.38]} />
          <meshBasicMaterial map={screen.texture} toneMapped={false} />
        </mesh>
        {/* bias light behind the monitor */}
        <mesh position={[0, 2.6, -0.06]}>
          <planeGeometry args={[2.9, 1.65]} />
          <meshBasicMaterial color={[0.5, 0.9, 2.2]} toneMapped={false} transparent opacity={0.25} />
        </mesh>
      </group>
    </Hotspot>
  )
}

function Keyboard() {
  const keys = useRef<THREE.InstancedMesh>(null)
  const color = useMemo(() => new THREE.Color(), [])
  const layout = useMemo(() => {
    const out: [number, number][] = []
    for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) out.push([c, r])
    return out
  }, [])

  useEffect(() => {
    const m = new THREE.Object3D()
    layout.forEach(([c, r], i) => {
      m.position.set(-0.66 + c * 0.1 + (r % 2) * 0.02, 0.045, -0.15 + r * 0.1)
      m.updateMatrix()
      keys.current!.setMatrixAt(i, m.matrix)
    })
    keys.current!.instanceMatrix.needsUpdate = true
  }, [layout])

  useFrame(({ clock }) => {
    if (!keys.current) return
    const { party } = useRoom.getState()
    const t = clock.elapsedTime
    layout.forEach(([c, r], i) => {
      const hue = (c * 0.04 + r * 0.03 - t * (party ? 0.6 : 0.12)) % 1
      color.setHSL((hue + 1) % 1, 0.85, party ? 0.6 : 0.45)
      keys.current!.setColorAt(i, color)
    })
    keys.current.instanceColor!.needsUpdate = true
  })

  return (
    <group position={[0.45, 1.57, -3.72]}>
      <RoundedBox args={[1.5, 0.05, 0.5]} radius={0.02}>
        <meshStandardMaterial color="#141126" metalness={0.4} roughness={0.4} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, layout.length]}>
        <boxGeometry args={[0.078, 0.035, 0.078]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <mesh position={[0, 0.045, 0.25]}>
        <boxGeometry args={[0.6, 0.035, 0.078]} />
        <meshStandardMaterial color="#2a2548" />
      </mesh>
    </group>
  )
}

function Mouse() {
  return (
    <group position={[1.6, 1.58, -3.65]}>
      <RoundedBox args={[0.5, 0.01, 0.45]} radius={0.005}>
        <meshStandardMaterial color="#231e44" />
      </RoundedBox>
      <mesh position={[0, 0.04, 0]} scale={[0.6, 0.35, 1]}>
        <sphereGeometry args={[0.1, 20, 16]} />
        <meshStandardMaterial color="#e9e6ff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.07, -0.05]}>
        <boxGeometry args={[0.01, 0.01, 0.05]} />
        <meshBasicMaterial color={[0.4, 1.8, 2.4]} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Mug() {
  const puffs = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const g = puffs.current
    if (!g) return
    g.children.forEach((c, i) => {
      const t = (clock.elapsedTime * 0.35 + i / g.children.length) % 1
      c.position.set(Math.sin(t * 6 + i) * 0.04, t * 0.55, Math.cos(t * 5 + i) * 0.03)
      c.scale.setScalar(0.03 + t * 0.07)
      ;((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.22
    })
  })
  return (
    <group position={[-0.95, 1.56, -3.7]}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.12, 0.11, 0.28, 24, 1, true]} />
        <meshStandardMaterial color="#ff6b8b" roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.02, 24]} />
        <meshStandardMaterial color="#ff6b8b" />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.115, 24]} />
        <meshStandardMaterial color="#3a1f12" roughness={0.2} />
      </mesh>
      <mesh position={[0.13, 0.15, 0]}>
        <torusGeometry args={[0.06, 0.018, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#ff6b8b" roughness={0.35} />
      </mesh>
      <group ref={puffs} position={[0, 0.28, 0]}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent depthWrite={false} opacity={0} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Lamp() {
  const bulb = useRef<THREE.MeshBasicMaterial>(null)
  const light = useRef<THREE.PointLight>(null)
  const head = useRef<THREE.Group>(null)
  useFrame(({ clock }, dt) => {
    const { lightsOn, party } = useRoom.getState()
    const on = lightsOn ? 1 : 0
    if (light.current) {
      easing.damp(light.current, "intensity", on * 9, 0.15, dt)
      if (party) light.current.color.setHSL((clock.elapsedTime * 0.6) % 1, 1, 0.6)
      else light.current.color.set("#ffc27a")
    }
    if (bulb.current) bulb.current.color.setRGB(3 * on + 0.15, 2.2 * on + 0.12, 1.2 * on + 0.1)
    if (head.current) head.current.rotation.z = 0.35 + Math.sin(clock.elapsedTime * 0.8) * 0.02
  })
  const metal = <meshStandardMaterial color="#1f1c38" metalness={0.7} roughness={0.3} />
  return (
    <group position={[-1.3, 1.56, -4.5]}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.06, 24]} />
        {metal}
      </mesh>
      <mesh position={[0.1, 0.45, 0]} rotation-z={-0.35}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
        {metal}
      </mesh>
      <group position={[0.25, 0.86, 0]}>
        <mesh position={[0.3, 0.12, 0]} rotation-z={-1.2}>
          <cylinderGeometry args={[0.022, 0.022, 0.7, 8]} />
          {metal}
        </mesh>
        <group ref={head} position={[0.62, 0.22, 0]}>
          <mesh rotation-z={Math.PI * 0.85}>
            <coneGeometry args={[0.18, 0.28, 24, 1, true]} />
            <meshStandardMaterial color="#ffb547" side={THREE.DoubleSide} metalness={0.2} roughness={0.4} />
          </mesh>
          <mesh position={[0.04, -0.08, 0]}>
            <sphereGeometry args={[0.07, 16, 12]} />
            <meshBasicMaterial ref={bulb} toneMapped={false} />
          </mesh>
          <pointLight ref={light} position={[0.1, -0.25, 0.1]} distance={7} decay={1.6} intensity={9} />
        </group>
      </group>
    </group>
  )
}

function Phone() {
  const tex = useMemo(() => phoneTexture(), [])
  const ref = useRef<THREE.Group>(null)
  const glow = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 6
    const buzz = t < 0.6 ? Math.sin(t * 90) * 0.03 : 0
    if (ref.current) ref.current.rotation.z = buzz
    if (glow.current) {
      const k = t < 1.5 ? 1.6 : 1.0
      glow.current.color.setScalar(k)
    }
  })
  return (
    <group position={[2.25, 1.57, -3.85]} rotation-y={-0.35}>
      {/* dock */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.4, 0.08, 0.3]} />
        <meshStandardMaterial color="#1b1830" />
      </mesh>
      <group ref={ref} position={[0, 0.38, -0.02]} rotation-x={-0.18}>
        <RoundedBox args={[0.34, 0.66, 0.035]} radius={0.04}>
          <meshStandardMaterial color="#0b0a14" metalness={0.5} roughness={0.25} />
        </RoundedBox>
        <mesh position={[0, 0, 0.019]}>
          <planeGeometry args={[0.3, 0.6]} />
          <meshBasicMaterial ref={glow} map={tex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Headphones() {
  return (
    <group position={[-0.25, 1.62, -4.55]} rotation={[0, 0.3, 0]}>
      <mesh rotation-x={Math.PI / 2} rotation-z={0}>
        <torusGeometry args={[0.2, 0.025, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#e9e6ff" roughness={0.4} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.09, 0.09, 0.07, 20]} />
          <meshStandardMaterial color="#8b7bff" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Chair() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = 0.45 + Math.sin(clock.elapsedTime * 0.35) * 0.12
  })
  const accent = "#8b7bff"
  const shell = "#1c1934"
  return (
    <group position={[0.6, 0, -2.45]}>
      {/* star base */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} rotation-y={a}>
            <mesh position={[0.3, 0.1, 0]}>
              <boxGeometry args={[0.6, 0.06, 0.08]} />
              <meshStandardMaterial color={shell} metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0.58, 0.05, 0]}>
              <sphereGeometry args={[0.05, 10, 8]} />
              <meshStandardMaterial color="#0c0a18" />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.7, 12]} />
        <meshStandardMaterial color="#9b98b8" metalness={0.8} roughness={0.25} />
      </mesh>
      <group ref={ref}>
        <RoundedBox args={[1.0, 0.16, 0.95]} radius={0.07} position={[0, 0.85, 0]}>
          <meshStandardMaterial color={shell} roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.98, 1.3, 0.16]} radius={0.07} position={[0, 1.55, 0.5]} rotation-x={0.12}>
          <meshStandardMaterial color={shell} roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.3, 1.1, 0.17]} radius={0.05} position={[0, 1.55, 0.505]} rotation-x={0.12}>
          <meshStandardMaterial color={accent} roughness={0.7} />
        </RoundedBox>
        {[-0.52, 0.52].map((x) => (
          <mesh key={x} position={[x, 1.1, 0.05]}>
            <boxGeometry args={[0.07, 0.06, 0.6]} />
            <meshStandardMaterial color="#0c0a18" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
