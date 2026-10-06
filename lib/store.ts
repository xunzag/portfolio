import { create } from "zustand"
import type { ActId, Section } from "./acts"

type State = {
  phase: "loading" | "room"
  act: ActId
  lightsOn: boolean
  party: boolean
  terminalOpen: boolean
  quality: "high" | "low"
  /** what the visitor scored on the loading screen */
  loaderScore: { kind: "wpm" | "petals"; value: number } | null
  setPhase: (p: State["phase"]) => void
  toggleLights: () => void
  setParty: (v: boolean) => void
  setTerminal: (v: boolean) => void
  setQuality: (q: State["quality"]) => void
}

// decided once, synchronously, so textures load at the right size from the start
function initialQuality(): State["quality"] {
  if (typeof window === "undefined") return "high"
  const q = new URLSearchParams(location.search).get("quality")
  if (q === "low" || q === "high") return q
  return (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 768 ? "low" : "high"
}

export const useRoom = create<State>((set) => ({
  phase: "loading",
  act: "hero",
  lightsOn: true,
  party: false,
  terminalOpen: false,
  quality: initialQuality(),
  loaderScore: null,
  setPhase: (phase) => set({ phase }),
  toggleLights: () => set((s) => ({ lightsOn: !s.lightsOn })),
  setParty: (party) => set({ party }),
  setTerminal: (terminalOpen) => set({ terminalOpen }),
  setQuality: (quality) => set({ quality }),
}))

// Smooth-scroll hook-up lives in components/Scroller.tsx; this is how anything
// (HUD, terminal, keyboard) jumps to a section.
export const scrollBus: { to: (section: Section | "top") => void; jump: (vh: number) => void } = { to: () => {}, jump: () => {} }
