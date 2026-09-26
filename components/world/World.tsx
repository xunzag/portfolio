"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { AdaptiveDpr, Environment, Lightformer, PerformanceMonitor, Preload } from "@react-three/drei"
import { Bloom, ChromaticAberration, EffectComposer, Noise, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing"
import { BlendFunction, ToneMappingMode } from "postprocessing"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { MaterialsProvider } from "../canvas/materials"
import { live } from "./live"
import { zones } from "./track"
import { ScrollRig } from "./ScrollRig"
import { Sky } from "./Sky"
import { Dream, Dust } from "./Dream"
import { Hero } from "./Hero"
import { AboutStation, FactsStation, ProjectStations } from "./Stations"
import { SkyRoom } from "./SkyRoom"
import { Realm } from "./Realm"
import { ContactStation } from "./ContactStation"

export default function World() {
  const quality = useRoom((s) => s.quality)
  const setQuality = useRoom((s) => s.setQuality)
  const [dpr, setDpr] = useState(1.25)

  useEffect(() => {
    const forced = new URLSearchParams(location.search).get("quality")
    const weak = forced === "low" || (forced !== "high" && (window.matchMedia("(max-width: 700px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4))
    if (weak) {
      setQuality("low")
      setDpr(1)
    } else setDpr(Math.min(1.5, window.devicePixelRatio))
  }, [setQuality])

  const high = quality === "high"

  return (
    <Canvas
      shadows
      dpr={dpr}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false, depth: true }}
      camera={{ fov: 36, near: 0.1, far: 900, position: [6, 2.4, 6] }}
      aria-hidden
    >
      <color attach="background" args={["#07051a"]} />
      <fogExp2 attach="fog" args={["#140a2a", 0.006]} />
      <PerformanceMonitor
        onDecline={() => {
          setQuality("low")
          setDpr(1)
        }}
        onIncline={() => {
          setQuality("high")
          setDpr(Math.min(1.5, window.devicePixelRatio))
        }}
      />
      <AdaptiveDpr pixelated={false} />

      <Sky />
      <ambientLight intensity={0.35} color="#a58cff" />
      <hemisphereLight args={["#b69cff", "#1a0a2a", 0.6]} />
      <Dust />

      <Suspense fallback={null}>
        <NeonEnvironment />
        <MaterialsProvider>
          <Zone name="dream">
            <Dream />
            <Hero />
            <ProjectStations />
            <AboutStation />
            <FactsStation />
          </Zone>
          <Zone name="room">
            <SkyRoom />
          </Zone>
          <Zone name="realm">
            <Realm />
            <ContactStation />
          </Zone>
        </MaterialsProvider>
        <Preload all />
      </Suspense>
      <ScrollRig />
      <Effects high={high} />
    </Canvas>
  )
}

// Only the worlds near the current scroll position render.
function Zone({ name, children }: { name: keyof ReturnType<typeof zones>; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (ref.current) ref.current.visible = zones(live.scroll)[name]
  })
  return <group ref={ref}>{children}</group>
}

// Soft studio of coloured light panels, baked once: glossy things pick up pink/cyan reflections.
function NeonEnvironment() {
  return (
    <Environment resolution={128} frames={1}>
      <color attach="background" args={["#0a0616"]} />
      <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
      <Lightformer form="rect" intensity={4.5} color="#ff4fc8" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[4, 10, 1]} />
      <Lightformer form="rect" intensity={4.5} color="#4fd8ff" position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[4, 10, 1]} />
      <Lightformer form="ring" intensity={3} color="#b18cff" position={[0, 3, -6]} scale={3} />
    </Environment>
  )
}

function Effects({ high }: { high: boolean }) {
  const offset = useMemo(() => new THREE.Vector2(0.0004, 0.0004), [])
  useFrame(() => {
    const v = Math.min(1, Math.abs(live.velocity) * 0.06)
    const k = 0.0003 + v * 0.0035 + live.frame.flash * 0.006
    offset.set(k, k * 0.6)
  })
  if (!high)
    return (
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.3} radius={0.75} levels={5} />
        <Vignette darkness={0.5} offset={0.3} />
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    )
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={1.15} luminanceThreshold={1} luminanceSmoothing={0.3} radius={0.78} levels={7} />
      <ChromaticAberration offset={offset} radialModulation modulationOffset={0.25} />
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
      <Vignette darkness={0.5} offset={0.3} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <SMAA />
    </EffectComposer>
  )
}
