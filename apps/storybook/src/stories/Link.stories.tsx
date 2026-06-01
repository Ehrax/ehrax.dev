import { Link } from "@ehrax/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Link> = {
  title: "Components/Navigation/Link",
  component: Link,
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "subtle"] },
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    underline: { control: "boolean" },
    external: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { href: "#", children: "Read the case study" },
};

export const Variants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
      <Link href="#">Default</Link>
      <Link href="#" variant="subtle">
        Subtle
      </Link>
      <Link href="#" underline>
        Underline
      </Link>
      <Link href="https://example.com" external>
        External
      </Link>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
      <Link href="#" size="sm">
        Small
      </Link>
      <Link href="#" size="md">
        Medium
      </Link>
      <Link href="#" size="lg">
        Large
      </Link>
    </div>
  ),
};
