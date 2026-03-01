import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedSection } from "./animated-section";

vi.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    section: ({ children, initial, whileInView, viewport, transition, ...props }: Record<string, unknown>) => (
      <section {...props}>{children as React.ReactNode}</section>
    ),
  },
}));

describe("AnimatedSection", () => {
  it("renders children content", () => {
    render(
      <AnimatedSection id="test">
        <p>Hello World</p>
      </AnimatedSection>,
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders with the correct id attribute", () => {
    render(
      <AnimatedSection id="projects">
        <p>Projects content</p>
      </AnimatedSection>,
    );
    const section = screen.getByText("Projects content").closest("section");
    expect(section).toHaveAttribute("id", "projects");
  });

  it("applies custom className", () => {
    render(
      <AnimatedSection id="test" className="bg-background rounded-xl p-4">
        <p>Content</p>
      </AnimatedSection>,
    );
    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveClass("bg-background", "rounded-xl", "p-4");
  });

  it("renders as a section element", () => {
    render(
      <AnimatedSection id="contact">
        <p>Contact form</p>
      </AnimatedSection>,
    );
    const section = screen.getByText("Contact form").closest("section");
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe("SECTION");
  });

  it("renders without className when not provided", () => {
    render(
      <AnimatedSection id="minimal">
        <p>Minimal</p>
      </AnimatedSection>,
    );
    const section = screen.getByText("Minimal").closest("section");
    expect(section).toHaveAttribute("id", "minimal");
  });

  it("supports multiple children", () => {
    render(
      <AnimatedSection id="multi">
        <h2>Title</h2>
        <p>Description</p>
        <button>Action</button>
      </AnimatedSection>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
