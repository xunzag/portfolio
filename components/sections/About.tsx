"use client"

import { useEffect, useState } from "react"
import { animate } from "motion/react"
import { FileDown } from "lucide-react"
import { experience, profile, stats, values } from "@/lib/content"
import { Label, Reveal } from "./common"

export function About() {
  return (
    <div className="space-y-9">
      <Reveal className="flex gap-5">
        <img src={profile.photo} alt={profile.name} className="h-28 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-white/10" />
        <div className="space-y-1">
          <p className="text-lg font-medium">{profile.tagline}</p>
          <p className="font-mono text-xs text-muted">
            {profile.location} · {profile.timezone}
          </p>
          <p className="inline-flex items-center gap-2 pt-1 text-xs text-mint">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            Open to new opportunities
          </p>
        </div>
      </Reveal>

      <Reveal i={1} className="space-y-3 leading-relaxed text-ink/80">
        {profile.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Reveal>

      <Reveal i={2} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-3xl font-semibold tracking-tight">
              <Counter to={s.value} />
              <span className="text-violet">{s.suffix}</span>
            </p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </Reveal>

      <Reveal i={3}>
        <Label>git log --career</Label>
        <ol className="relative space-y-5 border-l border-white/10 pl-6">
          {experience.map((e) => (
            <li key={e.hash} className="relative">
              <span
                className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 ${e.active ? "border-mint bg-mint/30 shadow-[0_0_14px] shadow-mint" : "border-white/30 bg-bg"}`}
              />
              <p className="font-mono text-[11px] text-amber">
                {e.hash} {e.active && <span className="text-cyan">(HEAD → main)</span>}
              </p>
              <p className="font-medium">
                {e.role} <span className="text-muted">@ {e.company}</span>
              </p>
              <p className="text-xs text-muted">
                {e.period} · {e.type}
              </p>
              <p className="mt-1 text-sm text-ink/75">{e.desc}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal i={4}>
        <Label>How I work</Label>
        <div className="grid gap-2 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-4">
              <p className="font-medium">{v.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal i={5}>
        <a href={profile.cv} download className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg transition hover:scale-[1.03]">
          <FileDown size={15} /> Download CV
        </a>
      </Reveal>
    </div>
  )
}

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [to])
  return <>{n}</>
}
