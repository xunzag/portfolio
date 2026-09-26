"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { X } from "lucide-react"
import { useRoom, sections, type Section } from "@/lib/store"
import { Work } from "../sections/Work"
import { About } from "../sections/About"
import { Skills } from "../sections/Skills"
import { Life } from "../sections/Life"
import { Contact } from "../sections/Contact"

const CONTENT: Record<Section, { eyebrow: string; title: string; body: () => React.ReactNode }> = {
  work: { eyebrow: "~/projects", title: "Things I've shipped", body: () => <Work /> },
  about: { eyebrow: "~/about", title: "Hey, I'm Farhan.", body: () => <About /> },
  skills: { eyebrow: "~/stack", title: "What's inside the machine", body: () => <Skills /> },
  life: { eyebrow: "~/life", title: "Off the clock", body: () => <Life /> },
  contact: { eyebrow: "~/contact", title: "Let's build something", body: () => <Contact /> },
}

function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const q = window.matchMedia("(max-width: 899px)")
    const on = () => setM(q.matches)
    on()
    q.addEventListener("change", on)
    return () => q.removeEventListener("change", on)
  }, [])
  return m
}

export function Panel({ section }: { section: Section }) {
  const mobile = useIsMobile()
  const scroller = useRef<HTMLDivElement>(null)
  const c = CONTENT[section]
  const idx = sections.findIndex((s) => s.id === section)

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [section])

  const hidden = mobile ? { y: "100%", x: 0 } : { x: "105%", y: 0 }

  return (
    <motion.aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="panel-title"
      initial={hidden}
      animate={{ x: 0, y: 0 }}
      exit={hidden}
      transition={{ type: "spring", damping: 32, stiffness: 260, mass: 0.9 }}
      className="glass absolute z-30 flex flex-col overflow-hidden shadow-2xl max-[899px]:inset-x-0 max-[899px]:bottom-0 max-[899px]:h-[62dvh] max-[899px]:rounded-t-3xl min-[900px]:bottom-4 min-[900px]:right-4 min-[900px]:top-[76px] min-[900px]:w-[min(600px,44vw)] min-[900px]:rounded-3xl"
    >
      {mobile && <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/20" />}
      <div className="flex shrink-0 items-start justify-between gap-4 px-6 pb-4 pt-5 sm:px-8 sm:pt-7">
        <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="font-mono text-xs text-violet">
            {String(idx + 1).padStart(2, "0")} · {c.eyebrow}
          </p>
          <h2 id="panel-title" className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            {c.title}
          </h2>
        </motion.div>
        <button
          onClick={() => useRoom.getState().setFocus(null)}
          aria-label="Close panel and return to the room"
          className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-muted transition hover:rotate-90 hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>
      <div ref={scroller} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-6 pb-10 sm:px-8">
        <motion.div key={section} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          {c.body()}
        </motion.div>
      </div>
    </motion.aside>
  )
}
