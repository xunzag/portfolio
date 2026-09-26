"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { woodTexture } from "./textures"

// Shared physically-based materials. One instance each keeps GPU programs + draw state cheap.
function useMaterialSet() {
  const [nWood, nFabric, nPlaster, nLeather] = useTexture(["/tex/n-wood.webp", "/tex/n-fabric.webp", "/tex/n-plaster.webp", "/tex/n-leather.webp"])

  return useMemo(() => {
    const tile = (t: THREE.Texture, r: number) => {
      const c = t.clone()
      c.wrapS = c.wrapT = THREE.RepeatWrapping
      c.repeat.set(r, r)
      c.needsUpdate = true
      return c
    }
    const woodMap = woodTexture()

    const walnut = new THREE.MeshPhysicalMaterial({
      color: "#b07a52",
      map: woodMap,
      normalMap: tile(nWood, 2),
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughness: 0.42,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
    })
    const shelfWood = walnut.clone()
    shelfWood.color.set("#8a5a3b")
    shelfWood.clearcoat = 0.2

    return {
      walnut,
      shelfWood,
      wall: new THREE.MeshStandardMaterial({ color: "#2c2850", roughness: 0.92, normalMap: tile(nPlaster, 3), normalScale: new THREE.Vector2(0.25, 0.25) }),
      wallSide: new THREE.MeshStandardMaterial({ color: "#26224a", roughness: 0.92, normalMap: tile(nPlaster, 3), normalScale: new THREE.Vector2(0.25, 0.25) }),
      trim: new THREE.MeshStandardMaterial({ color: "#16132e", roughness: 0.5 }),
      fabric: new THREE.MeshStandardMaterial({ color: "#4a2f73", roughness: 0.95, normalMap: tile(nFabric, 4), normalScale: new THREE.Vector2(0.6, 0.6) }),
      fabricBlue: new THREE.MeshStandardMaterial({ color: "#2f7fa8", roughness: 0.9, normalMap: tile(nFabric, 3), normalScale: new THREE.Vector2(0.8, 0.8) }),
      leather: new THREE.MeshPhysicalMaterial({ color: "#1b1830", roughness: 0.55, normalMap: tile(nLeather, 2), normalScale: new THREE.Vector2(0.5, 0.5), sheen: 0.4, sheenColor: new THREE.Color("#6b5cff") }),
      leatherAccent: new THREE.MeshPhysicalMaterial({ color: "#6f5cff", roughness: 0.5, normalMap: tile(nLeather, 2), normalScale: new THREE.Vector2(0.5, 0.5) }),
      darkMetal: new THREE.MeshStandardMaterial({ color: "#1d1b2c", metalness: 0.85, roughness: 0.32 }),
      aluminium: new THREE.MeshStandardMaterial({ color: "#b9b7c8", metalness: 1, roughness: 0.28 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 1, roughness: 0.08 }),
      brass: new THREE.MeshStandardMaterial({ color: "#e0b25a", metalness: 1, roughness: 0.25 }),
      plasticBlack: new THREE.MeshPhysicalMaterial({ color: "#0e0d18", roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
      plasticWhite: new THREE.MeshPhysicalMaterial({ color: "#eceaf6", roughness: 0.3, clearcoat: 0.4 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#0b0a12", roughness: 0.9 }),
      ceramic: new THREE.MeshPhysicalMaterial({ color: "#ff6b8b", roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 }),
      ceramicWhite: new THREE.MeshPhysicalMaterial({ color: "#f1eef9", roughness: 0.2, clearcoat: 1 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#b8c6ff",
        roughness: 0.04,
        metalness: 0,
        transparent: true,
        opacity: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      screenGlass: new THREE.MeshPhysicalMaterial({ color: "#000000", roughness: 0.06, transparent: true, opacity: 0.2, clearcoat: 1, depthWrite: false }),
      leaf: new THREE.MeshStandardMaterial({ color: "#3a9464", roughness: 0.55, side: THREE.DoubleSide }),
      leafDark: new THREE.MeshStandardMaterial({ color: "#2c7a50", roughness: 0.6, side: THREE.DoubleSide }),
      soil: new THREE.MeshStandardMaterial({ color: "#2b1d14", roughness: 1 }),
      terracotta: new THREE.MeshStandardMaterial({ color: "#c56a4a", roughness: 0.8 }),
    }
  }, [nWood, nFabric, nPlaster, nLeather])
}

export type Materials = ReturnType<typeof useMaterialSet>
const Ctx = createContext<Materials | null>(null)

export function MaterialsProvider({ children }: { children: ReactNode }) {
  const m = useMaterialSet()
  return <Ctx.Provider value={m}>{children}</Ctx.Provider>
}

export function useMat() {
  const m = useContext(Ctx)
  if (!m) throw new Error("useMat must be used inside <MaterialsProvider>")
  return m
}
