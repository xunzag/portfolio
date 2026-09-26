"use client"

import { animes, hobbies } from "@/lib/content"
import { Label, Reveal } from "./common"

export function Life() {
  return (
    <div className="space-y-9">
      <Reveal>
        <p className="text-muted">The posters on the wall aren&apos;t decoration — they&apos;re a personality test. Hover one.</p>
      </Reveal>

      <Reveal i={1}>
        <Label>Anime hall of fame</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {animes.map((a) => (
            <figure key={a.title} tabIndex={0} className="focus-ring group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
              <img src={a.image} alt={a.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-focus:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-amber backdrop-blur">★ {a.rating}</span>
              <figcaption className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-[11px] text-muted">♥ {a.fav}</p>
                <p className="mt-2 max-h-0 overflow-hidden text-[11px] italic leading-snug text-ink/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100 group-focus:max-h-24 group-focus:opacity-100">
                  “{a.quote}”
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <Reveal i={2}>
        <Label>When the laptop closes</Label>
        <div className="space-y-2">
          {hobbies.map((h) => (
            <div key={h.title} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 pr-4 transition hover:bg-white/[0.06]">
              <img src={h.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover transition group-hover:rotate-[-3deg] group-hover:scale-105" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium">{h.title}</p>
                  <span className="font-mono text-[10px] text-muted">since {h.since}</span>
                </div>
                <p className="text-xs text-muted">{h.detail}</p>
                <p className="mt-1 truncate text-xs italic text-ink/70">“{h.quote}”</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal i={3}>
        <p className="text-center font-mono text-[11px] text-muted">psst — try the Konami code. ↑↑↓↓←→←→BA</p>
      </Reveal>
    </div>
  )
}
