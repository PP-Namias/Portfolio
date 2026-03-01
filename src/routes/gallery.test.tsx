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
    gallery: { title: "Gallery", description: "Test" },
  },
}));

vi.mock("@/sections/gallery", () => ({
  default: () => (
    <div data-testid="gallery-section">Gallery Content</div>
  ),
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

import { GalleryPage } from "./gallery";

describe("GalleryPage", () => {
  it("renders the page title", () => {
    render(<GalleryPage />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("Gallery");
  });

  it("renders the back button linking to home", () => {
    render(<GalleryPage />);
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Back").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders the gallery section component", () => {
    render(<GalleryPage />);
    expect(screen.getByTestId("gallery-section")).toBeInTheDocument();
  });

  it("renders the arrow left icon in back button", () => {
    render(<GalleryPage />);
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });
});
