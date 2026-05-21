"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Github, ExternalLink, Code, Star, Rocket, Layout,
  CheckCircle2, GitCommit, Folder, Terminal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrambleText } from "@/components/scramble-text"

/* ════════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════════ */

const projects = [
  {
    title: "Peptides Calculator",
    description: "Mobile application for calculating molecular weight of peptides with real-time processing, validation, and PDF export.",
    image: "/images/1.png",
    tech: ["React Native", "Node.js", "Prisma", "PostgreSQL", "TypeScript"],
    links: { github: "https://github.com/xunzag/peptides-calculator", live: "https://play.google.com/store" },
    metrics: { downloads: "1k+", users: "500+", rating: "4.8★" },
    category: "Mobile",
    gradient: "from-purple-500 to-blue-500",
    file: "peptides-calculator.rn",
    size: "1.9 MB",
    date: "May 22",
    hash: "a1b2c3d",
    lang: "RN",
  },
  {
    title: "LunchThymes",
    description: "Modern food ordering platform for schools — parents order lunches for their children with payment integration and tracking.",
    image: "/images/2.png",
    tech: ["React", "Node.js", "MongoDB", "Express", "Shadcn UI", "TailwindCSS"],
    links: { github: "https://github.com/xunzag/lunchthymes", live: "https://lunchthymes.com" },
    metrics: { orders: "10k+", schools: "15+", satisfaction: "98%" },
    category: "Full Stack",
    gradient: "from-blue-500 to-cyan-500",
    file: "lunchthymes.tsx",
    size: "5.1 MB",
    date: "Jun 08",
    hash: "e4f5g6h",
    lang: "TSX",
  },
  {
    title: "LMS Portal",
    description: "Comprehensive Learning Management System with course management, student progress tracking, and interactive learning tools.",
    image: "/images/3.png",
    tech: ["PHP", "Laravel", "MySQL", "jQuery", "Bootstrap", "AWS"],
    links: { github: "https://github.com/xunzag/lms-portal", live: "https://demo-lms.com" },
    metrics: { students: "5k+", courses: "100+", completion: "92%" },
    category: "Full Stack",
    gradient: "from-cyan-500 to-green-500",
    file: "lms-portal.php",
    size: "2.8 MB",
    date: "Jul 20",
    hash: "i7j8k9l",
    lang: "PHP",
  },
  {
    title: "Sales Analytics",
    description: "Real-time sales analytics dashboard with advanced D3.js visualisation, custom reporting, and data export functionality.",
    image: "/images/4.png",
    tech: ["Next.js", "D3.js", "Firebase", "TailwindCSS", "TypeScript"],
    links: { github: "https://github.com/xunzag/sales-analytics", live: "https://sales-analytics-demo.com" },
    metrics: { dataPoints: "1M+", reports: "50+", accuracy: "99.9%" },
    category: "Frontend",
    gradient: "from-orange-500 to-red-500",
    file: "sales-dashboard.tsx",
    size: "3.2 MB",
    date: "Aug 03",
    hash: "m1n2o3p",
    lang: "TSX",
  },
  {
    title: "AmazonChapter",
    description: "Educational platform for Amazon-related courses — FBA to marketing strategies with interactive lessons and community.",
    image: "/images/5.png",
    tech: ["React", "Next.js", "TailwindCSS", "Firebase", "Stripe", "TypeScript"],
    links: { github: "https://github.com/xunzag/amazonchapter", live: "https://amazonchapter.com" },
    metrics: { students: "2k+", courses: "25+", satisfaction: "96%" },
    category: "Full Stack",
    gradient: "from-yellow-500 to-orange-500",
    file: "amazon-chapter.tsx",
    size: "6.2 MB",
    date: "Nov 12",
    hash: "a3f9d12",
    lang: "TSX",
  },
  {
    title: "FreshCart",
    description: "Modern grocery purchasing platform with seamless ordering, real-time inventory tracking, and fast delivery options.",
    image: "/images/6.png",
    tech: ["React", "Node.js", "MongoDB", "Express", "Redux", "TailwindCSS"],
    links: { github: "https://github.com/xunzag/freshcart", live: "https://freshcart-demo.com" },
    metrics: { products: "5k+", orders: "200+/day", delivery: "30 min avg" },
    category: "Full Stack",
    gradient: "from-green-500 to-emerald-500",
    file: "freshcart.tsx",
    size: "4.8 MB",
    date: "Oct 28",
    hash: "c7f2b91",
    lang: "TSX",
  },
  {
    title: "Elevate Carts",
    description: "Software company providing tailored e-commerce solutions, payment integrations, and business analytics.",
    image: "/images/ec-1.png",
    tech: ["Vue.js", "Laravel", "MySQL", "Docker", "AWS", "GraphQL"],
    links: { github: "https://github.com/xunzag/elevatecarts", live: "https://elevatecarts.com" },
    metrics: { clients: "50+", transactions: "1M+", uptime: "99.9%" },
    category: "Full Stack",
    gradient: "from-indigo-500 to-purple-500",
    file: "elevate-carts.vue",
    size: "8.1 MB",
    date: "Sep 15",
    hash: "f8e3c22",
    lang: "VUE",
  },
]

const categories = ["All", "Full Stack", "Frontend", "Mobile", "AI/ML"]

const statsBar = [
  { label: "Total Projects",  value: "20+", icon: Code,   cmd: "ls -la | wc -l"          },
  { label: "GitHub Stars",    value: "500+",icon: Star,   cmd: "gh api user/starred"      },
  { label: "Technologies",    value: "15+", icon: Layout, cmd: "npm list --depth=0"        },
  { label: "Live Apps",       value: "10+", icon: Rocket, cmd: "ping --alive all"         },
]

/* ════════════════════════════════════════════════════════════════
   ls -la HEADER
════════════════════════════════════════════════════════════════ */

function langColor(lang: string) {
  const m: Record<string, string> = { TSX: "text-blue-400", PHP: "text-purple-400", VUE: "text-green-400", RN: "text-yellow-400" }
  return m[lang] ?? "text-neutral-400"
}

function ProjectsHeader({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const [typed, setTyped]   = useState(false)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) { const t = setTimeout(() => setTyped(true), 400); return () => clearTimeout(t) }
  }, [inView])

  const sortedProjects = useMemo(() =>
    [...projects].sort((a, b) => new Date(`2024-${b.date}`).getTime() - new Date(`2024-${a.date}`).getTime()),
  [])

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mb-14">
      <div className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40">
        {/* Chrome */}
        <div className="flex items-center gap-2 px-5 py-3 bg-neutral-900/90 border-b border-neutral-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 font-mono text-xs text-neutral-500">farhan@portfolio — file explorer</span>
        </div>

        {/* ls command line */}
        <div className="px-6 py-4 border-b border-neutral-800/60 font-mono text-sm">
          <span className="text-purple-400">farhan@portfolio</span>
          <span className="text-neutral-700">:</span>
          <span className="text-blue-400">~/projects</span>
          <span className="text-neutral-400"> $ </span>
          <span className="text-white">ls -la </span>
          <span className="text-cyan-400">--sort=recent </span>
          <span className="text-yellow-400">--color=always</span>
          {!typed && <span className="animate-pulse text-purple-400 ml-1">▌</span>}
        </div>

        {typed && (
          <>
            {/* Column headers */}
            <div className="px-6 pt-3 pb-1 font-mono text-[10px] text-neutral-700 uppercase tracking-widest grid gap-2" style={{ gridTemplateColumns: "120px 80px 56px 48px 1fr 60px 80px" }}>
              <span>PERMISSIONS</span>
              <span>OWNER</span>
              <span className="text-right">SIZE</span>
              <span>DATE</span>
              <span>FILE</span>
              <span>LANG</span>
              <span>STATUS</span>
            </div>

            {/* Directory entry */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-6 py-0.5 font-mono text-xs grid gap-2 text-blue-400"
              style={{ gridTemplateColumns: "120px 80px 56px 48px 1fr 60px 80px" }}
            >
              <span className="text-neutral-700">drwxr-xr-x</span>
              <span className="text-green-500/60">farhan</span>
              <span className="text-right text-neutral-600">7 items</span>
              <span className="text-neutral-600">Nov 12</span>
              <span className="flex items-center gap-1.5"><Folder className="w-3 h-3 text-yellow-500/70" /> ./</span>
              <span />
              <span />
            </motion.div>

            {/* File entries */}
            <div className="pb-3">
              {sortedProjects.map((p, i) => (
                <motion.div
                  key={p.file}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="px-6 py-0.5 font-mono text-xs grid gap-2 hover:bg-white/[0.025] transition-colors cursor-default"
                  style={{ gridTemplateColumns: "120px 80px 56px 48px 1fr 60px 80px" }}
                >
                  <span className="text-neutral-700">-rw-r--r--</span>
                  <span className="text-green-500/60">farhan</span>
                  <span className="text-right text-neutral-600">{p.size}</span>
                  <span className="text-neutral-600">{p.date}</span>
                  <span className={langColor(p.lang)}>{p.file}</span>
                  <span className={cn("font-bold", langColor(p.lang))}>{p.lang}</span>
                  <span className="text-green-400">✓ LIVE</span>
                </motion.div>
              ))}
            </div>

            {/* Total line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-6 py-2 border-t border-neutral-800/40 font-mono text-xs text-neutral-600 flex items-center gap-4"
            >
              <span>total 7</span>
              <span className="text-neutral-700">·</span>
              <span><span className="text-blue-400">3</span> Full Stack</span>
              <span><span className="text-orange-400">1</span> Frontend</span>
              <span><span className="text-yellow-400">1</span> Mobile</span>
              <span><span className="text-purple-400">1</span> PHP</span>
              <span><span className="text-green-400">1</span> Vue</span>
            </motion.div>

            {/* Filter as CLI flags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="px-6 py-3 border-t border-neutral-800/50 font-mono text-xs flex flex-wrap items-center gap-2"
            >
              <span className="text-neutral-700">filter:</span>
              <span className="text-green-400">$</span>
              <span className="text-neutral-500">ls</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all duration-200 border",
                    filter === cat
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "text-neutral-600 border-neutral-800 hover:text-neutral-400 hover:border-neutral-700",
                  )}
                >
                  --{cat.toLowerCase().replace(/ /g, "-")}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════
   STATS — git log --stat style
════════════════════════════════════════════════════════════════ */

function StatsBar() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-card rounded-2xl overflow-hidden border border-neutral-700/40 mb-14"
    >
      <div className="flex items-center gap-2 px-5 py-3 bg-neutral-900/80 border-b border-neutral-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-3 font-mono text-xs text-neutral-500">git log --stat --summary</span>
        <span className="ml-auto font-mono text-xs text-neutral-700">commit a3f9d12 (HEAD → main)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-neutral-800/50">
        {statsBar.map(({ label, value, icon: Icon, cmd }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08 }}
            className="p-5 group hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <Icon className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-2xl font-bold gradient-text font-mono">{value}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{label}</div>
              </div>
            </div>
            <div className="font-mono text-[10px] text-neutral-700 flex items-center gap-1">
              <span className="text-green-500/60">❯</span> {cmd}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════
   3-D TILT PROJECT CARD — enhanced with file-header metadata
════════════════════════════════════════════════════════════════ */

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x    = (e.clientX - rect.left) / rect.width
    const y    = (e.clientY - rect.top)  / rect.height
    card.style.transform = `perspective(1000px) rotateX(${(y - 0.5) * -12}deg) rotateY(${(x - 0.5) * 12}deg) scale(1.02)`
    if (shineRef.current) {
      shineRef.current.style.setProperty("--shine-x", `${x * 100}%`)
      shineRef.current.style.setProperty("--shine-y", `${y * 100}%`)
      shineRef.current.style.opacity = "1"
    }
  }, [])

  const onLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
    if (shineRef.current) shineRef.current.style.opacity = "0"
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="tilt-card glass-card rounded-2xl overflow-hidden group h-full flex flex-col"
        style={{ transition: "transform 0.15s ease" }}
      >
        <div ref={shineRef} className="tilt-shine rounded-2xl" style={{ transition: "opacity 0.3s" }} />

        {/* File header strip */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/80 border-b border-neutral-800/60 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className={cn("font-bold", langColor(project.lang))}>{project.lang}</span>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-500">{project.file}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-700">
            <GitCommit className="w-3 h-3" />
            <span className="text-yellow-600">{project.hash}</span>
            <span>{project.date}</span>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20 mix-blend-overlay", project.gradient)} />
          <div className="scan-line opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Metrics as terminal output overlaid */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="font-mono text-[10px] bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 space-y-0.5">
              {Object.entries(project.metrics).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-neutral-500">{k}:</span>
                  <span className="text-green-400 font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <span className={cn("inline-block text-[10px] px-2 py-0.5 rounded font-mono font-bold text-neutral-900 bg-gradient-to-r", project.gradient)}>
              {project.category}
            </span>
            <span className="text-xs text-neutral-600 font-mono">{project.size}</span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:gradient-text transition-all">{project.title}</h3>
          <p className="text-sm text-neutral-400 leading-relaxed flex-1">{project.description}</p>

          {/* Tech as imports */}
          <div className="font-mono text-[10px] space-y-0.5 bg-neutral-900/50 rounded-lg p-2.5 border border-neutral-800/50">
            {project.tech.slice(0, 3).map((t) => (
              <div key={t} className="flex gap-1">
                <span className="text-blue-400">import</span>
                <span className="text-orange-400">{"{"} {t} {"}"}</span>
                <span className="text-neutral-600">from</span>
                <span className="text-green-400">"{t.toLowerCase()}"</span>
              </div>
            ))}
            {project.tech.length > 3 && (
              <div className="text-neutral-700">{"// "}+{project.tech.length - 3} more</div>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-2 border-t border-white/[0.05]">
            <Link href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors font-mono">
              <Github className="w-3.5 h-3.5" /> git clone
            </Link>
            <Link href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-purple-400 transition-colors font-mono">
              <ExternalLink className="w-3.5 h-3.5" /> open --live
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════
   GIT CLONE CTA
════════════════════════════════════════════════════════════════ */

function GitCloneCTA() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [phase, setPhase] = useState(0)

  const lines = [
    { text: "$ git clone https://github.com/xunzag",                    color: "text-neutral-300" },
    { text: "Cloning into 'xunzag'...",                                  color: "text-neutral-500" },
    { text: "remote: Enumerating objects: 2,847, done.",                 color: "text-neutral-600" },
    { text: "remote: Counting objects: 100% (2847/2847), done.",         color: "text-neutral-600" },
    { text: "remote: Compressing objects: 100% (1203/1203), done.",      color: "text-neutral-600" },
    { text: "Receiving objects: ████████████████████ 100% (2847/2847)", color: "text-cyan-400"    },
    { text: "Resolving deltas: 100% (892/892), done.",                   color: "text-neutral-600" },
    { text: "",                                                           color: "" },
    { text: "✓ Done! 20+ repositories cloned successfully.",             color: "text-green-400"   },
  ]

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      setPhase((p) => { if (p >= lines.length) { clearInterval(t); return p } return p + 1 })
    }, 320)
    return () => clearInterval(t)
  }, [inView, lines.length])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mt-24 space-y-8"
    >
      <div className="flex flex-col items-center gap-4">
        <Github className="w-14 h-14 text-neutral-600" />
        <ScrambleText as="h2" text="See More on GitHub" className="text-3xl font-bold" speed={30} />
        <p className="text-neutral-400 max-w-xl mx-auto">
          These are highlights. My GitHub has the full picture — experiments, open-source contributions, and everything in between.
        </p>
      </div>

      {/* git clone animation */}
      <div className="glass-card rounded-xl p-5 max-w-2xl mx-auto text-left border border-neutral-800">
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-xs text-neutral-600">zsh — ~/dev</span>
        </div>
        <div className="font-mono text-xs space-y-1">
          {lines.slice(0, phase).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={line.color || "text-neutral-400"}
            >
              {line.text || " "}
            </motion.div>
          ))}
          {phase < lines.length && (
            <span className="inline-block w-2 h-3.5 bg-purple-400 animate-pulse" />
          )}
        </div>
      </div>

      <Link href="https://github.com/xunzag" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 btn-primary text-base py-4 px-8">
        <Github className="w-5 h-5" />
        <span>Visit GitHub Profile</span>
      </Link>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category === activeFilter)

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-14"
        >
          <span className="section-label mx-auto">Portfolio</span>
          <ScrambleText as="h1" text="Featured Projects" className="text-5xl md:text-6xl font-bold" speed={25} />
          <p className="text-neutral-400 max-w-xl mx-auto text-lg">
            A curated showcase of my best work — from mobile apps to full-stack platforms.
          </p>
          <div className="font-mono text-xs text-neutral-700">
            <span className="text-green-400">$</span> ls ~/projects | wc -l &nbsp;→&nbsp;
            <span className="text-cyan-400">7 repos found</span>
          </div>
        </motion.div>

        {/* ls -la header (also contains filter) */}
        <ProjectsHeader filter={activeFilter} setFilter={setActiveFilter} />

        {/* Stats */}
        <StatsBar />

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* GitHub CTA */}
        <GitCloneCTA />
      </div>
    </main>
  )
}
