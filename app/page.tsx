"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useAnimationFrame } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Code, Brain, Rocket, Star, Coffee, Users, Instagram, Github, Linkedin, ChevronLeft, ChevronRight, Download, GraduationCap, Briefcase, Eye, FileText, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

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
  return (
    <div className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative max-w-7xl mx-auto px-4 space-y-16"
      >
        <div className="text-center space-y-4">
          <GradientHeading>Featured Work</GradientHeading>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Explore some of my recent projects and creative solutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-video rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <Image
                src={project.image}
                alt={`Project ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={i < 2}
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className={`text-2xl font-bold ${i < 3 ? 'text-black' : 'text-white'}`}>
                  {project.title}
                </h3>
                <p className={`mt-2 max-w-md ${i < 3 ? 'text-black' : 'text-neutral-200'}`}>
                  {project.description}
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Link
                    href="#"
                    className={`inline-flex items-center ${i < 3 ? 'text-black hover:text-gray-700' : 'text-white hover:text-purple-400'} transition-colors`}
                  >
                    View Project
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Add this new component for interactive background particles
function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  useEffect(() => {
    // Set dimensions after component mounts (client-side only)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    setMousePosition({ x: clientX, y: clientY })
  }

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.4), rgba(59,130,246,0.2))",
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
            style={{ top: `${i * 5}%` }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scaleY: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Interactive Particles */}
      <div className="absolute inset-0">
        {dimensions.width > 0 && Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            animate={{
              x: mousePosition.x + (Math.random() - 0.5) * 100,
              y: mousePosition.y + (Math.random() - 0.5) * 100,
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              delay: i * 0.02,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const CurrentIcon = skills[activeIndex].icon

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % skills.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <InteractiveBackground />
      <div className="max-w-7xl mx-auto px-4 py-32 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <motion.div className="space-y-6">
            {/* Enhanced Welcome Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="h-px w-10 bg-gradient-to-r from-purple-500 to-transparent" />
              <span className="text-purple-500 font-medium tracking-wider uppercase text-sm">
                Hello, World! 👋
              </span>
            </motion.div>

            {/* Enhanced Name Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl text-neutral-200 font-medium">
                I'm a Full Stack Developer
              </h2>
              <motion.div 
                className="relative inline-block"
                whileHover={{ scale: 1.02 }}
              >
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter gradient-text pb-2">
                  Farhan Ali
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-purple-500 via-blue-500 to-transparent" />
              </motion.div>
            </motion.div>

            {/* Enhanced Description */}
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-neutral-400 max-w-lg leading-relaxed"
              >
                Transforming ideas into reality through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 font-semibold">
                  innovative code
                </span>{" "}
                and{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold">
                  creative solutions
                </span>. 
                Specializing in building exceptional digital experiences.
              </motion.p>

              {/* Read More button as a separate element */}
              <div className="relative">
                <Link href="/about" className="group/link">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2",
                      "rounded-full border border-neutral-800",
                      "bg-neutral-900/50 backdrop-blur-sm",
                      "hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/20",
                      "transition-all duration-300"
                    )}
                  >
                    <span className="text-sm text-neutral-400 group-hover/link:text-white transition-colors">
                      Read More
                    </span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-neutral-400 group-hover/link:text-white"
                    >
                      →
                    </motion.span>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
              className="flex gap-6 pt-4"
            >
              {[
                { number: "2+", label: "Years Experience" },
                { number: "80+", label: "Projects Completed" },
                { number: "100%", label: "Client Satisfaction" },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-neutral-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <SocialLinks />
          </motion.div>

          {/* Rest of your existing hero content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-32"
            >
              <div className={cn(
                "inline-flex items-center space-x-4 px-6 py-3 rounded-full",
                "bg-gradient-to-r shadow-lg cosmic-card",
                skills[activeIndex].gradient
              )}>
                <CurrentIcon className="w-6 h-6 text-white" />
                <span className="text-white font-medium">{skills[activeIndex].title}</span>
              </div>
              <p className="mt-4 text-xl text-neutral-400">{skills[activeIndex].description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              href="/work"
              className={cn(
                "group relative px-8 py-4 rounded-full",
                "bg-gradient-to-r from-purple-500 to-blue-500",
                "hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/50",
                "transition-all duration-300"
              )}
            >
              <motion.span 
                className="relative z-10 flex items-center text-white font-medium"
                whileHover={{ x: 5 }}
              >
                Explore My Work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Link>

            <Link 
              href="/contact"
              className={cn(
                "group relative px-8 py-4 rounded-full",
                "bg-neutral-900/50 backdrop-blur-sm",
                "border border-neutral-800",
                "hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/20",
                "transition-all duration-300"
              )}
            >
              <span className="relative z-10 flex items-center text-white font-medium">
                Let's Connect
              </span>
            </Link>
          </motion.div>

          {/* Add this new interactive element */}
          <motion.div
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
            <div className="relative p-6 rounded-xl border border-neutral-800 group-hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                  <Code className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500">
                    Available for Projects
                  </h3>
                  <p className="text-neutral-400">Let's create something amazing together</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Stats with enhanced animations */}
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { number: "80+", label: "Projects", icon: Code },
              { number: "20+", label: "Certifications", icon: Star },
              { number: "2+", label: "Years", icon: Coffee },
              { number: "50+", label: "Clients", icon: Users },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  rotateX: 10,
                }}
                className="cosmic-card p-6 rounded-2xl group perspective-3d"
              >
                <motion.div
                  className="relative z-10 flex flex-col items-center text-center"
                  whileHover={{ rotateX: 10 }}
                >
                  <stat.icon className="w-6 h-6 text-purple-500 mb-3 group-hover:text-purple-400 transition-colors" />
                  <div className="text-3xl font-bold gradient-text">
                    {stat.number}
                  </div>
                  <div className="text-sm text-neutral-400 mt-1 group-hover:text-neutral-300 transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <TechStackShowcase />
    </div>
  )
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

export default function Home() {
  return (
    <main className="bg-black text-white">
      <ScrollIndicator />
      <AnimatedBackground />
      <FloatingResumeButton />
      <HeroSection />
      <FeaturedWorkPreview />
      <TimelineSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}

