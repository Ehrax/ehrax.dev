import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "~/i18n";
import { Hero } from "./Hero";

describe("Hero section", () => {
  it("renders a top-level heading from localized content", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the name Alexander Rasputin", () => {
    render(<Hero />);
    expect(screen.getByText("Alexander Rasputin")).toBeInTheDocument();
  });
});
