import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIST_DIR = "dist";
const config = JSON.parse(readFileSync("site.config.json", "utf8"));

function fail(message) {
  throw new Error(`static deploy check failed: ${message}`);
}

function readDistText(path) {
  const fullPath = join(DIST_DIR, path);
  if (!existsSync(fullPath)) fail(`missing ${fullPath}`);
  return readFileSync(fullPath, "utf8");
}

function requireDistFile(path) {
  const fullPath = join(DIST_DIR, path);
  if (!existsSync(fullPath)) fail(`missing ${fullPath}`);
}

function absoluteUrl(path) {
  return new URL(path, config.site.baseUrl).toString();
}

function countMatches(text, pattern) {
  return text.match(pattern)?.length ?? 0;
}

function getJsonLd(indexHtml) {
  const match = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match?.[1]) fail("missing JSON-LD script in dist/index.html");
  return match[1];
}

const indexHtml = readDistText("index.html");
if (countMatches(indexHtml, /<title>/g) !== 1) fail("expected exactly one title tag");
if (countMatches(indexHtml, /<meta name="description"/g) !== 1) {
  fail("expected exactly one meta description");
}
if (countMatches(indexHtml, /<link rel="canonical"/g) !== 1) {
  fail("expected exactly one canonical link");
}
if (countMatches(indexHtml, /<meta property="og:image"/g) !== 1) {
  fail("expected exactly one og:image tag");
}

const homeRoute = config.routes.find((route) => route.path === "/");
if (!homeRoute) fail("site.config.json must define /");
if (!indexHtml.includes(`<title>${homeRoute.searchPreview.title}</title>`)) {
  fail("dist/index.html title does not match site.config.json");
}
if (!indexHtml.includes(`href="${absoluteUrl("/")}"`)) {
  fail("dist/index.html canonical URL does not match site.config.json");
}

JSON.parse(getJsonLd(indexHtml));

const headers = readDistText("_headers");
const jsonLdHash = `sha256-${createHash("sha256").update(getJsonLd(indexHtml)).digest("base64")}`;
if (!headers.includes(`'${jsonLdHash}'`)) fail("CSP does not allow the static JSON-LD hash");

const robots = readDistText("robots.txt");
if (!robots.includes(`Sitemap: ${absoluteUrl("/sitemap.xml")}`)) {
  fail("robots.txt does not point to the sitemap");
}

const sitemap = readDistText("sitemap.xml");
for (const route of config.routes) {
  if (!sitemap.includes(`<loc>${absoluteUrl(route.path)}</loc>`)) {
    fail(`sitemap.xml is missing ${route.path}`);
  }
}

requireDistFile("og-image.png");
requireDistFile("favicon.ico");

const assetsDir = join(DIST_DIR, "assets");
if (!existsSync(assetsDir)) fail("missing dist/assets");
const assets = readdirSync(assetsDir);
if (!assets.some((asset) => asset.endsWith(".js"))) fail("dist/assets has no JavaScript bundle");
if (!assets.some((asset) => asset.endsWith(".css"))) fail("dist/assets has no CSS bundle");

console.log("static deploy check passed");
