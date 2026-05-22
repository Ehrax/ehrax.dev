import { useContent } from "~/i18n/useContent";
import { useSceneStore } from "~/state/sceneStore";
import styles from "./Nav.module.css";

type NavLink = { id: string; label: string; href: string };

export function Nav() {
  const { nav } = useContent();
  const activeSection = useSceneStore((s) => s.activeSection);
  const navRevealed = useSceneStore((s) => s.navRevealed);
  const links: NavLink[] = [
    { id: "about", label: nav.about, href: "#about" },
    { id: "work", label: nav.work, href: "#work" },
    { id: "contact", label: nav.contact, href: "#contact" },
  ];

  return (
    <header className={styles.header} data-visible={navRevealed} aria-hidden={!navRevealed}>
      <nav className={styles.nav} aria-label="Primary">
        <div className={styles.backdrop} />
        <a href="#hero" className={styles.brand} aria-label="ehrax.dev home">
          <span className={styles.mark}>ehrax.dev</span>
        </a>
        <div className={styles.divider} aria-hidden="true" />
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.id}>
              <a
                className={styles.link}
                href={link.href}
                aria-current={activeSection === link.id ? "page" : undefined}
                data-active={activeSection === link.id}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
