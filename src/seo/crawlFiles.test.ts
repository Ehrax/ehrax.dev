import { describe, expect, it } from "vitest";
import robotsTxt from "../../public/robots.txt?raw";
import sitemapXml from "../../public/sitemap.xml?raw";
import { absoluteSiteUrl } from "./siteMetadata";
import { siteRoutes } from "./siteRoutes";

describe("crawl files", () => {
  it("allows crawling and points crawlers at the sitemap", () => {
    expect(robotsTxt).toContain("User-agent: *");
    expect(robotsTxt).toContain("Allow: /");
    expect(robotsTxt).toContain(`Sitemap: ${absoluteSiteUrl("/sitemap.xml")}`);
  });

  it("lists the landing page canonical URL in the sitemap", () => {
    const doc = new DOMParser().parseFromString(sitemapXml, "application/xml");

    expect(doc.querySelector("urlset")?.getAttribute("xmlns")).toBe(
      "http://www.sitemaps.org/schemas/sitemap/0.9",
    );
    expect(doc.querySelector("url loc")?.textContent).toBe(absoluteSiteUrl("/"));
  });

  it("keeps the route registry as the sitemap source of truth", () => {
    const doc = new DOMParser().parseFromString(sitemapXml, "application/xml");
    const sitemapUrls = Array.from(doc.querySelectorAll("url loc"), (node) => node.textContent);

    expect(sitemapUrls).toEqual(siteRoutes.map((route) => absoluteSiteUrl(route.path)));
  });
});
