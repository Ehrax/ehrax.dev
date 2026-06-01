import { Button, Card } from "@ehrax/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Card> = {
  title: "Components/Data Display/Card",
  component: Card,
  argTypes: { interactive: { control: "boolean" } },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <Card.Header>
        <Card.Title>Realtime collaboration</Card.Title>
        <Card.Description>
          Cursors, presence, and conflict-free edits out of the box.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        Built on the design system primitives — a lit top edge, hairline border, and a soft
        elevation that lifts on hover when interactive.
      </Card.Content>
      <Card.Footer>
        <Button size="sm">Learn more</Button>
        <Button size="sm" variant="ghost">
          Docs
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const Interactive: Story = {
  args: { interactive: true },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <Card.Header>
        <Card.Title>Hover me</Card.Title>
        <Card.Description>Interactive cards lift and brighten their border.</Card.Description>
      </Card.Header>
      <Card.Content>The whole surface is the affordance.</Card.Content>
    </Card>
  ),
};
