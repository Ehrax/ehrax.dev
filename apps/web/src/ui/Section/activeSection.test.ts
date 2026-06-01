import { describe, expect, it } from "vitest";
import { getActiveSectionFromRects, hasSectionReachedNavReveal } from "./activeSection";

describe("active section", () => {
  it("keeps the hero active before the about section reaches the reading line", () => {
    expect(
      getActiveSectionFromRects({
        viewportHeight: 1_000,
        sections: [
          { id: "hero", top: -300, bottom: 700 },
          { id: "about", top: 500, bottom: 1_500 },
        ],
      }),
    ).toBe("hero");
  });

  it("lets a short contact section take over after it reaches the reading line", () => {
    expect(
      getActiveSectionFromRects({
        viewportHeight: 1_000,
        sections: [
          { id: "work", top: -900, bottom: 700 },
          { id: "contact", top: 360, bottom: 660 },
        ],
      }),
    ).toBe("contact");
  });

  it("reveals the nav only after the user has scrolled into the about section", () => {
    expect(hasSectionReachedNavReveal({ sectionTop: 0, viewportHeight: 1_000 })).toBe(false);
    expect(hasSectionReachedNavReveal({ sectionTop: -120, viewportHeight: 1_000 })).toBe(true);
  });
});
