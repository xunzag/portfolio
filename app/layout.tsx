import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black`}>
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <Navigation />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  )
}

