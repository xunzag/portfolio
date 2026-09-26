import * as THREE from "three"

function canvas(w: number, h: number) {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  return [c, c.getContext("2d")!] as const
}

function finish(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

// Seeded PRNG so the room looks identical on every visit.
export function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

export function woodTexture() {
  const [c, g] = canvas(512, 512)
  const r = rng(7)
  const rows = 8
  const h = 512 / rows
  for (let i = 0; i < rows; i++) {
    let x = -r() * 200
    while (x < 512) {
      const w = 180 + r() * 220
      const l = 22 + r() * 8
      g.fillStyle = `hsl(${22 + r() * 8} 38% ${l}%)`
      g.fillRect(x, i * h, w, h)
      // grain
      g.globalAlpha = 0.08
      for (let k = 0; k < 7; k++) {
        g.fillStyle = r() > 0.5 ? "#000" : "#fff"
        g.fillRect(x, i * h + r() * h, w, 1 + r() * 2)
      }
      g.globalAlpha = 1
      g.fillStyle = "rgba(0,0,0,0.55)"
      g.fillRect(x, i * h, 2, h)
      x += w
    }
    g.fillStyle = "rgba(0,0,0,0.6)"
    g.fillRect(0, i * h, 512, 2)
  }
  const t = finish(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2.5, 2.5)
  return t
}

export function rugTexture() {
  const [c, g] = canvas(512, 512)
  const grd = g.createRadialGradient(256, 256, 0, 256, 256, 256)
  grd.addColorStop(0, "#4b3a86")
  grd.addColorStop(1, "#2a2150")
  g.fillStyle = grd
  g.fillRect(0, 0, 512, 512)
  g.strokeStyle = "rgba(255,255,255,0.12)"
  for (let i = 1; i < 9; i++) {
    g.lineWidth = i % 3 === 0 ? 6 : 2
    g.beginPath()
    g.arc(256, 256, i * 28, 0, Math.PI * 2)
    g.stroke()
  }
  return finish(c)
}

export function neonSignTexture(text: string, sub: string) {
  const [c, g] = canvas(1024, 256)
  g.clearRect(0, 0, 1024, 256)
  g.textAlign = "center"
  g.textBaseline = "middle"
  const draw = (color: string, blur: number, width: number) => {
    g.shadowColor = color
    g.shadowBlur = blur
    g.strokeStyle = color
    g.lineWidth = width
    g.font = "italic 700 112px 'Brush Script MT', 'Segoe Script', cursive"
    g.strokeText(text, 512, 110)
    g.font = "600 34px ui-monospace, monospace"
    g.lineWidth = width * 0.6
    g.strokeText(sub, 512, 205)
  }
  draw("#ff4fd8", 40, 10)
  draw("#ffc3f3", 10, 4)
  draw("#ffffff", 0, 1.5)
  return finish(c)
}

// ── Monitor screen ────────────────────────────────────────────────

const CODE = [
  ["k", "import "], ["t", "{ Developer } "], ["k", "from "], ["s", "\"@/life\""], ["n", ""],
  ["n", ""],
  ["k", "const "], ["v", "farhan"], ["t", ": Developer = {"], ["n", ""],
  ["p", "  name: "], ["s", "\"Farhan Babar\""], ["t", ","], ["n", ""],
  ["p", "  role: "], ["s", "\"Full Stack Developer\""], ["t", ","], ["n", ""],
  ["p", "  stack: "], ["t", "["], ["s", "\"React\", \"Next.js\", \"Node\", \"TS\""], ["t", "],"], ["n", ""],
  ["p", "  based: "], ["s", "\"Pakistan 🇵🇰\""], ["t", ","], ["n", ""],
  ["p", "  fuel: "], ["s", "\"chai + lo-fi\""], ["t", ","], ["n", ""],
  ["p", "  shipped: "], ["m", "50"], ["t", ","], ["n", ""],
  ["t", "}"], ["n", ""],
  ["n", ""],
  ["c", "// click the monitor to see what I've built →"], ["n", ""],
  ["k", "export default "], ["f", "hire"], ["t", "(farhan)"], ["n", ""],
] as const

const COLORS: Record<string, string> = {
  k: "#c792ea", t: "#d6deeb", s: "#ecc48d", v: "#82aaff", p: "#7fdbca", m: "#f78c6c", c: "#637777", f: "#82aaff", n: "#fff",
}

export type ScreenPainter = {
  texture: THREE.CanvasTexture
  paintCode: (dt: number) => void
  paintImage: (img: HTMLImageElement, url: string, accent: string, reveal?: number) => void
}

export function createScreen(): ScreenPainter {
  const W = 1024
  const H = 540
  const [c, g] = canvas(W, H)
  const texture = finish(c)
  let chars = 0
  let acc = 0
  const total = CODE.reduce((n, [, s]) => n + Math.max(s.length, 1), 0)

  const chrome = (title: string) => {
    g.fillStyle = "#011627"
    g.fillRect(0, 0, W, H)
    g.fillStyle = "#0b2338"
    g.fillRect(0, 0, W, 38)
    ;["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
      g.fillStyle = col
      g.beginPath()
      g.arc(22 + i * 22, 19, 7, 0, Math.PI * 2)
      g.fill()
    })
    g.fillStyle = "#8fa6c0"
    g.font = "500 17px ui-monospace, monospace"
    g.textAlign = "center"
    g.fillText(title, W / 2, 25)
    g.textAlign = "left"
  }

  return {
    texture,
    paintCode(dt) {
      acc += dt
      if (acc < 0.05) return
      acc = 0
      chars = chars > total + 60 ? 0 : chars + 2
      chrome("farhan.ts — ~/portfolio")
      // gutter
      g.fillStyle = "#0a1d30"
      g.fillRect(0, 38, 56, H - 38)
      g.font = "500 22px ui-monospace, monospace"
      let x = 76
      let y = 78
      let line = 1
      let budget = chars
      g.fillStyle = "#3b5673"
      g.fillText(String(line).padStart(2, " "), 14, y)
      for (const [kind, str] of CODE) {
        if (budget <= 0) break
        if (kind === "n") {
          y += 32
          x = 76
          line++
          budget--
          g.fillStyle = "#3b5673"
          g.fillText(String(line).padStart(2, " "), 14, y)
          continue
        }
        const part = str.slice(0, budget)
        budget -= str.length
        g.fillStyle = COLORS[kind]
        g.fillText(part, x, y)
        x += g.measureText(part).width
      }
      // caret
      if (Math.floor(performance.now() / 450) % 2 === 0) {
        g.fillStyle = "#82aaff"
        g.fillRect(x + 2, y - 20, 11, 26)
      }
      // status bar
      g.fillStyle = "#6e56cf"
      g.fillRect(0, H - 28, W, 28)
      g.fillStyle = "#fff"
      g.font = "500 15px ui-monospace, monospace"
      g.fillText("⎇ main   ✓ 0 problems   TypeScript   Ln " + line, 14, H - 9)
      texture.needsUpdate = true
    },
    paintImage(img, url, accent, reveal = 1) {
      chrome("")
      // url bar
      g.fillStyle = "#12304b"
      g.beginPath()
      g.roundRect(W / 2 - 220, 8, 440, 22, 11)
      g.fill()
      g.fillStyle = "#b5c7da"
      g.font = "500 14px ui-monospace, monospace"
      g.textAlign = "center"
      g.fillText("🔒 " + url, W / 2, 24)
      g.textAlign = "left"
      const ar = img.width / img.height
      const bw = W
      const bh = H - 38
      let dw = bw
      let dh = bw / ar
      if (dh < bh) {
        dh = bh
        dw = bh * ar
      }
      g.save()
      g.beginPath()
      g.rect(0, 38, bw, bh)
      g.clip()
      g.drawImage(img, (bw - dw) / 2, 38, dw, dh)
      g.restore()
      g.fillStyle = accent
      g.fillRect(0, 38, W, 3)
      if (reveal < 1) {
        // scanline wipe: dark below the beam, a hot line at the edge
        const y = 38 + (H - 38) * reveal
        g.fillStyle = "#010812"
        g.fillRect(0, y, W, H - y)
        const beam = g.createLinearGradient(0, y - 24, 0, y + 4)
        beam.addColorStop(0, "rgba(130,170,255,0)")
        beam.addColorStop(1, accent)
        g.fillStyle = beam
        g.fillRect(0, y - 24, W, 28)
      }
      texture.needsUpdate = true
    },
  }
}

export function phoneTexture() {
  const [c, g] = canvas(256, 512)
  const grd = g.createLinearGradient(0, 0, 0, 512)
  grd.addColorStop(0, "#2b1d5c")
  grd.addColorStop(1, "#0d0b22")
  g.fillStyle = grd
  g.fillRect(0, 0, 256, 512)
  g.fillStyle = "#fff"
  g.textAlign = "center"
  g.font = "300 64px system-ui, sans-serif"
  g.fillText(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), 128, 120)
  g.font = "500 16px system-ui, sans-serif"
  g.fillStyle = "#b9b3e6"
  g.fillText("tap to get in touch", 128, 150)
  // notification bubble
  g.fillStyle = "rgba(255,255,255,0.14)"
  g.beginPath()
  g.roundRect(18, 200, 220, 92, 18)
  g.fill()
  g.textAlign = "left"
  g.fillStyle = "#3ee39a"
  g.font = "700 15px system-ui, sans-serif"
  g.fillText("● New message", 34, 230)
  g.fillStyle = "#fff"
  g.font = "500 16px system-ui, sans-serif"
  g.fillText("“Got a project for you —", 34, 256)
  g.fillText("  are you free?”", 34, 278)
  // call button
  g.fillStyle = "#3ee39a"
  g.beginPath()
  g.arc(128, 430, 36, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = "#0d0b22"
  g.font = "700 30px system-ui, sans-serif"
  g.textAlign = "center"
  g.fillText("✉", 128, 441)
  return finish(c)
}

export function spineTexture(title: string, color: string, ink: string) {
  const [c, g] = canvas(64, 448)
  g.fillStyle = color
  g.fillRect(0, 0, 64, 448)
  g.fillStyle = ink
  g.fillRect(0, 24, 64, 3)
  g.fillRect(0, 421, 64, 3)
  g.save()
  g.translate(32, 224)
  g.rotate(Math.PI / 2)
  g.font = "700 26px system-ui, sans-serif"
  g.textAlign = "center"
  g.textBaseline = "middle"
  g.fillText(title, 0, 0)
  g.restore()
  return finish(c)
}
