"use client"

import { useRef } from "react"
import { RANGES, band, local, ss } from "@/lib/acts"
import { profile, stats } from "@/lib/content"
import { useRoom } from "@/lib/store"
import { live } from "../live"
import { present, useLive } from "./useLive"

const PROMPT = "~/farhan $ cd ./case-files && ls"

// Act I overlay: the signature, a short whoami, then the dive into the monitor.
export function HeroAct() {
  const phase = useRoom((s) => s.phase)
  const root = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLDivElement>(null)
  const intro = useRef<HTMLDivElement>(null)
  const dive = useRef<HTMLDivElement>(null)
  const typed = useRef<HTMLSpanElement>(null)

  useLive(() => {
    const s = live.scroll
    const t = local(s, "hero")
    if (root.current) root.current.style.display = s < RANGES.hero[1] + 10 ? "" : "none"
    if (s > RANGES.hero[1] + 10) return
    const p = 1 - ss(0.06, 0.17, t)
    if (title.current) {
      present(title.current, p, -40, 10)
      title.current.style.letterSpacing = `${(1 - p) * 0.12}em`
    }
    present(hint.current, 1 - ss(0.0, 0.05, t), 10, 0)
    present(intro.current, band(t, 0.2, 0.3, 0.5, 0.58))
    const d = band(t, 0.62, 0.68, 0.94, 0.99)
    present(dive.current, d, 0, 4)
    if (typed.current) typed.current.textContent = PROMPT.slice(0, Math.round(PROMPT.length * ss(0.64, 0.84, t)))
  })

  const go = phase === "room" ? " go" : ""

  return (
    <div ref={root} className="layer z-10">
      {/* landscape: the name is painted into the scene by the stage shader; portrait gets this SVG signature */}
      <div ref={title} className="absolute inset-x-0 top-[24%] flex flex-col items-center px-4 text-center landscape:top-[47%]">
        <svg className={`signature${go} landscape:hidden h-[clamp(5rem,13vw,10rem)] w-[min(92vw,44rem)] overflow-visible`} viewBox="0 0 700 160" aria-label={profile.name} role="img">
          <defs>
            <linearGradient id="ink" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.6" stopColor="#ffe9ea" />
              <stop offset="1" stopColor="#ffb3b8" />
            </linearGradient>
          </defs>
          <text x="350" y="118" textAnchor="middle" fontFamily="var(--font-script)" fontSize="150" fill="url(#ink)" stroke="#fff" strokeWidth="1.4" style={{ filter: "drop-shadow(0 0 18px rgba(255,80,90,0.35))" }}>
            {profile.name}
          </text>
        </svg>
        <div className={`rise${go} mt-2 flex flex-col items-center`}>
          <p className="font-serif text-[clamp(1rem,2vw,1.45rem)] tracking-wide text-ink/95" style={{ animationDelay: "2.2s" }}>
            {profile.roles.map((r, i) => (
              <span key={r}>
                {i > 0 && <span className="mx-2 text-white/40 sm:mx-3">|</span>}
                {r}
              </span>
            ))}
          </p>
          <p className="smallcaps mt-4 text-white/55" style={{ animationDelay: "2.6s" }}>
            {profile.motto.join("  ×  ")}
          </p>
        </div>
      </div>

      <div ref={hint} className={`rise${go} absolute inset-x-0 bottom-[7vh] flex flex-col items-center`}>
        <div style={{ animationDelay: "3.2s" }} className="flex flex-col items-center gap-3">
          <span className="smallcaps text-white/60">scroll to enter</span>
          <span className="smallcaps -mt-1 !text-[9px] text-blood/80">
            <span className="pointer-coarse:hidden">or drag across the screen to slash</span>
            <span className="hidden pointer-coarse:inline">or swipe sideways to slash</span>
          </span>
          <span className="relative block h-12 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[drip_1.8s_ease-in-out_infinite] bg-gradient-to-b from-transparent to-blood" />
          </span>
        </div>
      </div>

      {/* whoami */}
      <div ref={intro} className="invisible absolute bottom-[10vh] left-4 right-4 max-w-xl sm:left-[6vw] sm:right-auto">
        <p className="smallcaps text-blood">// whoami</p>
        <h2 className="mt-3 font-serif text-[clamp(2rem,4.2vw,3.6rem)] font-light leading-[1.02]">
          I build for the web —<br />
          <em className="text-white/70">and keep the systems behind it running.</em>
        </h2>
        <div className="mt-6 flex gap-7">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl">
                {s.value}
                <span className="text-blood">{s.suffix}</span>
              </p>
              <p className="smallcaps mt-1 !text-[9px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* the dive */}
      <div ref={dive} className="invisible absolute inset-x-0 top-[16%] flex flex-col items-center px-4 text-center">
        <p className="font-mono text-sm text-[#9fd8ff] sm:text-base">
          <span ref={typed} />
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#9fd8ff]" />
        </p>
        <p className="mt-4 font-serif text-[clamp(1.6rem,3.6vw,3rem)] italic text-white/85">Entering the case files.</p>
      </div>
    </div>
  )
}
