"use client"

import { forwardRef, useEffect, useMemo } from "react"
import { useThree } from "@react-three/fiber"
import { CopyPass, Effect } from "postprocessing"
import * as THREE from "three"
import { cut } from "../cut"

// The katana cut: freeze the current frame, split it along the stroke and let
// the two halves slide apart over the next scene, with white-hot edges.

const frag = /* glsl */ `
  uniform sampler2D tSnap;
  uniform float uHas; uniform float uOpen; uniform float uAspect;
  uniform vec2 uA; uniform vec2 uN;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor;
    if (uHas < 0.5) return;
    vec2 asp = vec2(uAspect, 1.0);
    vec2 tang = vec2(-uN.y, uN.x);
    float side = sign(dot((uv - uA) * asp, uN));
    // each half slides away from the cut and shears along it
    float e = uOpen;
    vec2 off = (uN * side * e * 0.75 + tang * side * e * 0.12) / asp;
    vec2 suv = uv - off;
    float sd = dot((suv - uA) * asp, uN);
    bool inside = sign(sd) == side && all(greaterThan(suv, vec2(0.0))) && all(lessThan(suv, vec2(1.0)));
    if (inside) {
      vec3 old = texture2D(tSnap, suv).rgb;
      // the frozen frame dims as it leaves
      outputColor.rgb = old * (1.0 - e * 0.35);
      // white-hot cut edge, cooling to red
      float edge = exp(-abs(sd) * mix(500.0, 90.0, e));
      outputColor.rgb += mix(vec3(1.0, 0.95, 0.9), vec3(1.0, 0.12, 0.08), smoothstep(0.0, 0.5, e)) * edge * (1.6 - e);
    } else {
      // light spills out of the gap
      float gap = exp(-abs(dot((uv - uA) * asp, uN)) * 16.0) * (1.0 - e) * (1.0 - e);
      outputColor.rgb += vec3(1.0, 0.25, 0.15) * gap * 0.3;
    }
  }
`

class CutEffectImpl extends Effect {
  copy: CopyPass
  snap: THREE.WebGLRenderTarget
  constructor() {
    super("CutEffect", frag, {
      uniforms: new Map<string, THREE.Uniform>([
        ["tSnap", new THREE.Uniform(null)],
        ["uHas", new THREE.Uniform(0)],
        ["uOpen", new THREE.Uniform(0)],
        ["uAspect", new THREE.Uniform(1)],
        ["uA", new THREE.Uniform(new THREE.Vector2(0.5, 0.5))],
        ["uN", new THREE.Uniform(new THREE.Vector2(0, 1))],
      ]),
    })
    this.snap = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false, stencilBuffer: false })
    this.copy = new CopyPass(this.snap, false)
    this.uniforms.get("tSnap")!.value = this.snap.texture
  }
  update(renderer: THREE.WebGLRenderer, inputBuffer: THREE.WebGLRenderTarget) {
    if (cut.pending) {
      const rt = this.snap
      if (rt.width !== inputBuffer.width || rt.height !== inputBuffer.height) rt.setSize(inputBuffer.width, inputBuffer.height)
      // freeze this exact frame before the scroll jumps
      this.copy.render(renderer, inputBuffer, null as unknown as THREE.WebGLRenderTarget)
      cut.pending = false
      cut.snapped = true
    }
    const u = this.uniforms
    u.get("uHas")!.value = cut.has
    u.get("uOpen")!.value = cut.open
    ;(u.get("uA")!.value as THREE.Vector2).set(cut.a[0], cut.a[1])
    ;(u.get("uN")!.value as THREE.Vector2).set(cut.n[0], cut.n[1])
  }
  setSize(width: number, height: number) {
    this.snap.setSize(width, height)
    this.uniforms.get("uAspect")!.value = width / height
  }
}

export const CutEffect = forwardRef<CutEffectImpl>(function CutEffect(_, ref) {
  const effect = useMemo(() => new CutEffectImpl(), [])
  const size = useThree((s) => s.size)
  useEffect(() => {
    effect.uniforms.get("uAspect")!.value = size.width / size.height
  }, [effect, size])
  useEffect(() => () => effect.dispose(), [effect])
  return <primitive ref={ref} object={effect} dispose={null} />
})
