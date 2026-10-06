"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FileDown, TerminalSquare, Volume2, VolumeX } from "lucide-react"
import { RANGES, TOTAL_VH, local, sections, type ActId, type Section } from "@/lib/acts"
import { profile } from "@/lib/content"
import { scrollBus, useRoom } from "@/lib/store"
import { sound } from "@/lib/sound"
import { live } from "../live"
import { useLive } from "../acts/useLive"
import { Github, Linkedin } from "./icons"

const PATH: Record<ActId, string> = { hero: "", work: "case-files", arsenal: "arsenal", finale: "eclipse" }

function activeSection(s: number): Section | null {
  if (s < RANGES.work[0]) return null
  if (s < RANGES.arsenal[0]) return "work"
  if (s < RANGES.finale[0]) return local(s, "arsenal") < 0.7 ? "about" : "skills"
  return local(s, "finale") < 0.58 ? "life" : "contact"
}

export function Hud() {
  const phase = useRoom((s) => s.phase)
  const act = useRoom((s) => s.act)
  const party = useRoom((s) => s.party)
  const [sec, setSec] = useState<Section | null>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const dot = useRef<HTMLSpanElement>(null)

  useLive(() => {
    const p = Math.min(1, live.scroll / (TOTAL_VH - 100))
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
    if (dot.current) dot.current.style.left = `${p * 100}%`
    const a = activeSection(live.scroll)
    if (a !== sec) setSec(a)
  })

  return (
    <AnimatePresence>
      {phase === "room" && (
        <motion.div key="hud" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 2.8, duration: 1.2 } }} className="pointer-events-none fixed inset-0 z-20">
          <header className="pointer-events-auto absolute left-4 top-4 sm:left-6 sm:top-5">
            <button onClick={() => scrollBus.to("top")} className="focus-ring flex items-center gap-3 text-left" aria-label="Back to the top">
              <span className="font-script text-3xl leading-none text-white">FA</span>
              <span className="hidden sm:block">
                <span className="block font-serif text-base leading-tight">{profile.name}</span>
                <span className="smallcaps block !text-[9px] text-white/45">{party ? "party mode" : profile.roles[0]}</span>
              </span>
            </button>
            <ScoreChip />
          </header>

          <nav aria-label="Sections" className="pointer-events-auto absolute right-[20rem] top-6 hidden gap-6 lg:flex">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollBus.to(s.id)}
                aria-current={sec === s.id}
                className={`focus-ring relative font-mono text-[10px] uppercase tracking-[0.28em] transition ${sec === s.id ? "text-white" : "text-white/45 hover:text-white/80"}`}
              >
                {s.label}
                <span className={`absolute -bottom-1.5 left-0 h-px bg-blood transition-all duration-500 ${sec === s.id ? "w-full" : "w-0"}`} />
              </button>
            ))}
          </nav>

          <div className="pointer-events-auto absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-5">
            <SoundBtn />
            <IconBtn label="Open terminal (ctrl + `)" onClick={() => useRoom.getState().setTerminal(true)}>
              <TerminalSquare size={15} />
            </IconBtn>
            <IconLink label="GitHub" href={profile.socials.github}>
              <Github size={15} />
            </IconLink>
            <IconLink label="LinkedIn" href={profile.socials.linkedin}>
              <Linkedin size={15} />
            </IconLink>
            <a href={profile.cv} download className="focus-ring hidden items-center gap-2 border border-white/15 bg-black/40 px-4 text-[10px] uppercase tracking-[0.25em] backdrop-blur transition hover:bg-white hover:text-black sm:flex">
              <FileDown size={13} /> CV
            </a>
          </div>

          {/* >>> /portfolio progress, like the painting's own footer */}
          <div className="absolute bottom-5 left-4 hidden items-center gap-3 font-mono text-[11px] text-white/55 sm:left-6 sm:flex">
            <span className="text-white/35">&gt;&gt;&gt;</span>
            <span>/portfolio{PATH[act] && `/${PATH[act]}`}</span>
            <span className="relative ml-1 block h-px w-28 bg-white/15">
              <span ref={bar} className="absolute inset-0 origin-left bg-gradient-to-r from-[#5ab0ff] to-blood" />
              <span ref={dot} className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9fd8ff] shadow-[0_0_8px_#5ab0ff]" />
            </span>
          </div>

          {/* phones: section pill */}
          <nav aria-label="Sections" className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-0.5 border border-white/10 bg-black/60 p-1 backdrop-blur sm:hidden">
            {sections.map((s) => (
              <button key={s.id} onClick={() => scrollBus.to(s.id)} className={`px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider ${sec === s.id ? "bg-white text-black" : "text-white/55"}`}>
                {s.id === "life" ? "Life" : s.label}
              </button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const iconCls = "focus-ring grid h-9 w-9 place-items-center border border-white/15 bg-black/40 text-white/60 backdrop-blur transition hover:text-white hover:bg-white/10"

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
          animate={{ opacity: 1, y: 0, transition: { delay: 3.5 } }}
          exit={{ opacity: 0 }}
          className="mt-3 inline-block border border-white/10 bg-black/50 px-3 py-1 font-mono text-[10px] text-white/75 backdrop-blur"
        >
          {score.kind === "wpm"
            ? `you ${score.value} wpm · farhan 120${score.value > 120 ? " · you win" : ""}`
            : `${score.value} leaf${score.value === 1 ? "" : "s"} caught`}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function SoundBtn() {
  const [on, setOn] = useState(sound.on)
  useEffect(() => sound.subscribe(setOn), [])
  // the heartbeat swells as we approach the eclipse
  useLive(() => {
    const s = live.scroll
    const a = local(s, "arsenal")
    const heart = s >= RANGES.finale[0] ? 0.9 : s >= RANGES.arsenal[0] ? 0.15 + Math.max(0, a - 0.8) * 3.5 : 0
    sound.setHeart(heart)
  })
  return (
    <button
      aria-label={on ? "Mute sound" : "Turn sound on"}
      title={on ? "Mute" : "Sound on"}
      onClick={() => sound.toggle()}
      className={`${iconCls} relative ${on ? "text-white" : ""}`}
    >
      {on ? <Volume2 size={15} /> : <VolumeX size={15} />}
      {!on && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-widest text-white/40">sound</span>}
    </button>
  )
}
