export { siteMetadata } from "./siteConfig";

import { siteMetadata } from "./siteConfig";

export function absoluteSiteUrl(path: string) {
  return new URL(path, siteMetadata.baseUrl).toString();
}
