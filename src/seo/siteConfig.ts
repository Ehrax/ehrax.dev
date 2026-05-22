import { z } from "zod";
import rawSiteConfig from "../../site.config.json";

export const searchPreviewSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(200),
  imagePath: z.string().startsWith("/"),
  imageAlt: z.string().min(1),
  type: z.enum(["website", "profile"]).default("profile"),
  robots: z.string().min(1).default("index,follow"),
});

export const siteRouteSchema = z.object({
  path: z.string().startsWith("/"),
  changeFrequency: z.enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]),
  priority: z.number().min(0).max(1),
  searchPreview: searchPreviewSchema,
});

export const siteConfigSchema = z.object({
  site: z.object({
    baseUrl: z.string().url(),
    siteName: z.string().min(1),
    author: z.string().min(1),
    locale: z.string().min(1),
    language: z.string().min(2),
    jobTitle: z.string().min(1),
    themeColor: z.string().min(1),
  }),
  routes: z.array(siteRouteSchema).min(1),
});

export type SearchPreviewMetadata = z.infer<typeof searchPreviewSchema>;
export type SiteRoute = z.infer<typeof siteRouteSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;

export const siteConfig = siteConfigSchema.parse(rawSiteConfig);
export const siteMetadata = siteConfig.site;
export const siteRoutes = siteConfig.routes;

const homeRoute = siteRoutes.find((route) => route.path === "/");
if (!homeRoute) throw new Error("site.config.json must define the landing page route at /");

export const homeSearchPreview = homeRoute.searchPreview;
