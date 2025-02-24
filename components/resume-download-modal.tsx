"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Download, Eye, FileText, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ResumeDownloadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeDownloadModal({ isOpen, onClose }: ResumeDownloadModalProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setDownloading(false)
    setDownloaded(true)
    setTimeout(() => {
      setDownloaded(false)
      onClose()
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800 p-6 shadow-2xl">
              {/* Resume Preview */}
              <div className="relative aspect-[3/4] mb-6 rounded-lg overflow-hidden">
                <Image
                  src="/resume-preview.jpg" // Add your resume preview image
                  alt="Resume Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Farhan Ali - Resume</h3>
                    <p className="text-neutral-400">Updated August 2023</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">PDF • 2.1 MB</span>
                    <FileText className="w-4 h-4 text-neutral-500" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleDownload}
                    disabled={downloading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
                      "bg-gradient-to-r from-purple-500 to-blue-500",
                      "text-white font-medium",
                      "hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/50",
                      "transition-all duration-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {downloading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : downloaded ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Resume</span>
                      </>
                    )}
                  </motion.button>

                  <motion.a
                    href="/resume.pdf" // Add your actual resume PDF
                    target="_blank"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
                      "bg-neutral-800/50",
                      "text-white font-medium",
                      "hover:bg-neutral-700/50",
                      "transition-all duration-300"
                    )}
                  >
                    <Eye className="w-5 h-5" />
                    <span>Preview</span>
                  </motion.a>
                </div>

                {/* Available Formats */}
                <div className="pt-4 border-t border-neutral-800">
                  <p className="text-sm text-neutral-400 mb-2">Available Formats:</p>
                  <div className="flex gap-2">
                    {["PDF", "DOCX", "TXT"].map((format) => (
                      <span
                        key={format}
                        className="px-2 py-1 rounded-md bg-neutral-800/50 text-xs text-neutral-400"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 