import { Icon, type IconName, type IconSize } from "@ehrax/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const sample: IconName[] = ["ArrowRight", "Mail", "Code", "ExternalLink", "Moon", "Sun"];
const sizes: IconSize[] = ["xs", "sm", "md", "lg", "xl"];

const meta: Meta<typeof Icon> = {
  title: "Components/Media/Icon",
  component: Icon,
  argTypes: {
    size: { control: { type: "select" }, options: sizes },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: { name: "ArrowRight", size: "md" },
};

export const Gallery: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ color: "var(--ex-text-primary)", display: "flex", gap: 24 }}>
      {sample.map((name) => (
        <span key={name} style={{ alignItems: "center", display: "flex", gap: 8 }}>
          <Icon name={name} />
          <span style={{ color: "var(--ex-text-secondary)", fontSize: 13 }}>{name}</span>
        </span>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{ alignItems: "center", color: "var(--ex-text-primary)", display: "flex", gap: 16 }}
    >
      {sizes.map((size) => (
        <Icon key={size} name="Sparkles" size={size} />
      ))}
    </div>
  ),
};
