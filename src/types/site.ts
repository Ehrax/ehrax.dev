export type Locale = "en";

export type ThemePreference = "system" | "light" | "dark";

export type ResolvedTheme = "light" | "dark";

export type WorkCard = {
  id: string;
  title: string;
  summary: string;
  role: string;
};

export type ContactLink = {
  id: string;
  label: string;
  href: string;
  kind: "email" | "social" | "profile";
};
