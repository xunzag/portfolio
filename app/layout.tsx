import type { Metadata, Viewport } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://xunzag.vercel.app"),
  title: "Farhan Ali — IT Engineer & Full-Stack Developer",
  description:
    "A night drive through Farhan Ali's world: projects on drive-in screens above the clouds, a mechanical eagle for a guide. IT engineer and full-stack developer from Karachi.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon-32x32.png", type: "image/png" }],
    apple: { url: "/apple-touch-icon.png" },
  },
  openGraph: {
    title: "Farhan Ali — IT Engineer & Full-Stack Developer",
    description: "A night drive through my work: 3D, scroll-driven, built with three.js.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Farhan Ali - a 3D portfolio" }],
    type: "website",
  },
  // large preview card on X; LinkedIn and WhatsApp read the Open Graph image above
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
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
