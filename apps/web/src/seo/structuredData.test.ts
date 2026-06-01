import { describe, expect, it } from "vitest";
import indexHtml from "../../index.html?raw";
import headers from "../../public/_headers?raw";
import { homeSearchPreview } from "./siteConfig";
import { buildHomeStructuredData } from "./structuredData";

describe("home structured data", () => {
  it("describes the editable landing page identity without project-specific claims", () => {
    expect(buildHomeStructuredData()).toEqual({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": "https://ehrax.dev/#person",
          name: "Alexander Rasputin",
          url: "https://ehrax.dev/",
          jobTitle: "Senior Product Engineer",
        },
        {
          "@type": "WebSite",
          "@id": "https://ehrax.dev/#website",
          name: "ehrax.dev",
          url: "https://ehrax.dev/",
          description: homeSearchPreview.description,
          publisher: { "@id": "https://ehrax.dev/#person" },
        },
      ],
    });
  });

  it("ships valid JSON-LD in the static document", () => {
    const doc = new DOMParser().parseFromString(indexHtml, "text/html");
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');

    expect(jsonLdScripts).toHaveLength(1);
    expect(JSON.parse(jsonLdScripts[0]?.textContent ?? "")).toEqual(buildHomeStructuredData());
  });

  it("allows the static JSON-LD through the content security policy", async () => {
    const doc = new DOMParser().parseFromString(indexHtml, "text/html");
    const jsonLd = doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "";
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(jsonLd));
    const hash = `sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}`;

    expect(headers).toContain(`'${hash}'`);
  });
});
