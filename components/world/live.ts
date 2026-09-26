import { sample, type Frame } from "./track"

// Single per-frame snapshot shared by the canvas and the DOM overlay.
export const live: { scroll: number; velocity: number; frame: Frame } = {
  scroll: 0,
  velocity: 0,
  frame: sample(0),
}
