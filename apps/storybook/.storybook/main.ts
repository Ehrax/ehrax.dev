import type { StorybookConfig } from "@storybook/react-vite";
import { searchForWorkspaceRoot } from "vite";

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Force a single React instance — a stray transitive patch version can
  // double-load and break hooks ("resolveDispatcher().useState is null").
  viteFinal: async (cfg) => {
    cfg.resolve ??= {};
    cfg.resolve.dedupe = [...(cfg.resolve.dedupe ?? []), "react", "react-dom"];
    // Let the dev server serve workspace package sources, silencing
    // "outside of Vite serving allow list" warnings for monorepo packages/*.
    cfg.server ??= {};
    cfg.server.fs ??= {};
    cfg.server.fs.allow = [...(cfg.server.fs.allow ?? []), searchForWorkspaceRoot(process.cwd())];
    return cfg;
  },
};

export default config;
