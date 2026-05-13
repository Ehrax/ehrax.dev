import { Link, createFileRoute } from "@tanstack/react-router";
import styles from "./__root.module.css";

export const Route = createFileRoute("/$")({
  component: NotFound,
});

function NotFound() {
  return (
    <section className={styles.fallback}>
      <p className={styles.fallbackEyebrow}>404</p>
      <h1 className={styles.fallbackTitle}>Page not found</h1>
      <p className={styles.fallbackBody}>
        The page you tried to reach doesn't exist.
      </p>
      <Link to="/" className={styles.fallbackLink}>
        ← Back home
      </Link>
    </section>
  );
}
