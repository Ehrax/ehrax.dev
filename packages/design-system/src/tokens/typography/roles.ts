/**
 * Typography roles — ready-to-apply text styles composed from the primitive
 * type ladder. The promotion ladder uses these (not raw sizes) so headings,
 * body, controls and code stay consistent across the system.
 *
 * Family rule:
 *   - display face → display-* roles + h1-h3 (tight, expressive)
 *   - sans         → h4-h6, body, all UI text
 *   - mono         → code / kbd / price (tabular)
 */
import { family } from "../primitive/typography";

export type RoleStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
  letterSpacing: string;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  underline?: boolean;
  tabularNums?: boolean;
};

export const webRoles = {
  "display-2xl": {
    fontFamily: family.display,
    fontSize: 72,
    lineHeight: 1.05,
    fontWeight: "700",
    letterSpacing: "-0.03em",
  },
  "display-xl": {
    fontFamily: family.display,
    fontSize: 60,
    lineHeight: 1.05,
    fontWeight: "700",
    letterSpacing: "-0.03em",
  },
  h1: {
    fontFamily: family.display,
    fontSize: 48,
    lineHeight: 1.1,
    fontWeight: "700",
    letterSpacing: "-0.025em",
  },
  h2: {
    fontFamily: family.display,
    fontSize: 36,
    lineHeight: 1.15,
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  h3: {
    fontFamily: family.display,
    fontSize: 30,
    lineHeight: 1.2,
    fontWeight: "600",
    letterSpacing: "-0.015em",
  },
  h4: {
    fontFamily: family.sans,
    fontSize: 24,
    lineHeight: 1.25,
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  h5: {
    fontFamily: family.sans,
    fontSize: 20,
    lineHeight: 1.3,
    fontWeight: "600",
    letterSpacing: "0em",
  },
  h6: {
    fontFamily: family.sans,
    fontSize: 18,
    lineHeight: 1.35,
    fontWeight: "600",
    letterSpacing: "0em",
  },
  eyebrow: {
    fontFamily: family.sans,
    fontSize: 12,
    lineHeight: 1,
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  "body-lg": {
    fontFamily: family.sans,
    fontSize: 18,
    lineHeight: 1.6,
    fontWeight: "400",
    letterSpacing: "0em",
  },
  body: {
    fontFamily: family.sans,
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: "400",
    letterSpacing: "0em",
  },
  "body-sm": {
    fontFamily: family.sans,
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: "400",
    letterSpacing: "0em",
  },
  "body-bold": {
    fontFamily: family.sans,
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: "600",
    letterSpacing: "0em",
  },
  label: {
    fontFamily: family.sans,
    fontSize: 14,
    lineHeight: 1.3,
    fontWeight: "500",
    letterSpacing: "0em",
  },
  input: {
    fontFamily: family.sans,
    fontSize: 16,
    lineHeight: 1.4,
    fontWeight: "400",
    letterSpacing: "0em",
  },
  helper: {
    fontFamily: family.sans,
    fontSize: 12,
    lineHeight: 1.4,
    fontWeight: "400",
    letterSpacing: "0em",
  },
  error: {
    fontFamily: family.sans,
    fontSize: 12,
    lineHeight: 1.4,
    fontWeight: "500",
    letterSpacing: "0em",
  },
  "button-sm": {
    fontFamily: family.sans,
    fontSize: 14,
    lineHeight: 1,
    fontWeight: "500",
    letterSpacing: "0.01em",
  },
  "button-md": {
    fontFamily: family.sans,
    fontSize: 14,
    lineHeight: 1,
    fontWeight: "500",
    letterSpacing: "0.01em",
  },
  "button-lg": {
    fontFamily: family.sans,
    fontSize: 16,
    lineHeight: 1,
    fontWeight: "500",
    letterSpacing: "0.01em",
  },
  link: {
    fontFamily: family.sans,
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: "500",
    letterSpacing: "0em",
    underline: true,
  },
  nav: {
    fontFamily: family.sans,
    fontSize: 14,
    lineHeight: 1,
    fontWeight: "500",
    letterSpacing: "0.02em",
  },
  caption: {
    fontFamily: family.sans,
    fontSize: 12,
    lineHeight: 1.4,
    fontWeight: "400",
    letterSpacing: "0em",
  },
  price: {
    fontFamily: family.display,
    fontSize: 24,
    lineHeight: 1.1,
    fontWeight: "700",
    letterSpacing: "-0.01em",
    tabularNums: true,
  },
  code: {
    fontFamily: family.mono,
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: "400",
    letterSpacing: "0em",
  },
  kbd: {
    fontFamily: family.mono,
    fontSize: 12,
    lineHeight: 1,
    fontWeight: "500",
    letterSpacing: "0em",
  },
} as const satisfies Record<string, RoleStyle>;

export type TypographyRole = keyof typeof webRoles;
