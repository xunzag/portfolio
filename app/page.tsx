"use client"

import React, {
  useEffect, useRef, useState, useCallback, useMemo,
} from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight, Github, Linkedin, Instagram, Download,
  Code, Brain, Rocket, ExternalLink, Globe,
  Folder, FileCode2, GitCommit, ChevronRight,
  Terminal as TerminalIcon, RefreshCw, ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import CountUp from "react-countup"
import { ScrambleText } from "@/components/scramble-text"

/* ════════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════════ */

const techStack = [
  { name: "React",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",              ver: "^19.0.0" },
  { name: "Next.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",            ver: "^15.1.7" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",    ver: "^5.7.2"  },
  { name: "Node.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",            ver: "^22.0.0" },
  { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",            ver: "^3.12.0" },
  { name: "Docker",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",            ver: "^27.0.0" },
  { name: "MongoDB",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",          ver: "^8.0.0"  },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",    ver: "^17.0.0" },
  { name: "Git",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",                  ver: "^2.47.0" },
  { name: "Redux",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",              ver: "^5.0.0"  },
  { name: "Tailwind",   icon: "/tailwindcss.png",                                                                          ver: "^4.0.0"  },
  { name: "AWS",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", ver: "latest" },
]

const vscodeProjects = [
  {
    file: "amazon-chapter.tsx",
    title: "AmazonChapter",
    url: "amazonchaapter.com",
    image: "/images/5.png",
    description: "Educational platform for Amazon-related courses with interactive learning modules and community features.",
    tech: ["React", "Next.js", "Firebase", "Stripe"],
    href: "/projects",
    langBadge: "TSX",
    gitMsg: "feat: launch Amazon course marketplace",
    gitHash: "a3f9d12",
  },
  {
    file: "freshcart.tsx",
    title: "FreshCart",
    url: "freshcart.app",
    image: "/images/FreshCart.webp",
    description: "Modern grocery purchasing platform with real-time inventory tracking and same-day delivery.",
    tech: ["React", "Node.js", "MongoDB", "Redux"],
    href: "/projects",
    langBadge: "TSX",
    gitMsg: "feat: ship real-time grocery cart flow",
    gitHash: "c7f2b91",
  },
  {
    file: "elevate-carts.tsx",
    title: "Elevate Carts",
    url: "elevatecarts.io",
    image: "/images/ec-1.png",
    description: "Tailored e-commerce with payment integrations, advanced analytics, and enterprise-grade architecture.",
    tech: ["Vue.js", "Laravel", "Docker", "GraphQL"],
    href: "/projects",
    langBadge: "TSX",
    gitMsg: "feat: deploy enterprise e-commerce engine",
    gitHash: "f8e3c22",
  },
  {
    file: "sales-dashboard.tsx",
    title: "Sales Analytics",
    url: "analytics.dashboard/live",
    image: "/images/4.png",
    description: "Real-time dashboard with D3.js visualisation, custom charting, and automated reporting.",
    tech: ["Next.js", "D3.js", "Firebase", "TypeScript"],
    href: "/projects",
    langBadge: "TSX",
    gitMsg: "feat: add live d3 sales visualisation",
    gitHash: "2b9ae41",
  },
]

const stats = [
  { value: 2,  suffix: "+", label: "Years Experience", pct: 25, cmd: "career --years"              },
  { value: 50, suffix: "+", label: "Projects Shipped",  pct: 83, cmd: "git log --all | wc -l"      },
  { value: 30, suffix: "+", label: "Happy Clients",     pct: 70, cmd: "clients --filter=satisfied"  },
  { value: 15, suffix: "+", label: "Technologies",      pct: 60, cmd: "npm list --depth=0 | wc -l"  },
]

const roles = [
  "Full Stack Developer",
  "AI Enthusiast",
  "Open Source Contributor",
  "Problem Solver",
  "anime enjoyer 🍜",
]

const experiences = [
  {
    hash: "a3f9d12",
    role: "Senior Full Stack Developer",
    company: "Elevate Carts",
    period: "2023 — Present",
    type: "Full-time",
    desc: "Building enterprise e-commerce solutions handling 100k+ SKUs",
    branch: "HEAD → main",
    active: true,
  },
  {
    hash: "c7f2b91",
    role: "Full Stack Developer",
    company: "AmazonChapter",
    period: "2022 — 2023",
    type: "Contract",
    desc: "Educational platform serving 10k+ active course learners",
    branch: "feature/amazon",
    active: false,
  },
  {
    hash: "8d1a5e3",
    role: "Frontend Developer",
    company: "LunchThymes",
    period: "2022",
    type: "Freelance",
    desc: "Pixel-perfect responsive interfaces with micro-animations",
    branch: "feature/lunch",
    active: false,
  },
]

/* ════════════════════════════════════════════════════════════════
   KONAMI CODE EASTER EGG
════════════════════════════════════════════════════════════════ */
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]

function useKonami(cb: () => void) {
  const seq = useRef<string[]>([])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      seq.current = [...seq.current.slice(-9), e.key]
      if (seq.current.join(",") === KONAMI.join(",")) cb()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [cb])
}

function KonamiModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1,   rotate: 0   }}
        exit   ={{ scale: 0.5, rotate: 10  }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-center space-y-6 p-12 glass-card rounded-3xl border border-purple-500/30 max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-7xl">🎮</div>
        <h2 className="text-3xl font-bold gradient-text">Konami Code Unlocked!</h2>
        <p className="text-neutral-400 font-mono text-sm">
          ↑↑↓↓←→←→BA<br />
          You found the Easter egg.<br />
          <span className="text-purple-400">+30 lives granted to your career.</span>
        </p>
        <div className="font-mono text-xs text-neutral-600 space-y-1">
          <p>achievements_unlocked += 1</p>
          <p>{'console.log("you\'re one of us 🤝")'}</p>
        </div>
        <button onClick={onClose} className="btn-primary text-sm">
          <span>Continue Playing →</span>
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════
   LIVE SYSTEM STATS (neofetch style)
════════════════════════════════════════════════════════════════ */

function LiveClock() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="text-green-400 font-mono text-xs">{time}</span>
}

function SystemStats() {
  const rows = [
    { label: "OS",       value: "Coffee-Powered Linux 6.9" },
    { label: "Shell",    value: "zsh + ohmyzsh" },
    { label: "Editor",   value: "VS Code (neovim on weekends)" },
    { label: "Status",   value: <span className="text-green-400">● Available for work</span> },
    { label: "Location", value: "Pakistan 🇵🇰" },
    { label: "Time",     value: <LiveClock /> },
    { label: "Coffee",   value: "████████████ 2190 cups" },
    { label: "Memory",   value: "16GB (12GB = Chrome tabs)" },
  ]

  return (
    <div className="font-mono text-xs space-y-1.5">
      {rows.map(({ label, value }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1,  x: 0   }}
          transition={{ delay: 0.8 + i * 0.07, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <span className="text-cyan-400 w-16 shrink-0">{label}</span>
          <span className="text-neutral-500">:</span>
          <span className="text-neutral-300">{value}</span>
        </motion.div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   TYPEWRITER ROLE
════════════════════════════════════════════════════════════════ */

function TypewriterRole() {
  const [index,    setIndex]   = useState(0)
  const [text,     setText]    = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = roles[index]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && text !== target) {
      timeout = setTimeout(() => setText(target.slice(0, text.length + 1)), 60)
    } else if (!deleting && text === target) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && text !== "") {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 35)
    } else {
      setDeleting(false)
      setIndex((i) => (i + 1) % roles.length)
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, index])

  return (
    <span className="text-neutral-300 font-mono">
      {text}
      <span className="cursor-blink text-purple-400 ml-0.5">▌</span>
    </span>
  )
}

/* ════════════════════════════════════════════════════════════════
   HERO — neofetch terminal aesthetic
════════════════════════════════════════════════════════════════ */

function HeroSection() {
  const [konamiOpen, setKonami] = useState(false)
  useKonami(useCallback(() => setKonami(true), []))

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(168,85,247,0.15),transparent)]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1,  y: 0  }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40 shadow-2xl shadow-purple-500/5"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 bg-neutral-900/70 border-b border-neutral-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-3 text-xs text-neutral-500 font-mono">
              farhan@portfolio — bash — 140×40
            </span>
            <span className="ml-auto text-xs text-neutral-600 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Press <kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-400 mx-0.5">Ctrl</kbd>+<kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-400 mx-0.5">`</kbd> for terminal
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-start">
            {/* Left */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1,  scale: 1   }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-30 blur-lg" />
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border border-purple-500/20">
                  <Image
                    src="/me-new.png"
                    alt="Farhan Babar"
                    fill priority
                    className="object-cover object-top"
                    sizes="224px"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)" }}
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="font-mono space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="text-purple-400">farhan</span>
                  <span>@</span>
                  <span className="text-cyan-400">portfolio</span>
                </div>
                <div className="text-neutral-600 text-xs">{'─'.repeat(24)}</div>
              </motion.div>

              <div className="space-y-2">
                <ScrambleText
                  text="Farhan Babar"
                  as="h1"
                  className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                  speed={30}
                />
                <div className="text-lg text-neutral-400 font-mono">
                  $ <TypewriterRole />
                </div>
              </div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-sm text-neutral-400 leading-relaxed">
                Crafting scalable, performant applications at the intersection of great engineering and exceptional design. 2+ years shipping products that users love.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="flex flex-wrap gap-3">
                <Link href="/projects" className="btn-primary text-sm py-2.5 px-5">
                  <span>View Work</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="/cv.pdf" download className="btn-ghost text-sm py-2.5 px-5 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Resume
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex gap-2.5">
                {[
                  { icon: Github,    href: "https://github.com/xunzag",    label: "GitHub"    },
                  { icon: Linkedin,  href: "https://www.linkedin.com/in/farhan-ali-98a584206/", label: "LinkedIn"  },
                  { icon: Instagram, href: "https://www.instagram.com/xunzag", label: "Instagram" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-xl glass-card text-neutral-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Right: neofetch output */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1,  x: 0  }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="font-mono text-xs text-neutral-500">
                <span className="text-green-400">$</span> neofetch --config farhan
              </div>
              <SystemStats />
              <div className="flex gap-2 pt-2">
                {["#a855f7","#3b82f6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6"].map((c) => (
                  <div key={c} className="w-5 h-5 rounded-md" style={{ background: c }} title={c} />
                ))}
              </div>
              <div className="font-mono text-xs text-neutral-600 border-t border-neutral-800 pt-4 space-y-1">
                <div><span className="text-green-400">$</span> git log --oneline | head -1</div>
                <div className="text-neutral-500 pl-2">→ <span className="text-yellow-400">a3f9d12</span> feat: make portfolio so good recruiters cry</div>
                <div className="mt-2"><span className="text-green-400">$</span> <span className="animate-pulse text-neutral-600">▌</span></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "Node.js", "TypeScript", "Python", "Docker"].map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1    }}
                    transition={{ delay: 1.1 + i * 0.07 }}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-md glass-card text-neutral-300 border border-neutral-700/50"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-center mt-8 text-xs text-neutral-600 font-mono">
          ↓ scroll to explore — or try the Konami code 🎮
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-purple-500/60 to-transparent"
        />
      </motion.div>

      <AnimatePresence>
        {konamiOpen && <KonamiModal onClose={() => setKonami(false)} />}
      </AnimatePresence>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   STATS — htop / system monitor aesthetic
════════════════════════════════════════════════════════════════ */

const STAT_COLORS = [
  "from-purple-500 to-blue-500",
  "from-blue-500 to-cyan-500",
  "from-cyan-500 to-green-500",
  "from-green-500 to-yellow-500",
] as const

function StatsSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3 bg-neutral-900/80 border-b border-neutral-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-3 text-xs text-neutral-500 font-mono">farhan — system monitor</span>
            <span className="ml-auto text-xs font-mono text-green-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
            </span>
          </div>

          {/* htop-style info bar */}
          <div className="px-6 py-2.5 border-b border-neutral-800/60 font-mono text-xs grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              ["Tasks:",    "4 total, 4 running"],
              ["Uptime:",   "2y 6m 12d"],
              ["User:",     "farhan (root)"],
              ["Load avg:", "8.5, 9.2, 9.8"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-1.5">
                <span className="text-green-400">{k}</span>
                <span className="text-neutral-500">{v}</span>
              </div>
            ))}
          </div>

          {/* Column headers */}
          <div className="px-6 pt-4 pb-1 font-mono text-xs grid grid-cols-4 gap-4 text-neutral-700 uppercase tracking-wider border-b border-neutral-800/30">
            <span>PID</span>
            <span className="col-span-2">PROCESS</span>
            <span className="text-right">COUNT</span>
          </div>

          {/* Metric rows */}
          <div className="p-4 space-y-3">
            {stats.map(({ value, suffix, label, pct, cmd }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono"
              >
                <div className="grid grid-cols-4 gap-4 items-center px-2 py-1 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <span className="text-xs text-yellow-400">{1337 + i * 1024}</span>
                  <span className="col-span-2 text-xs text-cyan-400 truncate">{cmd}</span>
                  <span className="text-right text-sm font-bold gradient-text tabular-nums">
                    {inView && <CountUp end={value} duration={2} delay={i * 0.15} />}{suffix}
                  </span>
                </div>
                <div className="px-2 mt-1 space-y-1">
                  <div className="relative h-2 bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${pct}%` } : {}}
                      transition={{ duration: 1.4, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={cn("h-full bg-gradient-to-r", STAT_COLORS[i])}
                    />
                  </div>
                  <div className="text-xs text-neutral-700 flex justify-between">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* htop footer bar */}
          <div className="px-6 py-2.5 border-t border-neutral-800/50 font-mono text-xs text-neutral-700 flex justify-between items-center">
            <span className="hidden md:block">F1&nbsp;Help&nbsp; F5&nbsp;Refresh&nbsp; F6&nbsp;Sort&nbsp; F10&nbsp;Quit</span>
            <span className="text-neutral-600">htop v4.2.0 — farhan@dev</span>
          </div>
        </motion.div>
        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   TECH STACK — infinite marquee + package.json hover badge
════════════════════════════════════════════════════════════════ */

function TechStack() {
  const doubled = useMemo(() => [...techStack, ...techStack], [])

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-2"
        >
          <span className="section-label mx-auto">Stack</span>
          <ScrambleText as="h2" text="Tools I Work With" className="text-3xl md:text-4xl font-bold" speed={30} />
          <p className="text-xs text-neutral-600 font-mono mt-2">// hover to inspect version</p>
        </motion.div>
      </div>

      <div className="marquee-wrap relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {doubled.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex-shrink-0 flex flex-col items-center gap-3 px-5 py-4 glass-card rounded-2xl w-28 group relative"
            >
              <div className="relative w-9 h-9">
                <Image src={tech.icon} alt={tech.name} fill className="object-contain transition-transform duration-300 group-hover:scale-110" sizes="36px" unoptimized />
              </div>
              <span className="text-xs text-neutral-500 group-hover:text-white transition-colors font-mono text-center">{tech.name}</span>

              {/* package.json version tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap">
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-mono">
                  <span className="text-orange-400">"{tech.name.toLowerCase()}"</span>
                  <span className="text-neutral-500">: </span>
                  <span className="text-green-400">"{tech.ver}"</span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   SKILLS — VS Code code editor with 3 open file tabs
════════════════════════════════════════════════════════════════ */

function L({ n, children }: { n: number; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[1.4rem]">
      <span className="select-none text-neutral-700 w-7 text-right shrink-0 pr-4 text-[11px] leading-[1.4rem]">{n}</span>
      <span className="flex-1 text-[11px] leading-[1.4rem] font-mono">{children ?? " "}</span>
    </div>
  )
}

const K = ({ children }: { children: React.ReactNode }) => <span className="text-blue-400">{children}</span>
const Ty = ({ children }: { children: React.ReactNode }) => <span className="text-cyan-300">{children}</span>
const St = ({ children }: { children: React.ReactNode }) => <span className="text-orange-400">{children}</span>
const Nu = ({ children }: { children: React.ReactNode }) => <span className="text-purple-400">{children}</span>
const Cm = ({ children }: { children: React.ReactNode }) => <span className="text-neutral-600">{children}</span>
const Fn = ({ children }: { children: React.ReactNode }) => <span className="text-yellow-300">{children}</span>
const Gr = ({ children }: { children: React.ReactNode }) => <span className="text-green-400">{children}</span>
const Wh = ({ children }: { children: React.ReactNode }) => <span className="text-neutral-200">{children}</span>

const skillFiles = [
  {
    tab: "full-stack.ts",
    lang: "TypeScript",
    langColor: "bg-blue-500",
    gradient: "from-purple-500 to-blue-500",
    Icon: Code,
    render: () => (
      <>
        <L n={1}><Cm>{"// Full Stack Development — pixels to servers"}</Cm></L>
        <L n={2} />
        <L n={3}><K>interface </K><Fn>Developer</Fn><Wh>{" {"}</Wh></L>
        <L n={4}><Wh>{"  "}</Wh><Ty>name</Ty><Wh>{":    "}</Wh><St>"Farhan Babar"</St></L>
        <L n={5}><Wh>{"  "}</Wh><Ty>stack</Ty><Wh>{":   "}</Wh><K>string</K><Wh>[]</Wh></L>
        <L n={6}><Wh>{"  "}</Wh><Ty>yearsXP</Ty><Wh>{": "}</Wh><K>number</K><Wh>{"  "}</Wh><Cm>{"// 2+ and counting"}</Cm></L>
        <L n={7}><Wh>{"}"}</Wh></L>
        <L n={8} />
        <L n={9}><K>const </K><Wh>me</Wh><Wh>{": "}</Wh><Fn>Developer</Fn><Wh>{" = {"}</Wh></L>
        <L n={10}><Wh>{"  "}</Wh><Ty>name</Ty><Wh>{"    : "}</Wh><St>"Farhan Babar"</St><Wh>,</Wh></L>
        <L n={11}><Wh>{"  "}</Wh><Ty>stack</Ty><Wh>{"   : ["}</Wh><St>"React"</St><Wh>, </Wh><St>"Node"</St><Wh>, </Wh><St>"TS"</St><Wh>],</Wh></L>
        <L n={12}><Wh>{"  "}</Wh><Ty>yearsXP</Ty><Wh>{" : "}</Wh><Nu>2</Nu></L>
        <L n={13}><Wh>{"}"}</Wh></L>
        <L n={14} />
        <L n={15}><Cm>{"// RESULT: apps users actually love ❤️"}</Cm></L>
      </>
    ),
  },
  {
    tab: "ai-ml.py",
    lang: "Python",
    langColor: "bg-yellow-500",
    gradient: "from-blue-500 to-cyan-500",
    Icon: Brain,
    render: () => (
      <>
        <L n={1}><Cm>{"# AI & Machine Learning"}</Cm></L>
        <L n={2}><Cm>{"# Where intelligence meets engineering"}</Cm></L>
        <L n={3} />
        <L n={4}><K>import </K><Wh>torch</Wh></L>
        <L n={5}><K>import </K><Wh>tensorflow </Wh><K>as </K><Wh>tf</Wh></L>
        <L n={6}><K>from </K><St>openai </St><K>import </K><Fn>GPT4</Fn></L>
        <L n={7} />
        <L n={8}><K>class </K><Fn>AIEngineer</Fn><Wh>{"(object):"}</Wh></L>
        <L n={9}><Wh>{"    "}</Wh><Ty>expertise</Ty><Wh>{" = ["}</Wh><St>"NLP"</St><Wh>, </Wh><St>"CV"</St><Wh>, </Wh><St>"LLMs"</St><Wh>]</Wh></L>
        <L n={10}><Wh>{"    "}</Wh><Ty>tools</Ty><Wh>{"     = ["}</Wh><St>"PyTorch"</St><Wh>, </Wh><St>"HF"</St><Wh>]</Wh></L>
        <L n={11} />
        <L n={12}><Wh>{"    "}</Wh><K>def </K><Fn>solve</Fn><Wh>{"(self, "}</Wh><Ty>problem</Ty><Wh>{"): "}</Wh></L>
        <L n={13}><Wh>{"        "}</Wh><K>return </K><Ty>self</Ty><Wh>.pipeline.predict(</Wh><Ty>problem</Ty><Wh>)</Wh></L>
        <L n={14} />
        <L n={15}><Cm>{"# status: training on coffee ☕"}</Cm></L>
      </>
    ),
  },
  {
    tab: "devops.yaml",
    lang: "YAML",
    langColor: "bg-green-500",
    gradient: "from-cyan-500 to-green-500",
    Icon: Rocket,
    render: () => (
      <>
        <L n={1}><Cm>{"# Cloud & DevOps — ship fast, scale smart"}</Cm></L>
        <L n={2} />
        <L n={3}><Ty>infrastructure</Ty><Wh>:</Wh></L>
        <L n={4}><Wh>{"  "}</Wh><Ty>cloud</Ty><Wh>{"    : "}</Wh><Wh>AWS</Wh></L>
        <L n={5}><Wh>{"  "}</Wh><Ty>containers</Ty><Wh>{": ["}</Wh><St>Docker</St><Wh>, </Wh><St>K8s</St><Wh>]</Wh></L>
        <L n={6}><Wh>{"  "}</Wh><Ty>databases</Ty><Wh>{" : ["}</Wh><St>Postgres</St><Wh>, </Wh><St>Mongo</St><Wh>]</Wh></L>
        <L n={7} />
        <L n={8}><Ty>pipeline</Ty><Wh>:</Wh></L>
        <L n={9}><Wh>{"  - "}</Wh><Ty>name</Ty><Wh>{":   "}</Wh><Wh>Build</Wh><Wh>{"  "}</Wh><Ty>status</Ty><Wh>{": "}</Wh><Gr>✅</Gr></L>
        <L n={10}><Wh>{"  - "}</Wh><Ty>name</Ty><Wh>{":   "}</Wh><Wh>Test</Wh><Wh>{"   "}</Wh><Ty>status</Ty><Wh>{": "}</Wh><Gr>✅</Gr></L>
        <L n={11}><Wh>{"  - "}</Wh><Ty>name</Ty><Wh>{":   "}</Wh><Wh>Deploy</Wh><Wh>{"  "}</Wh><Ty>status</Ty><Wh>{": "}</Wh><Gr>✅</Gr></L>
        <L n={12} />
        <L n={13}><Ty>uptime</Ty><Wh>{": "}</Wh><St>"99.9%"</St><Wh>{"  "}</Wh><Cm>{"# downtime is not in vocab"}</Cm></L>
      </>
    ),
  },
]

function SkillsSection() {
  const [activeTab, setActiveTab] = useState(0)
  const active = skillFiles[activeTab]

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-14"
        >
          <span className="section-label mx-auto">Expertise</span>
          <ScrambleText as="h2" text="Core Skills" className="text-3xl md:text-4xl font-bold" speed={30} />
          <p className="text-xs text-neutral-600 font-mono">// click tabs to explore each domain</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40"
        >
          {/* Editor chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800">
            <div className="flex gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* File tabs */}
            {skillFiles.map((f, i) => (
              <button
                key={f.tab}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t-lg transition-all border-b-2",
                  activeTab === i
                    ? "bg-neutral-800 text-white border-purple-500"
                    : "text-neutral-500 hover:text-neutral-300 border-transparent hover:bg-neutral-800/50",
                )}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                {f.tab}
              </button>
            ))}
          </div>

          {/* Editor body */}
          <div className="md:grid md:grid-cols-[280px_1fr]">
            {/* Sidebar file explorer */}
            <div className="hidden md:block border-r border-neutral-800/60 bg-neutral-950/50 p-4 space-y-1">
              <div className="text-xs text-neutral-600 font-mono uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Folder className="w-3 h-3" /> SKILLS
              </div>
              {skillFiles.map((f, i) => {
                const Icon = f.Icon
                return (
                  <button
                    key={f.tab}
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all",
                      activeTab === i
                        ? "bg-white/[0.07] text-white"
                        : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]",
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r shrink-0", f.gradient)} />
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {f.tab}
                  </button>
                )
              })}

              {/* Explorer footer */}
              <div className="mt-8 pt-4 border-t border-neutral-800/50 text-xs font-mono space-y-1">
                <div className="text-neutral-700 uppercase tracking-wider mb-2">outline</div>
                {active.render.toString().match(/L n=\{(\d+)\}/g)?.slice(0, 5).map((_, idx) => (
                  <div key={idx} className="text-neutral-600 pl-2 flex items-center gap-1">
                    <span className="text-cyan-800">{">"}</span>
                    <span>line {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code area */}
            <div className="relative">
              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-900/60 border-b border-neutral-800/40 text-xs font-mono text-neutral-600">
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">⎇ main</span>
                  <span>Ln 1, Col 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("px-1.5 py-0.5 rounded text-neutral-900 text-[10px] font-bold", active.langColor)}>
                    {active.lang}
                  </span>
                  <span>UTF-8</span>
                </div>
              </div>

              {/* Code content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1,  x: 0  }}
                  exit  ={{ opacity: 0,  x: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="p-5 min-h-[280px] bg-neutral-950/30"
                >
                  {active.render()}
                </motion.div>
              </AnimatePresence>

              {/* Blink cursor at end */}
              <div className="px-5 pb-4 font-mono text-[11px] text-neutral-700 flex items-center gap-1">
                <span className="animate-pulse text-purple-500">█</span>
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between px-5 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-t border-neutral-800/50 text-xs font-mono">
            <div className="flex items-center gap-4 text-neutral-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> 0 errors</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> 0 warnings</span>
            </div>
            <span className="text-neutral-600">farhan — VS Code 1.96.0</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   FEATURED PROJECTS — VS Code file explorer + browser preview
════════════════════════════════════════════════════════════════ */

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900/90 border-b border-neutral-800">
      <div className="flex gap-1 mr-1">
        <ArrowLeft className="w-3 h-3 text-neutral-600" />
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <RefreshCw className="w-3 h-3 text-neutral-600" />
      </div>
      <div className="flex-1 flex items-center gap-1.5 bg-neutral-800/60 rounded-md px-3 py-1 text-xs font-mono text-neutral-400 border border-neutral-700/30">
        <Globe className="w-3 h-3 text-green-400 shrink-0" />
        <span className="text-neutral-500">https://</span>
        <span className="text-neutral-300">{url}</span>
      </div>
      <div className="flex gap-1.5 ml-1">
        {["●","●","●"].map((d, i) => <span key={i} className="text-neutral-700 text-[8px]">{d}</span>)}
      </div>
    </div>
  )
}

function FeaturedProjects() {
  const [active, setActive] = useState(0)
  const project = vscodeProjects[active]

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <span className="section-label">Portfolio</span>
            <ScrambleText as="h2" text="Featured Work" className="text-3xl md:text-4xl font-bold" speed={30} />
            <p className="text-xs text-neutral-600 font-mono">// click a file to preview the project</p>
          </div>
          <Link href="/projects" className="btn-ghost text-sm inline-flex">
            <ExternalLink className="w-4 h-4" /> View All Projects
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40"
        >
          {/* VS Code top bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800">
            <div className="flex gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* Open file tabs */}
            {vscodeProjects.map((p, i) => (
              <button
                key={p.file}
                onClick={() => setActive(i)}
                className={cn(
                  "hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t-lg transition-all border-b-2",
                  active === i
                    ? "bg-neutral-800 text-white border-purple-500"
                    : "text-neutral-600 hover:text-neutral-400 border-transparent",
                )}
              >
                <FileCode2 className="w-3 h-3" />
                {p.file}
              </button>
            ))}
            <span className="ml-auto text-xs text-neutral-600 font-mono hidden lg:block">
              {project.gitHash} — {project.gitMsg}
            </span>
          </div>

          {/* Main layout: sidebar + preview */}
          <div className="grid md:grid-cols-[220px_1fr]">
            {/* File explorer sidebar */}
            <div className="border-r border-neutral-800/60 bg-neutral-950/60">
              {/* Explorer header */}
              <div className="px-4 py-3 text-xs font-mono text-neutral-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-neutral-800/40">
                <Folder className="w-3 h-3" /> EXPLORER
              </div>

              {/* Project folder */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 mb-2">
                  <ChevronRight className="w-3 h-3" />
                  <Folder className="w-3 h-3 text-yellow-500/70" />
                  <span>PROJECTS (4)</span>
                </div>
                <div className="space-y-0.5 pl-4">
                  {vscodeProjects.map((p, i) => (
                    <button
                      key={p.file}
                      onClick={() => setActive(i)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-mono transition-all text-left",
                        active === i
                          ? "bg-white/[0.08] text-white"
                          : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]",
                      )}
                    >
                      <FileCode2 className={cn("w-3.5 h-3.5 shrink-0", active === i ? "text-blue-400" : "text-neutral-600")} />
                      <span className="truncate">{p.file}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech stack for active project */}
              <div className="px-4 py-3 border-t border-neutral-800/40 mt-2">
                <div className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-2">Dependencies</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1"
                  >
                    {project.tech.map((t) => (
                      <div key={t} className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                        <span className="text-green-600">+</span>
                        <span>{t.toLowerCase()}</span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Git status */}
              <div className="px-4 py-3 border-t border-neutral-800/40">
                <div className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-2">Git</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <span className="text-purple-400">⎇</span> main
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-yellow-400/70 truncate text-[10px]"
                    >
                      {project.gitHash}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right: browser preview */}
            <div className="flex flex-col">
              <BrowserChrome url={project.url} />

              {/* Screenshot */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1,  scale: 1    }}
                    exit  ={{ opacity: 0,  scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Badge pills on top */}
                <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                  <span className="px-2 py-1 text-[10px] font-mono rounded bg-black/70 backdrop-blur-sm text-white border border-white/10">
                    {project.langBadge}
                  </span>
                </div>
              </div>

              {/* Project info strip */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1,  y: 0 }}
                  exit  ={{ opacity: 0,  y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 border-t border-neutral-800/50 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2">{project.description}</p>
                  </div>
                  <Link
                    href={project.href}
                    className="shrink-0 flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium font-mono whitespace-nowrap"
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Terminal-style breadcrumb */}
              <div className="px-5 py-2 border-t border-neutral-800/30 bg-neutral-950/40 font-mono text-[10px] text-neutral-700 flex items-center gap-1.5">
                <span className="text-purple-500/60">farhan</span>
                <span>/</span>
                <span className="text-blue-500/60">projects</span>
                <span>/</span>
                <span className="text-green-500/60">{project.file}</span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="text-yellow-600">{project.gitHash}</span>
                  <GitCommit className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile project switcher */}
        <div className="flex gap-2 mt-5 md:hidden justify-center">
          {vscodeProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-8 bg-gradient-to-r from-purple-500 to-blue-500" : "w-1.5 bg-neutral-700",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   EXPERIENCE — git log --graph aesthetic
════════════════════════════════════════════════════════════════ */

function ExperienceSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: heading + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1,  x: 0  }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 lg:sticky lg:top-28"
          >
            <span className="section-label">Experience</span>
            <ScrambleText as="h2" text="Where I've Been" className="text-3xl md:text-4xl font-bold" speed={30} />
            <p className="text-neutral-400 leading-relaxed">
              2+ years building production-grade applications. Clean code, user delight, shipped on time.
            </p>

            {/* git graph legend */}
            <div className="glass-card rounded-xl p-4 font-mono text-xs space-y-2 border border-neutral-800">
              <div className="text-neutral-600">$ git log --graph --oneline --all</div>
              <div className="flex items-center gap-2 text-neutral-500">
                <span className="text-purple-400">*</span>
                <span>commit</span>
                <span className="text-neutral-700">·</span>
                <span className="text-yellow-400">hash</span>
                <span className="text-neutral-700">·</span>
                <span className="text-cyan-400">HEAD</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary text-sm py-2.5 px-5">
                <span>Hire Me</span>
              </Link>
              <a href="/cv.pdf" download className="btn-ghost text-sm py-2.5 px-5 flex items-center gap-2">
                <Download className="w-4 h-4" /> Resume
              </a>
            </div>
          </motion.div>

          {/* Right: git log view */}
          <div ref={ref} className="space-y-0">
            {/* Git log header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs text-neutral-600 mb-4 px-1"
            >
              <span className="text-green-400">$</span> git log --graph --pretty=tformat:"%h %s" --all
            </motion.div>

            {experiences.map((exp, i) => (
              <motion.div
                key={exp.hash}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-0"
              >
                {/* Graph line column */}
                <div className="flex flex-col items-center w-8 shrink-0">
                  {/* Dot */}
                  <div className={cn(
                    "relative z-10 w-3 h-3 rounded-full border-2 shrink-0 mt-5",
                    exp.active
                      ? "border-purple-400 bg-purple-400/20 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                      : "border-neutral-600 bg-neutral-900",
                  )} />
                  {/* Vertical line to next */}
                  {i < experiences.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-neutral-700 to-neutral-800 mt-1" />
                  )}
                </div>

                {/* Commit card */}
                <div className="flex-1 pb-6 pl-3">
                  {/* Commit hash line */}
                  <div className="font-mono text-xs flex items-center gap-2 mb-2">
                    <span className="text-purple-400">*</span>
                    <span className="text-yellow-400">{exp.hash}</span>
                    {exp.active && (
                      <span className="text-xs text-cyan-400">({exp.branch})</span>
                    )}
                    <span className="text-neutral-600 hidden md:block truncate">
                      feat: {exp.role.toLowerCase()} @ {exp.company.toLowerCase()}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className={cn(
                    "glass-card rounded-xl p-4 border transition-all duration-300",
                    exp.active ? "border-purple-500/30 bg-purple-500/[0.03]" : "border-neutral-800",
                  )}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-white text-sm">{exp.role}</h3>
                        <span className="text-sm text-neutral-400">{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full border border-purple-500/30 text-purple-400 font-mono">{exp.type}</span>
                        <span className="text-xs text-neutral-500 font-mono">{exp.period}</span>
                      </div>
                    </div>
                    <div className="font-mono text-xs text-neutral-600 flex items-start gap-1.5">
                      <span className="text-neutral-700 shrink-0">╰─</span>
                      <span className="text-neutral-500">{exp.desc}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* "end of log" line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
              className="font-mono text-xs text-neutral-700 pl-9 pt-2"
            >
              <span className="text-green-400">$</span> <span className="animate-pulse">▌</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   CTA — curl hire command animation
════════════════════════════════════════════════════════════════ */

function CurlAnimation() {
  const [phase, setPhase] = useState(0)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  const lines = useMemo(() => [
    { text: "$ curl -X POST https://farhan.dev/api/hire \\",        color: "text-neutral-300" },
    { text: '  -H "Content-Type: application/json" \\',              color: "text-neutral-500" },
    { text: '  -d \'{"message": "You are exactly what we need"}\'',  color: "text-neutral-500" },
    { text: "",                                                        color: "" },
    { text: "HTTP/2 200",                                             color: "text-green-400"   },
    { text: '{"status": "hired!", "start": "immediately"}',           color: "text-cyan-400"    },
  ], [])

  useEffect(() => {
    if (!inView) return
    const timer = setInterval(() => {
      setPhase((p) => {
        if (p >= lines.length) { clearInterval(timer); return p }
        return p + 1
      })
    }, 420)
    return () => clearInterval(timer)
  }, [inView, lines.length])

  return (
    <div ref={ref} className="glass-card rounded-xl p-5 max-w-xl mx-auto text-left border border-neutral-800">
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-neutral-600 font-mono">zsh — hire farhan</span>
      </div>
      <div className="font-mono text-xs space-y-1">
        {lines.slice(0, phase).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1,  x: 0  }}
            transition={{ duration: 0.2 }}
            className={line.color || "text-neutral-400"}
          >
            {line.text || " "}
          </motion.div>
        ))}
        {phase < lines.length && (
          <span className="inline-block w-2 h-3.5 bg-purple-400 animate-pulse" />
        )}
      </div>
    </div>
  )
}

function CTABand() {
  return (
    <section className="py-28 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1,  y: 0  }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto text-center space-y-10"
      >
        <div className="space-y-4">
          <span className="section-label mx-auto">Contact</span>
          <ScrambleText
            as="h2"
            text="Let's build something remarkable."
            className="text-4xl md:text-5xl font-bold tracking-tight"
            speed={25}
          />
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Have a project in mind, an idea to explore, or just want to say hi?
          </p>
        </div>

        <CurlAnimation />

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact" className="btn-primary text-base py-4 px-8">
            <span>Start a Conversation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="https://github.com/xunzag" target="_blank" rel="noopener noreferrer" className="btn-ghost text-base py-4 px-8 flex items-center gap-2">
            <Github className="w-5 h-5" /> GitHub
          </a>
        </div>
        <div className="text-xs text-neutral-700 font-mono">
          or press <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-500 mx-1">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-500 mx-1">`</kbd> to open the terminal
        </div>
      </motion.div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />
      <StatsSection />
      <TechStack />
      <SkillsSection />
      <FeaturedProjects />
      <ExperienceSection />
      <CTABand />
    </main>
  )
}
