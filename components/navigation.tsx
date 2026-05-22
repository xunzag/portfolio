"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { X, Menu } from "lucide-react"

const navItems = [
  { label: "Home",     path: "/",         hint: "~/index"    },
  { label: "About",    path: "/about",    hint: "~/about"    },
  { label: "Projects", path: "/projects", hint: "~/projects" },
  { label: "Contact",  path: "/contact",  hint: "~/contact"  },
]

export function Navigation() {
  const pathname  = usePathname()
  const [scrolled,  setScrolled]  = useState(false)
  const [open,      setOpen]      = useState(false)
  const [blink,     setBlink]     = useState(true)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 pointer-events-none">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto"
      >
        {/* ── Floating pill ── */}
        <div
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            setSpotlight({ x: e.clientX - r.left, y: e.clientY - r.top, visible: true })
          }}
          onMouseLeave={() => setSpotlight(s => ({ ...s, visible: false }))}
          className={cn(
            "relative flex items-center gap-1 px-2 py-2 rounded-2xl",
            "border border-white/[0.08] bg-black/70 backdrop-blur-2xl",
            "transition-all duration-500",
            scrolled
              ? "border-white/[0.14] shadow-[0_0_40px_rgba(139,92,246,0.13),0_8px_40px_rgba(0,0,0,0.55)]"
              : "shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
          )}
        >
          {/* Cursor spotlight */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              opacity: spotlight.visible ? 1 : 0,
              transition: "opacity 0.3s",
              background: `radial-gradient(260px circle at ${spotlight.x}px ${spotlight.y}px, rgba(139,92,246,0.07), transparent 70%)`,
            }}
          />

          {/* ── Logo ── */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors duration-150 flex-shrink-0"
          >
            <span className="font-mono text-[11px] font-bold text-purple-400 leading-none">&lt;</span>
            <span className="font-mono text-[13px] font-bold text-white leading-none tracking-tight">FB</span>
            <span className="font-mono text-[11px] font-bold text-cyan-400 leading-none">/&gt;</span>
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-white/[0.08] mx-1 flex-shrink-0" />

          {/* ── Nav items (desktop) ── */}
          <LayoutGroup>
            <ul className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const active = pathname === item.path
                return (
                  <li key={item.path} className="relative group">
                    {/* Sliding active indicator */}
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 38 }}
                      />
                    )}
                    <Link
                      href={item.path}
                      className={cn(
                        "relative z-10 flex items-center px-4 py-1.5 rounded-xl text-sm font-medium",
                        "transition-colors duration-150",
                        active ? "text-white" : "text-neutral-500 hover:text-neutral-200",
                      )}
                    >
                      {item.label}
                    </Link>
                    {/* Path hint on hover */}
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 select-none">
                      {item.hint}
                    </span>
                  </li>
                )
              })}
            </ul>
          </LayoutGroup>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-white/[0.08] mx-1 flex-shrink-0" />

          {/* ── CTA: hire(me) ── */}
          <Link
            href="/contact"
            className="relative z-10 hidden md:flex items-center px-3.5 py-1.5 rounded-xl font-mono text-sm flex-shrink-0 hover:bg-white/[0.04] transition-colors duration-150"
          >
            <span className="text-purple-400 font-semibold">hire</span>
            <span className="text-neutral-600">(</span>
            <span className="text-cyan-400 text-xs font-normal">me</span>
            <span className="text-neutral-600">)</span>
            <motion.span
              animate={{ opacity: blink ? 1 : 0 }}
              transition={{ duration: 0.05 }}
              className="inline-block w-[2px] h-[13px] bg-purple-400 ml-0.5 rounded-[1px] align-middle"
            />
          </Link>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden relative z-10 flex items-center justify-center w-8 h-8 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors ml-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit   ={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "mt-2 rounded-2xl border border-white/[0.08]",
                "bg-black/80 backdrop-blur-2xl",
                "shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
              )}
            >
              <ul className="p-2 flex flex-col gap-0.5">
                {navItems.map((item, i) => {
                  const active = pathname === item.path
                  return (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0   }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                    >
                      <Link
                        href={item.path}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl",
                          "text-sm font-medium transition-colors duration-150",
                          active
                            ? "bg-white/[0.08] text-white"
                            : "text-neutral-500 hover:bg-white/[0.04] hover:text-white",
                        )}
                      >
                        <span>{item.label}</span>
                        <span className="font-mono text-[10px] text-neutral-700">{item.hint}</span>
                      </Link>
                    </motion.li>
                  )
                })}

                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0   }}
                  transition={{ delay: navItems.length * 0.06, duration: 0.2 }}
                  className="mt-1 pt-1 border-t border-white/[0.06]"
                >
                  <Link
                    href="/contact"
                    className="flex items-center gap-0.5 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors font-mono text-sm"
                  >
                    <span className="text-purple-400 font-semibold">hire</span>
                    <span className="text-neutral-600">(</span>
                    <span className="text-cyan-400 text-xs">me</span>
                    <span className="text-neutral-600">)</span>
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  )
}
