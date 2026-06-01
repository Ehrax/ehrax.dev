import { Heading, Text } from "@ehrax/ui";
import { useContent } from "~/i18n/useContent";
import { Section } from "~/ui/Section/Section";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero } = useContent();
  return (
    <Section id="hero" ariaLabel="Hero" eyebrow={hero.eyebrow}>
      <Heading level="display-xl" className={styles.heading}>
        {hero.heading}
      </Heading>
      <Text variant="body-lg" tone="secondary" className={styles.lede}>
        {hero.lede}
      </Text>
    </Section>
  );
}
