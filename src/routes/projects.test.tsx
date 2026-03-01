import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({}),
  Link: ({
    children,
    to,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/hooks/use-seo", () => ({
  useSEO: vi.fn(),
}));

vi.mock("@/utilities/seo", () => ({
  sectionMetadata: {
    projects: { title: "Projects", description: "Test" },
  },
}));

vi.mock("@/sections/projects", () => ({
  Projects: () => <div data-testid="projects-section">Projects Content</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon" />,
}));

import { ProjectsPage } from "./projects";

describe("ProjectsPage", () => {
  it("renders the page title", () => {
    render(<ProjectsPage />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("Projects");
  });

  it("renders the back link to home", () => {
    render(<ProjectsPage />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders the projects section component", () => {
    render(<ProjectsPage />);
    expect(screen.getByTestId("projects-section")).toBeInTheDocument();
  });

  it("renders the arrow left icon in back link", () => {
    render(<ProjectsPage />);
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });
});
