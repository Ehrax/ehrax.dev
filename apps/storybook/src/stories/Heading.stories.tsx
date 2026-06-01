import { Heading } from "@ehrax/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const levels = ["display-2xl", "display-xl", "h1", "h2", "h3", "h4", "h5", "h6"] as const;

const meta: Meta<typeof Heading> = {
  title: "Components/Typography/Heading",
  component: Heading,
  argTypes: {
    level: { control: { type: "select" }, options: levels },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: { level: "h2", children: "Selected work" },
};

export const Scale: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {levels.map((level) => (
        <Heading key={level} level={level}>
          {level}
        </Heading>
      ))}
    </div>
  ),
};
