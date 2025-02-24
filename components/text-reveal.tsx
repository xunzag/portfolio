"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealProps {
  text: string
  className?: string
}

export function TextReveal({ text, className }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        variants={{
          hidden: { y: "100%" },
          visible: {
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.33, 1, 0.68, 1],
            },
          },
        }}
        initial="hidden"
        animate={controls}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0 blur-3xl" />
        <div className="relative">{text}</div>
      </motion.div>
    </div>
  )
}

