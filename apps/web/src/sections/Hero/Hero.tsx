import { Heading } from "@ehrax/ui";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useContent } from "~/i18n/useContent";
import { getSceneEffectOpacity } from "~/scene/sceneTransition";
import { useSceneStore } from "~/state/sceneStore";
import { Section } from "~/ui/Section/Section";
import { GlitchRole } from "./GlitchRole";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero } = useContent();
  const navRevealed = useSceneStore((s) => s.navRevealed);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const unsub = useSceneStore.subscribe((state) => {
      el.style.opacity = String(getSceneEffectOpacity(state.controllerValue));
    });
    return unsub;
  }, []);

  return (
    <Section id="hero" ariaLabel="Hero">
      {/* Hero copy is parked for now — the blueprint scene carries the hero alone.
          Keep the h1 in the document outline for accessibility and SEO. */}
      <Heading level="h1" className={styles.srOnly}>
        {hero.heading}
      </Heading>

      {/* Identity overlay: decorative duplicate of identity, not the page h1.
          Portaled to <body> because ancestor transforms (scroll parallax
          wrappers) would otherwise hijack its fixed positioning. */}
      {createPortal(
        <div ref={overlayRef} className={styles.overlay}>
          <div className={styles.identity} data-visible={navRevealed}>
            <GlitchRole className={styles.role} />
            <span className={styles.name}>Alexander Rasputin</span>
          </div>
        </div>,
        document.body,
      )}
    </Section>
  );
}
