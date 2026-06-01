import { Separator } from "@base-ui/react/separator";
import { useRender } from "@base-ui/react/use-render";
import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./navbar.module.css";

/**
 * NavBar — the floating, glassy "pill" navigation primitive that sets the
 * ehrax premium Linear look. Domain-free: the consumer supplies the brand,
 * the links, the active state, and any reveal/positioning behavior.
 *
 *   <NavBar.Root aria-label="Primary">
 *     <NavBar.Brand href="#hero" aria-label="ehrax.dev home">{...}</NavBar.Brand>
 *     <NavBar.Divider />
 *     <NavBar.List>
 *       <NavBar.Item><NavBar.Link href="#work" active>Work</NavBar.Link></NavBar.Item>
 *     </NavBar.List>
 *   </NavBar.Root>
 *
 * Brand + Link are polymorphic via Base UI's `useRender` `render` prop, so a
 * router `<Link>` can stand in for the default `<a>`.
 */

function Root({ className, children, ...props }: ComponentPropsWithoutRef<"nav">) {
  return (
    <nav className={clsx(styles.nav, className)} {...props}>
      <span className={styles.backdrop} aria-hidden="true" />
      {children}
    </nav>
  );
}

type BrandProps = useRender.ComponentProps<"a">;
function Brand({ className, render, ...props }: BrandProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: { className: clsx(styles.brand, className), ...props },
  });
}

function Divider({ className, ...props }: ComponentPropsWithoutRef<typeof Separator>) {
  return (
    <Separator orientation="vertical" className={clsx(styles.divider, className)} {...props} />
  );
}

function List({ className, ...props }: ComponentPropsWithoutRef<"ul">) {
  return <ul className={clsx(styles.list, className)} {...props} />;
}

function Item({ className, ...props }: ComponentPropsWithoutRef<"li">) {
  return <li className={clsx(styles.item, className)} {...props} />;
}

type LinkProps = useRender.ComponentProps<"a"> & { active?: boolean };
function Link({ className, render, active, ...props }: LinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: {
      className: clsx(styles.link, className),
      "data-active": active || undefined,
      "aria-current": active ? "page" : undefined,
      ...props,
    },
  });
}

export const NavBar = { Root, Brand, Divider, List, Item, Link };
