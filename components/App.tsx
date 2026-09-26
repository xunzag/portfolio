"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { AnimatePresence } from "motion/react"
import { useRoom, sections } from "@/lib/store"
import { projects } from "@/lib/content"
import { Loader } from "./ui/Loader"
import { Hud } from "./ui/Hud"
import { Panel } from "./ui/Panel"
import { Terminal } from "./ui/Terminal"

const Scene = dynamic(() => import("./canvas/Scene"), { ssr: false })

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export function App() {
  const focus = useRoom((s) => s.focus)
  const terminalOpen = useRoom((s) => s.terminalOpen)

  useEffect(() => {
    let konami = 0
    const onKey = (e: KeyboardEvent) => {
      const s = useRoom.getState()
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]")

      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault()
        s.setTerminal(!s.terminalOpen)
        return
      }
      if (e.key === "Escape") {
        if (s.terminalOpen) s.setTerminal(false)
        else if (s.focus) s.setFocus(null)
        return
      }
      if (typing) return

      konami = e.key === KONAMI[konami] ? konami + 1 : e.key === KONAMI[0] ? 1 : 0
      if (konami === KONAMI.length) {
        konami = 0
        s.setParty(!s.party)
        return
      }

      if (s.phase !== "room" || s.terminalOpen) return
      const sec = sections.find((x) => x.key === e.key)
      if (sec) s.setFocus(sec.id)
      if (s.focus === "work" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        const d = e.key === "ArrowRight" ? 1 : -1
        s.setProject((s.project + d + projects.length) % projects.length)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <Scene />
      </div>
      <Hud />
      <AnimatePresence>{focus && <Panel key="panel" section={focus} />}</AnimatePresence>
      <AnimatePresence>{terminalOpen && <Terminal key="terminal" />}</AnimatePresence>
      <Loader />
    </div>
  )
}
