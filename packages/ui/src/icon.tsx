import { icons, type LucideProps } from "lucide-react";
import { forwardRef } from "react";

export type IconName = keyof typeof icons;

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

export type IconProps = Omit<LucideProps, "size"> & {
  name: IconName;
  size?: IconSize | number;
};

/**
 * Icon — a single seam over lucide-react. Pick a glyph by `name`, size with the
 * token-aligned scale (or a raw px number). Decorative by default
 * (`aria-hidden`); pass `aria-label` to promote it to a labelled image.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = "md", strokeWidth = 1.75, ...props },
  ref,
) {
  const Glyph = icons[name];
  const px = typeof size === "number" ? size : sizeMap[size];
  return (
    <Glyph
      ref={ref}
      size={px}
      strokeWidth={strokeWidth}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    />
  );
});
