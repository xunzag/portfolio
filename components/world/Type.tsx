"use client"

import { forwardRef, useMemo } from "react"
import { Text } from "@react-three/drei"
import * as THREE from "three"

export const FONTS = {
  bold: "/fonts/inter-bold.woff",
  semi: "/fonts/inter-semi-bold.woff",
  regular: "/fonts/inter-regular.woff",
  light: "/fonts/inter-light.woff",
}

type Props = Omit<React.ComponentProps<typeof Text>, "color"> & { color?: string; glow?: number; opacity?: number; weight?: keyof typeof FONTS }

/**
 * SDF text that lives in the world. `glow` > 1 pushes the colour past the bloom
 * threshold so headlines softly bleed light.
 */
export const Type = forwardRef<THREE.Mesh, Props>(function Type({ glow = 1, opacity = 1, weight = "regular", color = "#ece9ff", children, ...props }, ref) {
  const c = useMemo(() => new THREE.Color(color).multiplyScalar(glow), [color, glow])
  // keep to glyphs the bundled font has, so troika never fetches fallback fonts
  const text = typeof children === "string" ? clean(children) : children
  return (
    <Text ref={ref} font={FONTS[weight]} anchorX="left" anchorY="top" letterSpacing={-0.01} {...props}>
      {text}
      <meshBasicMaterial attach="material" toneMapped={false} color={c} transparent opacity={opacity} depthWrite={false} />
    </Text>
  )
})

function clean(s: string) {
  return s
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00b7/g, "/")
    .replace(/[^\x20-\x7e\n]/g, "")
}
