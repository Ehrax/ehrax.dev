/** Border widths (px). */
export const borderWidth = {
  "0": 0,
  hairline: 1,
  thin: 1,
  thick: 2,
  heavy: 4,
  focus: 2,
} as const;

export type BorderWidth = keyof typeof borderWidth;
