import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Vitest runs with the package root as cwd.
const sceneCss = readFileSync("src/styles/scene.css", "utf8");

describe("scene palette contract", () => {
  // The scroll gradient must end on the page surface token so the canvas and the
  // content below it meet without a visible seam — in every theme block.
  it("ends the scroll gradient on the page surface token in every theme", () => {
    const finalStops = [...sceneCss.matchAll(/--color-scroll-scene-bg-final:\s*([^;]+);/g)].map(
      (match) => match[1].trim(),
    );

    expect(finalStops.length).toBeGreaterThanOrEqual(2);
    for (const stop of finalStops) {
      expect(stop).toBe("var(--ex-surface-canvas)");
    }
  });
});
