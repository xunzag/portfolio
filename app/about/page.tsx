"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Code, Brain, Rocket, Heart, Coffee,
  Star, Music, Book, Camera, Gamepad2,
  ArrowRight, Download, CheckCircle2, GitFork, Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import CountUp from "react-countup"
import { ScrambleText } from "@/components/scramble-text"

/* ════════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════════ */

const personalStats = [
  { value: 2,  suffix: "+", label: "Years Experience",      cmd: "career --years"           },
  { value: 50, suffix: "+", label: "Projects Shipped",       cmd: "git log --all | wc -l"   },
  { value: 30, suffix: "+", label: "Happy Clients",          cmd: "clients --satisfied"      },
  { value: 15, suffix: "+", label: "Technologies Mastered",  cmd: "npm list | grep -c '^'"  },
]

const coreValues = [
  {
    emoji: "🧠",
    title: "Innovation First",
    description: "Always pushing boundaries with cutting-edge solutions and emerging technologies.",
    gradient: "from-purple-500 to-blue-500",
    items: ["Embrace emerging tech", "Think outside the box", "Challenge conventions"],
  },
  {
    emoji: "⭐",
    title: "Quality Driven",
    description: "Delivering excellence in every line of code — clean architecture, robust testing.",
    gradient: "from-blue-500 to-cyan-500",
    items: ["Clean architecture", "Robust testing", "Performance first"],
  },
  {
    emoji: "❤️",
    title: "User Focused",
    description: "Creating intuitive, accessible, engaging experiences that delight real users.",
    gradient: "from-cyan-500 to-green-500",
    items: ["Intuitive design", "Accessibility", "User feedback driven"],
  },
]

const skills = [
  {
    category: "Frontend",
    label: "FRONTEND_DEV",
    gradient: "from-purple-500 to-blue-500",
    items: [
      { name: "React & Next.js", level: 93 },
      { name: "TypeScript",      level: 88 },
      { name: "TailwindCSS",     level: 92 },
      { name: "Framer Motion",   level: 82 },
    ],
  },
  {
    category: "Backend",
    label: "BACKEND_DEV",
    gradient: "from-blue-500 to-cyan-500",
    items: [
      { name: "Node.js & Express", level: 87 },
      { name: "Python",            level: 80 },
      { name: "MongoDB",           level: 85 },
      { name: "PostgreSQL",        level: 83 },
    ],
  },
  {
    category: "Cloud & DevOps",
    label: "CLOUD_OPS",
    gradient: "from-cyan-500 to-green-500",
    items: [
      { name: "AWS",    level: 80 },
      { name: "Docker", level: 85 },
      { name: "CI/CD",  level: 86 },
      { name: "Git",    level: 92 },
    ],
  },
]

const animes = [
  { title: "Hunter X Hunter", image: "/images/anime/hxh.jpg",       rating: "9.1", genre: "Action, Adventure",        favoriteChar: "Killua Zoldyck",    bestArc: "Chimera Ant Arc",    quote: "You should enjoy the little detours to the fullest.", yearWatched: "2019" },
  { title: "Monster",         image: "/images/anime/monster.jpg",    rating: "8.9", genre: "Psychological Thriller",   favoriteChar: "Dr. Kenzo Tenma",   bestArc: "The Perfect Suicide",quote: "The monster inside of me has grown this large.",      yearWatched: "2020" },
  { title: "Bleach",          image: "/images/anime/bleach.jpg",     rating: "8.8", genre: "Action, Supernatural",     favoriteChar: "Byakuya Kuchiki",   bestArc: "Soul Society Arc",   quote: "If fate is a millstone, then we are the grist.",     yearWatched: "2018" },
  { title: "Attack on Titan", image: "/images/anime/aot.jpg",        rating: "9.0", genre: "Dark Fantasy, Action",     favoriteChar: "Levi Ackerman",     bestArc: "Marley Arc",         quote: "If you win, you live. If you lose, you die.",        yearWatched: "2021" },
  { title: "Jujutsu Kaisen",  image: "/images/anime/jjk.jpg",        rating: "8.7", genre: "Action, Supernatural",     favoriteChar: "Gojo Satoru",       bestArc: "Shibuya Incident",   quote: "Throughout heaven and earth, I alone am the honored one.", yearWatched: "2022" },
  { title: "Death Note",      image: "/images/anime/deathnote.jpg",  rating: "9.0", genre: "Psychological Thriller",   favoriteChar: "L Lawliet",         bestArc: "L vs Light Arc",     quote: "I am Justice!",                                       yearWatched: "2017" },
]

const hobbies = [
  { title: "Gaming",       image: "/images/hobbies/got.jpg",           icon: Gamepad2, rating: "Elite",       detail: "Ghost of Tsushima · RPG & Strategy", genre: "RPG & Strategy",  quote: "We end this together! — Yuna",               since: "2010" },
  { title: "Photography",  image: "/images/hobbies/photography.jpg",   icon: Camera,   rating: "Amateur+",    detail: "Sony A7III · Northern Areas",        genre: "Street & Nature", quote: "The best camera is the one you have with you.", since: "2019" },
  { title: "Reading",      image: "/images/hobbies/reading.jpg",       icon: Book,     rating: "Bookworm",    detail: "12 books/year · History & Science",  genre: "Non-fiction",     quote: "Knowledge is power, books are the battery.",  since: "2015" },
  { title: "Music",        image: "/images/hobbies/musice.jpg",        icon: Music,    rating: "Enthusiast",  detail: "The Weeknd · Guitar",                genre: "Pop & Rock",      quote: "Music is how I debug my brain.",              since: "2016" },
]

const confLines = [
  { type: "comment",  text: "# /etc/farhan.conf — system configuration" },
  { type: "comment",  text: "# Last modified: 2024-11-12 by farhan (root)" },
  { type: "blank",    text: "" },
  { type: "section",  text: "[routines]" },
  { type: "entry",    key: "wake_time      ", value: "06:00",      comment: "# early bird mode" },
  { type: "entry",    key: "sleep_hours    ", value: "6",          comment: "# non-negotiable" },
  { type: "entry",    key: "water_litres   ", value: "4",          comment: "# hydration > caffeination" },
  { type: "entry",    key: "daily_calories ", value: "3000",       comment: "# fuel for deep work" },
  { type: "entry",    key: "pushups_max    ", value: "50",         comment: "# daily PR" },
  { type: "blank",    text: "" },
  { type: "section",  text: "[developer_metrics]" },
  { type: "entry",    key: "lines_of_code  ", value: "100_000+",   comment: "# and counting..." },
  { type: "entry",    key: "debug_tool     ", value: '"rubber_duck"', comment: "# it works, trust me" },
  { type: "entry",    key: "wpm            ", value: "120",        comment: "# measured, not estimated" },
  { type: "entry",    key: "leetcode_solved", value: "500+",       comment: "# grind never stops" },
  { type: "blank",    text: "" },
  { type: "section",  text: "[misc]" },
  { type: "entry",    key: "coffee_cups    ", value: "2190",       comment: "# lifetime total" },
  { type: "entry",    key: "favorite_os   ", value: '"coffee-powered-linux"', comment: "" },
]

/* ════════════════════════════════════════════════════════════════
   HERO — whoami terminal aesthetic
════════════════════════════════════════════════════════════════ */

function AboutHero() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="min-h-screen relative flex items-center px-6 pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_50%,rgba(168,85,247,0.1),transparent)]" />

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <div className="font-mono text-sm text-neutral-600 flex items-center gap-2">
              <span className="text-green-400">$</span>
              <span className="text-purple-400">farhan</span>
              <span className="text-neutral-700">@</span>
              <span className="text-cyan-400">portfolio</span>
              <span className="text-neutral-700">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-neutral-400"> $ whoami --verbose</span>
            </div>
            <span className="section-label">About Me</span>
          </div>

          <ScrambleText
            as="h1"
            text="Crafting Digital Excellence"
            className="text-5xl md:text-6xl font-bold leading-tight"
            speed={25}
          />

          <div className="space-y-2">
            <div className="font-mono text-xs text-green-400 flex items-center gap-1.5">
              <span>{">"}</span>
              <span className="text-neutral-500">output:</span>
            </div>
            <p className="text-lg text-neutral-400 leading-relaxed pl-4 border-l border-neutral-800">
              I'm a passionate Full Stack Developer with a love for building products that are fast, beautiful, and meaningful. My journey started with curiosity and has grown into expertise across the full stack — from pixel-perfect UIs to robust cloud architectures.
            </p>
          </div>

          {/* Stats as terminal metrics */}
          <div ref={ref} className="glass-card rounded-2xl overflow-hidden border border-neutral-800">
            <div className="px-5 py-3 bg-neutral-900/80 border-b border-neutral-800 font-mono text-xs flex items-center gap-2">
              <span className="text-green-400">$</span>
              <span className="text-neutral-400">whoami --stats --format=json</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {personalStats.map(({ value, suffix, label, cmd }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-1"
                >
                  <div className="text-2xl font-bold gradient-text font-mono tabular-nums">
                    {inView ? <CountUp end={value} duration={2} delay={i * 0.1} /> : 0}{suffix}
                  </div>
                  <div className="text-xs text-neutral-500">{label}</div>
                  <div className="font-mono text-[10px] text-neutral-700 truncate">
                    <span className="text-green-500/60">❯</span> {cmd}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary text-sm">
              <span>Let's Work Together</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="/cv.pdf" download className="btn-ghost text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Download CV
            </a>
          </div>
        </motion.div>

        {/* Right: profile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto lg:mx-0 w-72 md:w-80"
        >
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute inset-0 rounded-3xl border border-purple-500/20 rotate-3 scale-95 glass-card" />
          <div className="absolute inset-0 rounded-3xl border border-blue-500/15 -rotate-2 scale-[0.98] glass-card" />

          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image src="/me-new.png" alt="Farhan Babar" width={360} height={480} priority className="object-cover object-top w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* scan line overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)" }} />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-8 glass-card rounded-xl px-4 py-3 border border-green-500/20"
          >
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Status
            </div>
            <div className="text-sm font-semibold text-white font-mono">Open to Work</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-4 bottom-12 glass-card rounded-xl px-4 py-3 border border-blue-500/20"
          >
            <div className="text-xs text-neutral-400 font-mono">Location</div>
            <div className="text-sm font-semibold text-white">🇵🇰 Pakistan</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   MARQUEE — all images
════════════════════════════════════════════════════════════════ */

const allImages = [
  ...animes.map((a) => ({ src: a.image, label: a.title })),
  ...hobbies.map((h) => ({ src: h.image, label: h.title })),
]
const doubledImages = [...allImages, ...allImages]

function ImageMarquee() {
  return (
    <section className="py-16 overflow-hidden">
      <div className="marquee-wrap relative mb-4">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        <div className="marquee-track gap-4">
          {doubledImages.map((img, i) => (
            <div key={i} className="flex-shrink-0 relative w-52 h-36 rounded-2xl overflow-hidden border border-white/[0.06] group">
              <Image src={img.src} alt={img.label} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="208px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-white font-medium">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="marquee-wrap relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        <div className="marquee-track marquee-track-reverse gap-4">
          {[...doubledImages].reverse().map((img, i) => (
            <div key={i} className="flex-shrink-0 relative w-52 h-36 rounded-2xl overflow-hidden border border-white/[0.06] group">
              <Image src={img.src} alt={img.label} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="208px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-white font-medium">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   CORE VALUES — GitHub README.md viewer
════════════════════════════════════════════════════════════════ */

function CoreValues() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-14"
        >
          <span className="section-label mx-auto">Principles</span>
          <ScrambleText as="h2" text="My Core Values" className="text-3xl md:text-4xl font-bold" speed={30} />
          <p className="text-xs font-mono text-neutral-600">// rendered from xunzag/readme.md</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl overflow-hidden border border-neutral-700/60 shadow-2xl shadow-black/40"
          style={{ background: "#0d1117" }}
        >
          {/* GitHub repo header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/80" style={{ background: "#161b22" }}>
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="text-neutral-500">📁</span>
              <span className="text-blue-400">xunzag</span>
              <span className="text-neutral-600">/</span>
              <span className="text-blue-400 font-semibold">developer-readme</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" /> 847</span>
              <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> 23</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> 4.2k</span>
            </div>
          </div>

          {/* File tab */}
          <div className="flex items-center justify-between px-5 py-2 border-b border-neutral-800/60" style={{ background: "#0d1117" }}>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="text-neutral-600">📄</span>
              <span className="font-mono">README.md</span>
              <span className="text-neutral-700">·</span>
              <span className="text-neutral-600">0 contributors</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {["Raw", "Copy raw", "Download"].map((t) => (
                <button key={t} className="text-neutral-500 hover:text-neutral-300 transition-colors font-mono">{t}</button>
              ))}
            </div>
          </div>

          {/* README content — rendered markdown */}
          <div className="p-8 md:p-12 space-y-10" style={{ color: "#e6edf3" }}>
            {/* h1 */}
            <div className="pb-4" style={{ borderBottom: "1px solid #21262d" }}>
              <h2 className="text-2xl font-bold" style={{ color: "#e6edf3" }}>
                👋 Developer README — Farhan Babar
              </h2>
              <p className="text-sm mt-2" style={{ color: "#8b949e" }}>
                A quick guide to who I am, what I care about, and how I work.
              </p>
            </div>

            {/* 3 sections */}
            {coreValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="space-y-4"
              >
                {/* h2 heading */}
                <div className="flex items-center gap-3 pb-2" style={{ borderBottom: "1px solid #21262d" }}>
                  <h3 className="text-lg font-bold" style={{ color: "#e6edf3" }}>
                    {v.emoji} {v.title}
                  </h3>
                </div>

                {/* blockquote */}
                <div className="pl-4" style={{ borderLeft: "3px solid #30363d" }}>
                  <p className="text-sm italic" style={{ color: "#8b949e" }}>{v.description}</p>
                </div>

                {/* bullet list */}
                <ul className="space-y-2 pl-2">
                  {v.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#e6edf3" }}>
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#3fb950" }} />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* inline code example */}
                <div className="text-xs font-mono px-3 py-2 rounded-md" style={{ background: "#161b22", color: "#79c0ff", border: "1px solid #30363d" }}>
                  {"// "}<span style={{ color: "#a5d6ff" }}>{v.title.toLowerCase().replace(/ /g, "_")}</span>
                  {" = true  "}
                  <span style={{ color: "#8b949e" }}>/* always */</span>
                </div>
              </motion.div>
            ))}

            {/* footer */}
            <div className="pt-4" style={{ borderTop: "1px solid #21262d" }}>
              <p className="text-xs font-mono" style={{ color: "#8b949e" }}>
                <span style={{ color: "#3fb950" }}>●</span> Open to collaboration · Updated 2024-11-12 · MIT License
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   SKILLS — Lighthouse / benchmark profiler terminal
════════════════════════════════════════════════════════════════ */

function scoreLabel(level: number) {
  if (level >= 90) return { text: "Excellent", color: "text-green-400"  }
  if (level >= 80) return { text: "Advanced",  color: "text-cyan-400"   }
  if (level >= 70) return { text: "Proficient",color: "text-yellow-400" }
  return                  { text: "Learning",  color: "text-orange-400" }
}

function scoreBarColor(level: number) {
  if (level >= 90) return "from-green-500 to-emerald-500"
  if (level >= 80) return "from-cyan-500 to-blue-500"
  if (level >= 70) return "from-yellow-500 to-orange-500"
  return "from-orange-500 to-red-500"
}

function Skills() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const avgScore = Math.round(
    skills.flatMap((s) => s.items).reduce((a, b) => a + b.level, 0) /
    skills.flatMap((s) => s.items).length
  )

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center space-y-3 mb-14"
        >
          <span className="section-label mx-auto">Skills</span>
          <ScrambleText as="h2" text="Technical Expertise" className="text-3xl md:text-4xl font-bold" speed={30} />
          <p className="text-xs font-mono text-neutral-600">// npm run benchmark --suite=all</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40"
        >
          {/* Terminal chrome */}
          <div className="flex items-center gap-2 px-5 py-3 bg-neutral-900/90 border-b border-neutral-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-3 text-xs font-mono text-neutral-500">farhan@dev — benchmark runner</span>
            <span className="ml-auto text-xs font-mono text-green-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              RUNNING
            </span>
          </div>

          {/* Command line */}
          <div className="px-6 py-3 border-b border-neutral-800/50 font-mono text-xs">
            <span className="text-green-400">$</span>
            <span className="text-neutral-400"> npm run benchmark </span>
            <span className="text-cyan-400">--reporter=detailed</span>
            <span className="text-neutral-400"> </span>
            <span className="text-purple-400">--suite=all</span>
          </div>

          {/* Benchmark suites */}
          <div className="divide-y divide-neutral-800/40">
            {skills.map((cat, ci) => (
              <div key={cat.category} className="p-6">
                {/* Suite header */}
                <div className="font-mono text-xs mb-4 space-y-1">
                  <div className="text-neutral-600">{"━".repeat(48)}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400">SUITE: {cat.label}</span>
                    <span className="text-neutral-600">({cat.items.length} benchmarks)</span>
                  </div>
                  <div className="text-neutral-600">{"━".repeat(48)}</div>
                </div>

                {/* Benchmark rows */}
                <div className="space-y-3">
                  {cat.items.map((skill, si) => {
                    const { text, color } = scoreLabel(skill.level)
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: ci * 0.15 + si * 0.08, duration: 0.5 }}
                        className="font-mono"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-neutral-400 w-36 shrink-0">{skill.name}</span>
                          <div className="flex-1 relative h-2 bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800/60">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={inView ? { width: `${skill.level}%` } : {}}
                              transition={{ duration: 1.2, delay: ci * 0.15 + si * 0.08 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                              className={cn("h-full bg-gradient-to-r", scoreBarColor(skill.level))}
                            />
                          </div>
                          <span className="text-sm font-bold gradient-text w-14 text-right tabular-nums">
                            {inView ? skill.level : 0}/100
                          </span>
                          <span className={cn("text-xs w-20 shrink-0", color)}>{text}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Results footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
            className="px-6 py-4 border-t border-neutral-800/50 font-mono text-xs space-y-1"
          >
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All {skills.flatMap(s => s.items).length} benchmarks passed (0 failed)</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Average score: {avgScore}/100 — overall rating: Advanced</span>
            </div>
            <div className="text-neutral-700 mt-2">Time: 2.3s · Memory: 48MB</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   MORE ABOUT ME — enhanced tab section
════════════════════════════════════════════════════════════════ */

type Tab = "anime" | "hobbies" | "funfacts"

interface MediaItem {
  title: string; image: string; rating: string; genre: string; quote: string
  badge: string; line1Label?: string; line1Value?: string; line2Label?: string; line2Value?: string; detail?: string; isAnime: boolean
}

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} className="glass-card rounded-2xl overflow-hidden group relative">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/90 text-white font-bold backdrop-blur-sm">
            {item.isAnime ? `★ ${item.rating}` : item.rating}
          </span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/90 text-white backdrop-blur-sm">{item.badge}</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-bold text-white text-base group-hover:gradient-text transition-all">{item.title}</h3>
          <p className="text-xs text-purple-400 mt-0.5">{item.genre}</p>
        </div>
        <div className="space-y-1 text-xs">
          {item.isAnime ? (
            <>
              {item.line1Label && <div className="text-neutral-400"><span className="text-neutral-600">{item.line1Label}: </span><span className="text-neutral-300">{item.line1Value}</span></div>}
              {item.line2Label && <div className="text-neutral-400"><span className="text-neutral-600">{item.line2Label}: </span><span className="text-neutral-300">{item.line2Value}</span></div>}
            </>
          ) : (
            <div className="text-neutral-300">{item.detail}</div>
          )}
        </div>
        <div className="pt-2 border-t border-white/[0.05]">
          <p className="text-xs text-neutral-500 italic">"{item.quote}"</p>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl border border-purple-500/0 group-hover:border-purple-500/20 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  )
}

function FunFactsConfig() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40"
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-5 py-3 bg-neutral-900/90 border-b border-neutral-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-3 font-mono text-xs text-neutral-500">farhan@portfolio — zsh</span>
      </div>
      <div className="px-6 py-3 border-b border-neutral-800/50 font-mono text-xs">
        <span className="text-green-400">$</span>
        <span className="text-neutral-400"> cat </span>
        <span className="text-cyan-400">/etc/farhan.conf</span>
      </div>

      {/* INI file content */}
      <div className="p-6 font-mono text-xs leading-6 space-y-0">
        {confLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
          >
            {line.type === "blank"   && <div className="h-4" />}
            {line.type === "comment" && <div className="text-neutral-600">{line.text}</div>}
            {line.type === "section" && <div className="text-yellow-400 mt-1">{line.text}</div>}
            {line.type === "entry"   && (
              <div className="flex gap-0 pl-2">
                <span className="text-cyan-300">{line.key}</span>
                <span className="text-neutral-500">= </span>
                <span className="text-orange-400">{line.value}</span>
                {line.comment && <span className="text-neutral-700 ml-4">{line.comment}</span>}
              </div>
            )}
          </motion.div>
        ))}
        <div className="mt-4 flex items-center gap-1 text-neutral-700">
          <span className="text-green-400">$</span>
          <span className="animate-pulse">▌</span>
        </div>
      </div>
    </motion.div>
  )
}

function MoreAboutMe() {
  const [tab, setTab] = useState<Tab>("anime")

  type TabDef = { id: Tab; label: string; icon: React.FC<{ className?: string }>; file: string }
  const tabs: TabDef[] = [
    { id: "anime",    label: "Anime",     icon: Star,   file: "anime.list" },
    { id: "hobbies",  label: "Hobbies",   icon: Heart,  file: "hobbies.json" },
    { id: "funfacts", label: "Fun Facts", icon: Coffee, file: "/etc/farhan.conf" },
  ]

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-12"
        >
          <span className="section-label mx-auto">The Human</span>
          <ScrambleText as="h2" text="Beyond the Code" className="text-3xl md:text-4xl font-bold" speed={30} />
          <p className="text-neutral-400 max-w-xl mx-auto">Great developers have rich lives outside of work. Here's what keeps me inspired.</p>
        </motion.div>

        {/* Tab bar — file-tab style */}
        <div className="flex items-center gap-0 mb-8 overflow-x-auto">
          <div className="glass-card rounded-xl overflow-hidden border border-neutral-700/40 flex">
            {tabs.map(({ id, label, icon: Icon, file }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-mono transition-all border-b-2 whitespace-nowrap",
                  tab === id
                    ? "bg-neutral-800 text-white border-purple-500"
                    : "text-neutral-500 hover:text-neutral-300 border-transparent hover:bg-neutral-800/50",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-neutral-700">~/</span>{file}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === "anime" && (
            <motion.div key="anime" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {animes.map((a, i) => (
                <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <MediaCard item={{ title: a.title, image: a.image, rating: a.rating, genre: a.genre, quote: a.quote, badge: a.yearWatched, line1Label: "Fav. Character", line1Value: a.favoriteChar, line2Label: "Best Arc", line2Value: a.bestArc, isAnime: true }} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === "hobbies" && (
            <motion.div key="hobbies" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {hobbies.map((h, i) => (
                <motion.div key={h.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <MediaCard item={{ title: h.title, image: h.image, rating: h.rating, genre: h.genre, quote: h.quote, badge: h.since, detail: h.detail, isAnime: false }} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === "funfacts" && <FunFactsConfig />}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   CTA — ssh terminal animation
════════════════════════════════════════════════════════════════ */

function CTA() {
  return (
    <section className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto text-center space-y-8"
      >
        <ScrambleText
          as="h2"
          text="Let's Create Something Amazing"
          className="text-4xl md:text-5xl font-bold"
          speed={25}
        />
        <p className="text-neutral-400 text-lg">Have a project in mind? Let's collaborate and bring your ideas to life.</p>

        {/* SSH terminal snippet */}
        <div className="glass-card rounded-xl p-4 max-w-md mx-auto text-left border border-neutral-800 font-mono text-xs">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="space-y-1">
            <div><span className="text-green-400">$</span> <span className="text-neutral-300">ssh farhan@portfolio.dev</span></div>
            <div className="text-neutral-600">Welcome to Farhan's server 👋</div>
            <div className="text-neutral-600">Last login: {new Date().toDateString()}</div>
            <div><span className="text-purple-400">farhan@dev</span><span className="text-neutral-600">:~$</span> <span className="animate-pulse text-neutral-500">▌</span></div>
          </div>
        </div>

        <Link href="/contact" className="btn-primary text-base py-4 px-8 inline-flex mx-auto">
          <span>Get in Touch</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */

export default function AboutPage() {
  return (
    <main className="relative text-white">
      <AboutHero />
      <ImageMarquee />
      <CoreValues />
      <Skills />
      <MoreAboutMe />
      <CTA />
    </main>
  )
}
