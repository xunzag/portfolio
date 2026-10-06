import type { Metadata, Viewport } from "next"
import { Allura, Cormorant_Garamond, JetBrains_Mono, Noto_Serif_JP, Space_Grotesk } from "next/font/google"
import "./globals.css"

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif-face" })
const script = Allura({ subsets: ["latin"], weight: "400", variable: "--font-script-face" })
const jp = Noto_Serif_JP({ subsets: ["latin"], weight: ["300", "500"], variable: "--font-jp-face", preload: false })

const description =
  "Farhan Ali — full-stack developer, IT & cloud support, aspiring data scientist. A scroll-driven anime film of a portfolio: case files, the arsenal, and an eclipse."

export const metadata: Metadata = {
  title: "Farhan Ali — Full-Stack Developer",
  description,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon-32x32.png", type: "image/png" }],
    apple: { url: "/apple-touch-icon.png" },
  },
  openGraph: {
    title: "Farhan Ali — Full-Stack Developer",
    description,
    type: "website",
    images: [{ url: "/art/hero-sm.webp", width: 1200, height: 676 }],
  },
}

export const viewport: Viewport = {
  themeColor: "#030204",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable} ${script.variable} ${jp.variable}`}>
      <head>
        {/* start the heaviest downloads before any JS runs */}
        <link rel="preload" href="/art/hero.webp" as="image" />
        <link rel="preload" href="/art/hero-depth.webp" as="image" />
        <link rel="preload" href="/models/guts.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
