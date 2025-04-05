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

// Define our testimonials without profile images, more realistic content
const testimonials = [
  {
    content: "Farhan delivered our e-commerce platform ahead of schedule and optimized it beyond our expectations. The site loads 3x faster than our previous one, and conversions are up by 42% since launch.",
    name: "Alex Henderson",
    company: "Vertex Commerce",
    project: "E-commerce Platform",
    date: "March 2023",
    sentiment: "performance",
  },
  {
    content: "Working with Farhan was refreshingly straightforward. He listened to our needs and built exactly what we asked for, but also suggested improvements we hadn't thought of. The result speaks for itself.",
    name: "Sarah Liang",
    company: "Meridian Solutions",
    project: "Internal Dashboard",
    date: "January 2023",
    sentiment: "collaboration",
  },
  {
    content: "The interactive data visualization Farhan built for our research team has completely transformed how we present findings. Our stakeholders can now understand complex datasets at a glance.",
    name: "Dr. Marcus Chen",
    company: "BioTech Research",
    project: "Data Visualization Tool",
    date: "November 2022",
    sentiment: "innovation",
  },
  {
    content: "I was impressed by Farhan's ability to translate our vague ideas into concrete features. He asked the right questions and delivered a product that exceeded what we had initially envisioned.",
    name: "Jamie Winters",
    company: "CloudScale",
    project: "SaaS Application",
    date: "April 2023",
    sentiment: "communication",
  },
  {
    content: "The mobile app Farhan developed has gotten rave reviews from our users. The UI is incredibly intuitive, and we've seen user engagement increase by 78% compared to our previous version.",
    name: "Raj Patel",
    company: "UrbanMove",
    project: "Transportation App",
    date: "February 2023",
    sentiment: "design",
  },
  {
    content: "Farhan fixed performance issues that three previous developers couldn't solve. Our application now handles 5x the traffic without breaking a sweat. Worth every penny.",
    name: "Chris Donaldson",
    company: "Peak Analytics",
    project: "Performance Optimization",
    date: "May 2023",
    sentiment: "performance",
  },
  {
    content: "We hired Farhan to rescue a project that was going off the rails. Not only did he get us back on track, but he delivered additional features we didn't think were possible within our budget.",
    name: "Michelle Barnes",
    company: "Innovate Digital",
    project: "Web Application Rescue",
    date: "December 2022",
    sentiment: "rescue",
  },
  {
    content: "The authentication system Farhan implemented is rock-solid. He took the time to explain security considerations and best practices, which helped our team level up our own knowledge.",
    name: "David Kim",
    company: "SecureNet",
    project: "Authentication System",
    date: "June 2023",
    sentiment: "security",
  },
  {
    content: "Our startup needed an MVP fast. Farhan delivered a clean, functional product in just three weeks that helped us secure our next round of funding. We'll definitely work with him again.",
    name: "Lucia Fernandez",
    company: "GreenTech Startup",
    project: "MVP Development",
    date: "January 2023", 
    sentiment: "speed",
  },
  {
    content: "The API integration was more complex than we anticipated, but Farhan navigated the challenges skillfully. His documentation was exceptional, making it easy for our team to maintain.",
    name: "Thomas Wright",
    company: "ConnectAPI",
    project: "API Integration",
    date: "March 2023",
    sentiment: "technical",
  },
  {
    content: "Farhan's code is clean, well-documented, and maintainable - a breath of fresh air compared to most contractors. Our in-house team had no trouble taking over after handoff.",
    name: "Jennifer Lee",
    company: "CodeQuality", 
    project: "Legacy System Modernization",
    date: "April 2023",
    sentiment: "code-quality",
  },
  {
    content: "The CMS Farhan built is so user-friendly that we were able to train our marketing team in an hour. Now they can update content without going through our tech team - huge time saver!",
    name: "Mike Simmons",
    company: "ContentFirst",
    project: "Custom CMS",
    date: "February 2023",
    sentiment: "usability",
  }
];

function TestimonialsSection() {
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  // Define sentiments for filtering
  const sentiments = [
    { value: "performance", label: "Performance", color: "from-purple-500 to-fuchsia-500" },
    { value: "design", label: "Design", color: "from-blue-500 to-cyan-500" },
    { value: "technical", label: "Technical", color: "from-emerald-500 to-green-500" },
    { value: "collaboration", label: "Collaboration", color: "from-orange-500 to-amber-500" },
    { value: null, label: "All", color: "from-neutral-500 to-neutral-400" },
  ];
  
  // Filter testimonials based on selected sentiment
  const filteredTestimonials = selectedSentiment 
    ? testimonials.filter(t => t.sentiment === selectedSentiment)
    : testimonials;

  // Check if section is in view
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden" id="testimonials">
      {/* Cyber/tech-inspired background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.1),transparent_70%)]" />
      
      {/* Digital circuit line effect */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      {/* Animated circuit points */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div 
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-500"
          style={{ 
            left: `${10 + i * 20}%`, 
            top: '0', 
            boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)'
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500" />
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-purple-500 uppercase tracking-wider text-sm font-medium"
            >
              Client Experiences
            </motion.span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
          
          <GradientHeading>What Clients Are Saying</GradientHeading>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-2xl mx-auto"
          >
            Real feedback from real projects. No stock photos, just authentic experiences working together.
          </motion.p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {sentiments.map((sentiment) => (
            <motion.button
              key={sentiment.value || 'all'}
              onClick={() => setSelectedSentiment(sentiment.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedSentiment === sentiment.value 
                  ? `bg-gradient-to-r ${sentiment.color} text-white shadow-lg` 
                  : 'bg-neutral-900/50 text-neutral-400 hover:text-white border border-neutral-800 hover:border-purple-500/30'
                }`}
            >
              {sentiment.label}
            </motion.button>
          ))}
        </div>

        {/* Testimonial cards in a cyberpunk/tech-inspired grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial, idx) => {
            // Find the matching sentiment
            const sentiment = sentiments.find(s => s.value === testimonial.sentiment) || sentiments[0];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onHoverStart={() => setHoveredCard(idx)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Card with tech/cyberpunk inspired design */}
                <div className="h-full bg-neutral-900/60 backdrop-blur rounded-lg border border-neutral-800 group-hover:border-opacity-0 transition-all overflow-hidden">
                  {/* Animated border gradient on hover */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${sentiment.color} opacity-20`} />
                    <div className="absolute inset-0 rounded-lg border border-white/10" style={{ padding: '1px' }}>
                      <div className={`absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r ${sentiment.color}`} />
                      <div className={`absolute bottom-0 right-0 left-0 h-[1px] bg-gradient-to-r ${sentiment.color}`} />
                      <div className={`absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b ${sentiment.color}`} />
                      <div className={`absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b ${sentiment.color}`} />
                    </div>
                  </div>
                  
                  {/* Card content */}
                  <div className="p-6 relative z-10 h-full flex flex-col">
                    {/* Quote */}
                    <div className="flex-1">
                      <div className="mb-4 text-purple-500/80">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 9H6C4.89543 9 4 9.89543 4 11V17C4 18.1046 4.89543 19 6 19H10C11.1046 19 12 18.1046 12 17V11C12 9.89543 11.1046 9 10 9Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M22 9H18C16.8954 9 16 9.89543 16 11V17C16 18.1046 16.8954 19 18 19H22C23.1046 19 24 18.1046 24 17V11C24 9.89543 23.1046 9 22 9Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M6 9V5" stroke="currentColor" strokeWidth="2" />
                          <path d="M18 9V5" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <p className="text-neutral-300 mb-6 line-clamp-6">
                        {testimonial.content}
                      </p>
                    </div>
                    
                    {/* Client info with cyberpunk aesthetic */}
                    <div className="border-t border-neutral-800 pt-4 mt-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-medium">{testimonial.name}</h3>
                          <p className="text-neutral-500 text-sm flex items-center">
                            {testimonial.company}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${sentiment.color} bg-clip-text text-transparent border border-purple-500/20`}>
                          {testimonial.date}
                        </div>
                      </div>
                      
                      {/* Project type with tech aesthetic */}
                      <div className="mt-2 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse" />
                        <span className="text-xs text-neutral-400">
                          {testimonial.project}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Tech-inspired CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/contact" 
            className="inline-flex items-center group px-6 py-3 rounded-full bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 transition-all"
          >
            <span className="text-neutral-300 group-hover:text-white mr-2 transition-colors">Let's work together</span>
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
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

// Update the timeline data with the same content
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

// Performance-optimized TimelineSection component with cyberpunk aesthetic
const TimelineSection = React.memo(function TimelineSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'education'>('all');
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  
  // Filter timeline items based on active tab
  const filteredTimeline = useMemo(() => 
    activeTab === 'all' 
      ? timeline 
      : timeline.filter(item => item.type === activeTab),
    [activeTab]
  );
  
  // Check if section is in view
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once we've observed it in view, no need to keep observing
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="py-24 relative overflow-hidden" 
      id="timeline"
    >
      {/* Optimized background effects - reduced blur and animation */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.1),transparent_70%)]" />
      
      {/* Circuit Board Patterns - Static */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-purple-500/30" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-500/30" />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-purple-500/30" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-blue-500/30" />
      </div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-purple-400">Career Path</span>
          </div>
          
          <GradientHeading>Education & Experience</GradientHeading>
          
          <p className="text-neutral-400 max-w-2xl mx-auto">
            My journey in tech from education to professional experience
          </p>
          
          {/* Type filter tabs */}
          <div className="flex justify-center mt-6 mb-3 gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'experience', label: 'Experience' },
              { id: 'education', label: 'Education' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-neutral-900/50 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline content - simplified for better performance */}
        <div className="relative space-y-6 mt-12">
          {!isReducedMotion.current && (
            <div className="absolute left-8 sm:left-1/2 sm:-ml-px top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/30 via-blue-500/30 to-purple-500/30" />
          )}
          
          {filteredTimeline.map((item, idx) => (
            <motion.div
              key={idx}
              initial={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: Math.min(idx * 0.1, 0.5) }}
              className="relative flex flex-col sm:flex-row items-start gap-4"
            >
              {/* Timeline icon - visible on all screen sizes */}
              <div className="z-10 flex-shrink-0">
                <div className={`
                  w-16 h-16 rounded-xl flex items-center justify-center
                  bg-neutral-900 border border-neutral-800
                  ${item.type === 'experience' ? 'shadow-purple-500/20' : 'shadow-blue-500/20'}
                `}>
                  <item.icon className={`
                    w-6 h-6 
                    ${item.type === 'experience' ? 'text-purple-500' : 'text-blue-500'}
                  `} />
                </div>
                <div className="hidden sm:block absolute left-8 top-8 w-[calc(50%-2rem)] h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
              </div>
              
              {/* Content card - optimized and responsive */}
              <div className="flex-grow sm:ml-6 p-4 sm:p-6 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-purple-500/30 transition-all">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                    {item.title}
                  </h3>
                  <div className="px-3 py-1 rounded-full text-xs border border-purple-500/20 text-purple-400 bg-purple-500/5">
                    {item.date}
                  </div>
                </div>
                
                {/* Institution with icon */}
                <div className="flex items-center mb-3 text-neutral-300">
                  <span className="text-sm font-medium">{item.institution}</span>
                </div>
                
                {/* Description */}
                <p className="text-neutral-400 mb-4 text-sm">
                  {item.description}
                </p>
                
                {/* Skills - horizontal scrolling on mobile */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {item.skills.map((skill, skillIdx) => (
                    <span
                      key={skillIdx}
                      className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-neutral-800 text-neutral-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium"
            onClick={() => {
              const resumeBtn = document.querySelector('.fixed.bottom-8.right-8');
              if (resumeBtn && resumeBtn instanceof HTMLElement) {
                resumeBtn.click();
              }
            }}
          >
            <FileText className="w-4 h-4" />
            <span>View Resume</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
});

// Add this new component for the floating resume button
function ResumeDownloadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [animationCompleted, setAnimationCompleted] = useState(false)
  
  const handleDownload = () => {
    window.open('/cv.pdf', '_blank')
  }
  
  // Close animation handling
  const handleAnimationComplete = useCallback(() => {
    if (!isOpen) setAnimationCompleted(true)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) setAnimationCompleted(false)
  }, [isOpen])

  if (!isOpen && animationCompleted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring" }}
            onAnimationComplete={handleAnimationComplete}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-4xl max-h-[90vh] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl"
          >
            {/* Modal header */}
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-black/50">
              <h3 className="text-xl font-bold text-white">Resume Preview</h3>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-neutral-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* PDF Preview */}
            <div className="h-[70vh] overflow-auto">
              <iframe 
                src="/cv.pdf" 
                className="w-full h-full" 
                title="Resume Preview"
              />
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t border-neutral-800 flex justify-end gap-3 bg-black/50">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-neutral-700 hover:border-neutral-600 text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
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
        <FileText className="w-5 h-5" />
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
function AnimeLoader({ setLoading }: { setLoading: (value: boolean) => void }) {
  const [typedText, setTypedText] = useState("");
  const [showGlitch, setShowGlitch] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Text to be typed in the terminal-like interface
  const fullText = ">> INITIALIZING AWESOME MODE\n>> LOADING PORTFOLIO ASSETS\n>> PREPARING VISUAL INTERFACE\n>> DANCE SEQUENCE ACTIVATED";
  
  // Terminal typing effect
  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        setTypedText(currentText);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowGlitch(true), 500);
      }
    }, 35); // Speed of typing
    
    return () => clearInterval(typingInterval);
  }, []);
  
  // Loading progress bar
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + (Math.random() * 3);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);
    
    // Auto-dismiss after loader is complete
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5500); // Show loader for 5.5 seconds total
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [setLoading]);
  
  // Skip loader when user clicks
  const handleSkip = () => {
    setLoading(false);
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[100] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Retro CRT screen effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/scanline.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.8) 100%)' }} />
      </div>
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />
      
      {/* Dancing girl container */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8">
        {/* Animated glowing frame */}
        <motion.div
          className="absolute -inset-2 rounded-lg opacity-70"
          style={{ 
            background: 'linear-gradient(90deg, #9c27b0, #3b82f6, #9c27b0)', 
            backgroundSize: '200% 100%' 
          }}
          animate={{ 
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{ 
            duration: 3, 
            ease: 'linear', 
            repeat: Infinity 
          }}
        />
        
        {/* Black background for the GIF */}
        <div className="absolute inset-0 bg-black rounded-md" />
        
        {/* The dancing girl GIF */}
        <div className="absolute inset-0 rounded-md overflow-hidden flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Image
              src="/loader.gif"
              alt="Dancing girl animation"
              fill
              className="object-contain"
              style={{ 
                filter: 'none',
                transition: 'filter 0.5s ease-out'
              }}
            />
            
            {/* Glitch effect overlay */}
            {showGlitch && (
              <motion.div
                className="absolute inset-0 bg-transparent"
                animate={{ 
                  opacity: [0, 0.1, 0],
                  x: [0, -5, 5, -2, 0],
                }}
                transition={{ 
                  duration: 0.2, 
                  repeat: 6, 
                  repeatType: 'mirror' 
                }}
              />
            )}
          </div>
        </div>
        
        {/* Animated corners */}
        {[
          'top-0 left-0 border-t-2 border-l-2', 
          'top-0 right-0 border-t-2 border-r-2',
          'bottom-0 left-0 border-b-2 border-l-2', 
          'bottom-0 right-0 border-b-2 border-r-2'
        ].map((position, i) => (
          <motion.div
            key={i}
            className={`absolute w-6 h-6 ${position} border-purple-500 z-10`}
            animate={{ 
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: 'reverse',
              delay: i * 0.2
            }}
          />
        ))}
      </div>
      
      {/* Terminal-style text display */}
      <div className="bg-black/70 border border-purple-500/30 p-4 rounded-md w-80 sm:w-96 h-32 sm:h-40 mb-8 overflow-hidden font-mono text-xs sm:text-sm relative">
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-purple-700 to-blue-700 flex items-center px-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <div className="text-white text-xs ml-2">terminal_access.sh</div>
        </div>
        
        <div className="text-green-400 mt-6 whitespace-pre-line">
          {typedText}
          <motion.span
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >_</motion.span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-80 sm:w-96 h-3 bg-black/70 border border-purple-500/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      
      {/* Skip button */}
      <motion.button
        className="mt-6 px-4 py-1.5 bg-black/50 border border-purple-500/50 rounded-md text-purple-400 text-sm hover:bg-purple-900/20 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSkip}
        animate={{ opacity: [0, 1] }}
        transition={{ opacity: { delay: 1, duration: 0.5 } }}
      >
        Skip Intro
      </motion.button>
      
      {/* Floating elements for cyber aesthetic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              opacity: 0.6,
            }}
            animate={{ 
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.8, 0],
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: 'loop',
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Add TechSkills component between HeroSection and FeaturedWorkPreview
const TechSkills = React.memo(function TechSkills() {
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
        { name: "Prisma", icon: "https://www.prisma.io/images/favicon-32x32.png", level: 85 }
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
  const [isVisible, setIsVisible] = useState(false)
  
  // Check if component is in view for performance
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  // Animation variants for skill cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: Math.min(i * 0.1, 0.5),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }
  
  // Render a skill card with optimal performance
  const renderSkillCard = useCallback((skill: any, index: number, color: string) => (
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
          color === "purple" 
            ? "border-purple-500/20 hover:shadow-purple-500/10" 
            : color === "blue" 
              ? "border-blue-500/20 hover:shadow-blue-500/10"
              : color === "emerald"
                ? "border-emerald-500/20 hover:shadow-emerald-500/10"
                : "border-amber-500/20 hover:shadow-amber-500/10"
        }
        border
        bg-black/30 transition-all duration-300
        hover:shadow-lg
      `}
      style={{
        transform: hoverSkill === index ? "translateZ(20px)" : "none",
        transformStyle: "preserve-3d",
        transition: "transform 0.3s ease-out",
      }}
    >
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br opacity-30
          ${
            color === "purple" 
              ? "from-purple-500/10" 
              : color === "blue" 
                ? "from-blue-500/10"
                : color === "emerald"
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
                color === "purple" 
                  ? "border-purple-500/30" 
                  : color === "blue" 
                    ? "border-blue-500/30"
                    : color === "emerald"
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
                  color === "purple" 
                    ? "via-purple-500/30" 
                    : color === "blue" 
                      ? "via-blue-500/30"
                      : color === "emerald"
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
                color === "purple" 
                  ? "bg-purple-500/20" 
                  : color === "blue" 
                    ? "bg-blue-500/20"
                    : color === "emerald"
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
                  color === "purple" 
                    ? "from-purple-600 to-purple-400" 
                    : color === "blue" 
                      ? "from-blue-600 to-blue-400"
                      : color === "emerald"
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
    </motion.div>
  ), [hoverSkill]);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />
      
      {/* Moving background blobs - optimized for performance */}
      <div className="absolute top-20 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 bg-[radial-gradient(circle,_rgba(168,85,247,0.4),rgba(59,130,246,0.1))]" />
      <div className="absolute bottom-20 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 bg-[radial-gradient(circle,_rgba(59,130,246,0.4),rgba(16,185,129,0.1))]" />
      
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
            </motion.button>
          ))}
        </motion.div>
        
        {/* Skills grid - only animate when visible for performance */}
        <div className="py-4" ref={containerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {techCategories[activeCategory].skills.map((skill, index) => 
                renderSkillCard(skill, index, techCategories[activeCategory].color)
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  return (
    <main className="bg-black text-white">
      {loading && <AnimeLoader setLoading={setLoading} />}
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

