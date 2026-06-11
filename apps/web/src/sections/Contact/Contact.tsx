import { Heading } from "@ehrax/ui";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useContent } from "~/i18n/useContent";
import { nameFadeOpacity } from "~/scene/scenes/landingTuning";
import { useSceneStore } from "~/state/sceneStore";
import { Section } from "~/ui/Section/Section";
import styles from "./Contact.module.css";
import { GlitchEmail } from "./GlitchEmail";

export function Contact() {
  const { contact } = useContent();
  const overlayRef = useRef<HTMLDivElement>(null);

  // The email line tracks the particle title: a fixed overlay that fades in on
  // the same finale window (contact progress), parked just below the title
  // in the upper third. Driven imperatively — no per-scroll re-render.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const apply = (progress: number) => {
      el.style.opacity = String(nameFadeOpacity(progress));
    };
    apply(useSceneStore.getState().contactProgress);
    return useSceneStore.subscribe((state) => apply(state.contactProgress));
  }, []);

  return (
    <Section id="contact" ariaLabel="Contact">
      {/* The visible contact title is rendered as the particle finale in the
          scene; keep the real heading in the document outline for a11y + SEO. */}
      <Heading level="h2" className={styles.srOnly}>
        {contact.heading}
      </Heading>
      {/* The link buttons render in the canvas (decorative, aria-hidden); this
          mirrored list keeps them in the a11y tree and crawlable for SEO. */}
      <ul className={styles.srOnly}>
        {contact.links.map((link) => (
          <li key={link.id}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      {createPortal(
        <div ref={overlayRef} className={styles.invite}>
          <GlitchEmail prompt={contact.prompt} email={contact.email} />
        </div>,
        document.body,
      )}
    </Section>
  );
}
