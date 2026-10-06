"use client"

import { useRef } from "react"
import { CASE_VH, RANGES, clamp01, ss } from "@/lib/acts"
import { projects, type Project } from "@/lib/content"
import { live } from "../live"
import { useLive } from "./useLive"

// Act II — Case Files. One project per screen. Each file opens with its words
// rising into place; when you move on, a red slash cuts the panel and the two
// halves fall apart to reveal the next file underneath (manga-panel tear).

const KANJI = ["壱", "弐", "参", "肆", "伍", "陸", "漆", "捌", "玖"]

// the cut runs corner to corner, slightly off-axis
const CUT_A = "polygon(0 0, 100% 0, 100% 38%, 0 66%)"
const CUT_B = "polygon(0 66%, 100% 38%, 100% 100%, 0 100%)"

export function WorkAct() {
  const root = useRef<HTMLDivElement>(null)
  const files = useRef<(HTMLElement | null)[]>([])
  const counter = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [w0, w1] = RANGES.work

  useLive(() => {
    const s = live.scroll
    const on = s > w0 - 20 && s < w1 + 5
    if (root.current) root.current.style.display = on ? "" : "none"
    if (!on) return
    // pointer tilt for the media panels
    const rx = live.mouse.sy * 4
    const ry = live.mouse.sx * -6
    let current = 0
    files.current.forEach((el, i) => {
      if (!el) return
      const p = (s - (w0 + i * CASE_VH)) / CASE_VH
      const enter = i === 0 ? ss(-0.12, 0.08, p) : ss(-0.02, 0.14, p)
      const exit = ss(0.8, 1.0, p)
      const vis = p > -0.2 && p < 1.02
      el.style.visibility = vis ? "visible" : "hidden"
      if (!vis) return
      if (p >= -0.02 && p < 0.98) current = i
      el.style.setProperty("--enter", enter.toFixed(4))
      el.style.setProperty("--exit", exit.toFixed(4))
      // slash draws first, then the halves part
      el.style.setProperty("--cut", ss(0.0, 0.3, exit).toFixed(4))
      el.style.setProperty("--part", ss(0.22, 1, exit).toFixed(4))
      el.style.setProperty("--rx", `${rx}deg`)
      el.style.setProperty("--ry", `${ry}deg`)
      el.style.setProperty("--drift", clamp01(p).toFixed(4))
      el.style.zIndex = String(100 - i)
      el.style.pointerEvents = p > 0.05 && p < 0.85 ? "auto" : "none"
    })
    if (counter.current) counter.current.textContent = String(current + 1).padStart(2, "0")
    if (bar.current) bar.current.style.transform = `scaleX(${clamp01((s - w0) / (w1 - w0))})`
  })

  return (
    <div ref={root} className="layer z-10" style={{ display: "none" }}>
      {projects.map((p, i) => (
        <CaseFile key={p.slug} p={p} i={i} ref={(el) => void (files.current[i] = el)} />
      ))}
      {/* file index */}
      <div className="absolute bottom-6 right-4 z-[200] flex items-center gap-3 sm:right-[6vw]">
        <span className="smallcaps text-white/50">case</span>
        <span className="font-serif text-2xl tabular-nums">
          <span ref={counter}>01</span>
          <span className="text-white/35"> / {String(projects.length).padStart(2, "0")}</span>
        </span>
        <span className="relative ml-2 block h-px w-24 bg-white/15">
          <span ref={bar} className="absolute inset-0 origin-left bg-blood" />
        </span>
      </div>
    </div>
  )
}

function CaseFile({ p, i, ref }: { p: Project; i: number; ref: (el: HTMLElement | null) => void }) {
  const words = p.title.split(" ")
  const accent = p.accent
  // per-element entrance offsets (CSS calc on the shared --enter / --exit vars)
  const rise = (k: number) =>
    ({
      opacity: `calc(clamp(0, var(--enter) * 3 - ${k * 0.35}, 1) * (1 - var(--exit) * 1.6))`,
      transform: `translate3d(calc(var(--exit) * -60px), calc((1 - clamp(0, var(--enter) * 2.2 - ${k * 0.2}, 1)) * 40px), 0)`,
    }) as React.CSSProperties

  return (
    <article ref={ref} className="absolute inset-0" style={{ visibility: "hidden" }} aria-label={`Case file ${i + 1}: ${p.title}`}>
      {/* giant numeral */}
      <span
        aria-hidden
        className="vertical-jp absolute right-[3vw] top-[8vh] select-none text-[min(30vh,20vw)] leading-none text-white/[0.04]"
        style={{ transform: "translateY(calc((1 - var(--enter)) * 10vh + var(--drift) * -6vh))", opacity: "calc(1 - var(--exit))" }}
      >
        {KANJI[i]}
      </span>

      {/* media panel */}
      <div
        className="absolute left-4 right-4 top-[11vh] aspect-[16/10] sm:left-auto sm:right-[5vw] sm:top-1/2 sm:w-[min(50vw,62rem)] sm:-translate-y-1/2"
        style={{ perspective: "1400px" }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: "rotateX(var(--rx)) rotateY(var(--ry)) scale(calc(1.06 - var(--enter) * 0.06))",
            transformStyle: "preserve-3d",
            transition: "transform 0.2s linear",
          }}
        >
          {[CUT_A, CUT_B].map((clip, k) => (
            <div
              key={k}
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: clip,
                transform:
                  k === 0
                    ? "translate3d(calc(var(--part) * -7%), calc(var(--part) * -14%), 0) rotate(calc(var(--part) * -4deg))"
                    : "translate3d(calc(var(--part) * 7%), calc(var(--part) * 16%), 0) rotate(calc(var(--part) * 3deg))",
                opacity: "calc(1 - var(--part) * var(--part))",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={k === 0 ? `${p.title} screenshot` : ""}
                aria-hidden={k === 1}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
                style={{
                  transform: "scale(calc(1.12 - var(--drift) * 0.08))",
                  filter: "brightness(calc(0.25 + var(--enter) * 0.75)) saturate(calc(0.5 + var(--enter) * 0.5))",
                }}
              />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0_1px,transparent_1px_3px)] mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            </div>
          ))}
          {/* frame + corner brackets */}
          <div className="pointer-events-none absolute inset-0 border border-white/10" style={{ opacity: "calc(1 - var(--part))" }} />
          {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
            <span key={c} className={`absolute h-6 w-6 ${c}`} style={{ borderColor: accent, opacity: "calc(var(--enter) * (1 - var(--part)))" }} />
          ))}
          {/* the slash */}
          <span
            className="slash absolute left-[-6%] top-[52%] h-[3px] w-[112%] origin-left"
            style={{ transform: "translateY(-50%) rotate(-9.93deg) scaleX(var(--cut))", opacity: "calc(var(--cut) * (1 - var(--part) * 1.4))" }}
          />
        </div>
        <p className="smallcaps mt-3 flex justify-between text-white/40" style={{ opacity: "calc(var(--enter) * (1 - var(--exit) * 2))" }}>
          <span>
            fig. {String(i + 1).padStart(2, "0")} — {p.slug}
          </span>
          <span>
            {p.category} · {p.year}
          </span>
        </p>
      </div>

      {/* the words */}
      <div className="absolute bottom-[8vh] left-4 right-4 sm:bottom-auto sm:left-[6vw] sm:right-auto sm:top-1/2 sm:w-[min(36vw,34rem)] sm:-translate-y-1/2">
        <p className="smallcaps flex items-center gap-3 text-white/55" style={rise(0)}>
          <span className="font-jp text-base tracking-normal" style={{ color: accent }}>
            {KANJI[i]}
          </span>
          case file {String(i + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 font-serif text-[clamp(2.6rem,6vw,5.6rem)] font-light leading-[0.92] tracking-tight">
          {words.map((w, k) => (
            <span key={k} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span className="inline-block" style={rise(k + 1)}>
                {w}
              </span>
            </span>
          ))}
        </h3>
        <p className="mt-2 font-serif text-xl italic text-white/70 sm:text-2xl" style={rise(2)}>
          {p.tagline}
        </p>
        <p className="mt-4 hidden max-w-md text-sm leading-relaxed text-white/60 sm:block" style={rise(3)}>
          {p.description}
        </p>
        <div className="mt-5 flex gap-6 sm:mt-7 sm:gap-8" style={rise(4)}>
          {p.metrics.map(([v, l]) => (
            <div key={l}>
              <p className="font-serif text-2xl sm:text-3xl">{v}</p>
              <p className="smallcaps mt-0.5 !text-[9px] text-white/45">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 hidden font-mono text-[11px] leading-6 text-white/45 sm:block" style={rise(5)}>
          {p.tech.join("  ·  ")}
        </p>
        <div className="mt-5 flex gap-3" style={rise(6)}>
          {p.links.live && (
            <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="focus-ring group flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-white/60 hover:bg-white hover:text-black">
              Visit <span className="transition group-hover:translate-x-0.5">↗</span>
            </a>
          )}
          {p.links.github && (
            <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-2 px-2 py-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-white">
              <span className="link-u">Source</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
