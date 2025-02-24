"use client"

import { motion } from "framer-motion"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ResumeDownloadModal } from "./resume-download-modal"

export function FloatingResumeButton() {
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