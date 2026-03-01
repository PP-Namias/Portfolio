import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "./section-header";

// Mock @tanstack/react-router Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
    [key: string]: unknown;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import { vi } from "vitest";

describe("SectionHeader", () => {
  it("renders the title", () => {
    render(<SectionHeader title="Recent Projects" />);
    expect(screen.getByText("Recent Projects")).toBeInTheDocument();
  });

  it("renders an h2 element", () => {
    render(<SectionHeader title="Experience" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Experience");
  });

  it("does not render View All button when no viewAllHref", () => {
    render(<SectionHeader title="Recommendations" />);
    expect(screen.queryByText("View All")).not.toBeInTheDocument();
  });

  it("renders View All link when viewAllHref is provided", () => {
    render(
      <SectionHeader title="Recent Projects" viewAllHref="/projects" />,
    );
    expect(screen.getByText("View All")).toBeInTheDocument();
  });

  it("renders custom viewAllLabel", () => {
    render(
      <SectionHeader
        title="Gallery"
        viewAllHref="/gallery"
        viewAllLabel="See More"
      />,
    );
    expect(screen.getByText("See More")).toBeInTheDocument();
    expect(screen.queryByText("View All")).not.toBeInTheDocument();
  });
});
