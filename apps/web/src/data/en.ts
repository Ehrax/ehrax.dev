import type { SiteContent } from "~/schemas/siteContent";

export const en: SiteContent = {
  nav: {
    hero: "Top",
    about: "About",
    work: "Work",
    contact: "Contact",
    toggleTheme: "Toggle theme",
  },
  hero: {
    eyebrow: "Personal site",
    heading: "Provisional headline for a senior product engineer.",
    lede: "Scaffold placeholder copy. Positioning, tone, and brand language will be defined after the foundation is in place.",
  },
  about: {
    eyebrow: "About",
    heading: "About section placeholder.",
    paragraphs: [
      "This paragraph is placeholder content for the about section. It will later describe scope, focus areas, and working style.",
      "Copy is loaded through the i18n layer so that future locales and revisions stay separated from component code.",
    ],
  },
  work: {
    eyebrow: "Selected work",
    heading: "Lightweight selected-work cards.",
    intro: "Cards are placeholders. Final case study content arrives after the scaffold lands.",
    cards: [
      {
        id: "card-a",
        title: "Project alpha",
        summary: "Placeholder summary describing a small product-focused engineering effort.",
        role: "Product engineering",
      },
      {
        id: "card-b",
        title: "Project beta",
        summary: "Placeholder summary describing an end-to-end application delivery effort.",
        role: "Full-stack delivery",
      },
      {
        id: "card-c",
        title: "Project gamma",
        summary: "Placeholder summary describing agentic engineering and orchestration work.",
        role: "Agentic engineering",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Get in touch.",
    intro: "Direct links only. No form, no backend, no analytics for the scaffold.",
    links: [
      { id: "email", label: "Email", href: "mailto:hello@ehrax.dev", kind: "email" },
      { id: "github", label: "GitHub", href: "https://github.com/Ehrax", kind: "profile" },
      { id: "x", label: "X", href: "https://x.com/", kind: "social" },
    ],
  },
};
