// The site is one continuous scroll "film". Each chapter owns a slice of the
// page (in viewport heights); the 3D camera track and the DOM overlay both key
// off these same numbers, so they can never drift apart.

export type ChapterId = "hero" | "work" | "ascend" | "about" | "stack" | "portal" | "life" | "contact"

export const CHAPTERS: { id: ChapterId; vh: number; label?: string }[] = [
  { id: "hero", vh: 160, label: "Intro" },
  { id: "work", vh: 770, label: "Work" },
  { id: "ascend", vh: 140 },
  { id: "about", vh: 200, label: "About" },
  { id: "stack", vh: 200, label: "Stack" },
  { id: "portal", vh: 120 },
  { id: "life", vh: 260, label: "Life" },
  { id: "contact", vh: 170, label: "Contact" },
]

export const TOTAL_VH = CHAPTERS.reduce((n, c) => n + c.vh, 0)

// Chapter start/end expressed in "scroll vh" (scrollY / innerHeight).
// The last chapter ends at TOTAL_VH - 100 (you can't scroll past the final screen).
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
