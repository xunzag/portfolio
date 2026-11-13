import * as THREE from "three"
import { PROJECT_VH, RANGES, clamp01, local, type ChapterId } from "@/lib/chapters"
import { projects } from "@/lib/content"

// ── World layout (one continuous dreamscape) ──────────────────────────
const N = projects.length
const LAST_Z = -30 - (N - 1) * 26
export const ABOUT = new THREE.Vector3(-4, 4.5 + N * 0.5, LAST_Z - 50)
export const FACTS = new THREE.Vector3(16, ABOUT.y + 4, ABOUT.z - 40)
export const STACK = new THREE.Vector3(-6, ABOUT.y + 9, ABOUT.z - 82)
export const PORTAL = new THREE.Vector3(0, ABOUT.y + 13, ABOUT.z - 138)
export const REALM = new THREE.Vector3(0, 400, 0)
export const CONTACT = new THREE.Vector3(0, 416, -30)

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

// Drive-in screens alternate either side of the road, rising gently.
export function projectStation(i: number) {
  const side = i % 2 === 0 ? -1 : 1
  const center = v3(side * 5.6, 3 + i * 0.5, -30 - i * 26)
  const cam = center.clone().add(v3(-side * 2.4, 0.6, 12.6))
  const target = center.clone().add(v3(-side * 1.9, -0.5, 0))
  const yaw = Math.atan2(cam.x - center.x, cam.z - center.z)
  // where the car pulls up: under the screen, a little in front
  const park = center.clone().add(v3(side * 0.3, -2.75, 2.6))
  return { side, center, cam, target, yaw, park }
}

// ── The road ──────────────────────────────────────────────────────────
// A ribbon of light from the hero's island, past every screen, to the About island.
export const ROAD_START = v3(0, 0.12, -9)
export const ROAD_END = v3(ABOUT.x + 4.2, ABOUT.y - 3.78, ABOUT.z + 2.6)
const roadPts = [
  v3(0, 0.12, 6),
  ROAD_START,
  ...projects.map((_, i) => projectStation(i).park),
  v3(ABOUT.x + 6.5, ABOUT.y - 3.78, ABOUT.z + 22),
  ROAD_END,
  v3(ABOUT.x + 2.5, ABOUT.y - 3.78, ABOUT.z - 6),
]
export const road = new THREE.CatmullRomCurve3(roadPts, false, "catmullrom", 0.5)
/** the stretch of the curve that is actually paved */
export const ROAD_SPAN: [number, number] = [0.6 / (roadPts.length - 1), (roadPts.length - 1.6) / (roadPts.length - 1)]
const U = (k: number) => k / (roadPts.length - 1)
/** curve parameter of: the start line, each parking spot, the finish */
const U_START = U(1)
const U_PARK = (i: number) => U(2 + i)
const U_END = U(roadPts.length - 2)

const carOut = { pos: new THREE.Vector3(), dir: new THREE.Vector3(0, 0, -1), speed: 0, u: 0 }
const tmpA = new THREE.Vector3()
function carU(s: number) {
  const [w0] = RANGES.work
  // (scroll, u) stops: leave the start, pull up at each screen, hold, move on
  let a = w0 - 14
  let ua = U_START
  for (let i = 0; i < N; i++) {
    const arrive = w0 + i * PROJECT_VH + 44
    const leave = w0 + i * PROJECT_VH + 104
    if (s < arrive) return ua + (U_PARK(i) - ua) * ease.inOutSine(clamp01((s - a) / (arrive - a)))
    if (s < leave) return U_PARK(i)
    a = leave
    ua = U_PARK(i)
  }
  const arrive = RANGES.about[0] + 70
  return ua + (U_END - ua) * ease.inOutSine(clamp01((s - a) / (arrive - a)))
}
/** Where the car is, which way it points and how fast it is going, for a scroll position. */
export function carAt(s: number) {
  const u = carU(s)
  road.getPoint(u, carOut.pos)
  road.getTangent(Math.min(0.999, Math.max(0.001, u)), carOut.dir)
  carOut.u = u
  carOut.speed = (carU(s + 0.5) - carU(s - 0.5)) * road.getLength()
  return carOut
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

type Key = { s: number; pos: THREE.Vector3; target: THREE.Vector3; fov?: number; flash?: number; roll?: number; chase?: boolean }

function buildTrack(): Key[] {
  const K: Key[] = []
  const [w0] = RANGES.work
  K.push({ s: RANGES.hero[1], pos: v3(0, 2.1, 5.6), target: v3(0, 1.5, -4), fov: 40 })
  // chase cam: low behind the car as it pulls away from the start line
  K.push({ s: w0 + 22, pos: road.getPoint(carU(w0 + 22)).add(v3(1.2, 1.5, 7)), target: road.getPoint(carU(w0 + 22) + 0.01).add(v3(0, 0.9, -3)), fov: 48, roll: 0.03, chase: true })
  projects.forEach((_, i) => {
    const st = projectStation(i)
    const a = w0 + i * PROJECT_VH
    const drift = v3(st.side * 0.7, 0.1, -0.9)
    K.push({ s: a + 55, pos: st.cam, target: st.target, fov: 38, roll: -st.side * 0.02 })
    K.push({ s: a + 100, pos: st.cam.clone().add(drift), target: st.target, fov: 37 })
    if (i < N - 1) {
      // between screens: swing in behind the car and ride with it
      const sm = a + PROJECT_VH + 14
      const p = road.getPoint(carU(sm))
      const ahead = road.getPoint(Math.min(1, carU(sm) + 0.012))
      K.push({ s: sm, pos: p.clone().add(v3(-st.side * 1.6, 1.7, 7.5)), target: ahead.add(v3(0, 0.8, -2)), fov: 50, roll: st.side * 0.06, chase: true })
    }
  })
  const [ab0] = RANGES.about
  K.push({ s: ab0 + 100, pos: ABOUT.clone().add(v3(0, 0.6, 14.4)), target: ABOUT.clone().add(v3(0, -0.1, 0)), fov: 40 })
  K.push({ s: ab0 + 290, pos: ABOUT.clone().add(v3(0.7, 0.45, 13.9)), target: ABOUT.clone().add(v3(0.15, -0.1, 0)), fov: 40 })
  const [f0] = RANGES.facts
  K.push({ s: f0 + 80, pos: FACTS.clone().add(v3(0, 0, 14)), target: FACTS, fov: 42, roll: 0.03 })
  K.push({ s: f0 + 220, pos: FACTS.clone().add(v3(-1.6, 0.6, 9.5)), target: FACTS.clone().add(v3(0.4, 0, 0)), fov: 40, roll: -0.03 })
  const [st0] = RANGES.stack
  K.push({ s: st0 + 80, pos: STACK.clone().add(v3(3, 1.8, 20.5)), target: STACK.clone().add(v3(0.4, 0.8, 0)), fov: 40, roll: -0.02 })
  K.push({ s: st0 + 240, pos: STACK.clone().add(v3(-1.5, 1.1, 18)), target: STACK.clone().add(v3(0.6, 0.6, 0)), fov: 40, roll: 0.02 })
  const [p0, p1] = RANGES.portal
  // line up with the ring, then fly straight through it
  K.push({ s: p0 + 55, pos: PORTAL.clone().add(v3(0, 0.4, 26)), target: PORTAL, fov: 42 })
  K.push({ s: p1, pos: PORTAL.clone().add(v3(0, 0, -2)), target: PORTAL.clone().add(v3(0, 0, -20)), fov: 95, flash: 1, roll: 0.35 })
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
  const x = clamp01((s - a.s) / (b.s - a.s))
  // chase keys are fly-throughs: don't brake into them or out of them
  const u = b.chase ? 1 - Math.cos((x * Math.PI) / 2) : a.chase ? Math.sin((x * Math.PI) / 2) : ease.inOutSine(x)
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
    dream: s < RANGES.portal[1] - 2,
    realm: s >= RANGES.portal[1] - 4,
  }
}
