// One per-frame snapshot shared by the WebGL stage and the DOM acts, so nothing
// scroll-driven goes through React state.

export const live = {
  /** smoothed scroll in vh */
  scroll: 0,
  /** vh per second */
  velocity: 0,
  /** pointer in -1..1, raw and damped */
  mouse: { x: 0, y: 0, sx: 0, sy: 0 },
  /** pointer in CSS px */
  px: { x: -1e4, y: -1e4 },
  w: 1,
  h: 1,
}

type Cb = (dt: number) => void
const subs = new Set<Cb>()

/** Run a callback every frame, after the scroll value has been updated. */
export function onFrame(cb: Cb) {
  subs.add(cb)
  return () => void subs.delete(cb)
}

export function runFrame(dt: number) {
  subs.forEach((cb) => cb(dt))
}
