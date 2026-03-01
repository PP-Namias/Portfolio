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
    gallery: { title: "Gallery", description: "Test" },
  },
}));

vi.mock("@/sections/gallery", () => ({
  default: () => (
    <div data-testid="gallery-section">Gallery Content</div>
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

import { GalleryPage } from "./gallery";

describe("GalleryPage", () => {
  it("renders the page title", () => {
    render(<GalleryPage />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("Gallery");
  });

  it("renders the back link to home", () => {
    render(<GalleryPage />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders the gallery section component", () => {
    render(<GalleryPage />);
    expect(screen.getByTestId("gallery-section")).toBeInTheDocument();
  });

  it("renders the arrow left icon in back link", () => {
    render(<GalleryPage />);
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });
});
