"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { AnimatePresence } from "motion/react"
import { scrollBus, sections, useRoom } from "@/lib/store"
import { Scroller } from "./Scroller"
import { Overlay } from "./Overlay"
import { FxOverlay } from "./FxOverlay"
import { Loader } from "./ui/Loader"
import { Hud } from "./ui/Hud"
import { Terminal } from "./ui/Terminal"

const World = dynamic(() => import("./world/World"), { ssr: false })

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export function Experience({ models }: { models: string[] }) {
  const terminalOpen = useRoom((s) => s.terminalOpen)

  useEffect(() => {
    useRoom.setState({ models })
  }, [models])

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
      if (e.key === "Escape" && s.terminalOpen) return s.setTerminal(false)
      if (typing) return
      konami = e.key === KONAMI[konami] ? konami + 1 : e.key === KONAMI[0] ? 1 : 0
      if (konami === KONAMI.length) {
        konami = 0
        s.setParty(!s.party)
        return
      }
      if (s.terminalOpen) return
      const sec = sections.find((x) => x.key === e.key)
      if (sec) scrollBus.to(sec.chapter)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <div className="fixed inset-0 z-0">
        <World />
      </div>
      <FxOverlay />
      <Scroller />
      <Overlay />
      <Hud />
      <AnimatePresence>{terminalOpen && <Terminal key="terminal" />}</AnimatePresence>
      <Loader />
    </>
  )
}
