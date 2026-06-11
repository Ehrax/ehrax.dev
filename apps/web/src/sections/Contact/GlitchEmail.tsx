import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import styles from "./GlitchEmail.module.css";

const SCRAMBLE_GLYPHS = "0134578#%/¦≡∆";

// Briefly corrupt a few characters, echoing the in-scene telemetry readouts.
// Spaces and the "@"/"." anchors stay put so the address remains recognisable.
function scramble(text: string): string {
  let out = "";
  for (const ch of text) {
    out +=
      ch !== " " && ch !== "@" && ch !== "." && Math.random() < 0.08
        ? SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
        : ch;
  }
  return out;
}

/**
 * The closing email line rendered in the drafting-telemetry voice: a mono,
 * RGB-split address that flickers a glyph now and then, wrapped in a real
 * mailto link. Reduced motion shows it static.
 */
export function GlitchEmail({ prompt, email }: { prompt: string; email: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [shown, setShown] = useState(email);

  useEffect(() => {
    if (reducedMotion) {
      setShown(email);
      return;
    }
    const id = setInterval(() => {
      // Mostly resolved, with the occasional flicker frame.
      setShown(Math.random() < 0.4 ? scramble(email) : email);
    }, 140);
    return () => clearInterval(id);
  }, [email, reducedMotion]);

  return (
    <p className={styles.line}>
      <span className={styles.prompt}>{prompt}</span>{" "}
      <a className={styles.email} href={`mailto:${email}`} data-glitch={shown}>
        {shown}
      </a>
    </p>
  );
}
