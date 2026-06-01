/**
 * Component-level tokens for the button primitive — geometry per size.
 * Variants/intent come from the semantic intent layer at render time.
 */
export const buttonSize = {
  sm: { minHeight: 32, paddingX: 12, gap: 6, fontRole: "button-sm" },
  default: { minHeight: 36, paddingX: 16, gap: 8, fontRole: "button-md" },
  lg: { minHeight: 44, paddingX: 20, gap: 8, fontRole: "button-lg" },
} as const;

export type ButtonSizeToken = keyof typeof buttonSize;
