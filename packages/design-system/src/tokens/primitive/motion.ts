/**
 * Motion primitives — durations (ms) + easing curves.
 *
 * The `out` / `in-out` curves carry ehrax's signature "premium" feel (a soft
 * decelerating overshoot), while `emphasized` is the standard expressive curve.
 */

export const duration = {
  instant: 0,
  fast: 120,
  base: 240,
  slow: 400,
  slower: 500,
  slowest: 800,
} as const;

export const easing = {
  linear: "cubic-bezier(0, 0, 1, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
