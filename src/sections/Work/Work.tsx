import { useContent } from "~/i18n/useContent";
import { Section } from "~/ui/Section/Section";
import styles from "./Work.module.css";
import { WorkCard } from "./WorkCard";

export function Work() {
  const { work } = useContent();
  return (
    <Section id="work" ariaLabel="Selected work" eyebrow={work.eyebrow}>
      <h2>{work.heading}</h2>
      <p className={`t-body ${styles.intro}`}>{work.intro}</p>
      <ul className={styles.grid}>
        {work.cards.map((card) => (
          <li key={card.id}>
            <WorkCard card={card} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
