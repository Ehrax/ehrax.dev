import type { IntentTokens } from "./types";

type Ramp = Record<number, string>;

/**
 * Resolve one intent ramp into the full variant × slot matrix.
 *
 * Light surfaces darken the ramp for emphasis (solid 600→800); dark surfaces
 * lift it (solid 500→400) and tint chips with the mid-dark steps so soft/ghost
 * fills stay visible against the near-black canvas.
 */
export const buildIntent = (ramp: Ramp, onSolid: string, mode: "light" | "dark"): IntentTokens => {
  if (mode === "light") {
    return {
      solid: {
        bg: ramp[600],
        bgHover: ramp[700],
        bgPressed: ramp[800],
        fg: onSolid,
        border: "transparent",
      },
      soft: {
        bg: ramp[100],
        bgHover: ramp[200],
        bgPressed: ramp[300],
        fg: ramp[700],
        border: "transparent",
      },
      outline: {
        bg: "transparent",
        bgHover: ramp[100],
        bgPressed: ramp[200],
        fg: ramp[700],
        border: ramp[500],
      },
      ghost: {
        bg: "transparent",
        bgHover: ramp[100],
        bgPressed: ramp[200],
        fg: ramp[700],
        border: "transparent",
      },
      link: {
        bg: "transparent",
        bgHover: "transparent",
        bgPressed: "transparent",
        fg: ramp[700],
        border: "transparent",
      },
    };
  }
  return {
    solid: {
      bg: ramp[500],
      bgHover: ramp[400],
      bgPressed: ramp[600],
      fg: onSolid,
      border: "transparent",
    },
    soft: {
      bg: ramp[800],
      bgHover: ramp[700],
      bgPressed: ramp[600],
      fg: ramp[200],
      border: "transparent",
    },
    outline: {
      bg: "transparent",
      bgHover: ramp[800],
      bgPressed: ramp[700],
      fg: ramp[200],
      border: ramp[600],
    },
    ghost: {
      bg: "transparent",
      bgHover: ramp[800],
      bgPressed: ramp[700],
      fg: ramp[200],
      border: "transparent",
    },
    link: {
      bg: "transparent",
      bgHover: "transparent",
      bgPressed: "transparent",
      fg: ramp[300],
      border: "transparent",
    },
  };
};
