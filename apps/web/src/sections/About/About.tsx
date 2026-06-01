import { Heading, Stack, Text } from "@ehrax/ui";
import { useContent } from "~/i18n/useContent";
import { Section } from "~/ui/Section/Section";
import styles from "./About.module.css";

export function About() {
  const { about } = useContent();
  return (
    <Section id="about" ariaLabel="About" eyebrow={about.eyebrow}>
      <Heading level="h2">{about.heading}</Heading>
      <Stack gap={4} className={styles.paragraphs}>
        {about.paragraphs.map((paragraph) => (
          <Text key={paragraph} variant="body" tone="secondary">
            {paragraph}
          </Text>
        ))}
      </Stack>
    </Section>
  );
}
