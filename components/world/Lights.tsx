"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { PROJECT_VH, RANGES } from "@/lib/chapters"
import { projects } from "@/lib/content"
import { live } from "./live"
import { MOON_DIR } from "./Sky"
import { FACTS, REALM, STACK, carAt, projectStation } from "./track"

/** where the Weeknd's island sits inside the realm */
export const WEEKND_POS: [number, number, number] = [12.5, 2, -7.2]

// Every light in the world lives here, always mounted, never hidden.
// three.js bakes the number of lights into each material's shader, so a light
// that appears or disappears mid-scroll forces a recompile — a visible hitch.
// Lights that belong to a moving thing (the car, the active screen) are simply
// re-aimed every frame instead.
export function Lights() {
  const key = useRef<THREE.SpotLight>(null)
  const car = useRef<THREE.PointLight>(null)
  const screen = useRef<THREE.PointLight>(null)
  const target = useMemo(() => new THREE.Object3D(), [])
  const accents = useMemo(() => projects.map((p) => new THREE.Color(p.accent)), [])
  const stations = useMemo(() => projects.map((_, i) => projectStation(i)), [])

  useFrame(({ clock, gl }) => {
    const s = live.scroll
    const t = clock.elapsedTime % 7
    // lightning-ish flicker on Guts every few seconds
    if (key.current) key.current.intensity = 70 + (t > 6.6 && Math.sin(t * 90) > 0 ? 160 : 0)
    // the shadow map only matters while Guts is on screen
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = s < RANGES.work[0] + 90

    const c = carAt(s)
    car.current?.position.set(c.pos.x, c.pos.y + 2.2, c.pos.z)

    // one glow serves all nine screens: it sits under whichever is lit
    if (screen.current) {
      const i = THREE.MathUtils.clamp(Math.round((s - RANGES.work[0] - PROJECT_VH * 0.55) / PROJECT_VH), 0, projects.length - 1)
      const st = stations[i]
      screen.current.position.set(st.center.x, st.center.y - 0.6, st.center.z + 2.2)
      screen.current.color.lerp(accents[i], 0.1)
      const inWork = s > RANGES.work[0] && s < RANGES.work[1] + 40
      screen.current.intensity += ((inWork ? 14 : 0) - screen.current.intensity) * 0.08
    }
  })

  return (
    <>
      {/* moonlight from ahead, a violet bounce from the clouds below */}
      <ambientLight intensity={0.22} color="#8f7fd6" />
      <hemisphereLight args={["#6f7fe0", "#3a1054", 0.75]} />
      <directionalLight position={MOON_DIR.clone().multiplyScalar(60)} intensity={2.4} color="#d6dcff" />
      <directionalLight position={[-20, 12, 30]} intensity={0.55} color="#ff7fd0" />

      {/* Guts: key from above + neon rims from behind */}
      <primitive object={target} position={[0, 0.8, 0]} />
      <spotLight ref={key} target={target} position={[1.5, 9, 3]} angle={0.42} penumbra={0.8} intensity={70} distance={20} decay={1.5} color="#ffe2d0" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
      <pointLight position={[-2.6, 2.2, -2.2]} color="#ff2d6f" intensity={30} distance={8} decay={1.6} />
      <pointLight position={[2.8, 2.6, -1.6]} color="#2dd8ff" intensity={30} distance={8} decay={1.6} />

      <pointLight ref={car} color="#cdbfff" intensity={5} distance={7} decay={1.6} />
      <pointLight ref={screen} color="#ffffff" intensity={0} distance={9} decay={1.6} />
      {/* the desk lamp */}
      <pointLight position={[FACTS.x - 1, FACTS.y + 1.8, FACTS.z + 3.2]} color="#ffd9a8" intensity={26} distance={11} decay={1.6} />
      {/* the blade */}
      <pointLight position={[STACK.x, STACK.y + 0.8, STACK.z + 1.5]} color="#9fb4ff" intensity={8} distance={8} decay={1.6} />
      {/* After Hours: a hard red key and a cold rim on the Weeknd */}
      <pointLight position={[REALM.x + WEEKND_POS[0], REALM.y + WEEKND_POS[1] + 2.2, REALM.z + WEEKND_POS[2] + 4.5]} color="#ff1f3d" intensity={110} distance={16} decay={1.5} />
      <pointLight position={[REALM.x + WEEKND_POS[0] - 4, REALM.y + WEEKND_POS[1] + 9, REALM.z + WEEKND_POS[2] - 4]} color="#5f8cff" intensity={60} distance={16} decay={1.5} />
    </>
  )
}
