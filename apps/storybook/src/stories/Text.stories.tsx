import { Text } from "@ehrax/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const variants = [
  "body-lg",
  "body",
  "body-sm",
  "body-bold",
  "label",
  "caption",
  "overline",
  "code",
] as const;
const tones = ["default", "secondary", "tertiary", "brand", "inverse"] as const;

const meta: Meta<typeof Text> = {
  title: "Components/Typography/Text",
  component: Text,
  argTypes: {
    variant: { control: { type: "select" }, options: variants },
    tone: { control: { type: "select" }, options: tones },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    variant: "body",
    tone: "default",
    children: "Senior product engineer building end-to-end product experiences.",
  },
};

export const Variants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "60ch" }}>
      {variants.map((variant) => (
        <Text key={variant} variant={variant}>
          {variant} — the quick brown fox jumps over the lazy dog
        </Text>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {tones.map((tone) => (
        <Text key={tone} tone={tone}>
          {tone} tone
        </Text>
      ))}
    </div>
  ),
};
