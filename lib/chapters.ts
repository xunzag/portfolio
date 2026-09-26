// The site is one continuous scroll "film". Each chapter owns a slice of the
// page (in vh); the 3D camera keyframes and the DOM overlay key off the same numbers.

export type ChapterId = "hero" | "work" | "about" | "facts" | "stack" | "portal" | "life" | "contact"

export const PROJECT_VH = 150

export const CHAPTERS: { id: ChapterId; vh: number; label?: string }[] = [
  { id: "hero", vh: 150, label: "Intro" },
  { id: "work", vh: PROJECT_VH * 7, label: "Work" },
  { id: "about", vh: 300, label: "About" },
  { id: "facts", vh: 260, label: "Facts" },
  { id: "stack", vh: 300, label: "Stack" },
  { id: "portal", vh: 120 },
  { id: "life", vh: 360, label: "Life" },
  { id: "contact", vh: 220, label: "Contact" },
]

export const TOTAL_VH = CHAPTERS.reduce((n, c) => n + c.vh, 0)

export const RANGES = (() => {
  const out = {} as Record<ChapterId, [number, number]>
  let at = 0
  CHAPTERS.forEach((c, i) => {
    const end = i === CHAPTERS.length - 1 ? TOTAL_VH - 100 : at + c.vh
    out[c.id] = [at, end]
    at += c.vh
  })
  return out
})()

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export function chapterAt(s: number): { id: ChapterId; t: number } {
  for (const c of CHAPTERS) {
    const [a, b] = RANGES[c.id]
    if (s < b || c.id === "contact") return { id: c.id, t: clamp01((s - a) / (b - a)) }
  }
  return { id: "contact", t: 1 }
}

export const local = (s: number, id: ChapterId) => {
  const [a, b] = RANGES[id]
  return clamp01((s - a) / (b - a))
}
