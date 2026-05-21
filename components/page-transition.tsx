"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

/* ── Glitch overlay that fires on route change ───────────────── */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [glitching, setGlitching] = useState(false)
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setGlitching(true)
      const t = setTimeout(() => {
        setGlitching(false)
        prevPath.current = pathname
      }, 600)
      return () => clearTimeout(t)
    }
  }, [pathname])

  return (
    <>
      {/* Page content with key-swap for fresh mount */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit  ={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* RGB glitch overlay */}
      <AnimatePresence>
        {glitching && (
          <>
            {/* Red channel */}
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: [0, 0.15, 0.08, 0.2, 0], x: [-8, 6, -4, 8, 0] }}
              transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.7, 1] }}
              className="fixed inset-0 z-[300] pointer-events-none mix-blend-screen"
              style={{ background: "rgba(255,0,80,0.5)" }}
            />
            {/* Cyan channel */}
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: [0, 0.12, 0.06, 0.15, 0], x: [6, -5, 8, -6, 0] }}
              transition={{ duration: 0.5, times: [0, 0.15, 0.45, 0.75, 1] }}
              className="fixed inset-0 z-[300] pointer-events-none mix-blend-screen"
              style={{ background: "rgba(0,255,220,0.4)" }}
            />
            {/* Scan lines flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[299] pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
