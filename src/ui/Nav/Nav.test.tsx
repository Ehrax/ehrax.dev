import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import "~/i18n";
import { useSceneStore } from "~/state/sceneStore";
import { Nav } from "./Nav";

describe("Nav", () => {
  beforeEach(() => {
    useSceneStore.setState({ activeSection: "hero", navRevealed: false });
  });

  it("does not expose the primary bar before the about section has been visible", () => {
    render(<Nav />);

    expect(screen.queryByRole("navigation", { name: "Primary" })).not.toBeInTheDocument();
  });

  it("keeps the primary bar available after it has been revealed once", () => {
    useSceneStore.setState({ navRevealed: true });

    render(<Nav />);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });

  it("marks the active section link as current", () => {
    useSceneStore.setState({ activeSection: "work", navRevealed: true });

    render(<Nav />);

    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });

  it("uses the logo as the top link without showing a top nav item", () => {
    useSceneStore.setState({ activeSection: "hero", navRevealed: true });

  render(<Nav />);

  expect(screen.getByRole("link", { name: "ehrax.dev home" })).toHaveAttribute("href", "#hero");
  expect(screen.getByText("ehrax.dev")).toBeVisible();
  expect(screen.queryByRole("link", { name: "Top" })).not.toBeInTheDocument();
});
});
