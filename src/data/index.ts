import { type SiteContent, siteContentSchema } from "~/schemas/siteContent";
import type { Locale } from "~/types/site";
import { en } from "./en";

const rawContent: Record<Locale, SiteContent> = {
  en,
};

export const siteContent: Record<Locale, SiteContent> = Object.fromEntries(
  Object.entries(rawContent).map(([locale, content]) => [locale, siteContentSchema.parse(content)]),
) as Record<Locale, SiteContent>;

export const defaultLocale: Locale = "en";
