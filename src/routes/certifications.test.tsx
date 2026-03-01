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
    certifications: { title: "Certifications", description: "Test" },
  },
}));

vi.mock("@/sections/certifications", () => ({
  default: () => (
    <div data-testid="certifications-section">Certifications Content</div>
  ),
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

import { CertificationsPage } from "./certifications";

describe("CertificationsPage", () => {
  it("renders the page title", () => {
    render(<CertificationsPage />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("Certifications");
  });

  it("renders the back link to home", () => {
    render(<CertificationsPage />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders the certifications section component", () => {
    render(<CertificationsPage />);
    expect(screen.getByTestId("certifications-section")).toBeInTheDocument();
  });

  it("renders the arrow left icon in back link", () => {
    render(<CertificationsPage />);
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });
});
