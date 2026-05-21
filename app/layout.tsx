import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation }          from "@/components/navigation"
import { LenisProvider }        from "@/components/lenis-provider"
import { CustomCursor }         from "@/components/custom-cursor"
import { SceneWrapper }         from "@/components/scene-wrapper"
import { Terminal }             from "@/components/terminal"
import { PageTransition }       from "@/components/page-transition"
import { CursorTrailWrapper }   from "@/components/cursor-trail-wrapper"
import { CodeRainWrapper }      from "@/components/code-rain-wrapper"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Farhan Babar | Full Stack Developer",
  description:
    "Full Stack Developer specialising in building exceptional digital experiences with modern web technologies.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: { url: "/apple-touch-icon.png" },
  },
  openGraph: {
    title: "Farhan Babar | Full Stack Developer",
    description: "Full Stack Developer specialising in exceptional digital experiences.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head />
      <body className={`${inter.variable} font-sans bg-black text-white antialiased`}>
        <LenisProvider>
          {/* Film grain */}
          <div className="grain" aria-hidden />

          {/* WebGL aurora */}
          <SceneWrapper />

          {/* Code rain — below aurora, very subtle */}
          <CodeRainWrapper />

          {/* Cursor systems */}
          <CustomCursor />
          <CursorTrailWrapper />

          {/* Hidden terminal — Ctrl+` */}
          <Terminal />

          {/* Navigation */}
          <Navigation />

          {/* Page content with glitch transitions */}
          <div className="relative z-10">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </LenisProvider>
      </body>
    </html>
  )
}
