import * as THREE from "three"
import { PROJECT_VH, RANGES, clamp01, local, type ChapterId } from "@/lib/chapters"
import { projects } from "@/lib/content"

// ── World layout (one continuous dreamscape) ──────────────────────────
export const ROOM_ORIGIN = new THREE.Vector3(0, 18, -300)
export const ABOUT = new THREE.Vector3(-4, 7, -214)
export const FACTS = new THREE.Vector3(16, 11, -254)
export const REALM = new THREE.Vector3(0, 400, 0)
export const CONTACT = new THREE.Vector3(0, 416, -30)

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const room = (x: number, y: number, z: number) => v3(x, y, z).add(ROOM_ORIGIN)

// Project stations alternate either side of the light path, rising gently.
export function projectStation(i: number) {
  const side = i % 2 === 0 ? -1 : 1
  const center = v3(side * 5.2, 2.6 + i * 0.55, -28 - i * 24)
  const cam = center.clone().add(v3(-side * 2.4, 0.9, 12.6))
  const target = center.clone().add(v3(-side * 1.9, 0.3, 0))
  const yaw = Math.atan2(cam.x - center.x, cam.z - center.z)
  return { side, center, cam, target, yaw }
}

// ── Easing ────────────────────────────────────────────────────────────
export const ease = {
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  out: (t: number) => 1 - Math.pow(1 - t, 3),
}
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = THREE.MathUtils.lerp

// ── Keyframed camera track ────────────────────────────────────────────
// Each key is a pose at a scroll position. Between keys the camera eases in and
// out, so it glides between stations and settles while you read.

type Key = { s: number; pos: THREE.Vector3; target: THREE.Vector3; fov?: number; flash?: number; roll?: number }

function buildTrack(): Key[] {
  const K: Key[] = []
  const [w0] = RANGES.work
  K.push({ s: RANGES.hero[1], pos: v3(0, 2.1, 5.6), target: v3(0, 1.5, -4), fov: 40 })
  projects.forEach((_, i) => {
    const st = projectStation(i)
    const a = w0 + i * PROJECT_VH
    const drift = v3(st.side * 0.9, 0.15, -1.2)
    K.push({ s: a + 55, pos: st.cam, target: st.target, fov: 38, roll: -st.side * 0.02 })
    K.push({ s: a + 110, pos: st.cam.clone().add(drift), target: st.target, fov: 37 })
  })
  const [ab0] = RANGES.about
  K.push({ s: ab0 + 90, pos: ABOUT.clone().add(v3(0, 0.6, 12)), target: ABOUT.clone().add(v3(0, 0.2, 0)), fov: 40 })
  K.push({ s: ab0 + 250, pos: ABOUT.clone().add(v3(1.4, 0.2, 10)), target: ABOUT.clone().add(v3(0.3, 0, 0)), fov: 38 })
  const [f0] = RANGES.facts
  K.push({ s: f0 + 80, pos: FACTS.clone().add(v3(0, 0, 14)), target: FACTS, fov: 42, roll: 0.03 })
  K.push({ s: f0 + 220, pos: FACTS.clone().add(v3(-1.6, 0.6, 9.5)), target: FACTS.clone().add(v3(0.4, 0, 0)), fov: 40, roll: -0.03 })
  const [st0] = RANGES.stack
  K.push({ s: st0 + 70, pos: room(9.6, 7.6, 9.4), target: room(-0.4, 2.1, -1.2), fov: 36 })
  K.push({ s: st0 + 150, pos: room(13.2, 3.5, 2.6), target: room(4.0, 1.8, 0.4), fov: 42 })
  K.push({ s: st0 + 260, pos: room(12.6, 3.3, 1.8), target: room(4.0, 1.7, 0.1), fov: 42 })
  const [p0, p1] = RANGES.portal
  K.push({ s: p0 + 45, pos: room(0.65, 2.72, -1.25), target: room(0.65, 2.62, -4.62), fov: 36 })
  K.push({ s: p1, pos: room(0.65, 2.63, -4.45), target: room(0.65, 2.63, -4.7), fov: 100, flash: 1 })
  return K
}

const TRACK = buildTrack()
const curvePos = new THREE.CatmullRomCurve3(TRACK.map((k) => k.pos), false, "centripetal")
const curveTarget = new THREE.CatmullRomCurve3(TRACK.map((k) => k.target), false, "centripetal")

function sampleTrack(s: number, out: Frame) {
  let j = 0
  while (j < TRACK.length - 2 && s >= TRACK[j + 1].s) j++
  const a = TRACK[j]
  const b = TRACK[j + 1]
  const u = ease.inOutSine(clamp01((s - a.s) / (b.s - a.s)))
  const t = (j + u) / (TRACK.length - 1)
  curvePos.getPoint(t, out.pos)
  curveTarget.getPoint(t, out.target)
  out.fov = lerp(a.fov ?? 38, b.fov ?? 38, u)
  out.roll = lerp(a.roll ?? 0, b.roll ?? 0, u)
  // flash only ramps in the last stretch of a key that asks for it
  out.flash = (b.flash ?? 0) * smooth(0.65, 1, clamp01((s - a.s) / (b.s - a.s)))
}

export type Frame = {
  pos: THREE.Vector3
  target: THREE.Vector3
  fov: number
  roll: number
  flash: number
  chapter: ChapterId
  t: number
}

const out: Frame = { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 36, roll: 0, flash: 0, chapter: "hero", t: 0 }

/** Camera frame for a scroll position (in vh). Pure function of scroll. */
export function sample(s: number): Frame {
  const { pos, target } = out
  out.roll = 0
  out.flash = 0

  if (s < RANGES.hero[1]) {
    const t = local(s, "hero")
    const e = ease.inOutSine(t)
    const a = lerp(2.5, Math.PI * 2, e)
    const r = lerp(6.4, 5.6, e)
    pos.set(Math.sin(a) * r, lerp(1.5, 2.1, e), Math.cos(a) * r)
    target.set(0, lerp(1.35, 1.5, e), lerp(0, -4, e))
    out.fov = lerp(34, 40, e)
    out.chapter = "hero"
    out.t = t
  } else if (s < RANGES.portal[1]) {
    sampleTrack(s, out)
    const c = ["work", "about", "facts", "stack", "portal"] as const
    out.chapter = c.find((id) => s < RANGES[id][1]) ?? "portal"
    out.t = local(s, out.chapter)
  } else if (s < RANGES.life[1]) {
    const t = local(s, "life")
    const e = ease.inOutSine(t)
    const a = lerp(0.2, 0.2 + Math.PI * 1.6, e)
    const r = lerp(30, 17, e)
    pos.set(REALM.x + Math.sin(a) * r, REALM.y + lerp(24, 6, ease.out(t)), REALM.z + Math.cos(a) * r)
    target.set(REALM.x, REALM.y + lerp(-2, 4, e), REALM.z)
    out.fov = 38 + (1 - smooth(0, 0.14, t)) * 62
    out.flash = 1 - smooth(0, 0.1, t)
    out.roll = Math.sin(e * Math.PI * 2) * 0.04
    out.chapter = "life"
    out.t = t
  } else {
    const t = local(s, "contact")
    const e = ease.inOut(clamp01(t / 0.7))
    const lifeEnd = v3(REALM.x + Math.sin(0.2 + Math.PI * 1.6) * 17, REALM.y + 6, REALM.z + Math.cos(0.2 + Math.PI * 1.6) * 17)
    pos.lerpVectors(lifeEnd, CONTACT.clone().add(v3(0, 0.8, 12.5)), e)
    target.lerpVectors(v3(REALM.x, REALM.y + 4, REALM.z), CONTACT.clone().add(v3(0, 0.3, 0)), e)
    pos.y += Math.sin(e * Math.PI) * 5
    out.fov = 40
    out.chapter = "contact"
    out.t = t
  }
  return out
}

/** Which worlds should render near this scroll position (cheap culling). */
export function zones(s: number) {
  return {
    dream: s < RANGES.stack[0] + 40,
    room: s >= RANGES.facts[0] + 60 && s < RANGES.portal[1],
    realm: s >= RANGES.portal[1] - 4,
  }
}
