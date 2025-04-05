"use client"

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useAnimationFrame } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Code, Brain, Rocket, Star, Coffee, Users, Instagram, Github, Linkedin, ChevronLeft, ChevronRight, Download, GraduationCap, Briefcase, Eye, FileText, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import CountUp from "react-countup"

// Add GradientHeading component before using it
function GradientHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500"
    >
      {children}
    </motion.h2>
  )
}

const skills = [
  {
    title: "Full Stack Development",
    icon: Code,
    description: "Building scalable applications from ground up",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    title: "AI & Machine Learning",
    icon: Brain,
    description: "Creating intelligent solutions",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Innovation",
    icon: Rocket,
    description: "Pushing technological boundaries",
    gradient: "from-cyan-500 to-green-500",
  },
]

// Add these tech stack icons
const techStack = [
  // Frontend
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "cyan"
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    color: "white"
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "blue"
  },
  // Backend
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "green"
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "yellow"
  },
  // Cloud & DevOps
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "blue"
  },
  // Databases
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "green"
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "blue"
  },
  // Additional Tools
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    color: "orange"
  },
  {
    name: "Redux",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
    color: "purple"
  }
]

function AnimatedBackground() {
  const { scrollYProgress } = useScroll()
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "radial-gradient(circle at top left, rgba(168, 85, 247, 0.4), rgba(0, 0, 0, 0) 50%)",
      "radial-gradient(circle at center, rgba(59, 130, 246, 0.4), rgba(0, 0, 0, 0) 50%)",
      "radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.4), rgba(0, 0, 0, 0) 50%)"
    ]
  )

  return (
    <>
      <motion.div
        className="fixed inset-0 -z-10"
        style={{ background: backgroundColor }}
      />
      <div className="fixed inset-0 -z-10 bg-black/80" />
      <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-repeat opacity-20" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="fixed inset-0 -z-10 noise" />
    </>
  )
}

function NeonText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "relative inline-block group",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-blue-500",
      "before:blur-xl before:opacity-0 before:transition-opacity before:duration-500",
      "group-hover:before:opacity-50",
      className
    )}>
      {children}
    </span>
  )
}

function SocialLinks() {
  return (
    <div className="flex gap-4">
      {[
        { icon: Github, href: "https://github.com/xunzag", label: "GitHub" },
        { icon: Linkedin, href: "https://www.linkedin.com/in/farhan-ali-98a584206/", label: "LinkedIn" },
        { icon: Instagram, href: "https://www.instagram.com/xunzag", label: "Portfolio" },
      ].map((social) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-3 rounded-full",
            "bg-neutral-900/50 backdrop-blur-sm",
            "border border-neutral-800",
            "hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/20",
            "transition-all duration-300"
          )}
        >
          <social.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
        </motion.a>
      ))}
    </div>
  )
}

function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

function TechStackShowcase() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="absolute bottom-0 left-0 right-0 py-8 bg-gradient-to-t from-black to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={40}
                  height={40}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="mt-2 text-sm text-neutral-400 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Add this projects data array
const projects = [
  {
    title: "Peptides Mobile App",
    description: "A mobile app for peptides calculations which helps in calculating the molecular weight of peptides",
    image: "/images/1.png"
  },
  {
    title: "LunchThymes",
    description: "A food and lunch app for school students and parents to order lunch for their children",
    image: "/images/2.png"
  },
  {
    title: "LMS Portal",
    description: "A portal for managing the learning management system of a school",
    image: "/images/3.png"
  },
  {
    title: "Sales Analytics",
    description: "A sales analytics dashboard for a company to analyze their sales data",
    image: "/images/4.png"
  }
];

function FeaturedWorkPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Featured projects data with the new projects included
  const featuredProjects = [
    {
      title: "AmazonChapter",
      description: "Educational platform for Amazon-related courses with interactive learning modules.",
      image: "/images/5.png",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "FreshCart",
      description: "Modern grocery purchasing platform with real-time inventory and fast delivery options.",
      image: "/images/6.png", 
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Elevate Carts",
      description: "Software company providing e-commerce solutions and business analytics services.",
      image: "/images/ec-1.png",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "Sales Analytics",
      description: "Real-time dashboard with advanced visualization and reporting capabilities.",
      image: "/images/4.png",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  // Mouse tracking for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="py-32 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />
      
      {/* Moving gradient blob */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 15 }}
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.4), rgba(59,130,246,0.2))",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-4 space-y-16"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GradientHeading>Featured Work</GradientHeading>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-neutral-400 max-w-2xl mx-auto"
          >
            Explore my latest projects and creative solutions
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {featuredProjects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" 
              }}
              className={`
                relative rounded-xl overflow-hidden aspect-video
                border border-${project.gradient.split('-')[1]}/20
                bg-black/30 backdrop-blur-sm
                transition-all duration-500 ease-out
                group cursor-pointer
              `}
            >
              {/* Animated gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              
              {/* Background image with parallax effect */}
              <motion.div 
                className="absolute inset-0 z-0 overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i < 2}
                  />
                </motion.div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              </motion.div>
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-white/90 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-white/70 group-hover:text-white/80 transition-colors">
                    {project.description}
                  </p>
                </motion.div>
                
                {/* Button with hover effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="mt-4"
                >
                  <Link
                    href={`/projects#${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`
                      inline-flex items-center gap-2 py-2 px-4 
                      bg-gradient-to-r ${project.gradient} 
                      rounded-lg text-white font-medium
                      opacity-0 group-hover:opacity-100
                      translate-y-4 group-hover:translate-y-0
                      transition-all duration-300 ease-out
                      shadow-lg shadow-${project.gradient.split('-')[1]}/20
                    `}
                  >
                    View Project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
              
              {/* Tech badges - appear on hover */}
              <motion.div 
                className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {[1, 2, 3].map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`
                      h-2 w-2 rounded-full 
                      bg-gradient-to-r ${project.gradient}
                      shadow-glow-sm shadow-${project.gradient.split('-')[1]}/50
                    `}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View all projects button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link 
            href="/projects" 
            className="
              relative group overflow-hidden rounded-full 
              bg-gradient-to-r from-purple-500/10 to-blue-500/10
              border border-purple-500/20 hover:border-purple-500/40
              px-8 py-3 text-purple-400 hover:text-purple-300
              transition-all duration-300
            "
          >
            <span className="relative z-10 flex items-center gap-2">
              View All Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/20 to-blue-500/20 transition-opacity duration-300" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Add this new component for interactive background particles
function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const bgRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  // Transform background elements based on scroll
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5], [0.08, 0.03])
  const blobScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5])
  const particleOpacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 0.2])
  
  useEffect(() => {
    // Set dimensions after component mounts (client-side only)
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }
    
    // Initial dimensions
    updateDimensions()
    
    // Resize handler with debounce for better performance
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDimensions, 200)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!bgRef.current) return
    
    // Get mouse position relative to the container
    const rect = bgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Throttled update for better performance
    requestAnimationFrame(() => {
      setMousePosition({ x, y })
    })
  }

  return (
    <motion.div 
      ref={bgRef}
      className="absolute inset-0 overflow-hidden z-0"
      onMouseMove={handleMouseMove}
    >
      {/* Primary gradient blob that follows mouse */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 30, 
          damping: 25,
          mass: 2 
        }}
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.15), rgba(59,130,246,0.08))",
          scale: blobScale,
          opacity: particleOpacity
        }}
      />
      
      {/* Secondary smaller blob for additional effect */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
        animate={{
          x: mousePosition.x - 200 + Math.sin(Date.now() * 0.001) * 100,
          y: mousePosition.y - 200 + Math.cos(Date.now() * 0.001) * 100,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 20, 
          damping: 25 
        }}
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.15), rgba(139,92,246,0.08))",
          opacity: particleOpacity
        }}
      />

      {/* Grid Pattern - Responsive and performance optimized */}
      <div className="absolute inset-0">
        <motion.div 
          style={{ opacity: gridOpacity }}
          className="grid-pattern"
        >
          {Array.from({ length: Math.min(20, Math.floor(dimensions.height / 50)) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
              style={{ 
                top: `${(i / 20) * 100}%`,
                scaleY: Math.sin((Date.now() / 3000) + i * 0.2) * 0.5 + 1
              }}
              animate={{
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
          
          {Array.from({ length: Math.min(20, Math.floor(dimensions.width / 50)) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"
              style={{ 
                left: `${(i / 20) * 100}%`,
                scaleX: Math.cos((Date.now() / 3000) + i * 0.2) * 0.5 + 1
              }}
              animate={{
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating particles - dynamically adjust quantity based on viewport size */}
      <div className="absolute inset-0">
        {dimensions.width > 0 && Array.from({ length: Math.min(30, Math.floor((dimensions.width * dimensions.height) / 25000)) }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            style={{
              boxShadow: "0 0 5px rgba(168, 85, 247, 0.5)",
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            animate={{
              x: [
                Math.random() * dimensions.width,
                mousePosition.x + (Math.random() - 0.5) * 200,
                Math.random() * dimensions.width
              ],
              y: [
                Math.random() * dimensions.height,
                mousePosition.y + (Math.random() - 0.5) * 200,
                Math.random() * dimensions.height
              ],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
    </motion.div>
  )
}

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHoveringName, setIsHoveringName] = useState(false)
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const nameRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const CurrentIcon = skills[activeIndex].icon
  
  // For performance optimization - throttled cursor tracking
  const updateCursorThrottled = useCallback(
    throttle((x: number, y: number) => {
      setCursorPosition({ x, y })
    }, 50),
    []
  )
  
  // Character animation array for the name
  const nameChars = "Farhan Ali".split("")
  
  // Mouse tracking for interactive elements
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    updateCursorThrottled(x, y)
  }, [updateCursorThrottled])
  
  // Handle skill rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % skills.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  // Memoized 3D transformation values for performance
  const transform3d = useMemo(() => {
    const rotateX = (cursorPosition.y - 0.5) * 8 // -4 to 4 degrees
    const rotateY = (cursorPosition.x - 0.5) * -8 // -4 to 4 degrees
    return `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [cursorPosition])
  
  // For performance - memoize particle positions
  const particles = useMemo(() => 
    Array.from({ length: 50 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2
    })),
    []
  )
  
  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Optimized background particles - hardware accelerated */}
      <div className="absolute inset-0 overflow-hidden" style={{ willChange: 'transform' }}>
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            style={{ 
              left: `${particle.x * 100}%`, 
              top: `${particle.y * 100}%`,
              opacity: 0.3,
              willChange: 'transform, opacity',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, particle.y * 40 - 20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 / particle.speed,
              ease: "easeInOut",
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
      
      {/* Background gradient effects */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-60" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-60" />
      
      {/* Interactive spotlight effect that follows cursor */}
      <div 
        className="absolute w-[40vw] h-[40vw] rounded-full radial-spotlight opacity-30 pointer-events-none"
        style={{ 
          left: `calc(${cursorPosition.x * 100}% - 20vw)`, 
          top: `calc(${cursorPosition.y * 100}% - 20vw)`,
          transition: 'transform 0.1s linear',
          transform: `translate(${(cursorPosition.x - 0.5) * -20}px, ${(cursorPosition.y - 0.5) * -20}px)`,
          willChange: 'transform',
        }}
      />
      
      {/* Main content with 3D effect container */}
      <div className="max-w-7xl w-full mx-auto px-4 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column - Text Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Anime-style glitch text intro */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-px bg-gradient-to-r from-purple-500 to-transparent" 
              />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-purple-500 font-medium tracking-widest uppercase text-sm glitch-text"
                data-text="Hello, World!"
              >
                Hello, World!
              </motion.span>
            </motion.div>

            {/* Interactive headline with character animation */}
            <div className="space-y-4">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-2xl text-neutral-200 font-medium tracking-tight"
              >
                Full Stack Developer & Creative Coder
              </motion.h2>
              
              <div 
                ref={nameRef}
                className="relative" 
                onMouseEnter={() => setIsHoveringName(true)}
                onMouseLeave={() => setIsHoveringName(false)}
              >
                <motion.h1 
                  className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter pb-2 flex flex-wrap"
                  style={{ 
                    transform: isHoveringName ? transform3d : 'none',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  {nameChars.map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.05 }}
                      whileHover={{ color: `hsl(${i * 25}, 80%, 60%)` }}
                      className={char === " " ? "mr-6" : "relative inline-block gradient-text"}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {char}
                      {char !== " " && (
                        <motion.span
                          className="absolute inset-0 gradient-text"
                          initial={{ opacity: 0 }}
                          animate={isHoveringName ? 
                            { 
                              opacity: [0, 0.5, 0], 
                              y: [0, -4, 0],
                              x: [0, 1, 0]
                            } : {}
                          }
                          transition={{ 
                            duration: 0.2, 
                            delay: i * 0.02,
                            repeat: isHoveringName ? Infinity : 0,
                            repeatDelay: 5
                          }}
                          style={{ transform: 'translateZ(10px)' }}
                        >
                          {char}
                        </motion.span>
                      )}
                    </motion.span>
                  ))}
                </motion.h1>
                
                {/* Animated underline */}
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-px" 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-purple-500 via-blue-500 to-transparent" />
                  <motion.div 
                    className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                    animate={{ 
                      x: ['-100%', '500%'],
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Dynamic description with gradient highlights */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="text-xl text-neutral-400 max-w-xl leading-relaxed"
            >
              I transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 font-semibold">ideas</span> into 
              <span className="relative mx-2 inline-block group">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold">reality</span>
                <motion.span 
                  className="absolute inset-0 w-full h-full bg-blue-500/20 rounded-md"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: [0, 1.2, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 5
                  }}
                />
              </span>
              through innovative code. Specializing in creating exceptional digital experiences that merge art with technology.
            </motion.p>

            {/* Animated skill pills with morphing effect */}
            <div className="relative h-16 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <motion.div 
                    className={`px-4 py-2 rounded-full bg-gradient-to-r ${skills[activeIndex].gradient} shadow-lg relative overflow-hidden group`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative z-10 flex items-center gap-2">
                      <CurrentIcon className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">{skills[activeIndex].title}</span>
                    </div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatDelay: 1
                      }}
                    />
                  </motion.div>
                  <span className="text-neutral-400">{skills[activeIndex].description}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Stats with animated counters */}
            <div className="relative flex flex-wrap gap-6 pt-4">
              {[
                { end: 2, suffix: "+", label: "Years Experience" },
                { end: 80, suffix: "+", label: "Projects Completed" },
                { end: 100, suffix: "%", label: "Client Satisfaction" },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx} 
                  className="space-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.5 + idx * 0.1 }}
                >
                  <div className="text-2xl font-bold gradient-text flex items-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1.8 + idx * 0.1 }}
                    >
                      <CountUp
                        end={stat.end}
                        duration={2}
                        delay={0}
                      />
                      {stat.suffix}
                    </motion.span>
                    <motion.div 
                      className="ml-2 w-1 h-1 rounded-full bg-purple-500"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                  </div>
                  <div className="text-sm text-neutral-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <SocialLinks />
          </div>

          {/* Call to action buttons with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.9 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/projects"
              className="group relative px-8 py-4 rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20"
                animate={{ 
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.4) 0%, transparent 50%)'
                  ]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
              <span className="relative z-10 flex items-center text-white font-medium">
                Explore My Work
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse", 
                    ease: "easeInOut" 
                  }}
                >
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.span>
              </span>
            </Link>

            <Link
              href="/contact"
              className="group relative px-8 py-4 rounded-full overflow-hidden backdrop-blur-sm border border-neutral-800 hover:border-purple-500/50 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              
              {/* Animated glow effect on hover */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 duration-700 transition-opacity"
                animate={{
                  boxShadow: [
                    'inset 0 0 20px rgba(168, 85, 247, 0.2)',
                    'inset 0 0 30px rgba(168, 85, 247, 0.4)',
                    'inset 0 0 20px rgba(168, 85, 247, 0.2)'
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              <span className="relative z-10 flex items-center text-white font-medium">
                Let's Connect
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column - Interactive 3D Image */}
        <div className="relative order-first lg:order-last">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full max-w-md mx-auto aspect-square"
            style={{ 
              transform: isHoveringImage ? transform3d : 'none',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.2s ease-out'
            }}
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
          >
            {/* Animated background effects */}
            <motion.div 
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            
            {/* 3D layered cosmic container */}
            <motion.div 
              className="relative w-full h-full rounded-full p-2"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Profile image with mask */}
              <div className="absolute inset-0 rounded-full overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
                <Image
                  src="/images/me.jpg"
                  alt="Farhan Ali"
                  fill
                  className="object-cover scale-[1.06]"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                
                {/* Interactive overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tl from-purple-500/20 via-transparent to-blue-500/20"
                  animate={{ 
                    opacity: [0.3, 0.5, 0.3],
                    background: [
                      'linear-gradient(to top left, rgba(168,85,247,0.2), transparent, rgba(59,130,246,0.2))',
                      'linear-gradient(to top right, rgba(168,85,247,0.2), transparent, rgba(59,130,246,0.2))',
                      'linear-gradient(to bottom left, rgba(168,85,247,0.2), transparent, rgba(59,130,246,0.2))',
                      'linear-gradient(to bottom right, rgba(168,85,247,0.2), transparent, rgba(59,130,246,0.2))',
                      'linear-gradient(to top left, rgba(168,85,247,0.2), transparent, rgba(59,130,246,0.2))'
                    ]
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                />
                
                {/* Scanline effect */}
                <motion.div 
                  className="absolute left-0 right-0 h-[1px] bg-purple-500/30"
                  style={{ top: '50%' }}
                  animate={{ 
                    top: ['0%', '100%', '0%'],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }}
                />
              </div>
              
              {/* Animated rotating border */}
              <div className="absolute inset-0 rounded-full" style={{ transform: 'translateZ(10px)' }}>
                <motion.div 
                  className="w-full h-full rounded-full"
                  style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'transparent',
                    background: 'linear-gradient(115deg, rgba(168,85,247,0.6), rgba(59,130,246,0.6)) border-box',
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                  animate={{ 
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              
              {/* Outer cosmic circle with depth */}
              <motion.div 
                className="absolute -inset-6 rounded-full border border-purple-500/20"
                style={{ transform: 'translateZ(5px)' }}
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  rotate: {
                    duration: 15, 
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              />
              
              {/* Floating tech badges around the avatar */}
              {skills.map((skill, i) => {
                // Calculate position around the circle
                const angle = (i / skills.length) * Math.PI * 2
                const radiusX = 48 // Percentage from center
                const radiusY = 46 // Slightly oval
                
                return (
                  <motion.div
                    key={i}
                    className="absolute p-2 rounded-full cosmic-card border border-purple-500/30"
                    style={{ 
                      left: `calc(50% + ${radiusX * Math.cos(angle)}%)`,
                      top: `calc(50% + ${radiusY * Math.sin(angle)}%)`,
                      transform: 'translateZ(30px) translate(-50%, -50%)',
                      boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)',
                      opacity: activeIndex === i ? 1 : 0.6,
                      scale: activeIndex === i ? 1.2 : 1,
                    }}
                    animate={{ 
                      rotate: [0, 360],
                      boxShadow: activeIndex === i 
                        ? ['0 0 15px rgba(168, 85, 247, 0.3)', '0 0 25px rgba(168, 85, 247, 0.6)', '0 0 15px rgba(168, 85, 247, 0.3)']
                        : ['0 0 15px rgba(168, 85, 247, 0.1)', '0 0 10px rgba(168, 85, 247, 0.2)', '0 0 15px rgba(168, 85, 247, 0.1)']
                    }}
                    transition={{ 
                      rotate: { duration: 20 + i * 2, repeat: Infinity, ease: "linear" },
                      boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                      opacity: { duration: 0.5 },
                      scale: { duration: 0.5 }
                    }}
                    whileHover={{ scale: 1.4, opacity: 1 }}
                  >
                    <skill.icon className={`w-5 h-5 text-${skill.gradient.split('-')[1]}-500`} />
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Helper function for performance
function throttle(callback: Function, delay: number) {
  let lastCall = 0
  return function(...args: any[]) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return callback(...args)
    }
  }
}

// Add this testimonials data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechVision Inc",
    country: "United States",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content: "Working with Farhan was an absolute game-changer for our company. His innovative solutions and attention to detail transformed our digital presence.",
    rating: 5
  },
  {
    name: "Marcus Chen",
    role: "CTO",
    company: "InnovateLabs",
    country: "Singapore",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content: "Exceptional talent and profound understanding of modern technologies. Delivered beyond our expectations.",
    rating: 5
  },
  {
    name: "Samantha Smith",
    role: "Co-Founder",
    company: "Tracko",
    country: "United States",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content: "The AI solution implemented by Farhan increased our efficiency by 300%. Truly remarkable work!",
    rating: 5
  },
  {
    name: "Oliver Smith",
    role: "Technical Lead",
    company: "Dual-Sensor Sign Language",
    country: "United Kingdom",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    content: "Farhan really helped me with the AI module of the project. He is a great developer and a great person. I highly recommend him to anyone looking for a developer.",
    rating: 5
  },
  {
    name: "Samantha Smith",
    role: "Co-Founder",
    company: "Tracko",
    country: "United States",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "Had a great experience working with Farhan. He is a great developer and a great person. I highly recommend him to anyone looking for a developer.",
    rating: 5
  },
  {
    name: "Michael Kahn",
    role: "Product Manager",
    company: "Track.io",
    country: "China",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    content: "Farhan is a great developer and a great person. He is always willing to help and is very knowledgeable. I highly recommend him to anyone looking for a developer.",
    rating: 5
  },
  // Add more testimonials...
]

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const testimonialRef = useRef<HTMLDivElement>(null)
  const xTransform = useRef(0)
  const SPEED = -0.5 // Slower speed for testimonials

  useAnimationFrame(() => {
    if (!testimonialRef.current) return
    xTransform.current += SPEED
    const width = testimonials.length * 400 // Width of each testimonial card
    if (Math.abs(xTransform.current) > width) {
      xTransform.current = 0
    }
    testimonialRef.current.style.transform = `translateX(${xTransform.current}px)`
  })

  return (
    <div className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.15),transparent_80%)]" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-20">
          <GradientHeading>Client Testimonials</GradientHeading>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Hear what our clients have to say about their experiences working with us
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />

          <div
            ref={testimonialRef}
            className="flex gap-8 px-8"
          >
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.name}-${idx}`}
                className="relative flex-shrink-0 w-[400px]"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800 hover:border-purple-500/50 transition-colors">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative w-20 h-20">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-full"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-10 group-hover:opacity-20 transition-opacity" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </div>
                      <p className="text-lg text-neutral-200 italic line-clamp-4">
                        "{testimonial.content}"
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-neutral-400">
                        {testimonial.role} at {testimonial.company}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {testimonial.country}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-neutral-800">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(168,85,247,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(59,130,246,0.1),transparent_60%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-2xl font-bold gradient-text"
            >
              Farhan Ali
            </motion.h2>
            <p className="text-neutral-400">
              Crafting digital experiences through innovative code and creative solutions
            </p>
            <SocialLinks />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "About", href: "/about" },
                { name: "Projects", href: "/projects" },
                { name: "Contact", href: "/contact" },
                { name: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              {[
                "Web Development",
                "Mobile Apps",
                "AI Solutions",
                "Cloud Architecture",
                "UI/UX Design",
              ].map((service) => (
                <li key={service}>
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {service}
                  </motion.span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-neutral-400">
              Subscribe to my newsletter for the latest updates and insights.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/50 transition-all"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 pt-8 border-t border-neutral-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Farhan Ali. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </footer>
  )
}

// Update the timeline data
const timeline = [
  {
    type: "experience",
    date: "2024 - Present",
    title: "Software Developer",
    institution: "Elevate Carts",
    description: "Working on full-stack development, implementing new features, and optimizing application performance for e-commerce solutions.",
    icon: Briefcase,
    skills: ["React", "Node.js", "TypeScript", "AWS"]
  },
  {
    type: "experience",
    date: "2023 - Jan 2024",
    title: "Backend Developer",
    institution: "Invex Solutions",
    description: "Developed robust backend solutions, implementing APIs, and optimizing database performance for scalable applications.",
    icon: Briefcase,
    skills: ["Node.js", "Express", "MongoDB", "AWS"]
  },
  {
    type: "education",
    date: "2019 - 2023",
    title: "Bachelor's in Software Engineering",
    institution: "UIT University",
    description: "Graduated with distinction, specialized in full-stack development and data science. Led multiple innovative projects.",
    icon: GraduationCap,
    skills: ["Software Engineering", "Data Structures", "Web Development"]
  },
  {
    type: "experience",
    date: "2022",
    title: "Data Science Intern",
    institution: "Systems Limited Pvt",
    description: "Worked on machine learning models and data analysis. Implemented predictive analytics solutions for business intelligence.",
    icon: Brain,
    skills: ["Python", "Machine Learning", "Data Analysis"]
  },
  {
    type: "education",
    date: "2017 - 2019",
    title: "Pre-Engineering",
    institution: "Adamjee Science College",
    description: "Completed intermediate studies with focus on Mathematics, Physics, and Computer Science.",
    icon: GraduationCap,
    skills: ["Mathematics", "Physics", "Computer Science"]
  }
]

// Enhanced TimelineSection component
function TimelineSection() {
  return (
    <div className="py-32 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.15),transparent_80%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-20">
          <GradientHeading>Education & Experience</GradientHeading>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            My academic and professional journey in technology and innovation
          </p>
        </div>

        <div className="relative">
          {/* Enhanced Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px">
            <div className="h-full w-full bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500 opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500 animate-pulse opacity-10" />
          </div>

          <div className="space-y-12">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "relative flex items-center",
                  idx % 2 === 0 ? "justify-start" : "justify-end",
                  "group"
                )}
              >
                {/* Enhanced Timeline Point */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 animate-ping" />
                    <div className="absolute -inset-2 rounded-full border border-purple-500/20" />
                  </div>
                </div>

                {/* Enhanced Content Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "w-5/12 p-6 rounded-2xl",
                    "bg-neutral-900/50 backdrop-blur-sm",
                    "border border-neutral-800 hover:border-purple-500/50",
                    "transition-all duration-300",
                    "group"
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all">
                      <item.icon className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="text-sm text-neutral-400 bg-neutral-900/50 px-3 py-1 rounded-full">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all">
                    {item.title}
                  </h3>
                  <p className="text-purple-400 mb-2">{item.institution}</p>
                  <p className="text-neutral-400 mb-4">{item.description}</p>
                  
                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}

// Add this new component for the floating resume button
function ResumeDownloadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setDownloading(false)
    setDownloaded(true)
    setTimeout(() => {
      setDownloaded(false)
      onClose()
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800 p-6 shadow-2xl">
              {/* Resume Preview */}
              <div className="relative aspect-[3/4] mb-6 rounded-lg overflow-hidden">
                <Image
                  src="/resume-preview.jpg" // Add your resume preview image
                  alt="Resume Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Farhan Ali - Resume</h3>
                    <p className="text-neutral-400">Updated August 2023</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">PDF • 2.1 MB</span>
                    <FileText className="w-4 h-4 text-neutral-500" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleDownload}
                    disabled={downloading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
                      "bg-gradient-to-r from-purple-500 to-blue-500",
                      "text-white font-medium",
                      "hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/50",
                      "transition-all duration-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {downloading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : downloaded ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Resume</span>
                      </>
                    )}
                  </motion.button>

                  <motion.a
                    href="/resume.pdf"
                    target="_blank"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
                      "bg-neutral-800/50",
                      "text-white font-medium",
                      "hover:bg-neutral-700/50",
                      "transition-all duration-300"
                    )}
                  >
                    <Eye className="w-5 h-5" />
                    <span>Preview</span>
                  </motion.a>
                </div>

                {/* Available Formats */}
                <div className="pt-4 border-t border-neutral-800">
                  <p className="text-sm text-neutral-400 mb-2">Available Formats:</p>
                  <div className="flex gap-2">
                    {["PDF", "DOCX", "TXT"].map((format) => (
                      <span
                        key={format}
                        className="px-2 py-1 rounded-md bg-neutral-800/50 text-xs text-neutral-400"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FloatingResumeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className={cn(
          "fixed bottom-8 right-8 z-40",
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-gradient-to-r from-purple-500 to-blue-500",
          "text-white font-medium",
          "hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/50",
          "transition-all duration-300"
        )}
      >
        <Download className="w-5 h-5" />
        <span>Resume</span>
      </motion.button>

      <ResumeDownloadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

// Create anime-styled intro loader that plays at the beginning
function AnimeLoader() {
  const [loading, setLoading] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Auto-dismiss after 4.5 seconds to prevent users getting stuck
    const timer = setTimeout(() => {
      setLoading(false)
    }, 4500)
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleEnter = () => {
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = 'none'
    }
    setAnimationComplete(true)
    
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  
  if (!loading) return null
  
  return (
    <motion.div
      ref={containerRef} 
      className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[100]"
      animate={animationComplete ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        {/* Animated circles */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
        >
          <div className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse" />
        </motion.div>
        
        <motion.div 
          className="absolute w-40 h-40 rounded-full border-2 border-purple-500/30"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        />
        
        <motion.div 
          className="absolute w-52 h-52 rounded-full border border-blue-500/20"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: -360 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        />
        
        {/* Animated text */}
        <div className="text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3"
          >
            <div className="text-4xl font-bold gradient-text relative overflow-hidden">
              <span>F</span><span>a</span><span>r</span><span>h</span><span>a</span><span>n</span>
              <span className="ml-2">A</span><span>l</span><span>i</span>
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
            <motion.div 
              className="text-neutral-400 uppercase tracking-widest text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Creative Developer
            </motion.div>
          </motion.div>
          
          {/* Animated button */}
          <motion.button
            onClick={handleEnter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium transition-all overflow-hidden relative group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Let's Explore
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </div>
        
        {/* Animated elements that look like anime-styled energy */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-10 bg-gradient-to-t from-transparent via-purple-500 to-transparent rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                opacity: 0.4,
              }}
              animate={{
                y: ["0%", "100%"],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
          
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-purple-500/80"
              style={{
                left: `${50 + (Math.random() * 40 - 20)}%`,
                top: `${50 + (Math.random() * 40 - 20)}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 1.5, 0],
              }}
              transition={{
                duration: 1.5 + Math.random() * 1.5,
                repeat: Infinity,
                delay: Math.random() * 1,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Add TechSkills component between HeroSection and FeaturedWorkPreview
function TechSkills() {
  // Tech stack categories
  const techCategories = [
    {
      name: "Frontend",
      color: "purple",
      skills: [
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", level: 95 },
        { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", level: 90 },
        { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", level: 88 },
        { name: "TailwindCSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg", level: 92 },
        { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", level: 95 },
        { name: "HTML/CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", level: 97 }
      ]
    },
    {
      name: "Backend",
      color: "blue",
      skills: [
        { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", level: 89 },
        { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", level: 87 },
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", level: 83 },
        { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", level: 80 },
      ]
    },
    {
      name: "Database",
      color: "emerald",
      skills: [
        { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", level: 90 },
        { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", level: 86 },
        { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", level: 84 },
        { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", level: 88 }
      ]
    },
    {
      name: "DevOps & Tools",
      color: "amber",
      skills: [
        { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", level: 91 },
        { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", level: 80 },
        { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", level: 79 },
        { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", level: 87 }
      ]
    }
  ]
  
  // State to track which category is active
  const [activeCategory, setActiveCategory] = useState(0)
  const [hoverSkill, setHoverSkill] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Animation variants for skill cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />
      
      {/* Moving background blobs */}
      <motion.div
        className="absolute top-20 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.4), rgba(59,130,246,0.1))",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.4), rgba(16,185,129,0.1))",
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <GradientHeading>Technical Skills</GradientHeading>
          <p className="text-neutral-400 max-w-2xl mx-auto mt-4">
            My expertise spans across various technologies and frameworks
          </p>
        </motion.div>
        
        {/* Category tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {techCategories.map((category, index) => (
            <motion.button
              key={category.name}
              onClick={() => setActiveCategory(index)}
              className={`px-5 py-2.5 rounded-full backdrop-blur-sm transition-all duration-300 relative group overflow-hidden ${
                activeCategory === index 
                  ? category.color === "purple" 
                    ? "bg-purple-500/20 border-purple-500/50 text-white" 
                    : category.color === "blue" 
                      ? "bg-blue-500/20 border-blue-500/50 text-white"
                      : category.color === "emerald"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                        : "bg-amber-500/20 border-amber-500/50 text-white"
                  : 'bg-black/30 border-neutral-800 text-neutral-400 hover:text-white'
              } border`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">{category.name}</span>
              
              {/* Animated background */}
              {activeCategory === index && (
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${
                    category.color === "purple" 
                      ? "from-purple-500/20 to-purple-600/20" 
                      : category.color === "blue" 
                        ? "from-blue-500/20 to-blue-600/20"
                        : category.color === "emerald"
                          ? "from-emerald-500/20 to-emerald-600/20"
                          : "from-amber-500/20 to-amber-600/20"
                  }`}
                  layoutId="activeCategoryBackground"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Animated glow on hover */}
              <motion.div 
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 ${
                  category.color === "purple" 
                    ? "bg-purple-500/10" 
                    : category.color === "blue" 
                      ? "bg-blue-500/10"
                      : category.color === "emerald"
                        ? "bg-emerald-500/10"
                        : "bg-amber-500/10"
                }`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </motion.div>
        
        {/* Skills grid */}
        <div className="py-4" ref={containerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
            >
              {techCategories[activeCategory].skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  variants={cardVariants}
                  custom={index}
                  whileHover={{ scale: 1.05, z: 10 }}
                  onHoverStart={() => setHoverSkill(index)}
                  onHoverEnd={() => setHoverSkill(null)}
                  className={`
                    relative overflow-hidden rounded-xl p-6
                    backdrop-blur-sm 
                    ${
                      techCategories[activeCategory].color === "purple" 
                        ? "border-purple-500/20 hover:shadow-purple-500/10" 
                        : techCategories[activeCategory].color === "blue" 
                          ? "border-blue-500/20 hover:shadow-blue-500/10"
                          : techCategories[activeCategory].color === "emerald"
                            ? "border-emerald-500/20 hover:shadow-emerald-500/10"
                            : "border-amber-500/20 hover:shadow-amber-500/10"
                    }
                    border
                    bg-black/30 transition-all duration-300
                    hover:shadow-lg
                    perspective-3d
                  `}
                  style={{
                    transform: hoverSkill === index ? "translateZ(20px)" : "none",
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  {/* Background glow effect */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br opacity-30
                      ${
                        techCategories[activeCategory].color === "purple" 
                          ? "from-purple-500/10" 
                          : techCategories[activeCategory].color === "blue" 
                            ? "from-blue-500/10"
                            : techCategories[activeCategory].color === "emerald"
                              ? "from-emerald-500/10"
                              : "from-amber-500/10"
                      } via-transparent to-transparent`}
                  />
                  
                  {/* Skill content */}
                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon */}
                    <div className="relative">
                      <div 
                        className={`
                          w-16 h-16 flex items-center justify-center rounded-lg
                          bg-gradient-to-br from-black to-black/50
                          ${
                            techCategories[activeCategory].color === "purple" 
                              ? "border-purple-500/30" 
                              : techCategories[activeCategory].color === "blue" 
                                ? "border-blue-500/30"
                                : techCategories[activeCategory].color === "emerald"
                                  ? "border-emerald-500/30"
                                  : "border-amber-500/30"
                          }
                          border p-3 relative overflow-hidden
                        `}
                      >
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={40}
                          height={40}
                          className="relative z-10"
                        />
                        
                        {/* Animated scanner effect */}
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-b from-transparent to-transparent h-full w-full
                            ${
                              techCategories[activeCategory].color === "purple" 
                                ? "via-purple-500/30" 
                                : techCategories[activeCategory].color === "blue" 
                                  ? "via-blue-500/30"
                                  : techCategories[activeCategory].color === "emerald"
                                    ? "via-emerald-500/30"
                                    : "via-amber-500/30"
                            }
                          `}
                          animate={{
                            y: ['-100%', '200%'],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                            delay: index * 0.2
                          }}
                          style={{
                            opacity: hoverSkill === index ? 0.7 : 0.3
                          }}
                        />
                      </div>
                      
                      {/* Glowing orb underneath */}
                      <motion.div 
                        className={`absolute -inset-1 rounded-lg blur-md opacity-0
                          ${
                            techCategories[activeCategory].color === "purple" 
                              ? "bg-purple-500/20" 
                              : techCategories[activeCategory].color === "blue" 
                                ? "bg-blue-500/20"
                                : techCategories[activeCategory].color === "emerald"
                                  ? "bg-emerald-500/20"
                                  : "bg-amber-500/20"
                          }
                        `}
                        animate={{ 
                          opacity: hoverSkill === index ? [0, 0.7, 0] : 0 
                        }}
                        transition={{ 
                          repeat: hoverSkill === index ? Infinity : 0,
                          duration: 2
                        }}
                      />
                    </div>
                    
                    {/* Skill details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-2">{skill.name}</h3>
                      
                      {/* Skill level bar */}
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r
                            ${
                              techCategories[activeCategory].color === "purple" 
                                ? "from-purple-600 to-purple-400" 
                                : techCategories[activeCategory].color === "blue" 
                                  ? "from-blue-600 to-blue-400"
                                  : techCategories[activeCategory].color === "emerald"
                                    ? "from-emerald-600 to-emerald-400"
                                    : "from-amber-600 to-amber-400"
                            }
                          `}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ 
                            duration: 1, 
                            delay: 0.2 + index * 0.1,
                            ease: [0.34, 1.56, 0.64, 1]
                          }}
                        />
                      </div>
                      
                      {/* Skill level text */}
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-neutral-500">Expertise</span>
                        <motion.span 
                          className="text-xs text-white/80"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          {skill.level}%
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Particle effects on hover */}
                  {hoverSkill === index && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-1 h-1 rounded-full ${
                            techCategories[activeCategory].color === "purple" 
                              ? "bg-purple-500" 
                              : techCategories[activeCategory].color === "blue" 
                                ? "bg-blue-500"
                                : techCategories[activeCategory].color === "emerald"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                          }`}
                          initial={{ 
                            x: 50,
                            y: 50,
                            opacity: 0,
                            scale: 0
                          }}
                          animate={{ 
                            x: 50 + (Math.random() - 0.5) * 150,
                            y: 50 + (Math.random() - 0.5) * 150,
                            opacity: [0, 1, 0],
                            scale: [0, Math.random() * 2, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="bg-black text-white">
      <AnimeLoader />
      <ScrollIndicator />
      <AnimatedBackground />
      <FloatingResumeButton />
      <HeroSection />
      <TechSkills />
      <FeaturedWorkPreview />
      <TimelineSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}

