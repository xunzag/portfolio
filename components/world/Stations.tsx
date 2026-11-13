"use client"

import { useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { PROJECT_VH, RANGES } from "@/lib/chapters"
import { credentials, experience, profile, projects, stats, type Project } from "@/lib/content"
import { Button3D, HoloScreen } from "./Holo"
import { Type } from "./Type"
import { usePresence, useReveal } from "./presence"
import { ABOUT, projectStation } from "./track"

// ── Work: one floating hologram per project ───────────────────────────

export function ProjectStations() {
  const withImage = projects.filter((p) => p.image)
  const loaded = useTexture(withImage.map((p) => p.image!))
  const maps = useMemo(() => {
    let k = 0
    return projects.map((p) => {
      const m = p.image ? loaded[k++] : posterTexture(p)
      m.colorSpace = THREE.SRGBColorSpace
      return m
    })
  }, [loaded])
  return (
    <>
      {projects.map((p, i) => (
        <ProjectStation key={p.slug} p={p} i={i} map={maps[i]} />
      ))}
    </>
  )
}

// Projects without a screenshot get a generated title card for the big screen.
function posterTexture(p: Project) {
  const c = document.createElement("canvas")
  c.width = 1600
  c.height = 900
  const g = c.getContext("2d")!
  const grad = g.createLinearGradient(0, 0, 1600, 900)
  grad.addColorStop(0, "#070512")
  grad.addColorStop(1, "#1a0f33")
  g.fillStyle = grad
  g.fillRect(0, 0, 1600, 900)
  // accent glow + grid
  const glow = g.createRadialGradient(1250, 200, 0, 1250, 200, 900)
  glow.addColorStop(0, p.accent + "88")
  glow.addColorStop(1, "transparent")
  g.fillStyle = glow
  g.fillRect(0, 0, 1600, 900)
  g.strokeStyle = "rgba(255,255,255,0.05)"
  for (let x = 0; x < 1600; x += 80) g.strokeRect(x, 0, 80, 900)
  for (let y = 0; y < 900; y += 80) g.strokeRect(0, y, 1600, 80)
  g.fillStyle = p.accent
  g.font = "600 30px ui-monospace, monospace"
  g.fillText(`${p.category.toUpperCase()}  /  ${p.year}`, 110, 190)
  g.fillStyle = "#ffffff"
  g.font = "700 150px system-ui, sans-serif"
  const words = p.title.split(" ")
  let line = ""
  let y = 370
  for (const w of words) {
    if (g.measureText(line + w).width > 1350 && line) {
      g.fillText(line.trim(), 105, y)
      line = ""
      y += 160
    }
    line += w + " "
  }
  g.fillText(line.trim(), 105, y)
  g.fillStyle = "rgba(255,255,255,0.7)"
  g.font = "400 44px system-ui, sans-serif"
  g.fillText(p.tagline, 110, y + 95)
  g.fillStyle = p.accent
  g.fillRect(110, y + 140, 220, 6)
  g.fillStyle = "rgba(255,255,255,0.45)"
  g.font = "500 28px ui-monospace, monospace"
  g.fillText(p.links.live ? p.links.live.replace("https://", "") : "case study", 110, 800)
  return new THREE.CanvasTexture(c)
}

function ProjectStation({ p, i, map }: { p: Project; i: number; map: THREE.Texture }) {
  const st = projectStation(i)
  const a = RANGES.work[0] + i * PROJECT_VH
  const on = usePresence(a + 20, a + PROJECT_VH + 6, 45, 34)
  const info = useRef<THREE.Group>(null)
  const screen = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  useReveal(info, on, 0.5)
  const root = useRef<THREE.Group>(null)
  useFrame(({ clock, pointer }, dt) => {
    // dark, far-off screens would only clutter the one you're reading
    if (root.current) root.current.visible = (on.current ?? 0) > 0.004
    if (!screen.current) return
    // the screen leans towards the pointer; a little more when hovered
    const k = hover ? 0.1 : 0.04
    screen.current.rotation.y += (pointer.x * k - screen.current.rotation.y) * Math.min(1, dt * 4)
    screen.current.rotation.x += (-pointer.y * k * 0.6 - screen.current.rotation.x) * Math.min(1, dt * 4)
    screen.current.position.y = 0.6 + Math.sin(clock.elapsedTime * 0.8 + i) * 0.05
  })

  // Info column sits on the inner side (towards the road).
  const inner = -st.side
  const W = 6.6
  const H = W * 0.5625
  const infoX = inner > 0 ? W / 2 + 0.6 : -W / 2 - 0.6 - 4.3
  const accent = useMemo(() => new THREE.Color(p.accent), [p.accent])
  const url = p.links.live ?? p.links.github

  return (
    <group ref={root} position={st.center} rotation-y={st.yaw}>
      <Type weight="bold" fontSize={7} anchorX="center" anchorY="middle" position={[inner * 2.2, 1.4, -3]} color={p.accent} opacity={0.08}>
        {String(i + 1).padStart(2, "0")}
      </Type>
      {/* the drive-in screen: gantry legs, a dark bezel, the picture */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * (W / 2 - 0.5), -1.75, -0.2]}>
          <boxGeometry args={[0.09, 2.6, 0.09]} />
          <meshStandardMaterial color="#0c0916" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
      <group ref={screen} position={[0, 0.6, 0]}>
        <mesh position={[0, 0, -0.09]}>
          <boxGeometry args={[W + 0.28, H + 0.28, 0.14]} />
          <meshStandardMaterial color="#07050f" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, -H / 2 - 0.2, 0]}>
          <planeGeometry args={[W + 0.28, 0.03]} />
          <meshBasicMaterial color={accent.clone().multiplyScalar(3)} toneMapped={false} />
        </mesh>
        <group
          onPointerOver={(e) => {
            if (!url) return
            e.stopPropagation()
            setHover(true)
            document.body.style.cursor = "pointer"
          }}
          onPointerOut={() => {
            setHover(false)
            document.body.style.cursor = "auto"
          }}
          onClick={(e) => {
            if (!url || (on.current ?? 0) < 0.5) return
            e.stopPropagation()
            window.open(url, "_blank", "noopener")
          }}
        >
          <HoloScreen map={map} accent={p.accent} width={W} height={H} on={on} />
        </group>
      </group>
      <group ref={info} position={[infoX, 2.45, 0.3]}>
        <Type weight="semi" fontSize={0.17} letterSpacing={0.18} color={p.accent} glow={1.8}>
          {`${String(i + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}   ${p.category.toUpperCase()}   ${p.year}`}
        </Type>
        <Type weight="bold" fontSize={0.74} letterSpacing={-0.03} position={[0, -0.32, 0]} glow={1.3} maxWidth={4.7} lineHeight={0.95}>
          {p.title}
        </Type>
        <Type weight="light" fontSize={0.24} position={[0, -1.9, 0]} color="#d9d2ff" maxWidth={4.3}>
          {p.tagline}
        </Type>
        <Type fontSize={0.165} lineHeight={1.45} position={[0, -2.3, 0]} color="#b9b2dc" maxWidth={4.3}>
          {p.description}
        </Type>
        <group position={[0, -3.5, 0]}>
          {p.metrics.map(([v, l], k) => (
            <group key={l} position={[k * 1.5, 0, 0]}>
              <Type weight="bold" fontSize={0.34} color={p.accent} glow={2}>
                {v}
              </Type>
              <Type fontSize={0.115} letterSpacing={0.12} position={[0, -0.42, 0]} color="#9a95b8">
                {l.toUpperCase()}
              </Type>
            </group>
          ))}
        </group>
        <Type fontSize={0.125} letterSpacing={0.1} position={[0, -4.2, 0]} color="#8e87b3" maxWidth={4.4} lineHeight={1.6}>
          {p.tech.join("   /   ").toUpperCase()}
        </Type>
        <group position={[0, -4.75, 0]}>
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
  const on = usePresence(a + 70, b, 60, 40)
  const g = useRef<THREE.Group>(null)
  const frame = useRef<THREE.Group>(null)
  const halo = useRef<THREE.Group>(null)
  const beam = useRef<THREE.Mesh>(null)
  useReveal(g, on, 0.7)
  useFrame(({ clock, pointer }, dt) => {
    const t = clock.elapsedTime
    if (frame.current) {
      frame.current.rotation.y += (0.16 + pointer.x * 0.12 - frame.current.rotation.y) * Math.min(1, dt * 3)
      frame.current.position.y = 1.55 + Math.sin(t * 0.7) * 0.06
    }
    if (halo.current) halo.current.rotation.z = t * 0.15
    // the timeline draws itself from left to right as you arrive
    if (beam.current) {
      const k = Math.min(1, Math.max(0, (on.current ?? 0) * 1.4 - 0.2))
      beam.current.scale.x = Math.max(0.001, k)
      beam.current.position.x = (TL_W * k) / 2
    }
  })
  const TL_X = -6.7
  const TL_STEP = 3.4
  const TL_W = TL_STEP * (experience.length - 1) + 2.6
  const cyan = "#7fd8ff"

  return (
    <group position={ABOUT}>
      <Type weight="bold" fontSize={9} anchorX="center" anchorY="middle" position={[1.5, 1, -4]} color={cyan} opacity={0.05}>
        {"03"}
      </Type>
      {/* portrait: floating plate with a turning halo behind it */}
      <group ref={frame} position={[-5.35, 1.55, 0]}>
        <group ref={halo} position={[0, 0.1, -0.5]}>
          <mesh>
            <torusGeometry args={[2.25, 0.012, 8, 120]} />
            <meshBasicMaterial color={[1.2, 2.4, 3.4]} toneMapped={false} />
          </mesh>
          {Array.from({ length: 36 }, (_, i) => (
            <mesh key={i} position={[Math.cos((i / 36) * Math.PI * 2) * 2.42, Math.sin((i / 36) * Math.PI * 2) * 2.42, 0]} rotation-z={(i / 36) * Math.PI * 2}>
              <planeGeometry args={[i % 3 === 0 ? 0.22 : 0.1, 0.018]} />
              <meshBasicMaterial color={[2.6, 1.2, 3]} toneMapped={false} />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 0, -0.07]}>
          <boxGeometry args={[2.86, 3.56, 0.1]} />
          <meshStandardMaterial color="#07050f" metalness={0.9} roughness={0.25} />
        </mesh>
        <HoloScreen map={photo} accent={cyan} width={2.7} height={3.4} on={on} />
        <Type weight="bold" fontSize={0.2} letterSpacing={0.22} anchorX="center" position={[0, -1.95, 0]} glow={1.6}>
          {profile.name.toUpperCase()}
        </Type>
        <Type fontSize={0.11} letterSpacing={0.2} anchorX="center" position={[0, -2.27, 0]} color={cyan} glow={1.5}>
          {"KARACHI, PK   /   UTC +5   /   OPEN TO WORK"}
        </Type>
      </group>
      <group ref={g}>
        <group position={[-3.2, 3.95, 0]}>
          <Type weight="semi" fontSize={0.17} letterSpacing={0.2} color={cyan} glow={1.8}>
            {"03   ABOUT"}
          </Type>
        </group>
        <group position={[-3.2, 3.6, 0]}>
          <Type weight="bold" fontSize={0.86} letterSpacing={-0.035} glow={1.3} maxWidth={6.4}>
            {"Hey, I'm Farhan."}
          </Type>
        </group>
        <group position={[-3.2, 2.5, 0]}>
          <Type weight="semi" fontSize={0.235} lineHeight={1.25} color="#ffffff" maxWidth={6.3}>
            {profile.tagline}
          </Type>
        </group>
        <group position={[-3.2, 2.05, 0]}>
          <Type weight="light" fontSize={0.18} lineHeight={1.5} color="#d6d0f5" maxWidth={5.7}>
            {profile.bio.slice(0, 2).join("\n\n")}
          </Type>
        </group>
        {/* numbers */}
        <group position={[3.35, 3.75, 0]}>
          {stats.map((s, k) => (
            <group key={s.label} position={[(k % 2) * 1.95, -Math.floor(k / 2) * 1.2, 0]}>
              <Type weight="bold" fontSize={0.6} glow={2.2} color="#e8e0ff">
                {`${s.value}${s.suffix}`}
              </Type>
              <Type fontSize={0.11} letterSpacing={0.14} position={[0.02, -0.7, 0]} color="#8fd8ff">
                {s.label.toUpperCase()}
              </Type>
            </group>
          ))}
        </group>
        {/* credentials */}
        <group position={[3.35, 1.2, 0]}>
          {credentials.map((c, k) => (
            <group key={c.title} position={[0, -k * 0.82, 0]}>
              <mesh position={[-0.16, -0.3, 0]}>
                <planeGeometry args={[0.03, 0.6]} />
                <meshBasicMaterial color={[2.8, 1.6, 0.6]} toneMapped={false} transparent />
              </mesh>
              <Type weight="semi" fontSize={0.2}>
                {c.title}
              </Type>
              <Type fontSize={0.125} position={[0, -0.3, 0]} color="#a8a2cc">
                {`${c.where}  /  ${c.when}`}
              </Type>
            </group>
          ))}
        </group>
        {/* career: nodes on a beam of light */}
        <group position={[TL_X, -1.5, 0]}>
          <mesh ref={beam} position={[0, 0, -0.02]}>
            <planeGeometry args={[TL_W, 0.02]} />
            <meshBasicMaterial color={[1.2, 2.2, 3]} toneMapped={false} transparent />
          </mesh>
          {experience.map((e, k) => (
            <group key={e.hash} position={[k * TL_STEP, 0, 0]}>
              <mesh>
                <circleGeometry args={[e.active ? 0.12 : 0.08, 24]} />
                <meshBasicMaterial color={e.active ? [0.8, 4, 2] : [2, 2, 2.6]} toneMapped={false} transparent />
              </mesh>
              {e.active && (
                <mesh>
                  <ringGeometry args={[0.19, 0.21, 32]} />
                  <meshBasicMaterial color={[0.8, 4, 2]} toneMapped={false} transparent />
                </mesh>
              )}
              <Type weight="semi" fontSize={0.115} letterSpacing={0.12} position={[0, -0.3, 0]} color={e.active ? "#6fffc0" : "#ffcf7f"} glow={1.5}>
                {`${e.hash}   ${e.period.toUpperCase()}`}
              </Type>
              <Type weight="bold" fontSize={0.21} position={[0, -0.54, 0]} maxWidth={3.1} lineHeight={1.05}>
                {e.role}
              </Type>
              <Type fontSize={0.145} position={[0, -1.05, 0]} color={cyan} maxWidth={3.1}>
                {`@ ${e.company}`}
              </Type>
              <Type weight="light" fontSize={0.13} lineHeight={1.42} position={[0, -1.32, 0]} color="#c9c2ea" maxWidth={3.05}>
                {e.desc}
              </Type>
            </group>
          ))}
        </group>
        <group position={[3.35, -0.5, 0]}>
          <Button3D label="DOWNLOAD CV" href={profile.cv} accent={cyan} primary />
          <Button3D label="GITHUB" href={profile.socials.github} accent={cyan} position={[2.1, 0, 0]} />
          <Button3D label="LINKEDIN" href={profile.socials.linkedin} accent={cyan} position={[3.45, 0, 0]} />
        </group>
      </group>
    </group>
  )
}
