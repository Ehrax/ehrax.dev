import clsx from "clsx";
import { type ComponentPropsWithoutRef, createElement, type ElementType } from "react";
import styles from "./heading.module.css";

/**
 * Heading — display-face headings composed from the design-system type roles.
 * `level` chooses the visual role (and a sensible default element); pass `as`
 * to decouple the rendered tag from the visual size when the document outline
 * needs it.
 */
export type HeadingLevel = "display-2xl" | "display-xl" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const defaultTag: Record<HeadingLevel, ElementType> = {
  "display-2xl": "h1",
  "display-xl": "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
};

export type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
  level?: HeadingLevel;
  as?: ElementType;
};

export function Heading({ as, className, level = "h2", ...props }: HeadingProps) {
  const Tag = as ?? defaultTag[level];
  // createElement (not <Tag/>) so the polymorphic element type doesn't resolve
  // to `never` under a globally-augmented JSX namespace (e.g. an app that also
  // imports @react-three/fiber). Behaviour is identical.
  return createElement(Tag, {
    className: clsx(styles.heading, styles[level], className),
    ...props,
  });
}
