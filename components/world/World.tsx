"use client"

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdaptiveDpr, Environment, Lightformer, PerformanceMonitor, Preload } from "@react-three/drei"
import { Bloom, ChromaticAberration, EffectComposer, N8AO, Noise, Outline, Selection, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing"
import { BlendFunction, KernelSize, ToneMappingMode, type ChromaticAberrationEffect } from "postprocessing"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { MaterialsProvider } from "../canvas/materials"
import { live } from "./live"
import { zones } from "./track"
import { ScrollRig } from "./ScrollRig"
import { Sky } from "./Sky"
import { City, FOG } from "./City"
import { Bike } from "./Bike"
import { SkyRoom } from "./SkyRoom"
import { Realm } from "./Realm"
import { Rooftop } from "./Rooftop"

export default function World() {
  const quality = useRoom((s) => s.quality)
  const setQuality = useRoom((s) => s.setQuality)
  const [dpr, setDpr] = useState(1.5)

  useEffect(() => {
    const weak = window.matchMedia("(max-width: 700px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4
    if (weak) {
      setQuality("low")
      setDpr(1.1)
    } else setDpr(Math.min(1.75, window.devicePixelRatio))
  }, [setQuality])

  const high = quality === "high"

  return (
    <Canvas
      shadows
      dpr={dpr}
      gl={{ antialias: !high, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 36, near: 0.1, far: 600, position: [6, 2.4, 6] }}
      onPointerMissed={() => useRoom.getState().setHovered(null)}
      aria-hidden
    >
      <color attach="background" args={["#06050c"]} />
      <fogExp2 attach="fog" args={[FOG, 0.0105]} />
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

      <Sky />
      <ambientLight intensity={0.25} color="#8f86ff" />
      <hemisphereLight args={["#6f5cff", "#12061a", 0.45]} />

      <Selection>
        <Suspense fallback={null}>
          <NeonEnvironment />
          <MaterialsProvider>
            <Zone name="city">
              <City />
              <Bike />
            </Zone>
            <Zone name="room">
              <SkyRoom />
            </Zone>
            <Zone name="realm">
              <Realm />
            </Zone>
            <Zone name="roof">
              <Rooftop />
            </Zone>
            <ShadowSetup />
          </MaterialsProvider>
          <Preload all />
        </Suspense>
        <ScrollRig />
        <FogByZone />
        {high && <Effects />}
      </Selection>
    </Canvas>
  )
}

// Only the worlds near the current scroll position render (and cast shadows).
function Zone({ name, children }: { name: keyof ReturnType<typeof zones>; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (ref.current) ref.current.visible = zones(live.scroll)[name]
  })
  return <group ref={ref}>{children}</group>
}

// Thick neon haze in the city, clearer air elsewhere.
function FogByZone() {
  const scene = useThree((s) => s.scene)
  useFrame(() => {
    const fog = scene.fog as THREE.FogExp2 | null
    if (!fog) return
    const c = live.frame.chapter
    fog.density = c === "life" ? 0.004 : c === "contact" ? 0.006 : c === "about" || c === "stack" || c === "portal" ? 0.0 : 0.0105
    if (c === "life") fog.color.set("#e9a3cf")
    else if (c === "contact") fog.color.set("#5a3450")
    else fog.color.copy(FOG)
  })
  return null
}

// A studio of neon light panels: everything glossy picks up magenta/cyan reflections.
function NeonEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#05040a"]} />
      <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
      <Lightformer form="rect" intensity={5} color="#ff3fd0" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[4, 10, 1]} />
      <Lightformer form="rect" intensity={5} color="#3fd8ff" position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[4, 10, 1]} />
      <Lightformer form="rect" intensity={2} color="#ffb27a" position={[0, 2, 6]} scale={[10, 2, 1]} />
      <Lightformer form="ring" intensity={3} color="#9d7bff" position={[0, 3, -6]} scale={3} />
    </Environment>
  )
}

function ShadowSetup() {
  const scene = useThree((s) => s.scene)
  const built = useRoom((s) => s.roomBuilt)
  useLayoutEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh || (mesh as unknown as THREE.InstancedMesh).isInstancedMesh) return
      const mat = mesh.material as THREE.Material & { transparent?: boolean }
      const basic = (mat as THREE.MeshBasicMaterial).isMeshBasicMaterial || (mat as THREE.ShaderMaterial).isShaderMaterial
      if (mesh.userData.noShadow || basic || mat.transparent) return
      mesh.castShadow = true
      mesh.receiveShadow = true
    })
  }, [scene, built])
  return null
}

function Effects() {
  const ca = useRef<ChromaticAberrationEffect>(null)
  const offset = useMemo(() => new THREE.Vector2(0.0004, 0.0004), [])
  useFrame(() => {
    // lens fringing kicks in with scroll speed and during warps
    const v = Math.min(1, Math.abs(live.velocity) * 0.06)
    const k = 0.0004 + v * 0.004 + live.frame.flash * 0.006
    offset.set(k, k * 0.6)
  })
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO halfRes aoRadius={0.55} distanceFalloff={0.6} intensity={2} color="#05030d" />
      <Outline blendFunction={BlendFunction.SCREEN} edgeStrength={6} visibleEdgeColor={0x9d8cff} hiddenEdgeColor={0x3a2f80} kernelSize={KernelSize.SMALL} blur xRay={false} />
      <Bloom mipmapBlur intensity={1.05} luminanceThreshold={1} luminanceSmoothing={0.25} radius={0.75} />
      <ChromaticAberration ref={ca} offset={offset} radialModulation modulationOffset={0.2} />
      <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
      <Vignette darkness={0.55} offset={0.28} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <SMAA />
    </EffectComposer>
  )
}
