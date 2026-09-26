"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import * as THREE from "three"
import { useRoom } from "@/lib/store"
import { BackWall, Floor, LeftWall } from "../canvas/Room"
import { Desk } from "../canvas/Desk"
import { PC } from "../canvas/PC"
import { Shelf } from "../canvas/Shelf"
import { GuitarSpot, PosterWall } from "../canvas/PosterWall"
import { Beanbag, DiscoBall, Dust, FloorPlant } from "../canvas/Extras"
import { Assemble } from "../canvas/Assemble"
import { ROOM_ORIGIN } from "./track"
import { SkillHolo } from "./SkillHolo"

// The dev room, floating above the end of the highway like a lit apartment.
export function SkyRoom() {
  return (
    <group position={ROOM_ORIGIN}>
      <RoomLights />
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
      <Dust />
      <SkillHolo />
    </group>
  )
}

function RoomLights() {
  const ambient = useRef<THREE.AmbientLight>(null)
  const key = useRef<THREE.DirectionalLight>(null)
  const moon = useRef<THREE.DirectionalLight>(null)
  const target = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, dt) => {
    const { lightsOn, party } = useRoom.getState()
    const k = lightsOn ? 1 : 0.3
    if (ambient.current) easing.damp(ambient.current, "intensity", (party ? 0.18 : 0.3) * k, 0.3, dt)
    if (key.current) easing.damp(key.current, "intensity", (party ? 0.3 : 1.2) * k, 0.3, dt)
    if (moon.current) easing.damp(moon.current, "intensity", lightsOn ? 0.9 : 1.5, 0.3, dt)
  })

  return (
    <>
      <primitive object={target} position={[0, 0, -1]} />
      <ambientLight ref={ambient} color="#8f86ff" intensity={0.3} />
      <directionalLight
        ref={key}
        target={target}
        position={[9, 12, 7]}
        color="#ffd9b8"
        intensity={1.2}
      />
      <directionalLight ref={moon} target={target} position={[-3, 6, -9]} color="#8fb0ff" intensity={0.9} />
      <pointLight position={[0.65, 2.6, -3.7]} color="#6fb5ff" intensity={3.5} distance={4.5} decay={1.6} />
    </>
  )
}
