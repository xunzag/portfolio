"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { PROJECT_VH, RANGES } from "@/lib/chapters"
import { experience, facts, principles, profile, projects, setup, stats, type Project } from "@/lib/content"
import { Button3D, HoloScreen } from "./Holo"
import { Type } from "./Type"
import { usePresence, useReveal } from "./presence"
import { ABOUT, FACTS, projectStation } from "./track"

// ── Work: one floating hologram per project ───────────────────────────

export function ProjectStations() {
  const maps = useTexture(projects.map((p) => p.image))
  maps.forEach((m) => (m.colorSpace = THREE.SRGBColorSpace))
  return (
    <>
      {projects.map((p, i) => (
        <ProjectStation key={p.slug} p={p} i={i} map={maps[i]} />
      ))}
    </>
  )
}

function ProjectStation({ p, i, map }: { p: Project; i: number; map: THREE.Texture }) {
  const st = projectStation(i)
  const a = RANGES.work[0] + i * PROJECT_VH
  const on = usePresence(a + 20, a + PROJECT_VH + 10, 45, 40)
  const info = useRef<THREE.Group>(null)
  const screen = useRef<THREE.Group>(null)
  useReveal(info, on, 0.5)
  useFrame(({ clock }) => {
    if (screen.current) {
      screen.current.position.y = 0.6 + Math.sin(clock.elapsedTime * 0.8 + i) * 0.08
      screen.current.rotation.y = Math.sin(clock.elapsedTime * 0.3 + i) * 0.03
    }
  })

  // Info column sits on the inner side (towards the path).
  const inner = -st.side
  const W = 6.4
  const infoX = inner > 0 ? W / 2 + 0.55 : -W / 2 - 0.55 - 4.3

  return (
    <group position={st.center} rotation-y={st.yaw}>
      <group ref={screen}>
        <HoloScreen map={map} accent={p.accent} width={W} height={W * 0.5625} on={on} />
      </group>
      <group ref={info} position={[infoX, 2.2, 0.3]}>
        <Type weight="semi" fontSize={0.17} letterSpacing={0.18} color={p.accent} glow={1.8}>
          {`${String(i + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}   ${p.category.toUpperCase()}   ${p.year}`}
        </Type>
        <Type weight="bold" fontSize={0.72} letterSpacing={-0.03} position={[0, -0.32, 0]} glow={1.25} maxWidth={4.6} lineHeight={0.95}>
          {p.title}
        </Type>
        <Type weight="light" fontSize={0.24} position={[0, -1.18, 0]} color="#cfc8ff" maxWidth={4.3}>
          {p.tagline}
        </Type>
        <Type fontSize={0.165} lineHeight={1.45} position={[0, -1.62, 0]} color="#bdb6dc" maxWidth={4.3}>
          {p.description}
        </Type>
        <group position={[0, -2.75, 0]}>
          {p.metrics.map(([v, l], k) => (
            <group key={l} position={[k * 1.45, 0, 0]}>
              <Type weight="bold" fontSize={0.36} color={p.accent} glow={2}>
                {v}
              </Type>
              <Type fontSize={0.12} letterSpacing={0.12} position={[0, -0.44, 0]} color="#9a95b8">
                {l.toUpperCase()}
              </Type>
            </group>
          ))}
        </group>
        <Type fontSize={0.13} letterSpacing={0.1} position={[0, -3.45, 0]} color="#8e87b3" maxWidth={4.4} lineHeight={1.6}>
          {p.tech.join("   /   ").toUpperCase()}
        </Type>
        <group position={[0, -4.05, 0]}>
          {p.links.live && <Button3D label="VISIT SITE" href={p.links.live} accent={p.accent} primary />}
          {p.links.github && <Button3D label="SOURCE" href={p.links.github} accent={p.accent} position={[p.links.live ? 1.75 : 0, 0, 0]} />}
        </group>
      </group>
    </group>
  )
}

// ── About: a constellation of me ──────────────────────────────────────

export function AboutStation() {
  const photo = useTexture(profile.photo)
  photo.colorSpace = THREE.SRGBColorSpace
  const [a, b] = RANGES.about
  const on = usePresence(a + 60, b, 60, 40)
  const g = useRef<THREE.Group>(null)
  const frame = useRef<THREE.Group>(null)
  useReveal(g, on, 0.7)
  useFrame(({ clock }) => {
    if (frame.current) frame.current.rotation.y = 0.18 + Math.sin(clock.elapsedTime * 0.5) * 0.05
  })

  return (
    <group position={ABOUT}>
      <group ref={frame} position={[-4.9, 1.9, 0]}>
        <HoloScreen map={photo} accent="#7fd8ff" width={2.6} height={3.25} on={on} />
      </group>
      <group ref={g}>
        <group position={[-3.1, 3.55, 0]}>
          <Type weight="semi" fontSize={0.17} letterSpacing={0.2} color="#7fd8ff" glow={1.8}>
            {"03   ABOUT"}
          </Type>
        </group>
        <group position={[-3.1, 3.2, 0]}>
          <Type weight="bold" fontSize={0.78} letterSpacing={-0.035} glow={1.3} maxWidth={6}>
            {"Hey, I'm Farhan."}
          </Type>
        </group>
        <group position={[-3.1, 2.15, 0]}>
          <Type weight="light" fontSize={0.2} lineHeight={1.5} color="#d6d0f5" maxWidth={5.4}>
            {profile.bio.join("\n\n")}
          </Type>
        </group>
        <group position={[2.75, 3.1, 0]}>
          {stats.map((s, k) => (
            <group key={s.label} position={[(k % 2) * 1.75, -Math.floor(k / 2) * 1.2, 0]}>
              <Type weight="bold" fontSize={0.56} glow={2.2} color="#e8e0ff">
                {`${s.value}${s.suffix}`}
              </Type>
              <Type fontSize={0.11} letterSpacing={0.14} position={[0.02, -0.66, 0]} color="#8fd8ff">
                {s.label.toUpperCase()}
              </Type>
            </group>
          ))}
        </group>
        {/* career timeline: nodes on a beam of light */}
        <group position={[-3.1, -1.6, 0]}>
          <mesh position={[4.3, 0, -0.02]}>
            <planeGeometry args={[8.6, 0.02]} />
            <meshBasicMaterial color={[1.2, 2.2, 3]} toneMapped={false} transparent />
          </mesh>
          {experience.map((e, k) => (
            <group key={e.hash} position={[k * 3.05, 0, 0]}>
              <mesh>
                <circleGeometry args={[e.active ? 0.11 : 0.08, 24]} />
                <meshBasicMaterial color={e.active ? [0.8, 4, 2] : [2, 2, 2.6]} toneMapped={false} transparent />
              </mesh>
              <Type weight="semi" fontSize={0.12} letterSpacing={0.12} position={[0, -0.28, 0]} color="#ffcf7f" glow={1.5}>
                {`${e.hash}   ${e.period.toUpperCase()}`}
              </Type>
              <Type weight="bold" fontSize={0.2} position={[0, -0.52, 0]} maxWidth={2.8}>
                {e.role}
              </Type>
              <Type fontSize={0.15} position={[0, -0.8, 0]} color="#9a95b8" maxWidth={2.8}>
                {`@ ${e.company}  /  ${e.type}`}
              </Type>
              <Type weight="light" fontSize={0.14} lineHeight={1.4} position={[0, -1.08, 0]} color="#c9c2ea" maxWidth={2.8}>
                {e.desc}
              </Type>
            </group>
          ))}
        </group>
        <group position={[-3.1, -4.05, 0]}>
          <Button3D label="DOWNLOAD CV" href={profile.cv} accent="#7fd8ff" primary />
          <Button3D label="GITHUB" href={profile.socials.github} accent="#7fd8ff" position={[2.1, 0, 0]} />
          <Button3D label="LINKEDIN" href={profile.socials.linkedin} accent="#7fd8ff" position={[3.45, 0, 0]} />
        </group>
      </group>
    </group>
  )
}

// ── Facts: an orbit of glowing numbers ────────────────────────────────

const orbF = /* glsl */ `
  uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
  void main() {
    float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.0);
    gl_FragColor = vec4(uColor * (0.25 + f * 2.8), 1.0);
  }
`
const orbV = /* glsl */ `
  varying vec3 vN; varying vec3 vV;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const ORB_COLORS = ["#ff5fc8", "#5fd8ff", "#b18cff", "#ffcf7f", "#6fffc0", "#ff8f6f", "#9fb4ff", "#ff9fe0"]

export function FactsStation() {
  const [a, b] = RANGES.facts
  const on = usePresence(a + 40, b, 50, 40)
  const g = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Group>(null)
  useReveal(g, on, 0.8)
  useFrame(({ clock }) => {
    if (!ring.current) return
    const t = clock.elapsedTime
    ring.current.children.forEach((c, i) => {
      const ang = (i / facts.length) * Math.PI * 2 + t * 0.06
      c.position.set(Math.cos(ang) * 4.9, Math.sin(ang) * 3.1, Math.sin(ang * 2 + t * 0.3) * 0.4)
    })
  })

  return (
    <group position={FACTS}>
      <group ref={g}>
        <group position={[0, 1.05, 0]}>
          <Type weight="semi" fontSize={0.16} letterSpacing={0.24} anchorX="center" color="#ffcf7f" glow={1.8}>
            {"04   /ETC/FARHAN.CONF"}
          </Type>
          <Type weight="bold" fontSize={0.62} letterSpacing={-0.03} anchorX="center" position={[0, -0.32, 0]} glow={1.3}>
            {"Cool things\nabout me"}
          </Type>
        </group>
        <group ref={ring}>
          {facts.map((f, i) => (
            <group key={f.label}>
              <mesh position={[0, 0.02, -0.75]}>
                <sphereGeometry args={[0.55, 32, 24]} />
                <shaderMaterial vertexShader={orbV} fragmentShader={orbF} uniforms={{ uColor: { value: new THREE.Color(ORB_COLORS[i]) } }} transparent />
              </mesh>
              <Type weight="bold" fontSize={0.42} anchorX="center" anchorY="middle" glow={2.2}>
                {f.value}
              </Type>
              <Type weight="semi" fontSize={0.12} letterSpacing={0.14} anchorX="center" position={[0, -0.72, 0]} color={ORB_COLORS[i]} glow={1.6}>
                {f.label.toUpperCase()}
              </Type>
              <Type weight="light" fontSize={0.11} anchorX="center" position={[0, -0.92, 0]} color="#a39dc4">
                {`# ${f.note}`}
              </Type>
            </group>
          ))}
        </group>
        <group position={[-10.2, 2.6, -1.5]} rotation-y={0.35}>
          <Type weight="semi" fontSize={0.14} letterSpacing={0.2} color="#b18cff" glow={1.8}>
            {"[SETUP]"}
          </Type>
          {setup.map(([k, v], i) => (
            <group key={k} position={[0, -0.42 - i * 0.44, 0]}>
              <Type fontSize={0.13} letterSpacing={0.12} color="#8e87b3">
                {k.toUpperCase()}
              </Type>
              <Type weight="semi" fontSize={0.18} position={[1.35, 0.02, 0]}>
                {v}
              </Type>
            </group>
          ))}
        </group>
        <group position={[6.6, 2.6, -1.5]} rotation-y={-0.35}>
          <Type weight="semi" fontSize={0.14} letterSpacing={0.2} color="#ff5fc8" glow={1.8}>
            {"[PRINCIPLES]"}
          </Type>
          {principles.map((p, i) => (
            <Type key={p} weight="light" fontSize={0.2} lineHeight={1.35} position={[0, -0.42 - i * 0.78, 0]} maxWidth={3.6}>
              {`${String(i + 1).padStart(2, "0")}  ${p}`}
            </Type>
          ))}
        </group>
      </group>
    </group>
  )
}
