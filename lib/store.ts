import { create } from "zustand"

export type Section = "work" | "about" | "skills" | "life" | "contact"

export const sections: { id: Section; label: string; object: string; key: string }[] = [
  { id: "work", label: "Work", object: "the monitor", key: "1" },
  { id: "about", label: "About", object: "the bookshelf", key: "2" },
  { id: "skills", label: "Stack", object: "the PC", key: "3" },
  { id: "life", label: "Life", object: "the poster wall", key: "4" },
  { id: "contact", label: "Contact", object: "the phone", key: "5" },
]

type State = {
  phase: "loading" | "ready" | "intro" | "room"
  focus: Section | null
  hovered: Section | "lamp" | "duck" | "keyboard" | null
  lightsOn: boolean
  party: boolean
  terminalOpen: boolean
  project: number
  quality: "high" | "low"
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
  focus: null,
  hovered: null,
  lightsOn: true,
  party: false,
  terminalOpen: false,
  project: 0,
  quality: "high",
  setPhase: (phase) => set({ phase }),
  setFocus: (focus) => set({ focus, hovered: null }),
  setHovered: (hovered) => set({ hovered }),
  toggleLights: () => set((s) => ({ lightsOn: !s.lightsOn })),
  setParty: (party) => set({ party }),
  setTerminal: (terminalOpen) => set({ terminalOpen }),
  setProject: (project) => set({ project }),
  setQuality: (quality) => set({ quality }),
}))
