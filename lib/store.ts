import { create } from "zustand"
import type { ChapterId } from "./chapters"

export type Section = "work" | "about" | "skills" | "life" | "contact"

export const sections: { id: Section; label: string; chapter: ChapterId; key: string }[] = [
  { id: "work", label: "Work", chapter: "work", key: "1" },
  { id: "about", label: "About", chapter: "about", key: "2" },
  { id: "skills", label: "Stack", chapter: "stack", key: "3" },
  { id: "life", label: "Life", chapter: "life", key: "4" },
  { id: "contact", label: "Contact", chapter: "contact", key: "5" },
]

type State = {
  phase: "loading" | "room"
  /** smoothed scroll position in viewport-heights (written every frame by the scroller) */
  scroll: number
  chapter: ChapterId
  /** which room object is "presenting" (drives the in-room animations) */
  focus: Section | null
  hovered: Section | "lamp" | "duck" | "keyboard" | "chair" | null
  roomBuilt: boolean
  lightsOn: boolean
  party: boolean
  terminalOpen: boolean
  project: number
  quality: "high" | "low"
  models: string[]
  setPhase: (p: State["phase"]) => void
  setFocus: (s: Section | null) => void
  setHovered: (h: State["hovered"]) => void
  toggleLights: () => void
  setParty: (v: boolean) => void
  setTerminal: (v: boolean) => void
  setProject: (i: number) => void
  setQuality: (q: State["quality"]) => void
}

export const useRoom = create<State>((set) => ({
  phase: "loading",
  scroll: 0,
  chapter: "hero",
  focus: null,
  hovered: null,
  roomBuilt: false,
  lightsOn: true,
  party: false,
  terminalOpen: false,
  project: 0,
  quality: "high",
  models: [],
  setPhase: (phase) => set({ phase }),
  setFocus: (focus) => set({ focus }),
  setHovered: (hovered) => set({ hovered }),
  toggleLights: () => set((s) => ({ lightsOn: !s.lightsOn })),
  setParty: (party) => set({ party }),
  setTerminal: (terminalOpen) => set({ terminalOpen }),
  setProject: (project) => set({ project }),
  setQuality: (quality) => set({ quality }),
}))

// Smooth-scroll hook-up lives in components/Scroller.tsx; this is how anything
// (HUD, terminal, 3D hotspots) jumps to a chapter.
export const scrollBus: { to: (chapter: ChapterId) => void } = { to: () => {} }
