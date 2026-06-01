import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Getting Started/Overview",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <div
      style={{
        background: "var(--ex-surface-canvas)",
        color: "var(--ex-text-primary)",
        fontFamily: "var(--ex-font-sans)",
        minHeight: "100vh",
        padding: "64px 48px",
      }}
    >
      <p
        style={{
          color: "var(--ex-text-tertiary)",
          fontFamily: "var(--ex-font-mono)",
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        ehrax.dev · design system
      </p>
      <h1
        style={{
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          margin: "12px 0 16px",
        }}
      >
        Tokens &amp; primitives, the premium Linear way.
      </h1>
      <p
        style={{
          color: "var(--ex-text-secondary)",
          fontSize: 18,
          lineHeight: 1.6,
          maxWidth: "60ch",
          margin: 0,
        }}
      >
        A three-tier token system — primitive ramps → semantic light/dark → component tokens —
        generated to{" "}
        <code style={{ fontFamily: "var(--ex-font-mono)", color: "var(--ex-text-primary)" }}>
          --ex-*
        </code>{" "}
        CSS variables and consumed by Base UI primitives. Use the toolbar to switch theme and the
        canvas surface.
      </p>
      <ul
        style={{ color: "var(--ex-text-secondary)", fontSize: 15, lineHeight: 1.8, marginTop: 24 }}
      >
        <li>
          <strong style={{ color: "var(--ex-text-primary)" }}>Foundations</strong> — the full token
          catalog.
        </li>
        <li>
          <strong style={{ color: "var(--ex-text-primary)" }}>Components</strong> — Button, Card and
          the NavBar pill.
        </li>
      </ul>
    </div>
  ),
};
