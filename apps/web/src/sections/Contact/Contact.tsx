import { Heading, Link, Text } from "@ehrax/ui";
import { useContent } from "~/i18n/useContent";
import { Section } from "~/ui/Section/Section";
import styles from "./Contact.module.css";

export function Contact() {
  const { contact } = useContent();
  return (
    <Section id="contact" ariaLabel="Contact" eyebrow={contact.eyebrow}>
      <Heading level="h2">{contact.heading}</Heading>
      <Text variant="body" tone="secondary" className={styles.intro}>
        {contact.intro}
      </Text>
      <ul className={styles.links}>
        {contact.links.map((link) => (
          <li key={link.id}>
            <Link
              variant="subtle"
              className={styles.link}
              href={link.href}
              external={link.kind !== "email"}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
