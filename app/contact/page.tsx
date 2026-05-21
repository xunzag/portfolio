"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import {
  Send, Mail, Phone, MapPin, Github, Linkedin, Instagram,
  Check, Loader2, AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import emailjs from "@emailjs/browser"

/* ════════════════════════════════════════════════════════════════
   THREE.JS TORUS KNOT
════════════════════════════════════════════════════════════════ */

function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null)

  const mat = new THREE.MeshStandardMaterial({
    color:       new THREE.Color("#a855f7"),
    emissive:    new THREE.Color("#3b82f6"),
    emissiveIntensity: 0.3,
    metalness:   0.8,
    roughness:   0.2,
    wireframe:   true,
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

const contactInfo = [
  { icon: Mail,    label: "Email",    value: "farhan.babar123@gmail.com", href: "mailto:farhan.babar123@gmail.com" },
  { icon: Phone,   label: "Phone",   value: "+92 330 622 6290",           href: "tel:+923306226290" },
  { icon: MapPin,  label: "Location",value: "Pakistan",                   href: "#" },
]

const socials = [
  { icon: Github,    href: "https://github.com/xunzag",                        label: "GitHub"    },
  { icon: Linkedin,  href: "https://www.linkedin.com/in/farhan-ali-98a584206/",label: "LinkedIn"  },
  { icon: Instagram, href: "https://www.instagram.com/xunzag",                 label: "Instagram" },
]

type Status = "idle" | "loading" | "success" | "error"

/* ════════════════════════════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════════════════════════════ */

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [form,   setForm]   = useState({ name: "", email: "", subject: "", message: "" })

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
        setTimeout(() => setStatus("idle"), 4000)
      } else {
        throw new Error("Failed")
      }
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  const inputClass = cn(
    "w-full bg-neutral-900/60 border border-neutral-800",
    "rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600",
    "focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10",
    "transition-all duration-300",
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="group relative">
          <input
            type="text"
            name="user_name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your Name"
            required
            className={inputClass}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
        </div>

        <div className="group relative">
          <input
            type="email"
            name="user_email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Your Email"
            required
            className={inputClass}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
        </div>
      </div>

      <div className="group relative">
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          placeholder="Subject"
          className={inputClass}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
      </div>

      <div className="group relative">
        <textarea
          name="message"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          placeholder="Tell me about your project…"
          rows={6}
          required
          className={cn(inputClass, "resize-none")}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
      </div>

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "w-full py-4 rounded-xl font-medium text-white relative overflow-hidden",
          "bg-gradient-to-r from-purple-500 to-blue-500",
          "hover:shadow-lg hover:shadow-purple-500/30 transition-shadow",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2",
        )}
      >
        <AnimatePresence mode="wait">
          {status === "loading" ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader2 className="w-5 h-5 animate-spin" />
            </motion.div>
          ) : status === "success" ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Check className="w-5 h-5" /> Message Sent!
            </motion.div>
          ) : status === "error" ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Failed — try again
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Send className="w-5 h-5" /> Send Message
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </form>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(59,130,246,0.07),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-16"
        >
          <span className="section-label mx-auto">Contact</span>
          <h1 className="text-5xl md:text-6xl font-bold">
            Let's{" "}
            <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Have a project, an idea, or just want to say hello?
            My inbox is always open.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — info + torus */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Contact info cards */}
            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, label, value, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 glass-card rounded-xl p-4 group"
                >
                  <div className="p-2.5 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">{label}</div>
                    <div className="text-sm text-white font-medium">{value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Find me on</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -3, scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    className="p-3 rounded-full glass-card text-neutral-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Torus knot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-64 rounded-2xl overflow-hidden glass-card"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_70%)]" />
              <ContactScene />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-xs text-neutral-600">
                  Response time: usually within 24 hours
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </main>
  )
}
