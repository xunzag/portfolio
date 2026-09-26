"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { AdaptiveDpr, ContactShadows, PerformanceMonitor, Preload, Stars } from "@react-three/drei"
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing"
import { ToneMappingMode } from "postprocessing"
import { easing } from "maath"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { CameraRig } from "./CameraRig"
import { RoomShell } from "./Room"
import { Desk } from "./Desk"
import { PC } from "./PC"
import { Shelf } from "./Shelf"
import { PosterWall } from "./PosterWall"
import { Beanbag, DiscoBall, Dust, FloorPlant } from "./Extras"

export default function Scene() {
  const quality = useRoom((s) => s.quality)
  const setQuality = useRoom((s) => s.setQuality)
  const [dpr, setDpr] = useState(1.5)

  // Start low on small / low-power devices; PerformanceMonitor can still upgrade.
  useEffect(() => {
    const weak = window.matchMedia("(max-width: 700px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4
    if (weak) {
      setQuality("low")
      setDpr(1.1)
    }
  }, [setQuality])

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 36, near: 0.1, far: 150, position: [26, 20, 26] }}
      onPointerMissed={() => useRoom.getState().setHovered(null)}
      aria-label="Interactive 3D room — use the navigation buttons or number keys 1 to 5 to explore"
    >
      <color attach="background" args={["#07060d"]} />
      <fog attach="fog" args={["#07060d", 30, 70]} />
      <PerformanceMonitor
        onDecline={() => {
          setQuality("low")
          setDpr(1)
        }}
        onIncline={() => {
          setQuality("high")
          setDpr(Math.min(1.75, window.devicePixelRatio))
        }}
      />
      <AdaptiveDpr pixelated={false} />

      <Lights />
      <Suspense fallback={null}>
        <RoomShell />
        <Desk />
        <PC />
        <Shelf />
        <PosterWall />
        <Beanbag />
        <FloorPlant />
        <DiscoBall />
        <ContactShadows position={[0, 0.02, 0]} scale={11} resolution={512} blur={2.4} opacity={0.55} far={3} frames={1} color="#05030d" />
        <Preload all />
      </Suspense>
      <Dust />
      <Stars radius={70} depth={30} count={1800} factor={3} saturation={0.4} fade speed={0.4} />
      <CameraRig />

      {quality === "high" && (
        <EffectComposer multisampling={4} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={0.85} luminanceThreshold={1} luminanceSmoothing={0.25} radius={0.7} />
          <Vignette darkness={0.55} offset={0.25} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  )
}

function Lights() {
  const ambient = useRef<THREE.AmbientLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const moon = useRef<THREE.DirectionalLight>(null)
  useFrame((_, dt) => {
    const { lightsOn, party } = useRoom.getState()
    const k = lightsOn ? 1 : 0.35
    if (ambient.current) easing.damp(ambient.current, "intensity", (party ? 0.35 : 0.55) * k, 0.3, dt)
    if (hemi.current) easing.damp(hemi.current, "intensity", 0.9 * k, 0.3, dt)
    if (moon.current) easing.damp(moon.current, "intensity", lightsOn ? 1.1 : 1.6, 0.3, dt)
  })
  return (
    <>
      <ambientLight ref={ambient} color="#8f86ff" intensity={0.55} />
      <hemisphereLight ref={hemi} args={["#9d8cff", "#2a1636", 0.9]} />
      {/* moonlight from the window */}
      <directionalLight ref={moon} position={[-3, 6, -9]} color="#8fb0ff" intensity={1.1} />
      {/* warm key from the front so the room reads well from the default angle */}
      <directionalLight position={[8, 10, 6]} color="#ffd7b0" intensity={0.55} />
      {/* monitor spill */}
      <pointLight position={[0.65, 2.6, -3.7]} color="#6fb5ff" intensity={3} distance={4.5} decay={1.6} />
    </>
  )
}
