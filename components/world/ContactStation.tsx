"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"
import { RANGES } from "@/lib/chapters"
import { emailjsConfig, openTo, profile } from "@/lib/content"
import { Button3D } from "./Holo"
import { Type } from "./Type"
import { usePresence, useReveal } from "./presence"
import { CONTACT } from "./track"

export function ContactStation() {
  const [a, b] = RANGES.contact
  const on = usePresence(a + 60, b + 200, 60, 10)
  const g = useRef<THREE.Group>(null)
  const [formOn, setFormOn] = useState(false)
  useReveal(g, on, 0.8)
  useFrame(() => {
    const v = on.current ?? 0
    if (v > 0.6 !== formOn) setFormOn(v > 0.6)
  })
  const socials = [
    { label: "GITHUB", href: profile.socials.github },
    { label: "LINKEDIN", href: profile.socials.linkedin },
    { label: "INSTAGRAM", href: profile.socials.instagram },
  ]

  return (
    <group position={CONTACT}>
      <group ref={g}>
        <group position={[-6.2, 3.3, 0]}>
          <Type weight="semi" fontSize={0.16} letterSpacing={0.24} color="#6fffc0" glow={1.8}>
            {"07   CONTACT   /   OPEN TO WORK"}
          </Type>
        </group>
        <group position={[-6.2, 2.95, 0]}>
          <Type weight="bold" fontSize={0.95} letterSpacing={-0.04} lineHeight={0.92} glow={1.4} maxWidth={6.5}>
            {"Let's build\nsomething."}
          </Type>
        </group>
        <group position={[-6.2, 0.95, 0]}>
          <Type weight="light" fontSize={0.2} lineHeight={1.5} color="#d6d0f5" maxWidth={5.2}>
            {"Got a project, a role or a wild idea? Tell me about it. I reply within 24 hours."}
          </Type>
        </group>
        <group position={[-6.2, 0.05, 0]}>
          {openTo.map((o, i) => (
            <Type key={o} fontSize={0.16} position={[0, -i * 0.3, 0]} color="#bdf5dd">
              {`+  ${o}`}
            </Type>
          ))}
        </group>
        <group position={[-6.2, -1.45, 0]}>
          <Button3D label="EMAIL ME" href={`mailto:${profile.email}`} accent="#6fffc0" primary />
          <Button3D label="CV" href={profile.cv} accent="#6fffc0" position={[1.75, 0, 0]} />
        </group>
        <group position={[-6.2, -2.05, 0]}>
          {socials.map((s, i) => (
            <Button3D key={s.label} label={s.label} href={s.href} accent="#b18cff" position={[i * 1.55, 0, 0]} />
          ))}
        </group>
        <group position={[-6.2, -2.95, 0]}>
          <Type fontSize={0.13} letterSpacing={0.12} color="#8e87b3">
            {`${profile.email.toUpperCase()}   /   ${profile.location.toUpperCase()}   /   ${profile.timezone}`}
          </Type>
        </group>
      </group>
      {/* the form is real DOM, projected onto a plane in 3D */}
      <group position={[2.4, 0.4, 0]} rotation-y={-0.12}>
        <Html transform distanceFactor={4.2} zIndexRange={[5, 0]} style={{ opacity: formOn ? 1 : 0, transition: "opacity 0.8s", pointerEvents: formOn ? "auto" : "none" }}>
          <HoloForm />
        </Html>
      </group>
    </group>
  )
}

type Status = "idle" | "sending" | "sent" | "error"

function HoloForm() {
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
    "w-full border-0 border-b border-white/40 bg-transparent px-1 py-3 text-xl text-white placeholder:text-white/70 outline-none transition focus:border-[#6fffc0] focus:shadow-[0_8px_20px_-12px_#6fffc0]"
  return (
    <form ref={form} onSubmit={submit} className="holo-form w-[560px] space-y-5 font-sans" aria-label="Contact form">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#6fffc0]">› transmit a message</p>
      <div className="grid grid-cols-2 gap-6">
        <input className={field} name="user_name" placeholder="Your name" required autoComplete="name" aria-label="Your name" />
        <input className={field} name="user_email" type="email" placeholder="you@company.com" required autoComplete="email" aria-label="Your email" />
      </div>
      <input className={field} name="subject" placeholder="What's this about?" required aria-label="Subject" />
      <textarea className={`${field} h-32 resize-none`} name="message" placeholder="Tell me everything…" required aria-label="Message" />
      <button
        type="submit"
        disabled={status === "sending"}
        className="group relative mt-2 w-full overflow-hidden rounded-full border border-[#6fffc0]/60 py-4 font-mono text-sm uppercase tracking-[0.3em] text-[#6fffc0] transition hover:bg-[#6fffc0] hover:text-[#07060d] hover:shadow-[0_0_40px_#6fffc0]"
      >
        {status === "idle" && "Send transmission →"}
        {status === "sending" && "Transmitting…"}
        {status === "sent" && "Received. Talk soon ✓"}
        {status === "error" && "Signal lost. Try email instead"}
      </button>
    </form>
  )
}
