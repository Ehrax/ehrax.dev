import { NavBar } from "@ehrax/ui";
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
      <NavBar.Root aria-label="Primary" className={styles.bar}>
        <NavBar.Brand href="#hero" aria-label="ehrax.dev home">
          <span className={styles.mark}>
            <span className={styles.markLetter}>{"{E}"}</span>
            <span className={styles.markCaret} data-testid="logo-caret" aria-hidden="true" />
          </span>
        </NavBar.Brand>
        <NavBar.Divider />
        <NavBar.List>
          {links.map((link) => (
            <NavBar.Item key={link.id}>
              <NavBar.Link href={link.href} active={activeSection === link.id}>
                {link.label}
              </NavBar.Link>
            </NavBar.Item>
          ))}
        </NavBar.List>
      </NavBar.Root>
    </header>
  );
}
