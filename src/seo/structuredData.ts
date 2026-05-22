import { homeSearchPreview } from "./siteConfig";
import { absoluteSiteUrl, siteMetadata } from "./siteMetadata";

export type StructuredDataGraph = {
  "@context": "https://schema.org";
  "@graph": Array<Record<string, unknown>>;
};

export function buildHomeStructuredData(): StructuredDataGraph {
  const personId = `${absoluteSiteUrl("/")}#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteMetadata.author,
        url: absoluteSiteUrl("/"),
        jobTitle: siteMetadata.jobTitle,
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteSiteUrl("/")}#website`,
        name: siteMetadata.siteName,
        url: absoluteSiteUrl("/"),
        description: homeSearchPreview.description,
        publisher: { "@id": personId },
      },
    ],
  };
}
