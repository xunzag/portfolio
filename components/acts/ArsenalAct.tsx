"use client"

import { useRef } from "react"
import { ARSENAL, band, local, ss } from "@/lib/acts"
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
    // --q drives the word-by-word reveal; scrims fade with the words
    const chapter = (el: HTMLDivElement | null, r: readonly [number, number], vis: number) => {
      present(el, vis, 0, 6)
      el?.style.setProperty("--q", ss(r[0] - 0.03, r[0] + 0.1, t).toFixed(4))
    }
    chapter(guts.current, ARSENAL.guts, band(t, 0.0, 0.03, ARSENAL.guts[1] - 0.03, ARSENAL.guts[1] + 0.02))
    chapter(aizen.current, ARSENAL.aizen, stop(ARSENAL.aizen))
    chapter(light.current, ARSENAL.light, stop(ARSENAL.light))
    present(stack.current, stop(ARSENAL.stack), 40)
  })

  return (
    <div ref={root} className="layer z-10" style={{ display: "none" }}>
      {/* I — Guts: origin */}
      <Chapter ref={guts} side="right" num="I" kanji={quotes.guts.kanji} quote={quotes.guts}>
        <p className="smallcaps text-white/50">origin</p>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/80 sm:text-base">{profile.bio[0]}</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{profile.bio[2]}</p>
      </Chapter>

      {/* II — Aizen: the path */}
      <Chapter ref={aizen} side="left" num="II" kanji="計画" quote={quotes.aizen}>
        <p className="smallcaps text-white/50">the path</p>
        <ol className="mt-3 space-y-3">
          {experience.map((e, k) => (
            <li key={e.hash} className="overflow-hidden">
              <div style={lineIn(k + 3)}>
                <p className="font-mono text-[10px] text-white/40">
                  {e.period} · {e.type}
                </p>
                <p className="font-serif text-[clamp(1.25rem,1.9vw,1.9rem)] leading-tight">
                  {e.role} <em className="text-white/55">— {e.company}</em>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* III — Light: the rules */}
      <Chapter ref={light} side="left" num="III" kanji={quotes.light.kanji} quote={quotes.light}>
        <p className="smallcaps text-white/50">my rules</p>
        <ol className="mt-3 space-y-1.5">
          {principles.map((p, k) => (
            <li key={p} className="overflow-hidden">
              <p className="flex gap-3 font-serif text-[clamp(1.1rem,1.6vw,1.6rem)] leading-snug" style={lineIn(k + 3)}>
                <span className="font-mono text-xs text-blood">{String(k + 1).padStart(2, "0")}</span>
                {p}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
          {facts.slice(0, 4).map((f) => (
            <div key={f.label}>
              <p className="font-serif text-3xl leading-none">{f.value}</p>
              <p className="smallcaps mt-1 !text-[9px] text-white/45">{f.label}</p>
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

// lines and words rise out of a mask as --q goes 0 → 1
const lineIn = (k: number) =>
  ({
    transform: `translateY(calc((1 - clamp(0, var(--q) * 3.2 - ${k * 0.22}, 1)) * 110%))`,
    opacity: `clamp(0, var(--q) * 3.2 - ${k * 0.22}, 1)`,
  }) as React.CSSProperties

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
  const words = quote.text.split(" ")
  const right = side === "right"
  return (
    <div ref={ref} className="invisible absolute inset-0">
      {/* a soft scrim on the reading side instead of a box */}
      <div className={`absolute inset-y-0 w-full sm:w-[68%] ${right ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"} from-black via-black/85 to-transparent`} />
      <div
        className={`absolute bottom-16 left-4 right-4 sm:bottom-auto sm:top-1/2 sm:w-[min(40rem,42vw)] sm:-translate-y-1/2 ${right ? "sm:left-auto sm:right-[5vw]" : "sm:left-[5vw] sm:right-auto"}`}
      >
        <p className="flex items-center gap-3 font-serif text-sm italic text-blood">
          <span className="font-jp not-italic">{kanji}</span>
          <span className="h-px w-8 bg-blood/60" />
          Chapter {num}
        </p>
        <blockquote className="mt-3 font-serif text-[clamp(2rem,3.6vw,3.6rem)] font-light leading-[1.02] tracking-tight">
          {words.map((w, k) => (
            <span key={k} className="mr-[0.24em] inline-block overflow-hidden pb-[0.06em] align-bottom">
              <span className="inline-block" style={lineIn(k * 0.45)}>
                {k === 0 ? `“${w}` : k === words.length - 1 ? `${w}”` : w}
              </span>
            </span>
          ))}
          <footer className="mt-3 font-mono text-[11px] not-italic tracking-[0.3em] text-white/45">— {quote.by.toUpperCase()}</footer>
        </blockquote>
        <div className="mt-6 sm:mt-8">{children}</div>
      </div>
    </div>
  )
}
