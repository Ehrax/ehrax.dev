import { describe, expect, it } from "vitest";
import { en } from "~/data/en";
import { siteContentSchema } from "./siteContent";

describe("siteContentSchema", () => {
  it("accepts the bundled English content", () => {
    expect(() => siteContentSchema.parse(en)).not.toThrow();
  });

  it("rejects content missing required fields", () => {
    expect(() => siteContentSchema.parse({})).toThrow();
  });
});
