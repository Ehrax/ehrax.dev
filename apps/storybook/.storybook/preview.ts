import "@ehrax/design-system/themes/light.css";
import "@ehrax/design-system/themes/dark.css";
import type { Preview } from "@storybook/react-vite";
import React from "react";

const preview: Preview = {
  parameters: {
    // Our decorator paints the canvas from the live CSS variable so it tracks
    // the toolbar toggle — disable Storybook's static backgrounds.
    backgrounds: { disable: true },
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Getting Started",
          ["Overview"],
          "Foundations",
          ["Design Tokens", "Typography"],
          "Components",
          ["Actions", "Navigation", "Data Display", "Layout"],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Active theme",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
        items: [
          { value: "dark", icon: "moon", title: "Dark" },
          { value: "light", icon: "sun", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
    surface: {
      description: "Background surface to paint behind the story",
      defaultValue: "canvas",
      toolbar: {
        title: "Surface",
        items: [
          { value: "canvas", title: "canvas" },
          { value: "raised", title: "raised" },
          { value: "muted", title: "muted" },
          { value: "inverse", title: "inverse" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const theme = ctx.globals.theme ?? "dark";
      const surface = ctx.globals.surface ?? "canvas";

      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme);
        document.body.style.background = "var(--ex-surface-canvas)";
        document.body.style.color = "var(--ex-text-primary)";
        document.body.style.fontFamily = "var(--ex-font-sans)";
        document.body.style.transition = "background 120ms ease, color 120ms ease";
      }

      if (ctx.parameters.layout === "fullscreen") {
        return React.createElement(Story);
      }

      return React.createElement(
        "div",
        {
          style: {
            background: `var(--ex-surface-${surface})`,
            color: "var(--ex-text-primary)",
            padding: 24,
            minWidth: 320,
            minHeight: 80,
            borderRadius: 12,
            transition: "background 120ms ease, color 120ms ease",
          },
        },
        React.createElement(Story),
      );
    },
  ],
};

export default preview;
