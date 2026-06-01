import { Heading, Text } from "@ehrax/ui";
import { useContent } from "~/i18n/useContent";
import { Section } from "~/ui/Section/Section";
import styles from "./Work.module.css";
import { WorkCard } from "./WorkCard";

export function Work() {
  const { work } = useContent();
  return (
    <Section id="work" ariaLabel="Selected work" eyebrow={work.eyebrow}>
      <Heading level="h2">{work.heading}</Heading>
      <Text variant="body" tone="secondary" className={styles.intro}>
        {work.intro}
      </Text>
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
