"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Home",     href: "/" },
  { name: "About",    href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact",  href: "/contact" },
]

/* ── Magnetic link ───────────────────────────────────────────── */
function MagneticLink({
  href, children, active,
}: { href: string; children: React.ReactNode; active: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width  / 2) * 0.28
    const dy = (e.clientY - rect.top  - rect.height / 2) * 0.28
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "translate(0,0)"
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "relative text-sm font-medium transition-colors duration-200",
        "inline-block",
        "select-none",
        active ? "text-white" : "text-neutral-400 hover:text-white",
      )}
      style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
      {/* Gradient underline */}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-px w-full",
          "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500",
          "origin-left transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0",
          "group-hover:scale-x-100",
        )}
      />
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-px w-full",
          "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500",
          "origin-left transition-transform duration-300 delay-75",
          !active && "scale-x-0",
          !active && "group-hover:scale-x-100",
        )}
      />
    </Link>
  )
}

export function Navigation() {
  const pathname  = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open,    setOpen]    = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* close mobile menu on route change */
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent",
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative flex items-center gap-2">
            <span className="text-lg font-bold gradient-text tracking-tight">
              Farhan.
            </span>
            <span className="absolute -inset-2 rounded-lg bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.name} className="group">
                <MagneticLink href={item.href} active={pathname === item.href}>
                  {item.name}
                  {/* animated underline on hover when not active */}
                  {pathname !== item.href && (
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  )}
                </MagneticLink>
              </li>
            ))}
          </ul>

          {/* CTA button desktop */}
          <Link
            href="/contact"
            className="hidden md:inline-flex btn-primary text-sm py-2 px-5"
          >
            <span>Let's talk</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit ={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/[0.06]"
          >
            <ul className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-base font-medium",
                      pathname === item.href
                        ? "gradient-text"
                        : "text-neutral-400 hover:text-white",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="btn-primary text-sm py-2 px-5 w-fit">
                  <span>Let's talk</span>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
