"use client"

import { useRef, useState } from "react"
import { band, local, ss } from "@/lib/acts"
import { animes, emailjsConfig, hobbies, openTo, profile, shelf } from "@/lib/content"
import { live } from "../live"
import { present, useLive } from "./useLive"

// Act IV — the eclipse. Off the clock first, then the way to reach me.

export function FinaleAct() {
  const root = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLDivElement>(null)
  const life = useRef<HTMLDivElement>(null)
  const contact = useRef<HTMLDivElement>(null)

  useLive(() => {
    const s = live.scroll
    const t = local(s, "finale")
    const on = t > 0
    if (root.current) root.current.style.display = on ? "" : "none"
    if (!on) return
    present(title.current, band(t, 0.02, 0.07, 0.15, 0.2), 30, 12)
    present(life.current, band(t, 0.2, 0.28, 0.5, 0.56))
    const c = ss(0.62, 0.74, t)
    present(contact.current, c)
    if (contact.current) contact.current.style.pointerEvents = c > 0.5 ? "auto" : "none"
  })

  return (
    <div ref={root} className="layer z-10" style={{ display: "none" }}>
      <div ref={title} className="invisible absolute inset-x-0 top-[30%] px-4 text-center">
        <p className="font-jp text-sm tracking-[0.6em] text-blood">蝕</p>
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-[0.95]">
          Discipline today.
          <br />
          <em className="text-white/70">Freedom tomorrow.</em>
        </h2>
      </div>

      {/* off the clock */}
      <div ref={life} className="invisible absolute bottom-16 left-4 right-4 sm:bottom-auto sm:right-auto sm:top-[14vh] sm:w-[min(40rem,48vw)] sm:left-[5vw]">
        <div className="panel max-h-[70vh] overflow-y-auto p-6 sm:max-h-[76vh] sm:p-8">
          <p className="smallcaps text-blood">V · off the clock</p>
          <h2 className="mt-2 font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] font-light leading-none">When the laptop closes.</h2>
          <p className="smallcaps mt-6 text-white/45">watchlist</p>
          <ul className="mt-2 divide-y divide-white/[0.06]">
            {animes.map((a) => (
              <li key={a.title} className="flex items-baseline justify-between gap-4 py-2">
                <span className="font-serif text-lg">{a.title}</span>
                <span className="hidden flex-1 truncate text-right text-xs italic text-white/45 sm:block">“{a.quote}”</span>
                <span className="font-mono text-xs text-blood">{a.rating}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="smallcaps text-white/45">also</p>
              <ul className="mt-2 space-y-1.5 text-sm text-white/70">
                {hobbies.map((h) => (
                  <li key={h.title}>
                    <span className="text-white">{h.title}</span> <span className="text-white/45">— {h.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="smallcaps text-white/45">on the shelf</p>
              <p className="mt-2 text-sm leading-6 text-white/70">{shelf.reading.join(" · ")}</p>
              <p className="mt-2 font-mono text-[11px] leading-5 text-white/40">{shelf.studying.join(" / ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* contact */}
      <div className="absolute bottom-16 left-4 right-4 sm:bottom-auto sm:right-auto sm:top-1/2 sm:w-[min(38rem,46vw)] sm:-translate-y-1/2 sm:left-[5vw]">
        <div ref={contact} className="invisible max-h-[86vh] overflow-y-auto">
          <p className="smallcaps text-blood">VI · contact</p>
          <h2 className="mt-3 font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[0.95]">
            Let&apos;s build
            <br />
            <em>something.</em>
          </h2>
          <a href={`mailto:${profile.email}`} className="focus-ring link-u mt-5 inline-block font-serif text-xl text-white/85 sm:text-2xl">
            {profile.email}
          </a>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
            {openTo.map((o) => (
              <li key={o}>◆ {o}</li>
            ))}
          </ul>
          <ContactForm />
          <div className="mt-6 flex flex-wrap gap-5 text-xs uppercase tracking-[0.25em] text-white/60">
            <a className="link-u hover:text-white" href={profile.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="link-u hover:text-white" href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="link-u hover:text-white" href={profile.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="link-u hover:text-white" href={profile.cv}>CV ↓</a>
          </div>
          <p className="smallcaps mt-8 !text-[9px] text-white/30">
            © {new Date().getFullYear()} {profile.name} · {profile.tagline}
          </p>
        </div>
      </div>
    </div>
  )
}

type Status = "idle" | "sending" | "sent" | "error"

function ContactForm() {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>("idle")
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.current || status === "sending") return
    setStatus("sending")
    try {
      const emailjs = (await import("@emailjs/browser")).default
      await emailjs.sendForm(emailjsConfig.serviceId, emailjsConfig.templateId, form.current, { publicKey: emailjsConfig.publicKey })
      setStatus("sent")
      form.current.reset()
      setTimeout(() => setStatus("idle"), 5000)
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }
  const field =
    "w-full border-0 border-b border-white/20 bg-transparent px-0 py-2.5 text-[15px] text-white placeholder:text-white/40 outline-none transition focus:border-blood"
  return (
    <form ref={form} onSubmit={submit} className="mt-7 space-y-3" aria-label="Contact form">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
        <input className={field} name="user_name" placeholder="Your name" required autoComplete="name" aria-label="Your name" />
        <input className={field} name="user_email" type="email" placeholder="you@company.com" required autoComplete="email" aria-label="Your email" />
      </div>
      <input className={field} name="subject" placeholder="What's this about?" required aria-label="Subject" />
      <textarea className={`${field} h-20 resize-none`} name="message" placeholder="Tell me everything…" required aria-label="Message" />
      <button
        type="submit"
        disabled={status === "sending"}
        className="focus-ring group mt-2 flex w-full items-center justify-between border border-blood/60 bg-blood/10 px-5 py-3.5 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-blood hover:shadow-[0_0_40px_rgba(224,36,47,0.5)]"
      >
        <span>
          {status === "idle" && "Send message"}
          {status === "sending" && "Sending…"}
          {status === "sent" && "Received. Talk soon ✓"}
          {status === "error" && "Failed — use email instead"}
        </span>
        <span className="transition group-hover:translate-x-1">→</span>
      </button>
    </form>
  )
}
