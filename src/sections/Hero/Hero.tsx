import { useContent } from "~/i18n/useContent";
import { Section } from "~/ui/Section/Section";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero } = useContent();
  return (
    <Section id="hero" ariaLabel="Hero" eyebrow={hero.eyebrow}>
      <h1 className={styles.heading}>{hero.heading}</h1>
      <p className={`t-body ${styles.lede}`}>{hero.lede}</p>
    </Section>
  );
}
