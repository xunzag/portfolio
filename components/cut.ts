// Shared state for the katana-slash transition (DOM gesture → WebGL effect).
export const cut = {
  /** set by the gesture; the effect snapshots the current frame and clears it */
  pending: false,
  /** the effect took its snapshot this frame */
  snapped: false,
  /** 1 while the frozen halves are on screen */
  has: 0,
  /** 0 = halves together, 1 = fully parted */
  open: 0,
  /** a point on the cut and its unit normal, in aspect-corrected uv space (y up) */
  a: [0.5, 0.5] as [number, number],
  n: [0, 1] as [number, number],
}
