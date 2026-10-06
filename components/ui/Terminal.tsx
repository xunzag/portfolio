"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion } from "motion/react"
import { scrollBus, useRoom } from "@/lib/store"
import { sections, type Section } from "@/lib/acts"
import { animes, experience, profile, projects, skillGroups } from "@/lib/content"

const C = ({ c, children }: { c: string; children: ReactNode }) => <span className={c}>{children}</span>

type Out = ReactNode | "__CLEAR__" | null

const HELP: [string, string][] = [
  ["help", "this list"],
  ["whoami", "who is this guy?"],
  ["neofetch", "system info, the good stuff"],
  ["ls", "list projects"],
  ["open <work|about|stack|life|contact>", "fly somewhere"],
  ["skills", "technical skills tree"],
  ["git log", "career history"],
  ["anime", "current rankings"],
  ["lights", "toggle the monitor light"],
  ["party", "…you'll see"],
  ["sudo hire farhan", "you know you want to"],
  ["clear", "clear the screen"],
  ["exit", "close the terminal"],
]

function run(raw: string): Out {
  const cmd = raw.trim().replace(/\s+/g, " ")
  const lower = cmd.toLowerCase()
  const s = useRoom.getState()
  const goto = (id: Section) => {
    s.setTerminal(false)
    const sec = sections.find((x) => x.id === id)
    if (sec) scrollBus.to(sec.id)
  }

  if (!lower) return null
  if (lower === "help")
    return (
      <div>
        <C c="text-amber">Available commands</C>
        {HELP.map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <span className="w-56 shrink-0 text-cyan">{k}</span>
            <span className="text-muted">{v}</span>
          </div>
        ))}
        <p className="mt-1 text-muted">psst… there are hidden commands. try things.</p>
      </div>
    )
  if (lower === "whoami")
    return (
      <div>
        <C c="font-bold text-ink">{profile.name.toLowerCase()}</C> — {profile.role.toLowerCase()}
        <br />
        <C c="text-muted">{profile.tagline}</C>
        <br />
        <C c="text-cyan">github</C> {profile.socials.github.replace("https://", "")} · <C c="text-cyan">mail</C> {profile.email}
      </div>
    )
  if (lower === "neofetch")
    return (
      <div className="flex gap-6">
        <pre className="text-violet">{`   ▄▀▀▀▄
  █ ◉ ◉ █
  █  ▽  █
   ▀▄▄▄▀
  ▄█████▄`}</pre>
        <div>
          <C c="font-bold text-violet">farhan</C>@<C c="font-bold text-violet">eclipse</C>
          <br />
          ─────────────────
          {[
            ["OS", "Coffee-Powered Linux 6.9"],
            ["Host", "Pakistan 🇵🇰"],
            ["Uptime", "2+ years in production"],
            ["Shell", "zsh + too many aliases"],
            ["Editor", "VS Code (neovim on weekends)"],
            ["Packages", "50+ projects shipped"],
            ["GPU", "RGB (the fans in the corner)"],
          ].map(([k, v]) => (
            <div key={k}>
              <C c="text-violet">{k}</C>: {v}
            </div>
          ))}
        </div>
      </div>
    )
  if (lower === "ls" || lower === "ls -la" || lower === "ls projects")
    return (
      <div>
        {projects.map((p) => (
          <div key={p.slug}>
            <C c="text-cyan">drwxr-xr-x</C> farhan {p.year} <C c="font-semibold text-ink">{p.slug}/</C> <C c="text-muted"># {p.tagline}</C>
          </div>
        ))}
      </div>
    )
  if (lower.startsWith("open ") || lower.startsWith("cd ")) {
    const arg = lower.split(" ")[1]
    const alias: Record<string, Section> = { stack: "skills", arsenal: "skills", projects: "work", hobbies: "life", anime: "life", hire: "contact" }
    const target = (alias[arg] ?? arg) as Section
    if (sections.some((x) => x.id === target)) {
      setTimeout(() => goto(target), 250)
      return <C c="text-mint">→ flying to {target}…</C>
    }
    return <C c="text-red-400">no such place: {arg}</C>
  }
  if (lower === "skills")
    return (
      <div>
        {skillGroups.map((g) => (
          <div key={g.name}>
            <C c="text-violet">├── {g.name}</C>
            {g.items.map((i) => (
              <div key={i.name}>
                │   ├── {i.name.padEnd(20, " ")} <C c="text-mint">{"█".repeat(Math.round(i.level / 10))}</C>
                <C c="text-white/20">{"░".repeat(10 - Math.round(i.level / 10))}</C> {i.level}%
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  if (lower === "git log" || lower === "git log --oneline")
    return (
      <div>
        {experience.map((e) => (
          <div key={e.hash}>
            <C c="text-amber">commit {e.hash}</C> {e.active && <C c="text-cyan">(HEAD → main)</C>}
            <br />
            <span className="pl-4">
              {e.role} @ {e.company} <C c="text-muted">({e.period})</C>
            </span>
          </div>
        ))}
      </div>
    )
  if (lower === "anime")
    return (
      <div>
        {[...animes]
          .sort((a, b) => +b.rating - +a.rating)
          .map((a, i) => (
            <div key={a.title}>
              {i + 1}. <C c="text-ink">{a.title.padEnd(18, " ")}</C> <C c="text-amber">★ {a.rating}</C> <C c="text-muted">— {a.fav}</C>
            </div>
          ))}
      </div>
    )
  if (lower === "lights" || lower === "lights off" || lower === "lights on") {
    s.toggleLights()
    return <C c="text-amber">💡 monitor {useRoom.getState().lightsOn ? "on" : "off"}</C>
  }
  if (lower === "party" || lower === "disco") {
    s.setParty(!s.party)
    return <C c="text-amber">{s.party ? "party's over. back to work." : "🪩 PARTY MODE ENGAGED"}</C>
  }
  if (lower === "sudo hire farhan") {
    setTimeout(() => goto("contact"), 1200)
    return (
      <div>
        <C c="text-mint">[sudo] password accepted.</C>
        <br />
        Checking availability… <C c="text-mint">available ✓</C>
        <br />
        Opening a direct line…
      </div>
    )
  }
  if (lower === "hire farhan") return <span>Permission denied. Try <C c="text-cyan">sudo hire farhan</C></span>
  if (lower === "rm -rf /" || lower === "sudo rm -rf /") return <C c="text-red-400">Nice try. The eclipse is load-bearing. 😄</C>
  if (lower === "coffee" || lower === "chai") return <C c="text-amber">☕ brewing… ahh. ready to ship.</C>
  if (lower === "duck" || lower === "quack") return <C c="text-amber">🦆 “Have you tried explaining it to me line by line?”</C>
  if (lower === "vim") return <span>You are now trapped in vim. <C c="text-muted">(type exit — we&apos;re merciful)</C></span>
  if (lower === "date") return new Date().toString()
  if (lower === "pwd") return "/home/farhan/eclipse"
  if (lower === "clear" || lower === "cls") return "__CLEAR__"
  if (lower === "exit") {
    setTimeout(() => s.setTerminal(false), 150)
    return <C c="text-muted">logout</C>
  }
  if (lower.startsWith("echo ")) return cmd.slice(5)
  return (
    <span>
      <C c="text-red-400">command not found:</C> {cmd}. Type <C c="text-cyan">help</C>.
    </span>
  )
}

const WELCOME = (
  <div>
    <C c="font-bold text-mint">farhan-os terminal v2.0</C>
    <br />
    <C c="text-muted">
      type <C c="text-cyan">help</C> to start · <C c="text-cyan">esc</C> to close
    </C>
  </div>
)

export function Terminal() {
  const [lines, setLines] = useState<{ id: number; cmd?: string; out: ReactNode }[]>([{ id: 0, out: WELCOME }])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const id = useRef(1)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" })
  }, [lines])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const out = run(input)
    if (input.trim()) setHistory((h) => [input, ...h].slice(0, 50))
    setHi(-1)
    if (out === "__CLEAR__") setLines([])
    else setLines((l) => [...l, { id: id.current++, cmd: input, out }])
    setInput("")
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const n = Math.min(hi + 1, history.length - 1)
      if (n >= 0) {
        setHi(n)
        setInput(history[n])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const n = hi - 1
      setHi(n)
      setInput(n >= 0 ? history[n] : "")
    } else if (e.key === "Tab") {
      e.preventDefault()
      const match = HELP.map(([k]) => k.split(" <")[0]).find((k) => k.startsWith(input.toLowerCase()))
      if (match && input) setInput(match)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 20 }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      className="absolute inset-x-3 bottom-3 z-40 mx-auto flex h-[min(460px,70dvh)] max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0916]/95 shadow-2xl backdrop-blur sm:bottom-8"
      role="dialog"
      aria-label="Terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <button aria-label="Close terminal" onClick={() => useRoom.getState().setTerminal(false)} className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center font-mono text-[11px] text-muted">farhan@eclipse: ~</span>
      </div>
      <div className="scroll-thin flex-1 overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed text-ink/85">
        {lines.map((l) => (
          <div key={l.id} className="mb-2 whitespace-pre-wrap">
            {l.cmd !== undefined && (
              <div>
                <span className="text-mint">➜</span> <span className="text-cyan">~</span> {l.cmd}
              </div>
            )}
            {l.out}
          </div>
        ))}
        <form onSubmit={submit} className="flex items-center gap-2">
          <span className="text-mint">➜</span> <span className="text-cyan">~</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="flex-1 bg-transparent text-ink caret-violet outline-none"
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
        <div ref={bottom} />
      </div>
    </motion.div>
  )
}
