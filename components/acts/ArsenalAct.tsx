"use client"

import { useRef } from "react"
import { ARSENAL, band, local } from "@/lib/acts"
import { arsenal, experience, facts, ops, principles, profile, quotes } from "@/lib/content"
import { live } from "../live"
import { present, useLive } from "./useLive"

// Act III — over the second painting. The camera stops on Guts, Aizen and Light
// in turn; each one "speaks" a chapter of the story. Then it pulls back to show
// the whole arsenal and dives into the window.

export function ArsenalAct() {
  const root = useRef<HTMLDivElement>(null)
  const guts = useRef<HTMLDivElement>(null)
  const aizen = useRef<HTMLDivElement>(null)
  const light = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLDivElement>(null)

  useLive(() => {
    const t = local(live.scroll, "arsenal")
    const on = t > 0 && t < 1
    if (root.current) root.current.style.display = on ? "" : "none"
    if (!on) return
    const stop = (r: readonly [number, number], lead = 0.03) => band(t, r[0] - lead, r[0] + 0.04, r[1] - 0.03, r[1] + 0.02)
    present(guts.current, band(t, 0.0, 0.035, ARSENAL.guts[1] - 0.03, ARSENAL.guts[1] + 0.02))
    present(aizen.current, stop(ARSENAL.aizen))
    present(light.current, stop(ARSENAL.light))
    present(stack.current, stop(ARSENAL.stack), 40)
  })

  return (
    <div ref={root} className="layer z-10" style={{ display: "none" }}>
      {/* I — Guts: origin */}
      <Chapter ref={guts} side="right" num="I" kanji={quotes.guts.kanji} quote={quotes.guts}>
        <p className="smallcaps text-white/50">origin · about me</p>
        {profile.bio.map((b) => (
          <p key={b} className="mt-3 text-[13px] leading-relaxed text-white/75 sm:text-[15px]">
            {b}
          </p>
        ))}
        <p className="smallcaps mt-5 text-white/40">
          {profile.location} · {profile.timezone}
        </p>
      </Chapter>

      {/* II — Aizen: the path */}
      <Chapter ref={aizen} side="left" num="II" kanji="計画" quote={quotes.aizen}>
        <p className="smallcaps text-white/50">the path · experience</p>
        <ol className="mt-4 space-y-5 border-l border-white/10 pl-5">
          {experience.map((e) => (
            <li key={e.hash} className="relative">
              <span className={`absolute -left-[25px] top-1.5 h-2 w-2 rotate-45 ${e.active ? "bg-blood shadow-[0_0_12px_#e0242f]" : "bg-white/30"}`} />
              <p className="font-mono text-[10px] text-white/35">
                {e.hash} · {e.period} · {e.type}
              </p>
              <p className="mt-0.5 font-serif text-xl">
                {e.role} <span className="italic text-white/55">@ {e.company}</span>
              </p>
              <p className="mt-1 text-sm text-white/60">{e.desc}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* III — Light: the rules */}
      <Chapter ref={light} side="right" num="III" kanji={quotes.light.kanji} quote={quotes.light}>
        <p className="smallcaps text-white/50">the rules · how I work</p>
        <ul className="mt-3 space-y-2">
          {principles.map((p, i) => (
            <li key={p} className="flex gap-3 text-[15px] text-white/75">
              <span className="font-mono text-xs text-blood">{String(i + 1).padStart(2, "0")}</span>
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-5 grid grid-cols-4 gap-x-3 gap-y-4 border-t border-white/10 pt-4">
          {facts.slice(0, 8).map((f) => (
            <div key={f.label}>
              <p className="font-serif text-xl leading-none">{f.value}</p>
              <p className="mt-1 text-[10px] leading-tight text-white/45">{f.label}</p>
            </div>
          ))}
        </div>
      </Chapter>

      {/* IV — the arsenal */}
      <div ref={stack} className="invisible absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent px-4 pb-8 pt-24 sm:px-[6vw] sm:pb-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="smallcaps text-blood">IV · the arsenal</p>
            <h2 className="mt-2 font-serif text-[clamp(2rem,4vw,3.4rem)] font-light leading-none">Everything I fight with.</h2>
          </div>
          <p className="hidden max-w-xs text-right font-mono text-[11px] leading-5 text-white/45 lg:block">{ops.join(" · ")}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
          {arsenal.map((g) => (
            <div key={g.name} className="border-t border-white/15 pt-3">
              <p className="flex items-baseline gap-2">
                <span className="font-jp text-lg text-blood">{g.kanji}</span>
                <span className="smallcaps text-white/70">{g.name}</span>
              </p>
              <p className="mt-2 text-[13px] leading-6 text-white/70">{g.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Chapter({
  ref,
  side,
  num,
  kanji,
  quote,
  children,
}: {
  ref: React.Ref<HTMLDivElement>
  side: "left" | "right"
  num: string
  kanji: string
  quote: { text: string; by: string }
  children: React.ReactNode
}) {
  return (
    <div
      className={`absolute bottom-16 left-4 right-4 sm:bottom-auto sm:top-1/2 sm:w-[min(34rem,40vw)] sm:-translate-y-1/2 ${side === "right" ? "sm:left-auto sm:right-[5vw]" : "sm:left-[5vw] sm:right-auto"}`}
    >
      <div ref={ref} className="panel invisible relative max-h-[70vh] overflow-hidden p-5 sm:max-h-none sm:p-8">
        <span aria-hidden className="vertical-jp absolute right-3 top-6 text-sm text-white/25">
          {kanji}
        </span>
        <p className="font-serif text-sm italic text-blood">Chapter {num}</p>
        <blockquote className="mt-2 pr-6 font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] font-light leading-tight">
          “{quote.text}”
          <footer className="mt-2 font-mono text-[11px] not-italic tracking-widest text-white/45">— {quote.by}</footer>
        </blockquote>
        <div className="mt-5 border-t border-white/10 pt-5">{children}</div>
      </div>
    </div>
  )
}
