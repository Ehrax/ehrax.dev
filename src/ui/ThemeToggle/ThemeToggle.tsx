import { useContent } from "~/i18n/useContent";
import { useAppStore } from "~/state/appStore";
import styles from "./ThemeToggle.module.css";

const ICON: Record<string, string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
};

export function ThemeToggle() {
  const { nav } = useContent();
  const preference = useAppStore((s) => s.themePreference);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <button
      type="button"
      className={`t-button ${styles.toggle}`}
      onClick={toggleTheme}
      aria-label={nav.toggleTheme}
      title={nav.toggleTheme}
    >
      {ICON[preference]}
    </button>
  );
}
