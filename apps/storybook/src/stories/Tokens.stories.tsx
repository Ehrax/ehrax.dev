import {
  borderWidth,
  breakpoints,
  darkSemantic,
  duration,
  easing,
  elevation,
  type IntentName,
  type IntentVariant,
  lightSemantic,
  opacity,
  opacityRole,
  palette,
  type RoleStyle,
  radii,
  radiiRole,
  type SemanticTokens,
  spacing,
  type TypographyRole,
  webRoles,
  zIndex,
} from "@ehrax/design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";

const pickSemantic = (theme: unknown): SemanticTokens =>
  theme === "light" ? lightSemantic : darkSemantic;

const meta: Meta = {
  title: "Foundations/Design Tokens",
  parameters: { layout: "padded" },
};

export default meta;

const monoLabel: React.CSSProperties = {
  color: "var(--ex-text-secondary)",
  fontFamily: "var(--ex-font-mono)",
  fontSize: 11,
  marginTop: 6,
};

const sectionTitle: React.CSSProperties = {
  borderBottom: "1px solid var(--ex-border-subtle)",
  color: "var(--ex-text-primary)",
  fontFamily: "var(--ex-font-display)",
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  margin: "32px 0 16px",
  paddingBottom: 8,
};

const subTitle: React.CSSProperties = {
  color: "var(--ex-text-secondary)",
  fontFamily: "var(--ex-font-sans)",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: "0.06em",
  marginBottom: 12,
  marginTop: 24,
  textTransform: "uppercase",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 40 }}>
    <p style={sectionTitle}>{title}</p>
    {children}
  </div>
);

const Sub = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p style={subTitle}>{title}</p>
    {children}
  </div>
);

const RampRow = ({ name, ramp }: { name: string; ramp: Record<string, string> }) => (
  <div style={{ marginBottom: 16 }}>
    <p style={{ ...monoLabel, marginBottom: 6 }}>{name}</p>
    <div style={{ display: "flex", gap: 4 }}>
      {Object.entries(ramp).map(([step, hex]) => (
        <div key={step} style={{ flex: 1 }}>
          <div style={{ background: hex, height: 56, borderRadius: 6 }} />
          <div style={{ ...monoLabel, fontSize: 10 }}>{step}</div>
          <div style={{ ...monoLabel, fontSize: 10, opacity: 0.65 }}>{hex}</div>
        </div>
      ))}
    </div>
  </div>
);

export const ColorRamps = () => (
  <div>
    <Section title="Primitive — brand">
      <RampRow name="brand.indigo" ramp={palette.brand.indigo} />
      <RampRow name="brand.cyan" ramp={palette.brand.cyan} />
    </Section>
    <Section title="Primitive — neutral">
      <RampRow name="neutral" ramp={palette.neutral} />
    </Section>
    <Section title="Primitive — intent">
      <RampRow name="danger" ramp={palette.danger} />
      <RampRow name="warning" ramp={palette.warning} />
      <RampRow name="success" ramp={palette.success} />
      <RampRow name="info" ramp={palette.info} />
    </Section>
  </div>
);

const SwatchRow = ({ items }: { items: [string, string][] }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
    {items.map(([name, value]) => (
      <div key={name} style={{ width: 110 }}>
        <div
          style={{
            background: value,
            border: "1px solid var(--ex-border-subtle)",
            borderRadius: 8,
            height: 56,
            width: "100%",
          }}
        />
        <p style={monoLabel}>{name}</p>
        <p style={{ ...monoLabel, opacity: 0.7 }}>{value}</p>
      </div>
    ))}
  </div>
);

export const SemanticSurfaces: StoryObj = {
  render: (_, ctx) => {
    const semantic = pickSemantic(ctx.globals.theme);
    const themeLabel = ctx.globals.theme === "light" ? "light" : "dark";
    return (
      <div>
        <Section title={`Semantic — surface / text / border (${themeLabel})`}>
          <Sub title="Surface">
            <SwatchRow items={Object.entries(semantic.surface)} />
          </Sub>
          <Sub title="Text">
            <SwatchRow items={Object.entries(semantic.text)} />
          </Sub>
          <Sub title="Border">
            <SwatchRow items={Object.entries(semantic.border)} />
          </Sub>
        </Section>
      </div>
    );
  },
};

const intents: IntentName[] = [
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
  "info",
  "neutral",
];
const variants: IntentVariant[] = ["solid", "soft", "outline", "ghost", "link"];

export const IntentMatrix: StoryObj = {
  render: (_, ctx) => {
    const semantic = pickSemantic(ctx.globals.theme);
    const themeLabel = ctx.globals.theme === "light" ? "light" : "dark";
    return (
      <Section title={`Intent × Variant — ${themeLabel} theme`}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${variants.length + 1}, auto)`,
            gap: 8,
          }}
        >
          <div />
          {variants.map((v) => (
            <div key={v} style={{ ...monoLabel, textAlign: "center" }}>
              {v}
            </div>
          ))}
          {intents.flatMap((intent) => [
            <div key={`${intent}-label`} style={{ ...monoLabel, alignSelf: "center" }}>
              {intent}
            </div>,
            ...variants.map((variant) => {
              const slots = semantic.intent[intent][variant];
              return (
                <div
                  key={`${intent}-${variant}`}
                  style={{
                    background: slots.bg,
                    border: `1px solid ${slots.border === "transparent" ? "var(--ex-border-subtle)" : slots.border}`,
                    borderRadius: 8,
                    color: slots.fg,
                    fontFamily: "var(--ex-font-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "10px 14px",
                    textAlign: "center",
                    textDecoration: variant === "link" ? "underline" : "none",
                  }}
                >
                  Button
                </div>
              );
            }),
          ])}
        </div>
      </Section>
    );
  },
};

const roleSamples: TypographyRole[] = [
  "display-2xl",
  "display-xl",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "eyebrow",
  "body-lg",
  "body",
  "body-sm",
  "body-bold",
  "label",
  "nav",
  "button-md",
  "link",
  "caption",
  "code",
  "kbd",
];

export const Typography = () => (
  <Section title="Typography roles">
    <div style={{ display: "grid", gap: 16 }}>
      {roleSamples.map((role) => {
        const def: RoleStyle = webRoles[role];
        return (
          <div
            key={role}
            style={{ borderBottom: "1px dashed var(--ex-border-subtle)", paddingBottom: 12 }}
          >
            <p style={{ ...monoLabel, marginBottom: 4 }}>
              {role} · {def.fontSize}px / {def.lineHeight} · {def.fontWeight}
            </p>
            <p
              style={{
                color: "var(--ex-text-primary)",
                fontFamily: def.fontFamily,
                fontSize: def.fontSize,
                fontWeight: Number(def.fontWeight),
                letterSpacing: def.letterSpacing,
                lineHeight: def.lineHeight,
                margin: 0,
                textDecoration: def.underline ? "underline" : "none",
                textTransform: def.textTransform as React.CSSProperties["textTransform"],
              }}
            >
              ehrax.dev · The quick brown fox
            </p>
          </div>
        );
      })}
    </div>
  </Section>
);

export const Spacing = () => (
  <Section title="Spacing (Tailwind ladder)">
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Object.entries(spacing).map(([key, px]) => (
        <div key={key} style={{ alignItems: "center", display: "flex", gap: 12 }}>
          <div
            style={{
              background: "var(--ex-intent-primary-solid-bg)",
              borderRadius: 2,
              height: 12,
              opacity: 0.8,
              width: Math.max(px, 1),
            }}
          />
          <span style={monoLabel}>
            {key} → {px}px
          </span>
        </div>
      ))}
    </div>
  </Section>
);

export const RadiiAndElevation = () => (
  <div>
    <Section title="Radii">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {Object.entries(radiiRole).map(([name, px]) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div
              style={{
                background: "var(--ex-intent-primary-solid-bg)",
                borderRadius: px,
                height: 64,
                width: 96,
              }}
            />
            <p style={monoLabel}>role.{name}</p>
            <p style={{ ...monoLabel, opacity: 0.65 }}>{px}px</p>
          </div>
        ))}
        {Object.entries(radii).map(([name, px]) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div
              style={{
                background: "var(--ex-intent-primary-soft-bg)",
                border: "1px solid var(--ex-intent-primary-outline-border)",
                borderRadius: px,
                height: 64,
                width: 64,
              }}
            />
            <p style={monoLabel}>{name}</p>
            <p style={{ ...monoLabel, opacity: 0.65 }}>{px}px</p>
          </div>
        ))}
      </div>
    </Section>
    <Section title="Elevation">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {Object.keys(elevation)
          .filter((name) => name !== "none")
          .map((name) => (
            <div key={name} style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "var(--ex-surface-raised)",
                  borderRadius: 12,
                  boxShadow: `var(--ex-shadow-${name})`,
                  height: 96,
                  width: 120,
                }}
              />
              <p style={monoLabel}>{name}</p>
            </div>
          ))}
      </div>
    </Section>
  </div>
);

export const MotionAndScales = () => (
  <div>
    <Section title="Motion">
      <Sub title="Duration">
        <ul style={{ ...monoLabel, paddingLeft: 16 }}>
          {Object.entries(duration).map(([k, v]) => (
            <li key={k}>
              {k} → {v}ms
            </li>
          ))}
        </ul>
      </Sub>
      <Sub title="Easing">
        <ul style={{ ...monoLabel, paddingLeft: 16 }}>
          {Object.entries(easing).map(([k, v]) => (
            <li key={k}>
              {k} → {v}
            </li>
          ))}
        </ul>
      </Sub>
    </Section>
    <Section title="Z-index">
      <p style={monoLabel}>
        {Object.entries(zIndex)
          .map(([k, v]) => `${k}=${v}`)
          .join("  ·  ")}
      </p>
    </Section>
    <Section title="Opacity">
      <p style={monoLabel}>
        {Object.entries(opacityRole)
          .map(([k, v]) => `${k}=${v}`)
          .join("  ·  ")}
      </p>
      <p style={monoLabel}>
        {Object.entries(opacity)
          .map(([k, v]) => `${k}=${v}`)
          .join("  ·  ")}
      </p>
    </Section>
    <Section title="Border widths & breakpoints">
      <p style={monoLabel}>
        {Object.entries(borderWidth)
          .map(([k, v]) => `${k}=${v}px`)
          .join("  ·  ")}
      </p>
      <p style={monoLabel}>
        {Object.entries(breakpoints)
          .map(([k, v]) => `${k}=${v}px`)
          .join("  ·  ")}
      </p>
    </Section>
  </div>
);
