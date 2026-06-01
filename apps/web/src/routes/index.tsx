import { createFileRoute } from "@tanstack/react-router";
import { useActiveSection } from "~/hooks/useActiveSection";
import { About } from "~/sections/About/About";
import { Contact } from "~/sections/Contact/Contact";
import { Hero } from "~/sections/Hero/Hero";
import { Work } from "~/sections/Work/Work";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  useActiveSection();
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Contact />
    </>
  );
}
