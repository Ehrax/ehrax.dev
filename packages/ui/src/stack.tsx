import clsx from "clsx";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import styles from "./stack.module.css";

/** Any step on the spacing scale (`--ex-space-{n}`). */
export type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12 | 16;
export type StackAlign = "start" | "center" | "end" | "stretch";
export type StackJustify = "start" | "center" | "end" | "between" | "around";

export type StackProps = ComponentPropsWithoutRef<"div"> & {
  direction?: "row" | "col";
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
};

export function Stack({
  align,
  className,
  direction = "col",
  gap = 4,
  justify,
  style,
  wrap,
  ...props
}: StackProps) {
  return (
    <div
      className={clsx(
        styles.stack,
        styles[direction],
        align && styles[`align-${align}` as const],
        justify && styles[`justify-${justify}` as const],
        wrap && styles.wrap,
        className,
      )}
      style={{ "--stack-gap": gap ? `var(--ex-space-${gap})` : "0", ...style } as CSSProperties}
      {...props}
    />
  );
}

export function HStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="row" {...props} />;
}

export function VStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="col" {...props} />;
}
