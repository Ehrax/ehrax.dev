import { palette } from "../primitive/colors";
import { buildIntent } from "./build-intent";
import type { SemanticTokens } from "./types";

const { brand, neutral, danger, warning, success, info } = palette;

// Blue-tinted charcoal elevation ramp for the dark theme — distinct planes
// (sunken → canvas → muted → raised, lightest = most elevated) plus lifted
// border greys so panels read as crisp Linear-style surfaces, not flat fills.
const charcoal = {
  sunken: "#070912",
  canvas: neutral[950], // #0b0e18 — the anchor
  muted: "#171b2c",
  raised: neutral[900], // #141826
  borderSubtle: "#222741",
  borderDefault: "#2c3252",
  borderStrong: "#444b6e",
} as const;

export const darkSemantic: SemanticTokens = {
  surface: {
    canvas: charcoal.canvas,
    raised: charcoal.raised,
    sunken: charcoal.sunken,
    muted: charcoal.muted,
    inverse: neutral[50],
    brand: brand.indigo[500],
    accent: brand.cyan[400],
    overlay: "rgba(0, 0, 0, 0.66)",
  },
  text: {
    primary: neutral[50],
    secondary: neutral[300],
    tertiary: neutral[400],
    inverse: neutral[900],
    brand: brand.indigo[300],
    onBrand: neutral[0],
    onAccent: neutral[950],
    disabled: neutral[600],
    danger: danger[400],
    success: success[400],
    warning: warning[300],
    info: info[300],
    link: brand.indigo[300],
    linkHover: brand.indigo[200],
  },
  border: {
    subtle: charcoal.borderSubtle,
    default: charcoal.borderDefault,
    strong: charcoal.borderStrong,
    focus: brand.indigo[400],
    inverse: neutral[300],
  },
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
    md: "0 2px 4px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5)",
    lg: "0 4px 8px rgba(0, 0, 0, 0.45), 0 16px 40px rgba(0, 0, 0, 0.6)",
    xl: "0 8px 16px rgba(0, 0, 0, 0.5), 0 32px 64px rgba(0, 0, 0, 0.65)",
  },
  highlight: {
    raised: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  },
  intent: {
    primary: buildIntent(brand.indigo, neutral[0], "dark"),
    secondary: buildIntent(brand.cyan, neutral[950], "dark"),
    danger: buildIntent(danger, neutral[0], "dark"),
    warning: buildIntent(warning, neutral[950], "dark"),
    success: buildIntent(success, neutral[0], "dark"),
    info: buildIntent(info, neutral[0], "dark"),
    neutral: buildIntent(neutral, neutral[0], "dark"),
  },
};
