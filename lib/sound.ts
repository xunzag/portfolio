// Procedural sound: no audio files. Everything is synthesised with WebAudio the
// first time the visitor turns sound on (browsers need a click for that).
//  - wind + a slow pad under the whole journey
//  - an engine note that follows the car
//  - an original synthwave loop that opens up in the off-the-clock world

const BPM = 104
const STEP = 60 / BPM / 4 // one sixteenth
// A minor → F → C → G, one bar each (MIDI roots)
const ROOTS = [45, 41, 48, 43]
const CHORDS = [
  [57, 60, 64],
  [57, 60, 65],
  [55, 60, 64],
  [55, 59, 62],
]
const ARP = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1, 2, 1, 0, 2]
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

type Bus = {
  ctx: AudioContext
  master: GainNode
  music: GainNode
  drums: GainNode
  engine: { gain: GainNode; a: OscillatorNode; b: OscillatorNode; lp: BiquadFilterNode }
  noise: AudioBuffer
  t0: number
  step: number
}

let bus: Bus | null = null
let on = false
let timer: ReturnType<typeof setInterval> | null = null
const listeners = new Set<(v: boolean) => void>()

function noiseBuffer(ctx: AudioContext) {
  const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const d = b.getChannelData(0)
  let last = 0
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1
    last = (last + 0.02 * w) / 1.02
    d[i] = last * 3 + w * 0.12
  }
  return b
}

function boot(): Bus {
  const ctx = new AudioContext()
  const master = ctx.createGain()
  master.gain.value = 0
  const comp = ctx.createDynamicsCompressor()
  master.connect(comp).connect(ctx.destination)
  const noise = noiseBuffer(ctx)

  // wind
  const wind = ctx.createBufferSource()
  wind.buffer = noise
  wind.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = 420
  bp.Q.value = 0.6
  const windGain = ctx.createGain()
  windGain.gain.value = 0.16
  const gust = ctx.createOscillator()
  gust.frequency.value = 0.09
  const gustAmt = ctx.createGain()
  gustAmt.gain.value = 260
  gust.connect(gustAmt).connect(bp.frequency)
  gust.start()
  wind.connect(bp).connect(windGain).connect(master)
  wind.start()

  // engine: two detuned saws through a low-pass
  const eg = ctx.createGain()
  eg.gain.value = 0
  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.value = 300
  lp.Q.value = 4
  const a = ctx.createOscillator()
  const b = ctx.createOscillator()
  a.type = b.type = "sawtooth"
  a.frequency.value = 52
  b.frequency.value = 78.5
  a.connect(lp)
  b.connect(lp)
  lp.connect(eg).connect(master)
  a.start()
  b.start()

  const music = ctx.createGain()
  music.gain.value = 0.22
  const drums = ctx.createGain()
  drums.gain.value = 0
  // a short feedback delay gives the arp its 80s shimmer
  const delay = ctx.createDelay(1)
  delay.delayTime.value = STEP * 3
  const fb = ctx.createGain()
  fb.gain.value = 0.32
  music.connect(delay).connect(fb).connect(delay)
  delay.connect(master)
  music.connect(master)
  drums.connect(master)
  return { ctx, master, music, drums, engine: { gain: eg, a, b, lp }, noise, t0: ctx.currentTime + 0.1, step: 0 }
}

function tone(b: Bus, out: AudioNode, type: OscillatorType, f: number, at: number, dur: number, vol: number, cutoff: number) {
  const o = b.ctx.createOscillator()
  const g = b.ctx.createGain()
  const lp = b.ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.setValueAtTime(cutoff, at)
  lp.frequency.exponentialRampToValueAtTime(Math.max(120, cutoff * 0.25), at + dur)
  o.type = type
  o.frequency.value = f
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(vol, at + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  o.connect(lp).connect(g).connect(out)
  o.start(at)
  o.stop(at + dur + 0.02)
}

function schedule(b: Bus) {
  while (b.t0 + b.step * STEP < b.ctx.currentTime + 0.3) {
    const at = b.t0 + b.step * STEP
    const s16 = b.step % 16
    const bar = Math.floor(b.step / 16) % 4
    // bass on the eighths
    if (s16 % 2 === 0) tone(b, b.music, "sawtooth", hz(ROOTS[bar] - 12), at, STEP * 1.7, 0.5, 520)
    // arp on the sixteenths
    tone(b, b.music, "square", hz(CHORDS[bar][ARP[s16]] + 12), at, STEP * 0.9, 0.11, 2600)
    // pad once a bar
    if (s16 === 0) for (const n of CHORDS[bar]) tone(b, b.music, "sawtooth", hz(n), at, STEP * 16, 0.07, 900)
    // drums (only audible in the off-the-clock world)
    if (s16 % 4 === 0) {
      const o = b.ctx.createOscillator()
      const g = b.ctx.createGain()
      o.frequency.setValueAtTime(120, at)
      o.frequency.exponentialRampToValueAtTime(42, at + 0.14)
      g.gain.setValueAtTime(0.9, at)
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.26)
      o.connect(g).connect(b.drums)
      o.start(at)
      o.stop(at + 0.3)
    }
    if (s16 === 4 || s16 === 12) {
      const n = b.ctx.createBufferSource()
      n.buffer = b.noise
      const hp = b.ctx.createBiquadFilter()
      hp.type = "highpass"
      hp.frequency.value = 1800
      const g = b.ctx.createGain()
      g.gain.setValueAtTime(0.9, at)
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.2)
      n.connect(hp).connect(g).connect(b.drums)
      n.start(at, Math.random())
      n.stop(at + 0.22)
    }
    b.step++
  }
}

export const sound = {
  get on() {
    return on
  },
  subscribe(cb: (v: boolean) => void) {
    listeners.add(cb)
    return () => void listeners.delete(cb)
  },
  toggle() {
    if (!bus) bus = boot()
    on = !on
    const t = bus.ctx.currentTime
    if (on) bus.ctx.resume()
    bus.master.gain.cancelScheduledValues(t)
    bus.master.gain.setTargetAtTime(on ? 0.9 : 0, t, 0.5)
    if (on && !timer) {
      // restart the grid from "now" so nothing bunches up after a pause
      bus.t0 = t + 0.1
      bus.step = 0
      const b = bus
      timer = setInterval(() => on && schedule(b), 90)
    }
    if (!on && timer) {
      clearInterval(timer)
      timer = null
    }
    listeners.forEach((l) => l(on))
  },
  /** called every frame: how fast the car is going (0..1) and how far into the party we are (0..1) */
  mix(engine: number, party: number) {
    if (!bus || !on) return
    const t = bus.ctx.currentTime
    const e = bus.engine
    e.gain.gain.setTargetAtTime(0.02 + engine * 0.12, t, 0.15)
    e.a.frequency.setTargetAtTime(52 + engine * 75, t, 0.12)
    e.b.frequency.setTargetAtTime(78.5 + engine * 112, t, 0.12)
    e.lp.frequency.setTargetAtTime(280 + engine * 900, t, 0.15)
    bus.music.gain.setTargetAtTime(0.16 + party * 0.3, t, 0.6)
    bus.drums.gain.setTargetAtTime(party * 0.5, t, 0.6)
  },
  /** 0..1 pulse on every beat, for visuals. Follows the audio clock when sound is on. */
  beat(now: number) {
    const beatLen = STEP * 4
    const t = bus && on ? Math.max(0, bus.ctx.currentTime - bus.t0) : now
    const p = (t / beatLen) % 1
    return Math.pow(1 - p, 3)
  },
  tick() {
    if (!bus || !on) return
    tone(bus, bus.master, "sine", 2400, bus.ctx.currentTime, 0.05, 0.03, 6000)
  },
}
