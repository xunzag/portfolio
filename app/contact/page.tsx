"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mail, Phone, MapPin, MessageSquare, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "farhan.babar123@gmail.com",
    href: "mailto:farhan.babar123@gmail.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+923306226290",
    href: "tel:+923306226290"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Pakistan",
    href: "#"
  }
]

function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Input */}
        <div className="relative group">
          <input
            type="text"
            value={formState.name}
            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            placeholder="Your Name"
            required
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>

        {/* Email Input */}
        <div className="relative group">
          <input
            type="email"
            value={formState.email}
            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            placeholder="Your Email"
            required
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
      </div>

      {/* Message Input */}
      <div className="relative group">
        <textarea
          value={formState.message}
          onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
          rows={5}
          className="w-full px-5 py-4 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
          placeholder="Your Message"
          required
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full px-8 py-4 rounded-xl",
          "bg-gradient-to-r from-purple-500 to-blue-500",
          "text-white font-medium",
          "hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/50",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "relative overflow-hidden"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          ) : isSubmitted ? (
            <Check className="w-6 h-6 mx-auto text-green-500" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  )
}

export default function Contact() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Let's{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                  Connect
                </span>
              </h1>
              <p className="text-xl text-neutral-400">
                Have a project in mind? Let's bring your ideas to life. Feel free to reach out through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-purple-500/50 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 group-hover:from-purple-500/20 group-hover:to-blue-500/20">
                    <info.icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400">{info.label}</div>
                    <div className="text-white font-medium">{info.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  )
}

