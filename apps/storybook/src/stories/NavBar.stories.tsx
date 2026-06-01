import { NavBar } from "@ehrax/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import styles from "./NavBar.stories.module.css";

const meta: Meta = {
  title: "Components/Navigation/NavBar",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

const Mark = () => (
  <span className={styles.mark}>
    <span className={styles.markLetter}>{"{E}"}</span>
    <span className={styles.markCaret} aria-hidden="true" />
  </span>
);

export const Default: Story = {
  render: () => (
    <NavBar.Root aria-label="Primary">
      <NavBar.Brand href="#hero" aria-label="ehrax.dev home">
        <Mark />
      </NavBar.Brand>
      <NavBar.Divider />
      <NavBar.List>
        <NavBar.Item>
          <NavBar.Link href="#about" active>
            About
          </NavBar.Link>
        </NavBar.Item>
        <NavBar.Item>
          <NavBar.Link href="#work">Work</NavBar.Link>
        </NavBar.Item>
        <NavBar.Item>
          <NavBar.Link href="#contact">Contact</NavBar.Link>
        </NavBar.Item>
      </NavBar.List>
    </NavBar.Root>
  ),
};
