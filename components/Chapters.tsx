"use client"

import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { CHAPTERS, TOTAL_VH, local, type ChapterId } from "@/lib/chapters"
import { profile, projects, type Project } from "@/lib/content"
import { live } from "./world/live"
import { About } from "./sections/About"
import { Skills } from "./sections/Skills"
import { Life } from "./sections/Life"
import { Contact } from "./sections/Contact"
import { Tag } from "./sections/common"
import { Github } from "./ui/icons"

const vh = (id: ChapterId) => CHAPTERS.find((c) => c.id === id)!.vh

/** Drives CSS variables from the live scroll position without React re-renders. */
function useChapterVar(id: ChapterId) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      ref.current?.style.setProperty("--t", local(live.scroll, id).toFixed(4))
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [id])
  return ref
}

export function Chapters() {
  return (
    <main className="pointer-events-none relative z-10" style={{ height: `${TOTAL_VH}vh` }}>
      <Hero />
      <WorkChapter />
      <Interlude id="ascend" kicker="02 · the room" line="Every one of those started in one room." sub="Keep scrolling — we're going up." />
      <CardChapter id="about" offset={55}>
        <ChapterHeading kicker="03 · about" title="Hey, I'm Farhan." />
        <About />
      </CardChapter>
      <CardChapter id="stack" offset={60}>
        <ChapterHeading kicker="04 · stack" title="What's inside the machine" />
        <Skills />
      </CardChapter>
      <Interlude id="portal" kicker="05 · through the screen" line="Enough code. Let me show you what I love." sub="" />
      <CardChapter id="life" offset={45}>
        <ChapterHeading kicker="06 · life" title="Off the clock" />
        <Life />
      </CardChapter>
      <CardChapter id="contact" offset={25} last>
        <ChapterHeading kicker="07 · contact" title="Let's build something" />
        <Contact />
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-5 font-mono text-[11px] text-muted">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>made with three.js · r3f · gsap · lenis</span>
        </footer>
      </CardChapter>
    </main>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────

function Hero() {
  const ref = useChapterVar("hero")
  const [first, last] = profile.name.split(" ")
  return (
    <section style={{ height: `${vh("hero")}vh` }} className="relative">
      <div
        ref={ref}
        className="sticky top-0 flex h-[100svh] flex-col justify-end px-5 pb-[12vh] sm:px-[6vw]"
        style={{ opacity: "calc(1 - var(--t, 0) * 2.2)", transform: "translate3d(0, calc(var(--t, 0) * -22vh), 0)" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-mono text-xs uppercase tracking-[0.35em] text-cyan"
        >
          {profile.role} · {profile.location.split(" ·")[0]}
        </motion.p>
        <h1 className="mt-3 font-semibold leading-[0.85] tracking-[-0.04em] text-[clamp(3.6rem,13vw,12rem)]" aria-label={profile.name}>
          <SplitWord word={first} delay={0.4} />
          <br />
          <SplitWord word={last} delay={0.6} gradient />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-6 max-w-md text-base text-ink/75 sm:text-lg"
        >
          {profile.tagline}
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="mt-10 flex items-center gap-3 font-mono text-xs text-muted">
          <span className="grid h-10 w-6 place-items-start rounded-full border border-white/25 p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-ink/80 [margin-left:6px]" />
          </span>
          scroll to enter <ArrowDown size={13} />
        </motion.div>
      </div>
    </section>
  )
}

function SplitWord({ word, delay, gradient }: { word: string; delay: number; gradient?: boolean }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
      {[...word].map((ch, i) => (
        <motion.span
          key={i}
          className={`inline-block ${gradient ? "bg-gradient-to-br from-[#ff4fd8] via-violet to-cyan bg-clip-text text-transparent" : ""}`}
          initial={{ y: "110%", rotate: 8 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ delay: delay + i * 0.045, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

// ── Work: one card per billboard ──────────────────────────────────────

function WorkChapter() {
  const each = vh("work") / projects.length
  return (
    <section style={{ height: `${vh("work")}vh` }} className="relative">
      {projects.map((p, i) => (
        <div key={p.slug} style={{ height: `${each}vh` }} className={`flex items-center px-4 sm:px-[5vw] ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
          <ProjectCard p={p} i={i} />
        </div>
      ))}
    </section>
  )
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60, rotateX: 12, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: false, margin: "-18% 0px -18% 0px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 900 }}
      className="glass pointer-events-auto w-full max-w-[460px] overflow-hidden rounded-3xl shadow-[0_30px_120px_-20px_rgba(0,0,0,0.8)]"
    >
      <div className="relative aspect-[16/8] overflow-hidden">
        <img src={p.image} alt={`${p.title} screenshot`} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b18] via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] backdrop-blur" style={{ color: p.accent }}>
          {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: p.accent }}>
            {p.category} · {p.year}
          </p>
          <h3 className="mt-1 text-3xl font-semibold tracking-tight">{p.title}</h3>
          <p className="text-sm text-muted">{p.tagline}</p>
        </div>
        <p className="text-sm leading-relaxed text-ink/80">{p.description}</p>
        <div className="grid grid-cols-3 gap-2">
          {p.metrics.map(([v, l]) => (
            <div key={l} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="font-semibold" style={{ color: p.accent }}>
                {v}
              </p>
              <p className="text-[10px] text-muted">{l}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {p.links.live && (
            <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg transition hover:scale-[1.04]">
              Visit <ArrowUpRight size={15} />
            </a>
          )}
          {p.links.github && (
            <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/10">
              <Github size={14} /> Source
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// ── Interludes & card chapters ────────────────────────────────────────

function Interlude({ id, kicker, line, sub }: { id: ChapterId; kicker: string; line: string; sub: string }) {
  const ref = useChapterVar(id)
  return (
    <section style={{ height: `${vh(id)}vh` }} className="relative">
      <div
        ref={ref}
        className="sticky top-0 flex h-[100svh] flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: "calc(min(var(--t, 0) * 4, 1) * min((1 - var(--t, 0)) * 3, 1))",
          transform: "scale(calc(0.92 + var(--t, 0) * 0.16))",
        }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan">{kicker}</p>
        <p className="mt-4 max-w-4xl text-balance text-[clamp(2.2rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">{line}</p>
        {sub && <p className="mt-5 text-muted">{sub}</p>}
      </div>
    </section>
  )
}

function CardChapter({ id, offset, last, children }: { id: ChapterId; offset: number; last?: boolean; children: React.ReactNode }) {
  return (
    <section style={{ height: `${vh(id)}vh` }} className="relative">
      <div style={{ paddingTop: `${offset}vh` }} className={`flex px-4 sm:px-[4vw] ${last ? "pb-10" : ""} justify-end`}>
        <div className="glass pointer-events-auto w-full max-w-[560px] rounded-3xl p-6 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.8)] sm:p-8">{children}</div>
      </div>
    </section>
  )
}

function ChapterHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-7">
      <p className="font-mono text-xs text-violet">{kicker}</p>
      <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  )
}
