"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink, Rocket, Code, Layout, Server, Star, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

// Featured projects with detailed information
const projects = [
  {
    title: "Peptides Calculator",
    description: "A comprehensive mobile application for calculating molecular weight of peptides. Features include real-time calculations, history tracking, and export functionality.",
    image: "/images/1.png",
    tech: ["React Native", "Node.js", "Prisma", "PostgreSQL", "TypeScript"],
    links: {
      github: "https://github.com/xunzag/peptides-calculator",
      live: "https://play.google.com/store/apps/details?id=com.peptidescalculator"
    },
    features: [
      "Real-time molecular weight calculation",
      "Sequence validation",
      "Export to PDF/CSV",
      "Calculation history"
    ],
    metrics: {
      downloads: "1000+",
      users: "500+",
      rating: "4.8"
    },
    gradient: "from-purple-500 to-blue-500"
  },
  {
    title: "LunchThymes",
    description: "A modern food ordering platform for schools, enabling parents to order lunches for their children with ease. Built with MERN stack and enhanced with shadcn UI.",
    image: "/images/2.png",
    tech: ["React", "Node.js", "MongoDB", "Express", "Shadcn UI", "TailwindCSS"],
    links: {
      github: "https://github.com/xunzag/lunchthymes",
      live: "https://lunchthymes.com"
    },
    features: [
      "Intuitive ordering system",
      "Payment integration",
      "Menu customization",
      "Order tracking"
    ],
    metrics: {
      orders: "10k+",
      schools: "15+",
      satisfaction: "98%"
    },
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "LMS Portal",
    description: "A comprehensive Learning Management System built with PHP/Laravel, featuring course management, student progress tracking, and interactive learning tools.",
    image: "/images/3.png",
    tech: ["PHP", "Laravel", "MySQL", "jQuery", "Bootstrap", "AWS"],
    links: {
      github: "https://github.com/xunzag/lms-portal",
      live: "https://demo-lms.com"
    },
    features: [
      "Course management",
      "Progress tracking",
      "Interactive quizzes",
      "Resource library"
    ],
    metrics: {
      students: "5000+",
      courses: "100+",
      completion: "92%"
    },
    gradient: "from-cyan-500 to-green-500"
  },
  {
    title: "Sales Analytics Dashboard",
    description: "Real-time sales analytics dashboard with advanced visualization and reporting capabilities. Built with modern web technologies and real-time data processing.",
    image: "/images/4.png",
    tech: ["Next.js", "D3.js", "Firebase", "TailwindCSS", "TypeScript"],
    links: {
      github: "https://github.com/xunzag/sales-analytics",
      live: "https://sales-analytics-demo.com"
    },
    features: [
      "Real-time analytics",
      "Custom reports",
      "Data visualization",
      "Export functionality"
    ],
    metrics: {
      dataPoints: "1M+",
      reports: "50+",
      accuracy: "99.9%"
    },
    gradient: "from-orange-500 to-red-500"
  }
]

// Project categories for filtering
const categories = ["All", "Full Stack", "Frontend", "Backend", "AI/ML", "Mobile"]

// Project filtering and showcase section
function ProjectShowcase() {
  return (
    <div className="py-32 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Projects
            </span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            A showcase of my best work, side projects, and open source contributions
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project, idx) => (
            <ProjectCard key={project.title} project={project} index={idx} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Statistics section
function ProjectStats() {
  const stats = [
    { label: "Total Projects", value: "20+", icon: Code },
    { label: "Github Stars", value: "500+", icon: Star },
    { label: "Technologies", value: "15+", icon: Layout },
    { label: "Live Apps", value: "10+", icon: Rocket }
  ]

  return (
    <div className="py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-purple-500" />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Project card with 3D tilt effect
function ProjectCard({ project, index }: { project: typeof projects[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    setRotateX(rotateX)
    setRotateY(rotateY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.3s ease'
      }}
      className="group relative"
    >
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm border border-neutral-800">
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          
          {/* Project Metrics */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm"
              >
                <span className="text-xs font-medium text-white">{value}</span>
                <span className="text-xs text-neutral-400">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500">
            {project.title}
          </h3>

          <p className="text-neutral-400">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 rounded-md bg-neutral-800/50 text-xs text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-neutral-200">Key Features</h4>
            <ul className="grid grid-cols-2 gap-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-neutral-400"
                >
                  <Rocket className="w-4 h-4 text-purple-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-4 border-t border-neutral-800">
            <Link
              href={project.links.github}
              target="_blank"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">View Code</span>
            </Link>
            <Link
              href={project.links.live}
              target="_blank"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="text-sm">Live Demo</span>
            </Link>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  )
}

// Add this new component for the GitHub CTA
function GitHubCTA() {
  return (
    <div className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Github className="w-20 h-20 mx-auto text-white opacity-50" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore More on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              GitHub
            </span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            These are just a few highlights of my work. Visit my GitHub profile to explore more projects,
            contributions, and see my coding journey.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="https://github.com/xunzag"
              target="_blank"
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-full",
                "bg-white text-black font-medium",
                "hover:shadow-[0_0_30px_-5px] hover:shadow-white/20",
                "transition-all duration-300"
              )}
            >
              <Github className="w-5 h-5" />
              Visit My GitHub Profile
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// Main Projects Page
export default function ProjectsPage() {
  return (
    <main className="bg-black text-white pt-20">
      <ProjectShowcase />
      <ProjectStats />
      <GitHubCTA />
    </main>
  )
} 