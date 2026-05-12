import { useContent } from "~/i18n/useContent";
import { ThemeToggle } from "~/ui/ThemeToggle/ThemeToggle";
import styles from "./Nav.module.css";

type NavLink = { id: string; label: string; href: string };

export function Nav() {
  const { nav } = useContent();
  const links: NavLink[] = [
    { id: "hero", label: nav.hero, href: "#hero" },
    { id: "about", label: nav.about, href: "#about" },
    { id: "work", label: nav.work, href: "#work" },
    { id: "contact", label: nav.contact, href: "#contact" },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <a href="#hero" className={`t-button ${styles.brand}`}>
          ehrax.dev
        </a>
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.id}>
              <a className={`t-button ${styles.link}`} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
