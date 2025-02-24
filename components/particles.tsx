"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function Particles({ count = 2000 }) {
  const points = useRef<THREE.Points>(null)

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const distance = Math.random() * 2
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(360)

      const x = distance * Math.sin(theta) * Math.cos(phi)
      const y = distance * Math.sin(theta) * Math.sin(phi)
      const z = distance * Math.cos(theta)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    return positions
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    points.current!.rotation.x = time * 0.05
    points.current!.rotation.y = time * 0.075
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

