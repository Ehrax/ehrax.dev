import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";

const ROLE_WORDS = ["Product Engineer", "Builder", "UI & UX"];
const GLITCH_GLYPHS = "▓▒░<>/\\|=+*#_";

/**
 * Cycles through ROLE_WORDS with a left-to-right glitch-scramble resolve.
 * Each word holds for 3600ms; resolution takes 14 steps at 50ms each.
 * Reduced-motion: shows the first word statically with no animation.
 */
export function GlitchRole({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [text, setText] = useState(ROLE_WORDS[0]);

  useEffect(() => {
    if (reducedMotion) return;

    let wordIndex = 0;
    let frame = 0;
    let scrambleTimer: ReturnType<typeof setInterval> | undefined;

    const cycle = setInterval(() => {
      wordIndex = (wordIndex + 1) % ROLE_WORDS.length;
      const target = ROLE_WORDS[wordIndex];
      const steps = 14;
      frame = 0;
      clearInterval(scrambleTimer);
      scrambleTimer = setInterval(() => {
        frame += 1;
        const resolved = Math.floor((frame / steps) * target.length);
        let next = "";
        for (let i = 0; i < target.length; i++) {
          if (i < resolved || target[i] === " ") next += target[i];
          else next += GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
        }
        setText(next);
        if (frame >= steps) clearInterval(scrambleTimer);
      }, 50);
    }, 3600);

    return () => {
      clearInterval(cycle);
      clearInterval(scrambleTimer);
    };
  }, [reducedMotion]);

  return <span className={className}>{text}</span>;
}
