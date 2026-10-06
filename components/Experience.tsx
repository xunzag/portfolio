"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { AnimatePresence } from "motion/react"
import { TOTAL_VH, sections } from "@/lib/acts"
import { scrollBus, useRoom } from "@/lib/store"
import { Scroller } from "./Scroller"
import { HeroAct } from "./acts/HeroAct"
import { WorkAct } from "./acts/WorkAct"
import { ArsenalAct } from "./acts/ArsenalAct"
import { FinaleAct } from "./acts/FinaleAct"
import { ArtLabels } from "./acts/ArtLabels"
import { Flash } from "./acts/Flash"
import { ScreenReader } from "./acts/ScreenReader"
import { Loader } from "./ui/Loader"
import { Hud } from "./ui/Hud"
import { Terminal } from "./ui/Terminal"

const Stage = dynamic(() => import("./stage/Stage"), { ssr: false })

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export function Experience() {
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
      if (e.key === "Escape" && s.terminalOpen) return s.setTerminal(false)
      if (typing) return
      konami = e.key === KONAMI[konami] ? konami + 1 : e.key === KONAMI[0] ? 1 : 0
      if (konami === KONAMI.length) {
        konami = 0
        s.setParty(!s.party)
        return
      }
      if (s.terminalOpen || s.phase !== "room") return
      const sec = sections.find((x) => x.key === e.key)
      if (sec) scrollBus.to(sec.id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <div className="fixed inset-0 z-0" aria-hidden>
        <Stage />
      </div>
      <Scroller />
      <HeroAct />
      <WorkAct />
      <ArsenalAct />
      <FinaleAct />
      <Flash />
      <ArtLabels />
      <Hud />
      {/* the page is only as tall as the film */}
      <div style={{ height: `${TOTAL_VH}vh` }} aria-hidden />
      <ScreenReader />
      <AnimatePresence>{terminalOpen && <Terminal key="terminal" />}</AnimatePresence>
      <Loader />
    </>
  )
}
