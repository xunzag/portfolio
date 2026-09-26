"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FileDown, TerminalSquare } from "lucide-react"
import { CHAPTERS } from "@/lib/chapters"
import { profile } from "@/lib/content"
import { scrollBus, useRoom } from "@/lib/store"
import { Github, Linkedin } from "./icons"

const NAV = CHAPTERS.filter((c) => c.label)

export function Hud() {
  const phase = useRoom((s) => s.phase)
  const chapter = useRoom((s) => s.chapter)
  const party = useRoom((s) => s.party)
  const active = (id: string) =>
    chapter === id || (id === "stack" && chapter === "portal")

  return (
    <AnimatePresence>
      {phase === "room" && (
        <motion.div key="hud" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.4, duration: 1 } }} className="pointer-events-none fixed inset-0 z-20">
          <header className="pointer-events-auto absolute left-4 top-4 sm:left-6 sm:top-5">
            <button onClick={() => scrollBus.to("hero")} className="focus-ring rounded-lg text-left" aria-label="Back to the top">
              <p className="text-base font-semibold tracking-tight">{profile.name}</p>
              <p className="font-mono text-[10px] text-muted">{party ? "party mode 🪩" : profile.role.toLowerCase()}</p>
            </button>
            <ScoreChip />
          </header>

          {/* chapter rail */}
          <nav aria-label="Chapters" className="pointer-events-auto absolute right-3 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex">
            {NAV.map((c) => {
              const on = active(c.id)
              return (
                <button key={c.id} onClick={() => scrollBus.to(c.id)} className="focus-ring group flex items-center gap-3 rounded-full py-1 pl-3" aria-current={on}>
                  <span className={`font-mono text-[11px] uppercase tracking-widest transition ${on ? "text-ink" : "text-transparent group-hover:text-muted"}`}>{c.label}</span>
                  <span className={`block h-px transition-all duration-500 ${on ? "w-10 bg-ink" : "w-4 bg-white/30 group-hover:w-6 group-hover:bg-white/60"}`} />
                </button>
              )
            })}
          </nav>

          {/* mobile chapter pill */}
          <nav aria-label="Chapters" className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-full glass p-1 sm:hidden">
            {NAV.filter((c) => c.id !== "hero").map((c) => (
              <button key={c.id} onClick={() => scrollBus.to(c.id)} className={`rounded-full px-3 py-1.5 text-xs ${active(c.id) ? "bg-ink text-bg" : "text-muted"}`}>
                {c.label}
              </button>
            ))}
          </nav>

          <div className="pointer-events-auto absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-5">
            <IconBtn label="Open terminal (ctrl + `)" onClick={() => useRoom.getState().setTerminal(true)}>
              <TerminalSquare size={15} />
            </IconBtn>
            <IconLink label="GitHub" href={profile.socials.github}>
              <Github size={15} />
            </IconLink>
            <IconLink label="LinkedIn" href={profile.socials.linkedin}>
              <Linkedin size={15} />
            </IconLink>
            <a href={profile.cv} download className="focus-ring hidden items-center gap-2 rounded-full glass px-4 text-xs font-medium transition hover:bg-white/10 sm:flex">
              <FileDown size={14} /> CV
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const iconCls = "focus-ring grid h-9 w-9 place-items-center rounded-full glass text-muted transition hover:text-ink hover:bg-white/10"

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button aria-label={label} title={label} onClick={onClick} className={iconCls}>
      {children}
    </button>
  )
}

function IconLink({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a aria-label={label} title={label} href={href} target="_blank" rel="noopener noreferrer" className={`${iconCls} hidden sm:grid`}>
      {children}
    </a>
  )
}

function ScoreChip() {
  const score = useRoom((s) => s.loaderScore)
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 12000)
    return () => clearTimeout(t)
  }, [])
  return (
    <AnimatePresence>
      {score && show && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 2 } }}
          exit={{ opacity: 0 }}
          className="mt-2 inline-block rounded-full glass px-3 py-1 font-mono text-[10px] text-ink/80"
        >
          {score.kind === "wpm"
            ? `you ${score.value} wpm · farhan 120${score.value > 120 ? " · you win 🫡" : ""}`
            : `🌸 ${score.value} petal${score.value === 1 ? "" : "s"} caught`}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
