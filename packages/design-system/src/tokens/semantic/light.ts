import { palette } from "../primitive/colors";
import { buildIntent } from "./build-intent";
import type { SemanticTokens } from "./types";

const { brand, neutral, danger, warning, success, info } = palette;

export const lightSemantic: SemanticTokens = {
  surface: {
    canvas: neutral[50],
    raised: neutral[0],
    sunken: neutral[100],
    muted: neutral[100],
    inverse: neutral[900],
    brand: brand.indigo[500],
    accent: brand.cyan[400],
    overlay: "rgba(11, 14, 24, 0.5)",
  },
  text: {
    primary: neutral[900],
    secondary: neutral[600],
    tertiary: neutral[500],
    inverse: neutral[0],
    brand: brand.indigo[600],
    onBrand: neutral[0],
    onAccent: neutral[900],
    disabled: neutral[400],
    danger: danger[600],
    success: success[600],
    warning: warning[600],
    info: info[600],
    link: brand.indigo[600],
    linkHover: brand.indigo[700],
  },
  border: {
    subtle: neutral[100],
    default: neutral[200],
    strong: neutral[400],
    focus: brand.indigo[500],
    inverse: neutral[700],
  },
  shadow: {
    sm: "0 1px 2px rgba(20, 21, 31, 0.06)",
    md: "0 2px 4px rgba(20, 21, 31, 0.05), 0 8px 24px rgba(20, 21, 31, 0.08)",
    lg: "0 4px 8px rgba(20, 21, 31, 0.07), 0 16px 40px rgba(20, 21, 31, 0.10)",
    xl: "0 8px 16px rgba(20, 21, 31, 0.08), 0 32px 64px rgba(20, 21, 31, 0.14)",
  },
  highlight: {
    raised: "inset 0 1px 0 rgba(255, 255, 255, 0.7)",
  },
  intent: {
    primary: buildIntent(brand.indigo, neutral[0], "light"),
    secondary: buildIntent(brand.cyan, neutral[0], "light"),
    danger: buildIntent(danger, neutral[0], "light"),
    warning: buildIntent(warning, neutral[0], "light"),
    success: buildIntent(success, neutral[0], "light"),
    info: buildIntent(info, neutral[0], "light"),
    neutral: buildIntent(neutral, neutral[0], "light"),
  },
};
