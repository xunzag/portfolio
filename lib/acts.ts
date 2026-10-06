// The site is one scroll "film" in four acts. Each act owns a slice of the page
// (in vh); the WebGL stage and the DOM acts key off the same numbers.

export type ActId = "hero" | "work" | "arsenal" | "finale"

/** vh per project inside the Work act */
export const CASE_VH = 120

export const ACTS: { id: ActId; vh: number }[] = [
  { id: "hero", vh: 300 },
  { id: "work", vh: CASE_VH * 7 },
  { id: "arsenal", vh: 620 },
  { id: "finale", vh: 460 },
]

export const TOTAL_VH = ACTS.reduce((n, c) => n + c.vh, 0)

export const RANGES = (() => {
  const out = {} as Record<ActId, [number, number]>
  let at = 0
  ACTS.forEach((c, i) => {
    // the last act ends one screen early: that's the final viewport
    const end = i === ACTS.length - 1 ? TOTAL_VH - 100 : at + c.vh
    out[c.id] = [at, end]
    at += c.vh
  })
  return out
})()

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** 0..1 progress through an act (clamped) */
export const local = (s: number, id: ActId) => {
  const [a, b] = RANGES[id]
  return clamp01((s - a) / (b - a))
}

export function actAt(s: number): ActId {
  for (const c of ACTS) if (s < RANGES[c.id][1]) return c.id
  return "finale"
}

/** smoothstep */
export const ss = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** fade in over [a,b], hold, fade out over [c,d] */
export const band = (x: number, a: number, b: number, c: number, d: number) => ss(a, b, x) * (1 - ss(c, d, x))

export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

// Arsenal stops (fractions of the act). Shared by the camera path and the DOM panels.
export const ARSENAL = {
  guts: [0.0, 0.2] as const,
  aizen: [0.27, 0.43] as const,
  light: [0.5, 0.66] as const,
  stack: [0.74, 0.88] as const,
}

// Where each nav section lands (act + progress within it)
export type Section = "work" | "about" | "skills" | "life" | "contact"
export const sections: { id: Section; label: string; act: ActId; t: number; key: string }[] = [
  { id: "work", label: "Work", act: "work", t: 0.02, key: "1" },
  { id: "about", label: "About", act: "arsenal", t: 0.08, key: "2" },
  { id: "skills", label: "Arsenal", act: "arsenal", t: 0.8, key: "3" },
  { id: "life", label: "Off the clock", act: "finale", t: 0.2, key: "4" },
  { id: "contact", label: "Contact", act: "finale", t: 1, key: "5" },
]
