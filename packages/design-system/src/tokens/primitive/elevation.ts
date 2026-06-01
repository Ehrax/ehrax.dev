/**
 * Elevation levels — semantic depth indices. The actual box-shadow strings
 * live in the semantic layer (light/dark tune depth differently); this map is
 * the canonical set of named levels components reference via `--ex-shadow-*`.
 */
export const elevation = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

export type Elevation = keyof typeof elevation;
