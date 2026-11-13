import type { Metadata, Viewport } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Farhan Ali — IT Engineer & Full-Stack Developer",
  description:
    "A night drive through Farhan Ali's world: projects on drive-in screens above the clouds, a mechanical eagle for a guide. IT engineer and full-stack developer from Karachi.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon-32x32.png", type: "image/png" }],
    apple: { url: "/apple-touch-icon.png" },
  },
  openGraph: {
    title: "Farhan Ali — IT Engineer & Full-Stack Developer",
    description: "An interactive 3D developer room. Click around.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#07060d",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <head>
        {/* start the heaviest downloads before any JS runs */}
        <link rel="preload" href="/models/guts.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-bold.woff" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
