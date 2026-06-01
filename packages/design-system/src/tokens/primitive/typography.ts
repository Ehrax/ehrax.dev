/**
 * Primitive typography tokens (bikepark rules, ehrax fonts).
 *
 * ehrax.dev rides on a clean system-UI sans for body + UI and a system mono
 * for the logo caret / code. There is no custom display face — the display
 * role reuses the sans stack with tighter tracking (handled in the role layer).
 *
 * Size ladder mirrors Tailwind (px).
 */

export const family = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  display:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
} as const;

export const weight = {
  thin: "100",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

export const size = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
  "8xl": 96,
  "9xl": 128,
} as const;

export const lineHeight = {
  none: 1,
  tight: 1.1,
  snug: 1.25,
  normal: 1.45,
  relaxed: 1.65,
  loose: 2,
} as const;

export const tracking = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

export const transform = {
  none: "none",
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
} as const;

export type Family = keyof typeof family;
export type Weight = keyof typeof weight;
export type Size = keyof typeof size;
export type LineHeight = keyof typeof lineHeight;
export type Tracking = keyof typeof tracking;
export type Transform = keyof typeof transform;
