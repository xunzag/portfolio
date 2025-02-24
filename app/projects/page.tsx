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
    title: "AI-Powered Chat Application",
    description: "Real-time chat application with AI-powered features, sentiment analysis, and automatic language translation",
    Image: "/images/1.jpg", // Temporary image, replace with project image
    tech: ["Next.js", "TypeScript", "OpenAI", "WebSocket", "TailwindCSS"],
    links: {
      github: "https://github.com/yourusername/project1",
      live: "https://project1.com"
    },
    category: "Full Stack",
    stats: {
      stars: 120,
      forks: 34,
      views: 1500
    },
    features: [
      "Real-time messaging with WebSocket",
      "AI-powered response suggestions",
      "Multi-language support",
      "Voice messages with transcription"
    ],
    color: "from-purple-500 to-blue-500"
  },
  // Add more projects with similar structure
]

// Project categories for filtering
const categories = ["All", "Full Stack", "Frontend", "Backend", "AI/ML", "Mobile"]

// Project filtering and showcase section
function ProjectShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const { scrollYProgress } = useScroll()

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex-1"
          >
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 overflow-x-auto pb-2 md:pb-0"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-neutral-900/50 text-neutral-400 hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.title} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-neutral-400">No projects found matching your criteria</p>
          </motion.div>
        )}
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
            src={project.Image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 backdrop-blur-sm text-xs font-medium text-white">
            {project.category}
          </div>

          {/* Stats */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-white">{project.stats.stars}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              <Eye className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-white">{project.stats.views}</span>
            </div>
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

// Main Projects Page
export default function ProjectsPage() {
  return (
    <main className="bg-black text-white pt-20">
      <ProjectShowcase />
      <ProjectStats />
    </main>
  )
} 