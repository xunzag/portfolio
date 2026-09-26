"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FileDown, Lamp, LampDesk, TerminalSquare } from "lucide-react"
import { Github, Instagram, Linkedin } from "./icons"
import { useRoom, sections } from "@/lib/store"
import { profile } from "@/lib/content"

export function Hud() {
  const phase = useRoom((s) => s.phase)
  const focus = useRoom((s) => s.focus)
  const lightsOn = useRoom((s) => s.lightsOn)
  const party = useRoom((s) => s.party)
  const { setFocus, toggleLights, setTerminal } = useRoom.getState()
  const visible = phase === "room" || phase === "intro"

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hud"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}
          className="pointer-events-none absolute inset-0 z-20"
        >
          {/* brand */}
          <header className="pointer-events-auto absolute left-4 top-4 sm:left-6 sm:top-6">
            <button onClick={() => setFocus(null)} className="focus-ring rounded-lg text-left" aria-label="Back to the room overview">
              <p className="text-lg font-semibold leading-none tracking-tight sm:text-xl">{profile.name}</p>
              <RotatingRole />
            </button>
          </header>

          {/* nav */}
          <nav
            aria-label="Sections"
            className="pointer-events-auto absolute left-1/2 top-auto bottom-4 flex -translate-x-1/2 gap-1 rounded-full glass p-1 sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:translate-x-0"
          >
            {sections.map((s) => {
              const active = focus === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setFocus(active ? null : s.id)}
                  aria-pressed={active}
                  className={`focus-ring relative rounded-full px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:text-sm ${
                    active ? "text-bg" : "text-muted hover:text-ink"
                  }`}
                >
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                  <span className="relative">{s.label}</span>
                </button>
              )
            })}
          </nav>

          {/* bottom-left: hints */}
          <div className="pointer-events-none absolute bottom-20 left-4 hidden font-mono text-[11px] text-muted sm:bottom-6 sm:left-6 sm:block">
            <AnimatePresence mode="wait">
              {focus ? (
                <motion.p key="back" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <span className="kbd">Esc</span> back to the room
                </motion.p>
              ) : (
                <motion.p key="hint" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  click anything that glows · <span className="kbd">1</span>–<span className="kbd">5</span> jump ·{" "}
                  <span className="kbd">ctrl</span>+<span className="kbd">`</span> terminal
                  {party && <span className="ml-2 text-amber">· party mode 🪩</span>}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* bottom-right: tools + socials */}
          <div
            className={`absolute right-4 top-16 flex flex-col gap-2 transition-opacity duration-500 sm:bottom-6 sm:right-6 sm:top-auto sm:flex-row ${
              focus ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
            }`}
          >
            <IconBtn label={lightsOn ? "Turn the lamp off" : "Turn the lamp on"} onClick={toggleLights}>
              {lightsOn ? <LampDesk size={16} /> : <Lamp size={16} />}
            </IconBtn>
            <IconBtn label="Open terminal" onClick={() => setTerminal(true)}>
              <TerminalSquare size={16} />
            </IconBtn>
            <span className="hidden w-px bg-white/10 sm:block" />
            <IconLink label="GitHub" href={profile.socials.github}>
              <Github size={16} />
            </IconLink>
            <IconLink label="LinkedIn" href={profile.socials.linkedin}>
              <Linkedin size={16} />
            </IconLink>
            <IconLink label="Instagram" href={profile.socials.instagram}>
              <Instagram size={16} />
            </IconLink>
            <a
              href={profile.cv}
              download
              className="focus-ring hidden items-center gap-2 rounded-full glass px-4 text-xs font-medium text-ink transition hover:bg-white/10 sm:flex"
            >
              <FileDown size={14} /> CV
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function RotatingRole() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative mt-1 block h-4 overflow-hidden font-mono text-[11px] text-muted">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="block"
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
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
