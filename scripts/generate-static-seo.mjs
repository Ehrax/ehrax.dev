import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const SITE_CONFIG_PATH = "site.config.json";
const INDEX_PATH = "index.html";
const HEADERS_PATH = "public/_headers";
const ROBOTS_PATH = "public/robots.txt";
const SITEMAP_PATH = "public/sitemap.xml";

const textEncoder = new TextEncoder();

function absoluteUrl(site, path) {
  return new URL(path, site.baseUrl).toString();
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildHomeStructuredData(config) {
  const homeUrl = absoluteUrl(config.site, "/");
  const personId = `${homeUrl}#person`;
  const homeRoute = getHomeRoute(config);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: config.site.author,
        url: homeUrl,
        jobTitle: config.site.jobTitle,
      },
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        name: config.site.siteName,
        url: homeUrl,
        description: homeRoute.searchPreview.description,
        publisher: { "@id": personId },
      },
    ],
  };
}

function getHomeRoute(config) {
  const route = config.routes.find((candidate) => candidate.path === "/");
  if (!route) throw new Error(`${SITE_CONFIG_PATH} must define the landing page route at /`);
  return route;
}

function buildSeoBlock(config) {
  const homeRoute = getHomeRoute(config);
  const preview = homeRoute.searchPreview;
  const canonicalUrl = absoluteUrl(config.site, homeRoute.path);
  const imageUrl = absoluteUrl(config.site, preview.imagePath);
  const structuredData = JSON.stringify(buildHomeStructuredData(config));

  return [
    "    <!-- seo:start -->",
    `    <title>${escapeAttribute(preview.title)}</title>`,
    `    <meta name="description" content="${escapeAttribute(preview.description)}" />`,
    `    <meta name="robots" content="${escapeAttribute(preview.robots)}" />`,
    `    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`,
    `    <meta property="og:type" content="${escapeAttribute(preview.type)}" />`,
    `    <meta property="og:site_name" content="${escapeAttribute(config.site.siteName)}" />`,
    `    <meta property="og:locale" content="${escapeAttribute(config.site.locale)}" />`,
    `    <meta property="og:title" content="${escapeAttribute(preview.title)}" />`,
    `    <meta property="og:description" content="${escapeAttribute(preview.description)}" />`,
    `    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />`,
    `    <meta property="og:image" content="${escapeAttribute(imageUrl)}" />`,
    `    <meta property="og:image:alt" content="${escapeAttribute(preview.imageAlt)}" />`,
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${escapeAttribute(preview.title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttribute(preview.description)}" />`,
    `    <meta name="twitter:image" content="${escapeAttribute(imageUrl)}" />`,
    `    <meta name="twitter:image:alt" content="${escapeAttribute(preview.imageAlt)}" />`,
    `    <script type="application/ld+json">${structuredData}</script>`,
    "    <!-- seo:end -->",
  ].join("\n");
}

function buildSitemap(config) {
  const urls = config.routes
    .map(
      (route) => `  <url>
    <loc>${absoluteUrl(config.site, route.path)}</loc>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots(config) {
  return `User-agent: *
Allow: /
Sitemap: ${absoluteUrl(config.site, "/sitemap.xml")}
`;
}

function getJsonLdFromIndex(indexHtml) {
  const match = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match?.[1]) throw new Error("index.html is missing the static JSON-LD script");
  return match[1];
}

function cspHashForInlineScript(scriptText) {
  return `sha256-${createHash("sha256").update(textEncoder.encode(scriptText)).digest("base64")}`;
}

async function writeIfChanged(path, nextContent) {
  let current = "";
  try {
    current = await readFile(path, "utf8");
  } catch {
    // Missing generated files are written below.
  }

  if (current !== nextContent) {
    await writeFile(path, nextContent);
    console.log(`updated ${path}`);
  }
}

const config = JSON.parse(await readFile(SITE_CONFIG_PATH, "utf8"));
const indexHtml = await readFile(INDEX_PATH, "utf8");
const seoBlock = buildSeoBlock(config);
const nextIndexHtml = indexHtml.replace(
  / {4}<!-- seo:start -->[\s\S]*? {4}<!-- seo:end -->/,
  seoBlock,
);

if (nextIndexHtml === indexHtml && !indexHtml.includes("<!-- seo:start -->")) {
  throw new Error("index.html is missing the seo:start and seo:end markers");
}

const jsonLdHash = cspHashForInlineScript(getJsonLdFromIndex(nextIndexHtml));
const headers = await readFile(HEADERS_PATH, "utf8");
const nextHeaders = headers.replace(
  /(script-src 'self')(?: 'sha256-[^']+')?/,
  `$1 '${jsonLdHash}'`,
);

await writeIfChanged(INDEX_PATH, nextIndexHtml);
await writeIfChanged(HEADERS_PATH, nextHeaders);
await writeIfChanged(ROBOTS_PATH, buildRobots(config));
await writeIfChanged(SITEMAP_PATH, buildSitemap(config));
