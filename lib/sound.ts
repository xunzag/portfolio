// Procedural sound design — no audio files. Everything is synthesised with
// WebAudio the first time the visitor turns sound on (needs a user gesture).

type Bus = { ctx: AudioContext; master: GainNode; heart: GainNode; noise: AudioBuffer }

let bus: Bus | null = null
let on = false
let heartTimer: ReturnType<typeof setInterval> | null = null
const listeners = new Set<(v: boolean) => void>()

function noiseBuffer(ctx: AudioContext, seconds = 2) {
  const b = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const d = b.getChannelData(0)
  let last = 0
  for (let i = 0; i < d.length; i++) {
    // mostly brown noise with a little white on top
    const w = Math.random() * 2 - 1
    last = (last + 0.02 * w) / 1.02
    d[i] = last * 3.2 + w * 0.08
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

  // rain: looping noise through two filters
  const rain = ctx.createBufferSource()
  rain.buffer = noise
  rain.loop = true
  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.value = 1400
  const hiss = ctx.createBiquadFilter()
  hiss.type = "highpass"
  hiss.frequency.value = 3000
  const rainGain = ctx.createGain()
  rainGain.gain.value = 0.22
  const hissGain = ctx.createGain()
  hissGain.gain.value = 0.05
  rain.connect(lp).connect(rainGain).connect(master)
  rain.connect(hiss).connect(hissGain).connect(master)
  rain.start()

  // a low, slowly breathing drone
  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.05
  const droneLp = ctx.createBiquadFilter()
  droneLp.type = "lowpass"
  droneLp.frequency.value = 240
  droneLp.connect(droneGain).connect(master)
  for (const f of [55, 55.35, 82.5]) {
    const o = ctx.createOscillator()
    o.type = "sawtooth"
    o.frequency.value = f
    o.connect(droneLp)
    o.start()
  }
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.07
  const lfoAmt = ctx.createGain()
  lfoAmt.gain.value = 120
  lfo.connect(lfoAmt).connect(droneLp.frequency)
  lfo.start()

  const heart = ctx.createGain()
  heart.gain.value = 0
  heart.connect(master)
  return { ctx, master, heart, noise }
}

function thump(b: Bus, at: number, vol: number) {
  const o = b.ctx.createOscillator()
  const g = b.ctx.createGain()
  o.frequency.setValueAtTime(70, at)
  o.frequency.exponentialRampToValueAtTime(38, at + 0.18)
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(vol, at + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.32)
  o.connect(g).connect(b.heart)
  o.start(at)
  o.stop(at + 0.35)
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
    bus.master.gain.setTargetAtTime(on ? 0.9 : 0, t, 0.6)
    if (on && !heartTimer) {
      // the eclipse's heartbeat (lub-dub every ~3.3s, same period as the shader pulse)
      heartTimer = setInterval(() => {
        if (!bus || !on) return
        const now = bus.ctx.currentTime + 0.05
        thump(bus, now, 0.9)
        thump(bus, now + 0.24, 0.55)
      }, 3307)
    }
    listeners.forEach((l) => l(on))
  },
  /** 0..1 — how loud the heartbeat is right now (set every frame) */
  setHeart(v: number) {
    if (bus && on) bus.heart.gain.setTargetAtTime(v, bus.ctx.currentTime, 0.3)
  },
  slash() {
    if (!bus || !on) return
    const { ctx } = bus
    const t = ctx.currentTime
    // the swish: noise swept down through a band-pass
    const n = ctx.createBufferSource()
    n.buffer = bus.noise
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.Q.value = 2.5
    bp.frequency.setValueAtTime(7000, t)
    bp.frequency.exponentialRampToValueAtTime(900, t + 0.22)
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.0001, t)
    ng.gain.exponentialRampToValueAtTime(1.4, t + 0.02)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
    n.connect(bp).connect(ng).connect(bus.master)
    n.start(t, Math.random())
    n.stop(t + 0.3)
    // the ring of steel: a few inharmonic partials
    for (const [f, v] of [
      [1870, 0.12],
      [2933, 0.09],
      [4410, 0.06],
      [6120, 0.04],
    ]) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t + 0.03)
      g.gain.exponentialRampToValueAtTime(v, t + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1)
      o.connect(g).connect(bus.master)
      o.start(t + 0.03)
      o.stop(t + 1.2)
    }
    // and the impact
    thump(bus, t + 0.02, 0.7)
  },
  tick() {
    if (!bus || !on) return
    const { ctx } = bus
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = 2400
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.035, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    o.connect(g).connect(bus.master)
    o.start(t)
    o.stop(t + 0.06)
  },
}
