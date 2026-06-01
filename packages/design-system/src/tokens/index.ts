/**
 * ehrax.dev Design System — token surface (bikepark rules, ehrax identity).
 *
 * Three tiers:
 *   - primitive  raw values (palette ramps, type ladder, spacing ladder)
 *   - semantic   light + dark themes consumed by components
 *   - components ready-resolved tokens per component (button.size etc.)
 *
 * The Theme type assembles a complete set for a single mode (web platform).
 */

export * from "./components";
export * from "./primitive";
export * from "./semantic";
export * from "./typography";

import { buttonSize } from "./components/button";
import { borderWidth } from "./primitive/borders";
import { breakpoints, mediaQuery } from "./primitive/breakpoints";
import { palette } from "./primitive/colors";
import { elevation } from "./primitive/elevation";
import { duration, easing } from "./primitive/motion";
import { opacity, opacityRole } from "./primitive/opacity";
import { radii, radiiRole } from "./primitive/radii";
import { spacing } from "./primitive/spacing";
import { family, lineHeight, size, tracking, transform, weight } from "./primitive/typography";
import { zIndex } from "./primitive/z-index";
import { darkSemantic } from "./semantic/dark";
import { lightSemantic } from "./semantic/light";
import type { SemanticTokens, ThemeName } from "./semantic/types";
import { webRoles } from "./typography/roles";

/** A fully-resolved theme — what `useTheme()` returns. */
export type Theme = {
  name: ThemeName;
  semantic: SemanticTokens;
  primitive: {
    palette: typeof palette;
    spacing: typeof spacing;
    radii: typeof radii;
    radiiRole: typeof radiiRole;
    elevation: typeof elevation;
    duration: typeof duration;
    easing: typeof easing;
    zIndex: typeof zIndex;
    opacity: typeof opacity;
    opacityRole: typeof opacityRole;
    breakpoints: typeof breakpoints;
    mediaQuery: typeof mediaQuery;
    borderWidth: typeof borderWidth;
    family: typeof family;
    weight: typeof weight;
    size: typeof size;
    lineHeight: typeof lineHeight;
    tracking: typeof tracking;
    transform: typeof transform;
  };
  typography: typeof webRoles;
  components: {
    button: { size: typeof buttonSize };
  };
};

const primitive: Theme["primitive"] = {
  palette,
  spacing,
  radii,
  radiiRole,
  elevation,
  duration,
  easing,
  zIndex,
  opacity,
  opacityRole,
  breakpoints,
  mediaQuery,
  borderWidth,
  family,
  weight,
  size,
  lineHeight,
  tracking,
  transform,
};

export const lightTheme: Theme = {
  name: "light",
  semantic: lightSemantic,
  primitive,
  typography: webRoles,
  components: { button: { size: buttonSize } },
};

export const darkTheme: Theme = {
  name: "dark",
  semantic: darkSemantic,
  primitive,
  typography: webRoles,
  components: { button: { size: buttonSize } },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;
