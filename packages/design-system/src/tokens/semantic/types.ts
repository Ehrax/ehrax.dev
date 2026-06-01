/**
 * Shared types for the semantic layer (bikepark rules).
 *
 * The semantic layer is what apps consume. It maps the primitive palette to
 * contextual roles (surface/text/border/...) and resolves the
 * intent × variant × shade matrix into ready-to-use color slots.
 */

export type IntentName =
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "success"
  | "info"
  | "neutral";

export type IntentVariant = "solid" | "soft" | "outline" | "ghost" | "link";

export type IntentSlots = {
  /** Background fill. `transparent` for outline/ghost/link variants. */
  bg: string;
  /** Background on hover. */
  bgHover: string;
  /** Background on press / active. */
  bgPressed: string;
  /** Foreground text/icon color. */
  fg: string;
  /** Border color. `transparent` when there is no border. */
  border: string;
};

export type IntentTokens = Record<IntentVariant, IntentSlots>;

export type SemanticTokens = {
  surface: {
    canvas: string;
    raised: string;
    sunken: string;
    muted: string;
    inverse: string;
    brand: string;
    accent: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    brand: string;
    onBrand: string;
    onAccent: string;
    disabled: string;
    danger: string;
    success: string;
    warning: string;
    info: string;
    link: string;
    linkHover: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    focus: string;
    inverse: string;
  };
  /** Theme-aware box-shadow strings. Dark needs deeper shadows than light. */
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  /** Inset "lit edge" highlight for raised surfaces. */
  highlight: {
    raised: string;
  };
  /** intent[role][variant] -> slots. */
  intent: Record<IntentName, IntentTokens>;
};

export type ThemeName = "light" | "dark";
