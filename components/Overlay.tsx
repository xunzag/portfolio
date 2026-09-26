"use client"

import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import { ArrowDown } from "lucide-react"
import { CHAPTERS, TOTAL_VH, local, type ChapterId } from "@/lib/chapters"
import { animes, experience, facts, hobbies, profile, projects, skillGroups } from "@/lib/content"
import { live } from "./world/live"

const vh = (id: ChapterId) => CHAPTERS.find((c) => c.id === id)!.vh

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

// Everything visible lives in 3D now. The DOM only carries the hero type,
// one cinematic line, the scroll height — and a full text copy for SEO / screen readers.
export function Overlay() {
  const before = CHAPTERS.slice(0, CHAPTERS.findIndex((c) => c.id === "portal")).reduce((n, c) => n + c.vh, 0)
  return (
    <div className="pointer-events-none relative z-10" style={{ height: `${TOTAL_VH}vh` }}>
      <Hero />
      <div style={{ height: `${before - vh("hero")}vh` }} />
      <ScreenReaderCopy />
    </div>
  )
}

function Hero() {
  const ref = useChapterVar("hero")
  const [first, last] = profile.name.split(" ")
  return (
    <section style={{ height: `${vh("hero")}vh` }} className="relative">
      <div
        ref={ref}
        className="sticky top-0 flex h-[100svh] flex-col justify-end px-5 pb-[12vh] sm:px-[6vw]"
        style={{ opacity: "calc(1 - var(--t, 0) * 2.2)", transform: "translate3d(0, calc(var(--t, 0) * -22vh), 0)" }}
        aria-hidden
      >
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="font-mono text-xs uppercase tracking-[0.35em] text-[#ff7fc8]">
          {profile.role} · Pakistan
        </motion.p>
        <h1 className="mt-3 font-semibold leading-[0.85] tracking-[-0.04em] text-[clamp(3.6rem,13vw,12rem)] [text-shadow:0_0_60px_rgba(177,140,255,0.35)]">
          <SplitWord word={first} delay={0.4} />
          <br />
          <SplitWord word={last} delay={0.6} gradient />
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 1 }} className="mt-6 max-w-md text-base text-ink/75 sm:text-lg">
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
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
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

function ScreenReaderCopy() {
  return (
    <article className="sr-only">
      <h1>
        {profile.name} — {profile.role}
      </h1>
      <p>{profile.tagline}</p>
      {profile.bio.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>Built with {p.tech.join(", ")}</p>
            {p.links.live && <a href={p.links.live}>{p.title} live site</a>}
            {p.links.github && <a href={p.links.github}>{p.title} source code</a>}
          </li>
        ))}
      </ul>
      <h2>Experience</h2>
      <ul>
        {experience.map((e) => (
          <li key={e.hash}>
            {e.role} at {e.company}, {e.period}. {e.desc}
          </li>
        ))}
      </ul>
      <h2>Things about me</h2>
      <ul>
        {facts.map((f) => (
          <li key={f.label}>
            {f.value} {f.label}
          </li>
        ))}
      </ul>
      <h2>Skills</h2>
      <ul>
        {skillGroups.flatMap((g) => g.items).map((s) => (
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>
      <h2>Anime & hobbies</h2>
      <ul>
        {animes.map((a) => (
          <li key={a.title}>{a.title}</li>
        ))}
        {hobbies.map((h) => (
          <li key={h.title}>
            {h.title}: {h.detail}
          </li>
        ))}
      </ul>
      <h2>Contact</h2>
      <a href={`mailto:${profile.email}`}>{profile.email}</a>
      <a href={profile.socials.github}>GitHub</a>
      <a href={profile.socials.linkedin}>LinkedIn</a>
      <a href={profile.cv}>Download CV</a>
    </article>
  )
}
