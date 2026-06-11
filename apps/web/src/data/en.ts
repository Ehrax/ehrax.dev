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
        summary:
          "Placeholder summary describing a small product-focused engineering effort. This wide flagship slot will later carry the lead case study with imagery and outcome metrics.",
        role: "Product engineering",
        size: "wide",
      },
      {
        id: "card-b",
        title: "Project beta",
        summary: "Placeholder summary describing an end-to-end application delivery effort.",
        role: "Full-stack delivery",
        size: "standard",
      },
      {
        id: "card-c",
        title: "Project gamma",
        summary:
          "Placeholder summary describing agentic engineering and orchestration work. The tall slot leaves room for a vertical visual or a longer narrative arc.",
        role: "Agentic engineering",
        size: "tall",
      },
      {
        id: "card-d",
        title: "Project delta",
        summary: "Placeholder summary describing a design-system and tooling investment.",
        role: "Design systems",
        size: "standard",
      },
      {
        id: "card-e",
        title: "Project epsilon",
        summary: "Placeholder summary describing performance and reliability work on the edge.",
        role: "Platform engineering",
        size: "standard",
      },
      {
        id: "card-f",
        title: "Project zeta",
        summary:
          "Placeholder summary describing a developer-experience initiative. Another wide slot closing the grid so the section ends on a full-width beat before the outro.",
        role: "Developer experience",
        size: "wide",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Want to get in touch? Or just say hi?",
    prompt: "Drop me a line at",
    email: "hello@ehrax.dev",
    links: [
      { id: "github", label: "GitHub", href: "https://github.com/Ehrax", kind: "profile" },
      { id: "x", label: "X", href: "https://x.com/", kind: "social" },
      { id: "email", label: "Email", href: "mailto:hello@ehrax.dev", kind: "email" },
    ],
  },
};
