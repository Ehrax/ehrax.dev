import { useContent } from "~/i18n/useContent";
import { Section } from "~/ui/Section/Section";
import styles from "./About.module.css";

export function About() {
  const { about } = useContent();
  return (
    <Section id="about" ariaLabel="About" eyebrow={about.eyebrow}>
      <h2>{about.heading}</h2>
      <div className={styles.paragraphs}>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="t-body">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
