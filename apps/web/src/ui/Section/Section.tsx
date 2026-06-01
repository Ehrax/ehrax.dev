import { Text } from "@ehrax/ui";
import type { CSSProperties, ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  ariaLabel: string;
  eyebrow?: string;
  children: ReactNode;
};

export function Section({ id, ariaLabel, eyebrow, children }: SectionProps) {
  return (
    <section
      id={id}
      className={styles.section}
      aria-label={ariaLabel}
      data-scroll-reveal-section={id}
      style={
        {
          "--section-exit-progress": "0",
          "--section-depth-progress": "0",
          "--section-reveal-progress": "1",
        } as CSSProperties
      }
    >
      <div className={styles.inner}>
        {eyebrow ? (
          <Text
            as="p"
            variant="overline"
            tone="secondary"
            className={styles.eyebrow}
            data-scroll-reveal-item
          >
            {eyebrow}
          </Text>
        ) : null}
        <div className={styles.body} data-scroll-reveal-item>
          {children}
        </div>
      </div>
    </section>
  );
}
