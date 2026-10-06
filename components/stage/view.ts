import { CASE_VH, RANGES, clamp01, easeInOutSine, local, ss } from "@/lib/acts"

// ── The "camera" over the two paintings ────────────────────────────────
// Each painting is drawn full-screen by a depth-parallax shader. Instead of a
// 3D camera we drive four numbers: where in the image we look (focus), how far
// in we are (zoom), how much the depth map pushes near things towards us
// (dolly), plus how visible each layer is. The DOM uses the same numbers to pin
// labels onto the art.

export const IMG_ASPECT = 2000 / 1126

/** focus x, focus y (image coords, y down), zoom, dolly */
type Key = [t: number, fx: number, fy: number, zoom: number, dolly: number]

const HERO: Key[] = [
  [0.0, 0.5, 0.47, 1.0, 0],
  [0.2, 0.5, 0.5, 1.1, 0.04],
  [0.55, 0.46, 0.63, 1.65, 0.16],
  [1.0, 0.41, 0.765, 7.5, 0.5],
]

const ARSENAL_PATH: Key[] = [
  [0.0, 0.16, 0.45, 2.05, 0],
  [0.2, 0.19, 0.47, 1.95, 0.03],
  [0.27, 0.36, 0.24, 2.3, 0],
  [0.43, 0.38, 0.26, 2.2, 0.03],
  [0.5, 0.71, 0.3, 2.6, 0],
  [0.66, 0.72, 0.32, 2.45, 0.03],
  [0.74, 0.5, 0.5, 1.0, 0],
  [0.88, 0.5, 0.52, 1.07, 0.04],
  [1.0, 0.535, 0.745, 7.5, 0.45],
]

function path(keys: Key[], t: number) {
  let j = 0
  while (j < keys.length - 2 && t >= keys[j + 1][0]) j++
  const a = keys[j]
  const b = keys[j + 1]
  const u = easeInOutSine(clamp01((t - a[0]) / (b[0] - a[0])))
  const lerp = (x: number, y: number) => x + (y - x) * u
  return {
    fx: lerp(a[1], b[1]),
    fy: lerp(a[2], b[2]),
    // zoom in log space so the push feels constant-speed
    zoom: Math.exp(lerp(Math.log(a[3]), Math.log(b[3]))),
    dolly: lerp(a[4], b[4]),
  }
}

export type View = {
  /** 0 hero painting, 1 arsenal painting */
  art: 0 | 1
  fx: number
  fy: number
  zoom: number
  dolly: number
  /** painting brightness 0..1 */
  bright: number
  /** white-hot flash 0..1 */
  flash: number
  /** the work-act backdrop 0..1 */
  backdrop: number
  /** the 3D finale 0..1 */
  finale: number
  /** per-art effect knobs */
  heroT: number
  arsenalT: number
}

const out: View = { art: 0, fx: 0.5, fy: 0.5, zoom: 1, dolly: 0, bright: 1, flash: 0, backdrop: 0, finale: 0, heroT: 0, arsenalT: 0 }

export function view(s: number): View {
  const [w0, w1] = RANGES.work
  const [a0] = RANGES.arsenal
  const [f0] = RANGES.finale
  out.heroT = local(s, "hero")
  out.arsenalT = local(s, "arsenal")
  out.flash = 0
  out.finale = 0
  if (s < w0 + CASE_VH * 0.2) {
    // Act I: dolly over his shoulder into the monitor
    Object.assign(out, path(HERO, out.heroT))
    out.art = 0
    out.bright = 1 - ss(w0 - 2, w0 + 6, s)
    out.flash = ss(w0 - 30, w0, s) * (1 - ss(w0, w0 + 14, s))
    out.backdrop = ss(w0 - 4, w0 + 8, s)
  } else if (s < w1 - CASE_VH * 0.3) {
    // Act II: inside the monitor
    out.art = 1
    out.bright = 0
    out.backdrop = 1
    Object.assign(out, path(ARSENAL_PATH, 0))
  } else if (s < f0) {
    // Act III: the last case file tears open onto the arsenal painting
    Object.assign(out, path(ARSENAL_PATH, out.arsenalT))
    out.art = 1
    out.backdrop = 1 - ss(w1 - CASE_VH * 0.2, w1, s)
    out.bright = ss(w1 - CASE_VH * 0.25, w1 - CASE_VH * 0.05, s) * (1 - ss(0.94, 1, out.arsenalT))
    out.flash = 0
  } else {
    // Act IV: the eclipse
    Object.assign(out, path(ARSENAL_PATH, 1))
    out.art = 1
    out.bright = 0
    out.backdrop = 0
    out.flash = 0
    out.finale = ss(f0 + 8, f0 + 22, s)
  }
  return out
}

/** The visible window into the image for a viewport (image coords, y down). */
export function frame(v: Pick<View, "fx" | "fy" | "zoom">, w: number, h: number) {
  const A = w / h
  const vw = (A >= IMG_ASPECT ? 1 : A / IMG_ASPECT) / v.zoom
  const vh = (A >= IMG_ASPECT ? IMG_ASPECT / A : 1) / v.zoom
  // keep the window inside the painting
  const fx = Math.min(1 - vw / 2, Math.max(vw / 2, v.fx))
  const fy = Math.min(1 - vh / 2, Math.max(vh / 2, v.fy))
  return { fx, fy, vw, vh }
}

/** image coords → CSS px (ignores the depth push; good enough for labels) */
export function imgToScreen(u: number, v: number, f: ReturnType<typeof frame>, w: number, h: number) {
  return { x: ((u - f.fx) / f.vw + 0.5) * w, y: ((v - f.fy) / f.vh + 0.5) * h }
}

export function screenToImg(x: number, y: number, f: ReturnType<typeof frame>, w: number, h: number) {
  return { u: f.fx + (x / w - 0.5) * f.vw, v: f.fy + (y / h - 0.5) * f.vh }
}
