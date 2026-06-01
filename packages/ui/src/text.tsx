import clsx from "clsx";
import { type ComponentPropsWithoutRef, createElement, type ElementType } from "react";
import styles from "./text.module.css";

/**
 * Text — body, label, overline and code variants from the design-system type
 * scale, with a `tone` for emphasis. Headings live in `Heading`; this covers
 * everything in the sans/mono families. (The typographic axis is `variant`, not
 * `role`, so the DOM `role` attribute stays free for genuine ARIA use.)
 */
export type TextVariant =
  | "body-lg"
  | "body"
  | "body-sm"
  | "body-bold"
  | "label"
  | "caption"
  | "overline"
  | "code";

export type TextTone = "default" | "secondary" | "tertiary" | "brand" | "inverse";

const defaultTag: Record<TextVariant, ElementType> = {
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  "body-bold": "p",
  label: "span",
  caption: "span",
  overline: "p",
  code: "code",
};

export type TextProps = ComponentPropsWithoutRef<"p"> & {
  variant?: TextVariant;
  tone?: TextTone;
  as?: ElementType;
};

export function Text({ as, className, variant = "body", tone = "default", ...props }: TextProps) {
  const Tag = as ?? defaultTag[variant];
  // createElement (not <Tag/>) so the polymorphic element type doesn't resolve
  // to `never` under a globally-augmented JSX namespace (e.g. an app that also
  // imports @react-three/fiber). Behaviour is identical.
  return createElement(Tag, {
    className: clsx(styles.text, styles[variant], styles[`tone-${tone}`], className),
    ...props,
  });
}
