"use client"

import { motion } from "motion/react"

export function Reveal({ children, i = 0, className }: { children: React.ReactNode; i?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-ink/80">{children}</span>
}

export function Label({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{children}</h3>
}
