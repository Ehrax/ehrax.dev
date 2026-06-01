import { Button as BaseButton } from "@base-ui/react/button";
import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./button.module.css";

/**
 * Button — single-axis variant model (variant carries both emphasis + intent),
 * dressed in the ehrax "premium Linear" look: crisp 1px edge, soft lit
 * highlight on solids, decisive focus ring.
 */
export type ButtonVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";

export type ButtonProps = ComponentPropsWithoutRef<typeof BaseButton> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  size = "default",
  type = "button",
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={clsx(styles.button, styles[`size-${size}`], styles[variant], className)}
      type={type}
      {...props}
    />
  );
}
