/**
 * Build the CSS custom-property block for the token tiers.
 *
 * Single source of truth for `themes/light.css` + `themes/dark.css` — run the
 * generator after editing any token file so the CSS never drifts. Prefix: --ex.
 */

import { borderWidth } from "../tokens/primitive/borders";
import { duration, easing } from "../tokens/primitive/motion";
import { opacity, opacityRole } from "../tokens/primitive/opacity";
import { radii, radiiRole } from "../tokens/primitive/radii";
import { spacing } from "../tokens/primitive/spacing";
import { family, lineHeight, size, tracking, weight } from "../tokens/primitive/typography";
import { zIndex } from "../tokens/primitive/z-index";
import type { IntentName, IntentVariant, SemanticTokens } from "../tokens/semantic/types";

const PREFIX = "--ex";

const intents: IntentName[] = [
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
  "info",
  "neutral",
];
const variants: IntentVariant[] = ["solid", "soft", "outline", "ghost", "link"];

export const buildSemanticCssVars = (tokens: SemanticTokens): Record<string, string> => {
  const vars: Record<string, string> = {};

  for (const [name, value] of Object.entries(tokens.surface)) {
    vars[`${PREFIX}-surface-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.text)) {
    vars[`${PREFIX}-text-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.border)) {
    vars[`${PREFIX}-border-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.shadow)) {
    vars[`${PREFIX}-shadow-${kebab(name)}`] = value;
  }
  vars[`${PREFIX}-highlight-raised`] = tokens.highlight.raised;
  for (const intent of intents) {
    for (const variant of variants) {
      const slots = tokens.intent[intent][variant];
      for (const [slot, value] of Object.entries(slots)) {
        vars[`${PREFIX}-intent-${intent}-${variant}-${kebab(slot)}`] = value;
      }
    }
  }
  return vars;
};

/** Primitive (theme-independent) CSS variables. */
export const buildPrimitiveCssVars = (): Record<string, string> => {
  const vars: Record<string, string> = {};

  vars[`${PREFIX}-font-sans`] = family.sans;
  vars[`${PREFIX}-font-display`] = family.display;
  vars[`${PREFIX}-font-mono`] = family.mono;

  for (const [k, v] of Object.entries(weight)) {
    vars[`${PREFIX}-weight-${kebab(k)}`] = v;
  }
  for (const [k, v] of Object.entries(size)) {
    vars[`${PREFIX}-text-size-${kebab(k)}`] = `${v}px`;
  }
  for (const [k, v] of Object.entries(lineHeight)) {
    vars[`${PREFIX}-leading-${kebab(k)}`] = String(v);
  }
  for (const [k, v] of Object.entries(tracking)) {
    vars[`${PREFIX}-tracking-${kebab(k)}`] = v;
  }
  for (const [k, v] of Object.entries(spacing)) {
    vars[`${PREFIX}-space-${kebab(k)}`] = `${v}px`;
  }
  for (const [k, v] of Object.entries(radii)) {
    vars[`${PREFIX}-radius-${kebab(k)}`] = `${v}px`;
  }
  for (const [k, v] of Object.entries(radiiRole)) {
    vars[`${PREFIX}-radius-role-${kebab(k)}`] = `${v}px`;
  }
  // Theme-independent only; sm/md/lg/xl live in the semantic layer so each
  // theme can tune shadow depth.
  vars[`${PREFIX}-shadow-none`] = "none";
  for (const [k, v] of Object.entries(duration)) {
    vars[`${PREFIX}-duration-${kebab(k)}`] = `${v}ms`;
  }
  for (const [k, v] of Object.entries(easing)) {
    vars[`${PREFIX}-easing-${kebab(k)}`] = v;
  }
  for (const [k, v] of Object.entries(zIndex)) {
    vars[`${PREFIX}-z-${kebab(k)}`] = String(v);
  }
  for (const [k, v] of Object.entries(opacity)) {
    vars[`${PREFIX}-opacity-${kebab(k)}`] = String(v);
  }
  for (const [k, v] of Object.entries(opacityRole)) {
    vars[`${PREFIX}-opacity-${kebab(k)}`] = String(v);
  }
  for (const [k, v] of Object.entries(borderWidth)) {
    vars[`${PREFIX}-border-width-${kebab(k)}`] = `${v}px`;
  }
  return vars;
};

const kebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[._]/g, "-")
    .toLowerCase();

/** Render a CSS rule block from a vars map. */
export const renderCssBlock = (selector: string, vars: Record<string, string>): string => {
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `${selector} {\n${body}\n}`;
};
