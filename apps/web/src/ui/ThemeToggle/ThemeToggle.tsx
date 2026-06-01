import { Button, Icon, type IconName } from "@ehrax/ui";
import { useContent } from "~/i18n/useContent";
import { useAppStore } from "~/state/appStore";

const ICON: Record<string, IconName> = {
  system: "Monitor",
  light: "Sun",
  dark: "Moon",
};

export function ThemeToggle() {
  const { nav } = useContent();
  const preference = useAppStore((s) => s.themePreference);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={nav.toggleTheme}
      title={nav.toggleTheme}
    >
      <Icon name={ICON[preference]} size="sm" />
    </Button>
  );
}
