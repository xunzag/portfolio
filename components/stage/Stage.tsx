"use client"

import { Suspense, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei"
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { live } from "../live"
import { Painting } from "./Painting"
import { Backdrop } from "./Backdrop"
import { Particles } from "./Particles"
import { Finale } from "./Finale"

// One canvas for the whole film. Paintings and the void are full-screen
// shader quads; particles float in camera space; the finale is a real 3D set.

export default function Stage() {
  const quality = useRoom((s) => s.quality)
  const [dpr, setDpr] = useState(1.5)

  useEffect(() => {
    const weak = useRoom.getState().quality === "low"
    setDpr(weak ? 1 : Math.min(1.5, window.devicePixelRatio))
  }, [])

  return (
    <Canvas
      dpr={dpr}
      camera={{ fov: 45, near: 0.1, far: 500, position: [0, 0, 0] }}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false, toneMapping: THREE.NoToneMapping }}
      onCreated={({ gl }) => gl.setClearColor("#030204")}
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <Backdrop />
        <Painting />
        <Finale />
        <Particles />
        <Preload all />
      </Suspense>
      <Effects high={quality === "high"} />
    </Canvas>
  )
}

function Effects({ high }: { high: boolean }) {
  const ca = useState(() => new THREE.Vector2())[0]
  useFrame(() => {
    // a touch of chromatic split when you scroll fast
    const k = Math.min(0.004, Math.abs(live.velocity) * 0.00003)
    ca.set(k, k * 0.5)
  })
  return high ? (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur luminanceThreshold={0.62} luminanceSmoothing={0.2} intensity={0.85} radius={0.7} />
      <ChromaticAberration offset={ca} radialModulation modulationOffset={0.3} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.12} />
      <Vignette offset={0.25} darkness={0.75} />
    </EffectComposer>
  ) : (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur luminanceThreshold={0.65} intensity={0.7} />
      <Vignette offset={0.25} darkness={0.7} />
    </EffectComposer>
  )
}
