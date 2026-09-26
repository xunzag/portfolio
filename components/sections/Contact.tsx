"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, Check, Copy, Loader2, Send } from "lucide-react"
import { emailjsConfig, openTo, profile } from "@/lib/content"
import { Github, Instagram, Linkedin } from "../ui/icons"
import { Label, Reveal } from "./common"

type Status = "idle" | "sending" | "sent" | "error"

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-violet focus:bg-white/[0.06] focus:ring-2 focus:ring-violet/30"

export function Contact() {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [copied, setCopied] = useState(false)

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <div className="space-y-9">
      <Reveal>
        <p className="text-muted">
          That phone&apos;s been buzzing. Tell me about your project, role or wild idea — I reply within 24 hours.
        </p>
      </Reveal>

      <Reveal i={1}>
        <form ref={form} onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} name="user_name" placeholder="Your name" required autoComplete="name" aria-label="Your name" />
            <input className={field} name="user_email" type="email" placeholder="you@company.com" required autoComplete="email" aria-label="Your email" />
          </div>
          <input className={field} name="subject" placeholder="What's this about?" required aria-label="Subject" />
          <textarea className={`${field} min-h-32 resize-y`} name="message" placeholder="Tell me everything…" required aria-label="Message" />
          <button
            type="submit"
            disabled={status === "sending"}
            className="focus-ring relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-ink px-5 py-3.5 text-sm font-semibold text-bg transition hover:scale-[1.01] disabled:opacity-70"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={status} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="flex items-center gap-2">
                {status === "idle" && (
                  <>
                    Send message <Send size={15} />
                  </>
                )}
                {status === "sending" && (
                  <>
                    Sending <Loader2 size={15} className="animate-spin" />
                  </>
                )}
                {status === "sent" && (
                  <>
                    Sent — talk soon! <Check size={15} />
                  </>
                )}
                {status === "error" && <>Something broke. Try email instead?</>}
              </motion.span>
            </AnimatePresence>
          </button>
        </form>
      </Reveal>

      <Reveal i={2}>
        <Label>Or reach me directly</Label>
        <div className="space-y-2">
          <button onClick={copy} className="focus-ring group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.06]">
            <span>
              <span className="block text-xs text-muted">Email</span>
              <span className="font-medium">{profile.email}</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted group-hover:text-ink">
              {copied ? (
                <>
                  copied <Check size={13} className="text-mint" />
                </>
              ) : (
                <>
                  copy <Copy size={13} />
                </>
              )}
            </span>
          </button>
          <div className="grid grid-cols-3 gap-2">
            {[
              { href: profile.socials.github, label: "GitHub", Icon: Github },
              { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
              { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="focus-ring group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm transition hover:bg-white/[0.06]">
                <span className="flex items-center gap-2">
                  <Icon size={15} /> <span className="hidden sm:inline">{label}</span>
                </span>
                <ArrowUpRight size={14} className="text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal i={3} className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Open to</Label>
          <ul className="space-y-1.5 text-sm text-ink/80">
            {openTo.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="text-mint">✓</span> {o}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Label>Quick facts</Label>
          <dl className="space-y-1.5 text-sm">
            {[
              ["Location", profile.location],
              ["Timezone", profile.timezone],
              ["Response", "< 24 hours"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </div>
  )
}
