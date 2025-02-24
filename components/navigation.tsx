"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/50 backdrop-blur-xl border-b border-neutral-800"
      >
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold gradient-text">
              Farhan Ali
            </Link>

            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm text-neutral-400 hover:text-white transition-colors",
                      "relative after:absolute after:left-0 after:right-0 after:-bottom-1",
                      "after:h-px after:bg-gradient-to-r after:from-purple-500 after:to-transparent",
                      "after:origin-left after:scale-x-0 hover:after:scale-x-100",
                      "after:transition-transform after:duration-300"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </motion.div>
    </header>
  )
}

