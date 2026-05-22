"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import {
  Send, Mail, Phone, MapPin, Github, Linkedin, Instagram,
  Check, Loader2, AlertCircle, Download, ExternalLink,
  Clock, Briefcase, Globe, Minimize2, Maximize2, X,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import emailjs from "@emailjs/browser"
import Link from "next/link"
import { ScrambleText } from "@/components/scramble-text"

/* ════════════════════════════════════════════════════════════════
   THREE.JS TORUS KNOT
════════════════════════════════════════════════════════════════ */

function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#a855f7"),
    emissive: new THREE.Color("#3b82f6"),
    emissiveIntensity: 0.3,
    metalness: 0.8,
    roughness: 0.2,
    wireframe: true,
  })

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.15
    meshRef.current.rotation.y = t * 0.25
    meshRef.current.rotation.z = t * 0.08
  })

  return (
    <mesh ref={meshRef} material={mat}>
      <torusKnotGeometry args={[1.4, 0.35, 180, 20, 2, 3]} />
    </mesh>
  )
}

function ContactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#a855f7" />
      <pointLight position={[-5, -5, 3]} intensity={0.5} color="#3b82f6" />
      <TorusKnot />
    </Canvas>
  )
}

/* ════════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════════ */

type Status = "idle" | "loading" | "success" | "error"

const openTo = [
  "Full-time Senior Developer",
  "Long-term Contract (6+ months)",
  "Consulting & Freelance Projects",
  "Technical Co-founder",
]

const quickFacts = [
  { icon: CheckCircle2, label: "Availability",   value: "Open to hire",          color: "text-green-400"  },
  { icon: MapPin,       label: "Location",        value: "Pakistan · Remote OK",  color: "text-blue-400"   },
  { icon: Clock,        label: "Response time",   value: "< 24 hours",            color: "text-cyan-400"   },
  { icon: Globe,        label: "Timezone",        value: "UTC +5 (PKT)",          color: "text-purple-400" },
  { icon: Briefcase,    label: "Experience",      value: "2+ years · 50+ shipped",color: "text-yellow-400" },
]

/* ════════════════════════════════════════════════════════════════
   LEFT PANEL — HR-first information card
════════════════════════════════════════════════════════════════ */

function InfoPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      {/* ── At a Glance card ── */}
      <div className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40">
        {/* Card header */}
        <div className="px-5 py-4 border-b border-neutral-800/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Farhan Babar</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Senior Full Stack Developer</p>
          </div>
          {/* Availability pulse */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-xs text-green-400 font-medium">Available now</span>
          </div>
        </div>

        {/* Quick facts grid */}
        <div className="p-5 space-y-3">
          {quickFacts.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex items-center gap-3"
            >
              <Icon className={cn("w-4 h-4 shrink-0", color)} />
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="text-xs text-neutral-600 w-24 shrink-0">{label}</span>
                <span className="text-sm text-neutral-200 truncate">{value}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Open to */}
        <div className="px-5 pb-5">
          <div className="pt-4 border-t border-neutral-800/50">
            <p className="text-xs text-neutral-600 uppercase tracking-widest mb-3">Currently open to</p>
            <div className="space-y-2">
              {openTo.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-center gap-2 text-sm text-neutral-300"
                >
                  <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Direct contact */}
        <div className="px-5 pb-5 space-y-2">
          <div className="pt-4 border-t border-neutral-800/50">
            <p className="text-xs text-neutral-600 uppercase tracking-widest mb-3">Direct contact</p>
            {[
              { icon: Mail,    label: "farhan.babar123@gmail.com", href: "mailto:farhan.babar123@gmail.com" },
              { icon: Phone,   label: "+92 330 622 6290",           href: "tel:+923306226290"                },
              { icon: Linkedin,label: "linkedin.com/in/farhan-ali", href: "https://www.linkedin.com/in/farhan-ali-98a584206/" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2 text-sm text-neutral-400 hover:text-white transition-colors group"
              >
                <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate group-hover:text-purple-300 transition-colors">{label}</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="px-5 pb-5 flex gap-3">
          <a
            href="/cv.pdf"
            download
            className="flex-1 btn-primary text-sm py-2.5 justify-center"
          >
            <Download className="w-4 h-4" /> Download CV
          </a>
          <a
            href="https://github.com/xunzag"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center justify-center px-4 py-2.5 text-sm"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/xunzag"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center justify-center px-4 py-2.5 text-sm"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ── Developer terminal snippet ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40"
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-neutral-900/80 border-b border-neutral-800">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 font-mono text-xs text-neutral-600">farhan@portfolio — zsh</span>
        </div>
        <div className="p-4 font-mono text-xs space-y-2">
          <div>
            <span className="text-green-400">$</span>
            <span className="text-neutral-300"> curl https://farhan.dev/api/status</span>
          </div>
          <div className="pl-2 space-y-1">
            <div><span className="text-yellow-400">{"{"}</span></div>
            <div className="pl-3"><span className="text-cyan-400">"available"</span><span className="text-neutral-500">: </span><span className="text-green-400">true</span><span className="text-neutral-500">,</span></div>
            <div className="pl-3"><span className="text-cyan-400">"response"</span><span className="text-neutral-500">: </span><span className="text-orange-400">"&lt; 24h"</span><span className="text-neutral-500">,</span></div>
            <div className="pl-3"><span className="text-cyan-400">"timezone"</span><span className="text-neutral-500">: </span><span className="text-orange-400">"UTC+5"</span><span className="text-neutral-500">,</span></div>
            <div className="pl-3"><span className="text-cyan-400">"coffee"</span><span className="text-neutral-500">: </span><span className="text-green-400">true</span></div>
            <div><span className="text-yellow-400">{"}"}</span></div>
          </div>
          <div className="pt-1">
            <span className="text-green-400">$</span>
            <span className="text-neutral-600"> # reach out at any of the channels above</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-700">
            <span className="text-green-400">$</span>
            <span className="animate-pulse">▌</span>
          </div>
        </div>
      </motion.div>

      {/* ── Three.js visual ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative w-full h-48 rounded-2xl overflow-hidden glass-card border border-neutral-700/30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_70%)]" />
        <ContactScene />
        <div className="absolute bottom-3 left-0 right-0 text-center font-mono text-xs text-neutral-700">
          // torus_knot.render() — just for fun
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════
   EMAIL COMPOSE WINDOW — right panel
════════════════════════════════════════════════════════════════ */

function EmailCompose() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [wordCount, setWordCount] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const result = await emailjs.sendForm(
        "service_gx0cj7o",
        "template_nodmfpa",
        formRef.current!,
        "pa51ET1DYIGze1RqM",
      )
      if (result.text === "OK") {
        setStatus("success")
        setForm({ name: "", email: "", subject: "", message: "" })
        setWordCount(0)
        setTimeout(() => setStatus("idle"), 5000)
      } else throw new Error("Failed")
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  const fieldClass = cn(
    "w-full bg-transparent text-sm text-white placeholder:text-neutral-600",
    "focus:outline-none transition-colors",
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40 flex flex-col"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900/80 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 flex items-center justify-center"><X className="w-1.5 h-1.5 text-red-900 opacity-0 hover:opacity-100" /></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs text-neutral-500 font-medium">New Message</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-700">
          <Minimize2 className="w-3.5 h-3.5" />
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col flex-1">

        {/* To field — pre-filled */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-800/60">
          <span className="text-xs text-neutral-600 w-16 shrink-0 text-right">To</span>
          <div className="flex-1 flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 font-mono">
              farhan.babar123@gmail.com
            </span>
          </div>
        </div>

        {/* From / Name field */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-800/60 group">
          <label className="text-xs text-neutral-600 w-16 shrink-0 text-right" htmlFor="contact-name">From</label>
          <input
            id="contact-name"
            type="text"
            name="user_name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
            required
            className={cn(fieldClass, "flex-1")}
          />
        </div>

        {/* Reply-to email */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-800/60 group">
          <label className="text-xs text-neutral-600 w-16 shrink-0 text-right" htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            name="user_email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com"
            required
            className={cn(fieldClass, "flex-1")}
          />
        </div>

        {/* Subject */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-800/60 group">
          <label className="text-xs text-neutral-600 w-16 shrink-0 text-right" htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
            placeholder="What's this about?"
            className={cn(fieldClass, "flex-1 font-medium")}
          />
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-4 relative">
          <textarea
            name="message"
            value={form.message}
            onChange={(e) => {
              setForm((p) => ({ ...p, message: e.target.value }))
              setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length)
            }}
            placeholder={`Hi Farhan,\n\nI'd love to discuss an opportunity with you...\n\n— Your name`}
            rows={10}
            required
            className={cn(fieldClass, "resize-none w-full h-full min-h-[200px] leading-relaxed")}
          />
        </div>

        {/* Toolbar / send bar */}
        <div className="px-5 py-3.5 border-t border-neutral-800/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Send button */}
            <motion.button
              type="submit"
              disabled={status === "loading" || status === "success"}
              whileHover={{ scale: status === "idle" ? 1.03 : 1 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                "bg-gradient-to-r from-purple-500 to-blue-500 text-white",
                "hover:shadow-lg hover:shadow-purple-500/25",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              <AnimatePresence mode="wait">
                {status === "loading" && (
                  <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                  </motion.span>
                )}
                {status === "success" && (
                  <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Sent!
                  </motion.span>
                )}
                {status === "error" && (
                  <motion.span key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Try again
                  </motion.span>
                )}
                {status === "idle" && (
                  <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Discard */}
            <button
              type="button"
              onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setWordCount(0) }}
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              Discard
            </button>
          </div>

          {/* Word count — subtle developer detail */}
          <span className="text-xs text-neutral-700 font-mono">
            {wordCount > 0 ? `${wordCount} words` : ""}
          </span>
        </div>
      </form>

      {/* Success overlay */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 gap-4"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-green-400" />
            </motion.div>
            <div className="text-center space-y-1">
              <p className="text-white font-semibold">Message delivered!</p>
              <p className="text-neutral-500 text-sm">I'll get back to you within 24 hours.</p>
            </div>
            <div className="font-mono text-xs text-neutral-600">
              <span className="text-green-400">200 OK</span> · Message queued successfully
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(59,130,246,0.06),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_60%,rgba(168,85,247,0.06),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto">

        {/* Header — speaks both languages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-14"
        >
          <div className="font-mono text-xs text-neutral-600">
            <span className="text-green-400">$</span>
            {" "}<span className="text-neutral-500">// open to new connections</span>
          </div>
          <span className="section-label mx-auto">Contact</span>
          <ScrambleText
            as="h1"
            text="Get In Touch"
            className="text-5xl md:text-6xl font-bold"
            speed={25}
          />
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Whether you're a recruiter with an exciting role, a founder with a bold idea,
            or a developer who wants to collaborate — I'd love to hear from you.
          </p>

          {/* Dual-audience subtitle chips */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              { label: "👔 Hiring managers", desc: "CV + availability info on the left" },
              { label: "🚀 Founders",         desc: "Let's build something great"        },
              { label: "💻 Developers",       desc: "curl /api/status on the left"      },
            ].map(({ label, desc }) => (
              <span
                key={label}
                title={desc}
                className="px-3 py-1.5 text-xs rounded-full glass-card text-neutral-400 border border-neutral-800 cursor-default"
              >
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start relative">
          <InfoPanel />
          <EmailCompose />
        </div>

      </div>
    </main>
  )
}
