"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function BlackHoleEffect() {
  const mesh = useRef<THREE.Mesh>(null)

  const uniforms = {
    uTime: { value: 0 },
    uIntensity: { value: 0.5 },
  }

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vec2 center = vec2(0.5);
      vec2 pos = vUv - center;
      float dist = length(pos);
      
      float strength = 0.15 / dist;
      strength = pow(strength, 1.5);

      vec3 color = vec3(strength) * vec3(0.1, 0.3, 0.9);
      color += vec3(0.1, 0.1, 0.2);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  useFrame((state) => {
    const { clock } = state
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = clock.getElapsedTime()
      mesh.current.rotation.z += 0.001
    }
  })

  return (
    <mesh ref={mesh} position={[0, 0, -1]}>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

