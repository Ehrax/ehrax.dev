import { Stack } from "@ehrax/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Stack> = {
  title: "Components/Layout/Stack",
  component: Stack,
  argTypes: {
    direction: { control: { type: "inline-radio" }, options: ["col", "row"] },
    gap: { control: { type: "select" }, options: [0, 1, 2, 3, 4, 5, 6, 8, 12, 16] },
    align: { control: { type: "select" }, options: ["start", "center", "end", "stretch"] },
    justify: {
      control: { type: "select" },
      options: ["start", "center", "end", "between", "around"],
    },
    wrap: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "var(--ex-surface-raised)",
      border: "1px solid var(--ex-border-default)",
      borderRadius: "var(--ex-radius-md)",
      color: "var(--ex-text-primary)",
      padding: "var(--ex-space-3) var(--ex-space-4)",
    }}
  >
    {children}
  </div>
);

export const Vertical: Story = {
  args: { direction: "col", gap: 4 },
  render: (args) => (
    <Stack {...args}>
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: { direction: "row", gap: 3, align: "center" },
  render: (args) => (
    <Stack {...args}>
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};
