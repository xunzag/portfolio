"use client"

import { motion } from "motion/react"
import { skillGroups, toolbelt } from "@/lib/content"
import { Label, Reveal, Tag } from "./common"

export function Skills() {
  return (
    <div className="space-y-9">
      <Reveal>
        <p className="text-muted">
          Every fan in that case is a subsystem. Here&apos;s what&apos;s running — rated honestly, benchmarked on real client work.
        </p>
      </Reveal>

      {skillGroups.map((g, gi) => (
        <Reveal key={g.name} i={gi + 1}>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color, boxShadow: `0 0 14px ${g.color}` }} />
            <h3 className="font-semibold">{g.name}</h3>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <ul className="space-y-3.5">
            {g.items.map((s, i) => (
              <li key={s.name}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="font-mono text-xs text-muted">{s.level}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${g.color}55, ${g.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.level}%` }}
                    transition={{ delay: 0.4 + gi * 0.15 + i * 0.07, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}

      <Reveal i={5}>
        <Label>Daily toolbelt</Label>
        <div className="flex flex-wrap gap-1.5">
          {toolbelt.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </Reveal>

      <Reveal i={6}>
        <div className="rounded-2xl border border-violet/30 bg-violet/[0.07] p-4 font-mono text-xs leading-relaxed text-ink/80">
          <span className="text-violet">$</span> npm run learn --current
          <br />
          <span className="text-mint">→</span> WebGL &amp; shaders (you&apos;re standing in one)
          <br />
          <span className="text-mint">→</span> AI agents &amp; LLM-powered products
          <br />
          <span className="text-mint">→</span> Edge runtimes &amp; real-time systems
        </div>
      </Reveal>
    </div>
  )
}
