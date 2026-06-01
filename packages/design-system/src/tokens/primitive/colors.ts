/**
 * Primitive color tokens — raw values keyed by Tailwind-style 50-900 ramps
 * (bikepark rules, ehrax identity).
 *
 * Identity (the ehrax.dev "premium Linear" palette):
 *   - brand.indigo.500 = #364cc9   (signature indigo, primary action + logo caret)
 *   - brand.cyan.500   = #38bdf8   (atmospheric accent, derived from the scene glow)
 *
 * Neutral ramp is a cool, blue-tinted grey: a near-white paper top and a deep
 * blue-black canvas (#0b0e18) at the bottom — the Linear-style dark surface.
 *
 * Intent ramps (danger / warning / success / info) follow the bikepark anchors;
 * info stays distinct from the indigo brand.
 *
 * App code should consume the SEMANTIC layer, not these primitives.
 */

export const palette = {
  brand: {
    indigo: {
      50: "#ebedfa",
      100: "#d7dbf4",
      200: "#aeb7ea",
      300: "#8693df",
      400: "#5e70d4",
      500: "#364cc9",
      600: "#2b3da1",
      700: "#202d79",
      800: "#151e51",
      900: "#0b0f28",
    },
    cyan: {
      50: "#ecfbff",
      100: "#cff5ff",
      200: "#a5ecff",
      300: "#78d8ff",
      400: "#38bdf8",
      500: "#0c9fe3",
      600: "#057bbb",
      700: "#076196",
      800: "#0c4f79",
      900: "#0b3553",
    },
  },
  neutral: {
    0: "#ffffff",
    50: "#f6f7fb",
    100: "#eceef5",
    200: "#d7dbe8",
    300: "#b4bad0",
    400: "#888fac",
    500: "#646b8a",
    600: "#4c5372",
    700: "#363c56",
    800: "#20243a",
    900: "#141826",
    950: "#0b0e18",
    1000: "#000000",
  },
  danger: {
    50: "#fdf2f0",
    100: "#fbdeda",
    200: "#f5bab1",
    300: "#ed8e80",
    400: "#df5b48",
    500: "#e5484d",
    600: "#c62a31",
    700: "#9f1c25",
    800: "#74161c",
    900: "#4a0e12",
  },
  warning: {
    50: "#fbf4e3",
    100: "#f6e6b8",
    200: "#ecc97a",
    300: "#d7a943",
    400: "#ba8520",
    500: "#a16207",
    600: "#855005",
    700: "#6a4004",
    800: "#4f3003",
    900: "#2f1d01",
  },
  success: {
    50: "#e7f7f0",
    100: "#c2ecd7",
    200: "#8edcb6",
    300: "#56c993",
    400: "#2bae74",
    500: "#0f8a5f",
    600: "#0a724e",
    700: "#075c3f",
    800: "#054430",
    900: "#032a1e",
  },
  info: {
    50: "#eef3fe",
    100: "#d4e0fd",
    200: "#a6bdfb",
    300: "#7795f8",
    400: "#4a72f3",
    500: "#2563eb",
    600: "#1d4ed8",
    700: "#1e40af",
    800: "#1e3a8a",
    900: "#172554",
  },
} as const;

export type Palette = typeof palette;
export type ColorRamp =
  | keyof Palette["brand"]
  | "neutral"
  | "danger"
  | "warning"
  | "success"
  | "info";
export type ColorStep =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";
