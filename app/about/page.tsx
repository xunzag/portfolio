"use client"

import React, { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Code, Brain, Rocket, Heart, Coffee, Star, Cat, Music, Gamepad, Book } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "framer-motion"

// Personal stats data
const personalStats = [
  {
    number: "2+",
    label: "Years of Experience",
    icon: Coffee,
    description: "Building scalable applications"
  },
  {
    number: "50+",
    label: "Projects Completed",
    icon: Rocket,
    description: "From web apps to AI solutions"
  },
  {
    number: "30+",
    label: "Happy Clients",
    icon: Heart,
    description: "Worldwide satisfaction"
  },
  {
    number: "15+",
    label: "Technologies Mastered",
    icon: Code,
    description: "Full-stack expertise"
  }
]

// Core values data
const coreValues = [
  {
    title: "Innovation First",
    description: "Always pushing boundaries with cutting-edge solutions",
    icon: Brain,
    gradient: "from-purple-500 to-blue-500",
    metrics: [
      { label: "New Technologies", value: "15+" },
      { label: "Innovative Solutions", value: "25+" }
    ],
    principles: [
      "Embrace emerging tech",
      "Think outside the box",
      "Challenge conventions"
    ]
  },
  {
    title: "Quality Driven",
    description: "Delivering excellence in every line of code",
    icon: Star,
    gradient: "from-blue-500 to-cyan-500",
    metrics: [
      { label: "Code Quality", value: "A+" },
      { label: "Test Coverage", value: "95%" }
    ],
    principles: [
      "Clean architecture",
      "Robust testing",
      "Performance first"
    ]
  },
  {
    title: "User Focused",
    description: "Creating intuitive and engaging experiences",
    icon: Heart,
    gradient: "from-cyan-500 to-green-500",
    metrics: [
      { label: "User Satisfaction", value: "98%" },
      { label: "Retention Rate", value: "95%" }
    ],
    principles: [
      "Intuitive design",
      "Accessibility",
      "User feedback driven"
    ]
  }
]

// Add this for the moving cat
function MovingCat({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      animate={mousePosition}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 200
      }}
    >
      <Cat className="w-12 h-12 text-purple-500" />
    </motion.div>
  )
}

// Fun facts about me
const funFacts = [
  {
    icon: Coffee,
    fact: "I've consumed approximately 2,190 cups of coffee while coding",
    color: "text-amber-500"
  },
  {
    icon: Music,
    fact: "I code better while listening to Lo-fi beats",
    color: "text-blue-500"
  },
  {
    icon: Gamepad,
    fact: "I'm a casual gamer who loves strategy games",
    color: "text-green-500"
  },
  {
    icon: Book,
    fact: "I read one technical book every month",
    color: "text-red-500"
  }
]

function AboutHeroSection() {
  return (
    <div className="min-h-[80vh] relative flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.15),transparent_80%)]" />

      <div className="relative max-w-7xl mx-auto px-4 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column - Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="h-px w-10 bg-gradient-to-r from-purple-500 to-transparent" />
              <span className="text-purple-500 font-medium tracking-wider uppercase text-sm">
                About Me
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Crafting Digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                Excellence
              </span>
            </h1>

            <p className="text-xl text-neutral-400 leading-relaxed">
              I'm a passionate Full Stack Developer with expertise in creating innovative solutions. 
              My journey in tech has been driven by curiosity and a desire to build impactful applications.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {personalStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="cosmic-card p-6 rounded-xl group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                    <stat.icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500">
                      {stat.number}
                    </div>
                    <div className="text-sm text-neutral-400">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square rounded-2xl overflow-hidden"
        >
          <Image
            src="/images/me.jpg"
            alt="Farhan Ali"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>
      </div>
    </div>
  )
}

function CoreValuesSection() {
  const coreValues = [
    {
      title: "Innovation First",
      description: "Always pushing boundaries with cutting-edge solutions",
      icon: Brain,
      gradient: "from-purple-500 to-blue-500",
      metrics: [
        { label: "New Technologies", value: "15+" },
        { label: "Innovative Solutions", value: "25+" }
      ],
      principles: [
        "Embrace emerging tech",
        "Think outside the box",
        "Challenge conventions"
      ]
    },
    {
      title: "Quality Driven",
      description: "Delivering excellence in every line of code",
      icon: Star,
      gradient: "from-blue-500 to-cyan-500",
      metrics: [
        { label: "Code Quality", value: "A+" },
        { label: "Test Coverage", value: "95%" }
      ],
      principles: [
        "Clean architecture",
        "Robust testing",
        "Performance first"
      ]
    },
    {
      title: "User Focused",
      description: "Creating intuitive and engaging experiences",
      icon: Heart,
      gradient: "from-cyan-500 to-green-500",
      metrics: [
        { label: "User Satisfaction", value: "98%" },
        { label: "Retention Rate", value: "95%" }
      ],
      principles: [
        "Intuitive design",
        "Accessibility",
        "User feedback driven"
      ]
    }
  ]

  return (
    <div className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            My Core{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Values
            </span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Principles that guide my development process and ensure exceptional results
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {coreValues.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-neutral-800 bg-neutral-900/50">
                {/* Header with Icon */}
                <div className={cn(
                  "p-6",
                  "bg-gradient-to-r bg-opacity-10",
                  value.gradient
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      "bg-gradient-to-r",
                      value.gradient
                    )}>
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500">
                        {value.title}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 border-y border-neutral-800">
                  {value.metrics.map((metric, metricIdx) => (
                    <div
                      key={metricIdx}
                      className="p-4 text-center group-hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="text-xl font-bold text-white">{metric.value}</div>
                      <div className="text-xs text-neutral-500">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Principles */}
                <div className="p-6 space-y-3">
                  {value.principles.map((principle, principleIdx) => (
                    <motion.div
                      key={principleIdx}
                      className="flex items-center gap-3 group/item"
                      whileHover={{ x: 5 }}
                    >
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        "bg-gradient-to-r",
                        value.gradient
                      )} />
                      <span className="text-sm text-neutral-400 group-hover/item:text-white transition-colors">
                        {principle}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillsSection() {
  const skills = [
    {
      category: "Frontend",
      items: [
        { name: "React", level: 95, icon: "⚛️" },
        { name: "Next.js", level: 90, icon: "▲" },
        { name: "TypeScript", level: 88, icon: "TS" },
        { name: "TailwindCSS", level: 92, icon: "🎨" }
      ],
      gradient: "from-purple-500 to-blue-500"
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: 85, icon: "🟢" },
        { name: "Express", level: 88, icon: "🚂" },
        { name: "Python", level: 80, icon: "🐍" },
        { name: "MongoDB", level: 85, icon: "🍃" }
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      category: "Tools & Others",
      items: [
        { name: "Git", level: 90, icon: "🌳" },
        { name: "AWS", level: 82, icon: "☁️" },
        { name: "Docker", level: 85, icon: "🐳" },
        { name: "CI/CD", level: 88, icon: "⚡" }
      ],
      gradient: "from-cyan-500 to-green-500"
    }
  ]

  return (
    <div className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Technical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Expertise
            </span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            A comprehensive set of skills honed through years of experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {skills.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="cosmic-card p-6 rounded-xl backdrop-blur-sm border border-neutral-800 bg-neutral-900/50"
            >
              <div className="space-y-6">
                <div className={cn(
                  "text-xl font-bold bg-clip-text text-transparent",
                  "bg-gradient-to-r",
                  category.gradient
                )}>
                  {category.category}
                </div>
                
                <div className="space-y-4">
                  {category.items.map((skill, skillIdx) => (
                    <motion.div
                      key={skillIdx}
                      className="group"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-800 group-hover:bg-neutral-700 transition-colors">
                          <span className="text-lg">{skill.icon}</span>
                        </div>
                        <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                        <span className="ml-auto text-sm text-neutral-500 group-hover:text-neutral-400">
                          {skill.level}%
                        </span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 + skillIdx * 0.1 }}
                          className={cn(
                            "h-full rounded-full",
                            "bg-gradient-to-r",
                            category.gradient
                          )}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InterestsSection() {
  const interests = [
    {
      title: "AI & Machine Learning",
      description: "Exploring the frontiers of artificial intelligence and its applications in real-world scenarios",
      icon: Brain,
      gradient: "from-purple-500 to-blue-500",
      stats: [
        { label: "Projects", value: "15+" },
        { label: "Papers Read", value: "50+" },
        { label: "Models Trained", value: "25+" }
      ],
      tools: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras"]
    },
    {
      title: "Open Source",
      description: "Contributing to the developer community and building public tools for everyone",
      icon: Code,
      gradient: "from-blue-500 to-cyan-500",
      stats: [
        { label: "Contributions", value: "200+" },
        { label: "Stars", value: "1k+" },
        { label: "Projects", value: "10+" }
      ],
      tools: ["GitHub", "Git", "Open Source", "Community"]
    },
    {
      title: "Innovation",
      description: "Building next-generation solutions that push the boundaries of technology",
      icon: Rocket,
      gradient: "from-cyan-500 to-green-500",
      stats: [
        { label: "Patents", value: "2" },
        { label: "Research", value: "5+" },
        { label: "POCs", value: "20+" }
      ],
      tools: ["Web3", "IoT", "Cloud Native", "Edge Computing"]
    }
  ]

  return (
    <div className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Areas of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Interest
            </span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Exploring cutting-edge technologies and innovative solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {interests.map((interest, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-neutral-800 bg-neutral-900/50">
                {/* Header */}
                <div className={cn(
                  "p-6 flex items-start gap-4",
                  "bg-gradient-to-r",
                  interest.gradient,
                  "bg-opacity-10"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    "bg-gradient-to-r",
                    interest.gradient
                  )}>
                    <interest.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500">
                      {interest.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1">
                      {interest.description}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 border-y border-neutral-800">
                  {interest.stats.map((stat, statIdx) => (
                    <div
                      key={statIdx}
                      className="p-4 text-center group-hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-neutral-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tools */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {interest.tools.map((tool, toolIdx) => (
                      <motion.span
                        key={toolIdx}
                        whileHover={{ y: -2 }}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs",
                          "bg-neutral-800 text-neutral-300",
                          "hover:bg-gradient-to-r hover:text-white transition-colors",
                          interest.gradient
                        )}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HobbiesSection() {
  return (
    <div className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
              initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          When I'm Not{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
            Coding
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Photography",
              description: "Capturing moments through my lens",
              icon: "📸",
              gradient: "from-pink-500 to-rose-500"
            },
            {
              title: "Traveling",
              description: "Exploring new places and cultures",
              icon: "✈️",
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              title: "Music",
              description: "Playing guitar in my free time",
              icon: "🎸",
              gradient: "from-purple-500 to-indigo-500"
            }
          ].map((hobby, idx) => (
            <motion.div
              key={hobby.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className={cn(
                "group relative p-6 rounded-xl overflow-hidden",
                `bg-gradient-to-r ${hobby.gradient} opacity-10 group-hover:opacity-20`
              )}
            >
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">{hobby.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{hobby.title}</h3>
                <p className="text-neutral-400">{hobby.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FunFactsTicker() {
  return (
    <div className="py-16 relative overflow-hidden bg-neutral-900/50">
      {/* Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black to-transparent z-10" />
      
      {/* RGB Lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

      {/* Two rows of facts scrolling in opposite directions */}
      <div className="flex flex-col gap-8">
        <motion.div
          animate={{
            x: [-1000, 1000],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...personalInterests.funFacts, ...personalInterests.funFacts].slice(0, 8).map((fact, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              className={cn(
                "px-6 py-3 rounded-xl backdrop-blur-sm",
                "border border-neutral-800",
                "bg-neutral-900/50",
                "flex items-center gap-4",
                "group cursor-pointer"
              )}
            >
              <motion.span 
                className="text-3xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {fact.icon}
              </motion.span>
              <div className="relative">
                <p className="text-neutral-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all">
                  {fact.fact}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          animate={{
            x: [1000, -1000],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...personalInterests.funFacts, ...personalInterests.funFacts].slice(8).map((fact, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              className={cn(
                "px-6 py-3 rounded-xl backdrop-blur-sm",
                "border border-neutral-800",
                "bg-neutral-900/50",
                "flex items-center gap-4",
                "group cursor-pointer"
              )}
            >
              <motion.span 
                className="text-3xl"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {fact.icon}
              </motion.span>
              <div className="relative">
                <p className="text-neutral-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all">
                  {fact.fact}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/20 rounded-full"
            animate={{
              x: ["0%", "100%"],
              y: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function CTASection() {
  return (
    <div className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Let's Create Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Amazing
            </span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Have a project in mind? Let's collaborate and bring your ideas to life.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-full",
                "bg-gradient-to-r from-purple-500 to-blue-500",
                "text-white font-medium",
                "hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/50",
                "transition-all duration-300"
              )}
            >
              Get in Touch
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

const personalInterests = {
  animes: [
    {
      title: "Hunter X Hunter",
      image: "/images/anime/hxh.jpg", // Updated path
      rating: "9.1",
      genre: "Action, Adventure",
      description: "A masterpiece following Gon's journey, featuring complex characters and unique power systems",
      favoriteChar: "Killua Zoldyck",
      bestArc: "Chimera Ant Arc",
      quote: "You should enjoy the little detours to the fullest. Because that's where you'll find the things more important than what you want.",
      yearWatched: "2019"
    },
    {
      title: "Monster",
      image: "/images/anime/monster.jpg", // Updated path
      rating: "8.9",
      genre: "Psychological Thriller",
      description: "A gripping tale of morality, identity, and the consequences of our choices",
      favoriteChar: "Dr. Kenzo Tenma",
      bestArc: "The Perfect Suicide",
      quote: "The monster inside of me has grown this large.",
      yearWatched: "2020"
    },
    {
      title: "Bleach",
      image: "/images/anime/bleach.jpg", // Updated path
      rating: "8.8",
      genre: "Action, Supernatural",
      description: "Epic battles, stunning visuals, and deep character development",
      favoriteChar: "Byakuya Kuchiki",
      bestArc: "Soul Society Arc",
      quote: "If fate is a millstone, then we are the grist. All we can do is turn.",
      yearWatched: "2018"
    },
    {
      title: "Attack on Titan",
      image: "/images/anime/aot.jpg", // Updated path
      rating: "9.0",
      genre: "Dark Fantasy, Action",
      description: "A masterpiece of storytelling that redefines the meaning of freedom",
      favoriteChar: "Levi Ackerman",
      bestArc: "Marley Arc",
      quote: "If you win, you live. If you lose, you die. If you don't fight, you can't win!",
      yearWatched: "2021"
    },
    {
      title: "Jujutsu Kaisen",
      image: "/images/anime/jjk.jpg", // Updated path
      rating: "8.7",
      genre: "Action, Supernatural",
      description: "Modern dark fantasy with stunning animation and unique curse system",
      favoriteChar: "Gojo Satoru",
      bestArc: "Shibuya Incident",
      quote: "Throughout heaven and earth, I alone am the honored one.",
      yearWatched: "2022"
    },
    {
      title: "Death Note",
      image: "/images/anime/deathnote.jpg",
      rating: "9.0",
      genre: "Psychological Thriller, Supernatural",
      description: "A brilliant cat-and-mouse game between Light Yagami and L, exploring morality and justice through supernatural means",
      favoriteChar: "L Lawliet",
      bestArc: "L vs Light Arc",
      quote: "I am Justice! I protect the innocent and those who fear evil. I'm the one who will become the god of a new world that everyone desires!",
      yearWatched: "2017"
    }
  ],
  hobbies: [
    {
      title: "Gaming",
      image: "/images/hobbies/got.jpg",
      rating: "Elite",
      genre: "RPG & Strategy",
      description: "Dedicated gamer with a passion for complex storylines and strategic gameplay",
      favoriteGame: "Ghost Of Tsushima",
      platform: "PC Master Race",
      quote: "We end this together! Yuna.",
      yearStarted: "2010"
    },
    {
      title: "Photography",
      image: "/images/hobbies/photography.jpg",
      rating: "Amateur+",
      genre: "Street & Nature",
      description: "Capturing moments and perspectives that tell unique stories through the lens",
      favoriteCamera: "Sony A7III",
      bestLocation: "Northern Areas",
      quote: "The best camera is the one you have with you",
      yearStarted: "2019"
    },
    {
      title: "Reading",
      image: "/images/hobbies/reading.jpg",
      rating: "Bookworm",
      genre: "History & Science",
      description: "History is the best storyteller and science is the best teacher",
      favoriteBook: "The History of the World",
      readingPace: "12 Books/Year",
      quote: "Knowledge is power, and books are the battery",
      yearStarted: "2015"
    },
    {
      title: "Music",
      image: "/images/hobbies/musice.jpg",
      rating: "Enthusiast",
      genre: "Pop & Rock",
      description: "Music is the way to code yourself out of bugs",
      favoriteBand: "The Weeknd",
      instrument: "Guitar",
      quote: "I tried to find love, in someone else too many times.",
      yearStarted: "2016"
    }
  ],
  funFacts: [
    {
      fact: "I've written over 100,000 lines of code",
      icon: "💻",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      fact: "I debug with rubber ducks",
      icon: "🦆",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      fact: "I can type at 120 WPM",
      icon: "⚡",
      gradient: "from-green-500 to-teal-500"
    },
    {
      fact: "I sleep exactly 6 hours a day",
      icon: "😴",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      fact: "I consume 3000+ calories daily",
      icon: "🍔",
      gradient: "from-red-500 to-pink-500"
    },
    {
      fact: "I've solved 500+ LeetCode problems",
      icon: "🧩",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      fact: "I drink 4 liters of water daily",
      icon: "💧",
      gradient: "from-sky-500 to-blue-500"
    },
    {
      fact: "I can do 50 push-ups in one go",
      icon: "💪",
      gradient: "from-orange-500 to-red-500"
    }
  ]
}

// Update the tabs order in MoreAboutMeSection
const tabs = ["anime", "hobbies", "fun facts"]

// Add this new component for the terminal
function AnimeTerminal() {
  const [currentLine, setCurrentLine] = useState(0)
  const commands = [
    "ani-cli",
    "Searching for Hunter X Hunter...",
    "Multiple results found:",
    "1. Hunter x Hunter (2011)",
    "2. Hunter x Hunter (1999)",
    "Enter choice: 1",
    "Selected: Hunter x Hunter (2011)",
    "Episodes: 148",
    "Select episode [1-148]: 1",
    "Loading episode 1...",
    "Playing episode in your default player...",
    "Enjoy watching! 🎬"
  ]

  useEffect(() => {
    if (currentLine < commands.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentLine])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 rounded-xl overflow-hidden"
    >
      <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 border-b border-neutral-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-neutral-400">ani-cli terminal</span>
        </div>

        {/* Terminal Content */}
        <div className="p-4 font-mono text-sm">
        <div className="space-y-2">
            {commands.slice(0, currentLine + 1).map((command, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex"
              >
                <span className="text-green-500 mr-2">$</span>
                <TypewriterText text={command} delay={30} />
              </motion.div>
            ))}
          </div>
          <motion.div
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-purple-500 ml-2"
          />
        </div>
      </div>
    </motion.div>
  )
}

// Add this component for the typewriter effect
function TypewriterText({ text, delay }: { text: string; delay: number }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, delay])

  return (
    <span className={cn(
      "text-neutral-200",
      text.startsWith("Searching") && "text-yellow-400",
      text.startsWith("Selected") && "text-green-400",
      text.startsWith("Loading") && "text-blue-400",
      text.startsWith("Playing") && "text-purple-400",
      text.startsWith("Enjoy") && "text-green-400 font-bold"
    )}>
      {displayText}
    </span>
  )
}

function MoreAboutMeSection() {
  const [activeTab, setActiveTab] = useState("anime")

  return (
    <div className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.15),transparent_80%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            More About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Me
            </span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Beyond coding, I'm a person with diverse interests and passions
          </p>
        </motion.div>

        {/* Interactive Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-neutral-900/50 text-neutral-400 hover:text-white"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "hobbies" && (
            <motion.div
              key="hobbies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {personalInterests.hobbies.map((hobby, idx) => (
                <HobbyCard key={hobby.title} hobby={hobby} idx={idx} />
              ))}
            </motion.div>
          )}

          {activeTab === "anime" && (
            <motion.div
              key="anime"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {personalInterests.animes.map((anime, idx) => (
                  <AnimeCard key={anime.title} anime={anime} idx={idx} />
                ))}
      </div>

              {/* Add the terminal section */}
              <div className="max-w-3xl mx-auto">
                <div className="text-center space-y-4 mb-8">
                  <h3 className="text-2xl font-bold">
                    How I Watch Anime
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                      {" "}via Terminal
                    </span>
                  </h3>
                  <p className="text-neutral-400">
                    Using ani-cli, a CLI tool to stream anime from the terminal
                  </p>
                </div>
                <AnimeTerminal />
              </div>
            </motion.div>
          )}

          {activeTab === "fun facts" && (
            <motion.div
              key="funFacts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {personalInterests.funFacts.map((fact, idx) => (
                <motion.div
                  key={fact.fact}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{fact.icon}</span>
                    <p className="text-neutral-300 group-hover:text-white transition-colors">
                      {fact.fact}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function AnimeCard({ anime, idx }: { anime: typeof personalInterests.animes[0], idx: number }) {
  return (
    <motion.div
      key={anime.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -10 }}
        className="relative rounded-xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm border border-neutral-800"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={idx < 2} // Prioritize loading first two images
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="px-2 py-1 rounded-full bg-yellow-500/90 backdrop-blur-sm text-xs font-bold text-white flex items-center gap-1"
            >
              ★ {anime.rating}
            </motion.div>
            <div className="px-2 py-1 rounded-full bg-purple-500/90 backdrop-blur-sm text-xs font-medium text-white">
              {anime.yearWatched}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500">
              {anime.title}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-400">{anime.genre}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-neutral-400">{anime.description}</p>
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <div className="text-sm">
                <span className="text-neutral-500">Favorite Character: </span>
                <span className="text-white font-medium">{anime.favoriteChar}</span>
              </div>
              <div className="text-sm">
                <span className="text-neutral-500">Best Arc: </span>
                <span className="text-white font-medium">{anime.bestArc}</span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="pt-4 border-t border-neutral-800">
            <p className="text-sm text-neutral-400 italic">
              "{anime.quote}"
            </p>
          </div>
        </div>

        {/* Enhanced Hover Effects */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-500/20 transition-all duration-300" />
      </motion.div>
    </motion.div>
  )
}

// Add this new component for hobbies
function HobbyCard({ hobby, idx }: { hobby: typeof personalInterests.hobbies[0], idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -10 }}
        className="relative rounded-xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm border border-neutral-800"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={hobby.image}
            alt={hobby.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={idx < 2}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="px-2 py-1 rounded-full bg-purple-500/90 backdrop-blur-sm text-xs font-bold text-white flex items-center gap-1"
            >
              {hobby.rating}
            </motion.div>
            <div className="px-2 py-1 rounded-full bg-blue-500/90 backdrop-blur-sm text-xs font-medium text-white">
              {hobby.yearStarted}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500">
              {hobby.title}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-400">{hobby.genre}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-neutral-400">{hobby.description}</p>
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              {hobby.favoriteGame && (
                <div className="text-sm">
                  <span className="text-neutral-500">Favorite Game: </span>
                  <span className="text-white font-medium">{hobby.favoriteGame}</span>
                </div>
              )}
              {hobby.favoriteCamera && (
                <div className="text-sm">
                  <span className="text-neutral-500">Camera: </span>
                  <span className="text-white font-medium">{hobby.favoriteCamera}</span>
                </div>
              )}
              {hobby.favoriteBook && (
                <div className="text-sm">
                  <span className="text-neutral-500">Favorite Book: </span>
                  <span className="text-white font-medium">{hobby.favoriteBook}</span>
                </div>
              )}
              {hobby.favoriteBand && (
                <div className="text-sm">
                  <span className="text-neutral-500">Favorite Band: </span>
                  <span className="text-white font-medium">{hobby.favoriteBand}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quote */}
          <div className="pt-4 border-t border-neutral-800">
            <p className="text-sm text-neutral-400 italic">
              "{hobby.quote}"
            </p>
          </div>
        </div>

        {/* Enhanced Hover Effects */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-500/20 transition-all duration-300" />
      </motion.div>
    </motion.div>
  )
}

export default function AboutPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    setMousePosition({ x: clientX - 25, y: clientY - 25 })
  }

  return (
    <main className="bg-black text-white pt-20" onMouseMove={handleMouseMove}>
      <MovingCat mousePosition={mousePosition} />
      <AboutHeroSection />
      <FunFactsTicker />
      <CoreValuesSection />
      <MoreAboutMeSection />
      <SkillsSection />
      <InterestsSection />
      <CTASection />
    </main>
  )
}