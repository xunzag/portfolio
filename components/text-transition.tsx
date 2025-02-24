"use client"

import { motion, AnimatePresence } from "framer-motion"

interface TextTransitionProps {
  text: string
}

export function TextTransition({ text }: TextTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl text-neutral-400"
      >
        {text}
      </motion.div>
    </AnimatePresence>
  )
}

