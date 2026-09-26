"use client"

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdaptiveDpr, Environment, PerformanceMonitor, Preload, Stars } from "@react-three/drei"
import { Bloom, EffectComposer, N8AO, Outline, Selection, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing"
import { BlendFunction, KernelSize, ToneMappingMode } from "postprocessing"
import { easing } from "maath"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { CameraRig } from "./CameraRig"
import { BackWall, Floor, LeftWall } from "./Room"
import { Desk } from "./Desk"
import { PC } from "./PC"
import { Shelf } from "./Shelf"
import { GuitarSpot, PosterWall } from "./PosterWall"
import { Beanbag, DiscoBall, Dust, FloorPlant } from "./Extras"
import { Assemble } from "./Assemble"
import { MaterialsProvider } from "./materials"
import { Backdrop } from "./Backdrop"

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
    } else setDpr(Math.min(1.75, window.devicePixelRatio))
  }, [setQuality])

  const high = quality === "high"

  return (
    <Canvas
      shadows="soft"
      dpr={dpr}
      gl={{ antialias: !high, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 34, near: 0.1, far: 200, position: [4, 34, 10] }}
      onPointerMissed={() => useRoom.getState().setHovered(null)}
      aria-label="Interactive 3D room — use the navigation buttons or number keys 1 to 5 to explore"
    >
      <color attach="background" args={["#06050c"]} />
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

      <Backdrop />
      <Stars radius={80} depth={40} count={2200} factor={3.2} saturation={0.5} fade speed={0.35} />
      <Lights high={high} />

      <Selection>
        <Suspense fallback={null}>
          <Environment files="/env/apartment.exr" environmentIntensity={0.45} />
          <MaterialsProvider>
            <Assemble mode="rise">
              <Floor />
            </Assemble>
            <Assemble mode="unfoldX" pivot={[0, 0, -5.2]} delay={0.3}>
              <BackWall />
            </Assemble>
            <Assemble mode="unfoldZ" pivot={[-5.2, 0, 0]} delay={0.45}>
              <LeftWall>
                <PosterWall />
              </LeftWall>
            </Assemble>
            <Assemble mode="drop" delay={0.85}>
              <Desk />
            </Assemble>
            <Assemble mode="drop" delay={1.05}>
              <PC />
            </Assemble>
            <Assemble mode="drop" delay={1.2}>
              <Shelf />
            </Assemble>
            <Assemble mode="pop" delay={1.45}>
              <GuitarSpot />
            </Assemble>
            <Assemble mode="drop" delay={1.35}>
              <Beanbag />
            </Assemble>
            <Assemble mode="pop" delay={1.6}>
              <FloorPlant />
            </Assemble>
            <DiscoBall />
            <ShadowSetup />
          </MaterialsProvider>
          <Preload all />
        </Suspense>

        <Dust />
        <CameraRig />

        {high && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <N8AO halfRes aoRadius={0.55} distanceFalloff={0.6} intensity={2.2} color="#05030d" />
            <Outline blendFunction={BlendFunction.SCREEN} edgeStrength={6} visibleEdgeColor={0x9d8cff} hiddenEdgeColor={0x3a2f80} kernelSize={KernelSize.SMALL} blur xRay={false} />
            <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.25} radius={0.72} />
            <Vignette darkness={0.5} offset={0.3} />
            <ToneMapping mode={ToneMappingMode.AGX} />
            <SMAA />
          </EffectComposer>
        )}
      </Selection>
    </Canvas>
  )
}

// Everything casts and receives shadows unless it opts out (emissive bits, glass, labels).
function ShadowSetup() {
  const scene = useThree((s) => s.scene)
  const phase = useRoom((s) => s.phase)
  useLayoutEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const mat = mesh.material as THREE.Material & { transparent?: boolean }
      const basic = (mat as THREE.MeshBasicMaterial).isMeshBasicMaterial || (mat as THREE.ShaderMaterial).isShaderMaterial
      if (mesh.userData.noShadow || basic || mat.transparent) return
      mesh.castShadow = true
      mesh.receiveShadow = true
    })
  }, [scene, phase])
  return null
}

function Lights({ high }: { high: boolean }) {
  const ambient = useRef<THREE.AmbientLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const key = useRef<THREE.DirectionalLight>(null)
  const moon = useRef<THREE.DirectionalLight>(null)
  const size = high ? 2048 : 1024

  useFrame((_, dt) => {
    const { lightsOn, party } = useRoom.getState()
    const k = lightsOn ? 1 : 0.3
    if (ambient.current) easing.damp(ambient.current, "intensity", (party ? 0.18 : 0.28) * k, 0.3, dt)
    if (hemi.current) easing.damp(hemi.current, "intensity", 0.55 * k, 0.3, dt)
    if (key.current) easing.damp(key.current, "intensity", (party ? 0.3 : 1.25) * k, 0.3, dt)
    if (moon.current) easing.damp(moon.current, "intensity", lightsOn ? 0.9 : 1.5, 0.3, dt)
  })

  const shadowCam = useMemo(() => ({ left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 }), [])

  return (
    <>
      <ambientLight ref={ambient} color="#8f86ff" intensity={0.28} />
      <hemisphereLight ref={hemi} args={["#a596ff", "#2a1636", 0.55]} />
      {/* warm key from the front: the only shadow caster */}
      <directionalLight
        ref={key}
        position={[9, 12, 7]}
        color="#ffd9b8"
        intensity={1.25}
        castShadow
        shadow-mapSize={[size, size]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={6}
        shadow-camera-left={shadowCam.left}
        shadow-camera-right={shadowCam.right}
        shadow-camera-top={shadowCam.top}
        shadow-camera-bottom={shadowCam.bottom}
        shadow-camera-near={shadowCam.near}
        shadow-camera-far={shadowCam.far}
      />
      {/* cool moonlight through the window */}
      <directionalLight ref={moon} position={[-3, 6, -9]} color="#8fb0ff" intensity={0.9} />
      {/* monitor spill */}
      <pointLight position={[0.65, 2.6, -3.7]} color="#6fb5ff" intensity={3.5} distance={4.5} decay={1.6} />
    </>
  )
}
