"use client"

import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { projects } from "@/lib/content"
import { useRoom } from "@/lib/store"
import { Github } from "../ui/icons"
import { Label, Reveal, Tag } from "./common"

export function Work() {
  const index = useRoom((s) => s.project)
  const setProject = useRoom((s) => s.setProject)
  const p = projects[index]
  const go = (d: number) => setProject((index + d + projects.length) % projects.length)

  return (
    <div className="space-y-8">
      <Reveal>
        <p className="text-muted">
          The monitor is live — pick a project and it loads on the screen. <span className="kbd">←</span> <span className="kbd">→</span> to flip through.
        </p>
      </Reveal>

      <Reveal i={1}>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={p.image} alt={`${p.title} screenshot`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: p.accent }}>
                      {p.category} · {p.year}
                    </p>
                    <h3 className="text-2xl font-semibold">{p.title}</h3>
                    <p className="text-sm text-ink/70">{p.tagline}</p>
                  </div>
                  <span className="font-mono text-xs text-ink/50">
                    {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="space-y-5 p-5">
                <p className="leading-relaxed text-ink/80">{p.description}</p>
                <div className="grid grid-cols-3 gap-2">
                  {p.metrics.map(([v, l]) => (
                    <div key={l} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                      <p className="text-lg font-semibold" style={{ color: p.accent }}>
                        {v}
                      </p>
                      <p className="text-[11px] text-muted">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.links.live && (
                    <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg transition hover:scale-[1.03]">
                      Visit site <ArrowUpRight size={15} />
                    </a>
                  )}
                  {p.links.github && (
                    <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-ink transition hover:bg-white/10">
                      <Github size={14} /> Source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute right-3 top-3 flex gap-1.5">
            <button aria-label="Previous project" onClick={() => go(-1)} className="focus-ring grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur transition hover:bg-black/70">
              <ChevronLeft size={16} />
            </button>
            <button aria-label="Next project" onClick={() => go(1)} className="focus-ring grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur transition hover:bg-black/70">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal i={2}>
        <Label>All projects</Label>
        <ul className="space-y-1">
          {projects.map((x, i) => (
            <li key={x.slug}>
              <button
                onClick={() => setProject(i)}
                aria-current={i === index}
                className={`focus-ring group flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition ${i === index ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
              >
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-2 w-2 rounded-full transition group-hover:scale-150" style={{ background: x.accent }} />
                <span className="flex-1 font-medium">{x.title}</span>
                <span className="hidden text-xs text-muted sm:block">{x.tagline}</span>
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal i={3}>
        <a href="https://github.com/xunzag" target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center justify-between rounded-2xl border border-dashed border-white/15 px-5 py-4 text-sm text-muted transition hover:border-violet hover:text-ink">
          <span className="font-mono">$ git clone github.com/xunzag</span>
          <ArrowUpRight size={16} />
        </a>
      </Reveal>
    </div>
  )
}
