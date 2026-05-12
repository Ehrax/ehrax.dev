import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  ariaLabel: string;
  eyebrow?: string;
  children: ReactNode;
};

export function Section({ id, ariaLabel, eyebrow, children }: SectionProps) {
  return (
    <section id={id} className={styles.section} aria-label={ariaLabel}>
      <div className={styles.inner}>
        {eyebrow ? <p className={`t-overline ${styles.eyebrow}`}>{eyebrow}</p> : null}
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
