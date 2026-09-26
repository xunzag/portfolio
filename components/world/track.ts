import * as THREE from "three"
import { RANGES, clamp01, local, type ChapterId } from "@/lib/chapters"

// ── World layout ──────────────────────────────────────────────────────
export const ROAD_LENGTH = 230
export const ROOM_ORIGIN = new THREE.Vector3(0, 22, -300)
export const REALM = new THREE.Vector3(0, 400, 0)
export const ROOF = new THREE.Vector3(38, 30, -120)

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

// ── Shared helpers ────────────────────────────────────────────────────

/** Where the bike is on the road (z) for a given scroll position. */
export function bikeZ(s: number) {
  return -ROAD_LENGTH * ease.inOutSine(local(s, "work"))
}

/** Which side of the road project i's billboard stands on (-1 left, +1 right). */
export const billboardSide = (i: number) => (i % 2 === 0 ? -1 : 1)

/** Billboard z for project i, placed so it passes the camera when that project is "live". */
export function billboardZ(i: number, count: number) {
  const t = (i + 0.5) / count
  return -ROAD_LENGTH * ease.inOutSine(t) - 22
}

const room = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).add(ROOM_ORIGIN)
const roof = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).add(ROOF)
const curve = (pts: THREE.Vector3[]) => new THREE.CatmullRomCurve3(pts, false, "centripetal")

// Room-local camera shots (same framings as the interactive room had).
const SHOT = {
  overview: { pos: room(9.6, 7.6, 9.4), target: room(-0.4, 2.1, -1.2) },
  about: { pos: room(2.6, 3.3, 1.9), target: room(-4.4, 2.5, 0.9) },
  skills: { pos: room(10.4, 3.0, -3.3), target: room(3.8, 1.3, -3.9) },
  monitor: { pos: room(0.65, 2.72, -1.25), target: room(0.65, 2.6, -4.62) },
}

const PATHS = {
  ascendPos: curve([new THREE.Vector3(0, 1.5, -ROAD_LENGTH + 6.5), new THREE.Vector3(-9, 7, -242), new THREE.Vector3(-6, 20, -268), SHOT.overview.pos]),
  ascendTarget: curve([new THREE.Vector3(0, 2.2, -ROAD_LENGTH - 14), new THREE.Vector3(0, 8, -268), room(0, 4, -3), SHOT.overview.target]),
  aboutPos: curve([SHOT.overview.pos, room(7, 5.5, 6.5), room(4, 3.8, 3.6), SHOT.about.pos]),
  aboutTarget: curve([SHOT.overview.target, room(-2, 2.4, -0.4), room(-3.8, 2.5, 0.6), SHOT.about.target]),
  stackPos: curve([SHOT.about.pos, room(4.6, 4.2, 2.6), room(8.4, 3.6, 0.4), SHOT.skills.pos]),
  stackTarget: curve([SHOT.about.target, room(-0.5, 2.2, -1.2), room(2.6, 1.6, -3.2), SHOT.skills.target]),
  portalPos: curve([SHOT.skills.pos, room(6.2, 3.4, 0.4), room(2.2, 2.9, -0.6), SHOT.monitor.pos, room(0.65, 2.63, -4.5)]),
  portalTarget: curve([SHOT.skills.target, room(2.6, 2.3, -3.6), room(0.9, 2.55, -4.6), SHOT.monitor.target, room(0.65, 2.63, -4.7)]),
  contactPos: curve([roof(-12, 26, 26), roof(-9, 9, 17), roof(-5, 3.4, 9.5), roof(-3.4, 2.6, 6.5)]),
  contactTarget: curve([roof(0, 0, 0), roof(0, 2, -4), roof(2, 3.5, -20), roof(4, 4.5, -40)]),
}

export type Frame = {
  pos: THREE.Vector3
  target: THREE.Vector3
  fov: number
  roll: number
  /** 0..1 white-violet flash for world cuts */
  flash: number
  /** fraction of the viewport width to shift the render (desktop only) so content fits beside the subject */
  shift: number
  chapter: ChapterId
  t: number
}

const out: Frame = { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 36, roll: 0, flash: 0, shift: 0, chapter: "hero", t: 0 }

/** Camera frame for a scroll position (in viewport heights). Pure function of scroll. */
export function sample(s: number): Frame {
  const { pos, target } = out
  out.roll = 0
  out.flash = 0
  out.shift = 0
  out.fov = 36

  if (s < RANGES.hero[1]) {
    const t = local(s, "hero")
    const e = ease.inOutSine(t)
    const a = lerp(2.5, Math.PI * 2, e)
    const r = lerp(6.4, 5.6, e)
    pos.set(Math.sin(a) * r, lerp(1.5, 2.1, e), Math.cos(a) * r)
    target.set(0, lerp(1.35, 1.5, e), lerp(0, -4, e))
    out.shift = -0.16 * (1 - e)
    out.fov = lerp(34, 40, e)
    out.chapter = "hero"
    out.t = t
  } else if (s < RANGES.work[1]) {
    const t = local(s, "work")
    const z = bikeZ(s)
    const side = Math.sin(t * Math.PI * 7) // swings across the road once per project
    const a = Math.abs(side)
    pos.set(side * 4.4, 1.5 + a * 1.1, z + 6.5 - a * 2)
    target.set(-side * 5.5, 2 + a * 2.2, z - 14)
    out.roll = -side * 0.07
    out.fov = 40 + a * 8
    out.chapter = "work"
    out.t = t
  } else if (s < RANGES.ascend[1]) {
    const t = local(s, "ascend")
    const e = ease.inOut(t)
    PATHS.ascendPos.getPointAt(e, pos)
    PATHS.ascendTarget.getPointAt(e, target)
    out.fov = lerp(40, 36, e) + Math.sin(e * Math.PI) * 10
    out.roll = Math.sin(e * Math.PI) * 0.12
    out.chapter = "ascend"
    out.t = t
  } else if (s < RANGES.about[1]) {
    const t = local(s, "about")
    const u = ease.inOut(clamp01(t / 0.45))
    PATHS.aboutPos.getPointAt(u, pos)
    PATHS.aboutTarget.getPointAt(u, target)
    pos.x += (t - 0.45) * 0.6 // slow push while reading
    out.shift = 0.2 * u
    out.chapter = "about"
    out.t = t
  } else if (s < RANGES.stack[1]) {
    const t = local(s, "stack")
    const u = ease.inOut(clamp01(t / 0.45))
    PATHS.stackPos.getPointAt(u, pos)
    PATHS.stackTarget.getPointAt(u, target)
    pos.z += (t - 0.45) * 0.8
    out.shift = 0.2
    out.chapter = "stack"
    out.t = t
  } else if (s < RANGES.portal[1]) {
    const t = local(s, "portal")
    const e = ease.inOut(t)
    PATHS.portalPos.getPointAt(e, pos)
    PATHS.portalTarget.getPointAt(e, target)
    out.fov = 36 + smooth(0.62, 1, t) * 64
    out.flash = smooth(0.82, 1, t)
    out.shift = 0.2 * (1 - smooth(0, 0.4, t))
    out.chapter = "portal"
    out.t = t
  } else if (s < RANGES.life[1]) {
    const t = local(s, "life")
    const e = ease.inOutSine(t)
    const a = lerp(0.2, 0.2 + Math.PI * 1.7, e)
    const r = lerp(30, 15, e)
    pos.set(REALM.x + Math.sin(a) * r, REALM.y + lerp(24, 5, ease.out(t)), REALM.z + Math.cos(a) * r)
    target.set(REALM.x, REALM.y + lerp(-2, 3.5, e), REALM.z)
    out.fov = 36 + (1 - smooth(0, 0.14, t)) * 64
    out.flash = Math.max(1 - smooth(0, 0.1, t), smooth(0.9, 1, t))
    out.roll = Math.sin(e * Math.PI * 2) * 0.05
    out.shift = 0.16 * smooth(0.08, 0.2, t)
    out.chapter = "life"
    out.t = t
  } else {
    const t = local(s, "contact")
    const e = ease.out(t)
    PATHS.contactPos.getPointAt(e, pos)
    PATHS.contactTarget.getPointAt(e, target)
    out.fov = 38
    out.flash = 1 - smooth(0, 0.12, t)
    out.shift = 0.14 * e
    out.chapter = "contact"
    out.t = t
  }
  return out
}

/** Which worlds should render near this scroll position (cheap culling). */
export function zones(s: number) {
  const asc = local(s, "ascend")
  return {
    city: s < RANGES.ascend[1] - 6 || s >= RANGES.contact[0] - 2,
    room: (s >= RANGES.ascend[0] + (RANGES.ascend[1] - RANGES.ascend[0]) * 0.1 && s < RANGES.portal[1]) || (asc > 0.1 && asc < 1),
    realm: s >= RANGES.portal[1] - 4 && s < RANGES.contact[0] + 4,
    roof: s >= RANGES.life[1] - 20,
  }
}
