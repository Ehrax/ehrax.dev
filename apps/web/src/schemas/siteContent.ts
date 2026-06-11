import { z } from "zod";

export const workCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  // Bento footprint: how much of the grid the card claims.
  size: z.enum(["standard", "wide", "tall"]).default("standard"),
});

export const contactLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  kind: z.enum(["email", "social", "profile"]),
});

export const siteContentSchema = z.object({
  nav: z.object({
    hero: z.string().min(1),
    about: z.string().min(1),
    work: z.string().min(1),
    contact: z.string().min(1),
    toggleTheme: z.string().min(1),
  }),
  hero: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    lede: z.string().min(1),
  }),
  about: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),
  work: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    intro: z.string().min(1),
    cards: z.array(workCardSchema).min(1),
  }),
  contact: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    prompt: z.string().min(1),
    email: z.string().min(1),
    links: z.array(contactLinkSchema).min(1),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
