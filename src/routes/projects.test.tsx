import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({}),
  Link: ({
    children,
    to,
  }: {
    children: React.ReactNode;
    to: string;
  }) => <a href={to}>{children}</a>,
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

vi.mock("@heroui/react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: (props: any) => {
    const Component = props.as || "button";
    return (
      <Component {...props}>
        {props.startContent}
        {props.children}
      </Component>
    );
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
    ).toHaveTextContent("All Projects");
  });

  it("renders the back button linking to home", () => {
    render(<ProjectsPage />);
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Back").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders the projects section component", () => {
    render(<ProjectsPage />);
    expect(screen.getByTestId("projects-section")).toBeInTheDocument();
  });

  it("renders the arrow left icon in back button", () => {
    render(<ProjectsPage />);
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });
});
