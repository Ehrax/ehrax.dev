import { useContent } from "~/i18n/useContent";
import { Section } from "~/ui/Section/Section";
import styles from "./Contact.module.css";

export function Contact() {
  const { contact } = useContent();
  return (
    <Section id="contact" ariaLabel="Contact" eyebrow={contact.eyebrow}>
      <h2>{contact.heading}</h2>
      <p className={`t-body ${styles.intro}`}>{contact.intro}</p>
      <ul className={styles.links}>
        {contact.links.map((link) => (
          <li key={link.id}>
            <a
              className={`t-button ${styles.link}`}
              href={link.href}
              rel={link.kind === "email" ? undefined : "noopener noreferrer"}
              target={link.kind === "email" ? undefined : "_blank"}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
