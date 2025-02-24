"use client"

import { motion, useScroll, useTransform } from "framer-motion"

export function AnimatedBackground() {
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