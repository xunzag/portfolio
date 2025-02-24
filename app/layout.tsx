import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Farhan Ali | Full Stack Developer",
  description: "Full Stack Developer specializing in building exceptional digital experiences",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/images/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/images/apple-touch-icon.png",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      </head>
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

