import { describe, expect, it } from "vitest";
import indexHtml from "../../index.html?raw";
import { homeSearchPreview } from "./siteConfig";
import { absoluteSiteUrl } from "./siteMetadata";

describe("static search preview tags", () => {
  it("keeps index.html aligned with the landing page metadata", () => {
    const doc = new DOMParser().parseFromString(indexHtml, "text/html");

    expect(doc.head.querySelectorAll("title")).toHaveLength(1);
    expect(doc.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(doc.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(doc.head.querySelectorAll('meta[property="og:image"]')).toHaveLength(1);

    expect(doc.title).toBe(homeSearchPreview.title);
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      homeSearchPreview.description,
    );
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      absoluteSiteUrl("/"),
    );
    expect(doc.querySelector('meta[property="og:image"]')?.getAttribute("content")).toBe(
      absoluteSiteUrl(homeSearchPreview.imagePath),
    );
  });
});
