import type { WorkCard as WorkCardType } from "~/types/site";
import styles from "./WorkCard.module.css";

type WorkCardProps = {
  card: WorkCardType;
};

export function WorkCard({ card }: WorkCardProps) {
  return (
    <article className={styles.card} aria-labelledby={`${card.id}-title`}>
      <p className={`t-overline ${styles.role}`}>{card.role}</p>
      <h3 id={`${card.id}-title`} className={styles.title}>
        {card.title}
      </h3>
      <p className={`t-body ${styles.summary}`}>{card.summary}</p>
    </article>
  );
}
