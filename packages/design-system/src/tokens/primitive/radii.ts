/**
 * Border radius scale.
 *
 * ehrax.dev reads premium/soft (Linear-style) rather than industrial, so the
 * role aliases sit one step more generous than bikepark:
 *  - field (inputs/buttons): 8px
 *  - card (surfaces, popovers, menus, toasts): 12px
 *  - modal (dialogs): 16px
 *  - pill: fully round
 */

export const radii = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 20,
  "4xl": 28,
  full: 9999,
} as const;

export const radiiRole = {
  field: radii.lg,
  card: radii.xl,
  modal: radii["2xl"],
  pill: radii.full,
} as const;

export type Radius = keyof typeof radii;
export type RadiusRole = keyof typeof radiiRole;
