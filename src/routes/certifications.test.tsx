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
    certifications: { title: "Certifications", description: "Test" },
  },
}));

vi.mock("@/sections/certifications", () => ({
  default: () => (
    <div data-testid="certifications-section">Certifications Content</div>
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

import { CertificationsPage } from "./certifications";

describe("CertificationsPage", () => {
  it("renders the page title", () => {
    render(<CertificationsPage />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("All Certifications");
  });

  it("renders the back button linking to home", () => {
    render(<CertificationsPage />);
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Back").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders the certifications section component", () => {
    render(<CertificationsPage />);
    expect(screen.getByTestId("certifications-section")).toBeInTheDocument();
  });

  it("renders the arrow left icon in back button", () => {
    render(<CertificationsPage />);
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });
});
