import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
  it("exposes a section reveal surface without changing section content", () => {
    render(
      <Section id="about" ariaLabel="About" eyebrow="Profile">
        <h2>About ehrax.dev</h2>
        <p>Original section copy stays owned by the caller.</p>
      </Section>,
    );

    const section = screen.getByRole("region", { name: "About" });
    expect(section).toHaveAttribute("data-scroll-reveal-section", "about");

    const body = within(section).getByText("Original section copy stays owned by the caller.");
    expect(body).toHaveTextContent("Original section copy stays owned by the caller.");
  });
});
