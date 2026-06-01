import { useRender } from "@base-ui/react/use-render";
import clsx from "clsx";
import styles from "./link.module.css";

/**
 * Link — a text anchor in the ehrax look. Domain-free and polymorphic via Base
 * UI's `useRender`, so a router `<Link>` can stand in for the default `<a>`.
 * `external` opts into safe new-tab semantics (`target`/`rel`) in one place.
 */
export type LinkVariant = "default" | "subtle";
export type LinkSize = "sm" | "md" | "lg";

export type LinkProps = useRender.ComponentProps<"a"> & {
  variant?: LinkVariant;
  size?: LinkSize;
  underline?: boolean;
  external?: boolean;
};

export function Link({
  className,
  external,
  render,
  size = "md",
  underline,
  variant = "default",
  ...props
}: LinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: {
      className: clsx(
        styles.link,
        styles[`size-${size}`],
        variant === "subtle" && styles.subtle,
        underline && styles.underline,
        className,
      ),
      ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      ...props,
    },
  });
}
