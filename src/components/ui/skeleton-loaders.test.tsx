import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Mock HeroUI Skeleton to render a simple div with data attributes
vi.mock("@heroui/react", () => ({
  Skeleton: ({
    className,
    style,
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) => <div data-testid="skeleton" className={className} style={style} />,
}));

import {
  ExperienceCardSkeleton,
  ExperiencesSkeleton,
  ProjectCardSkeleton,
  ProjectsSkeleton,
  CertificationCardSkeleton,
  CertificationsSkeleton,
  GallerySkeleton,
  RecommendationsSkeleton,
  TechStackSkeleton,
  GithubStatsSkeleton,
  GithubCalendarSkeleton,
  MembershipsSkeleton,
  ProfileCardSkeleton,
} from "@/components/ui/skeleton-loaders";

describe("Skeleton Loaders", () => {
  describe("ExperienceCardSkeleton", () => {
    it("renders with border and rounded styling", () => {
      const { container } = render(<ExperienceCardSkeleton />);
      const card = container.firstChild as HTMLElement;
      expect(card).toBeTruthy();
      expect(card.className).toContain("rounded-xl");
      expect(card.className).toContain("border");
    });

    it("renders multiple skeleton elements inside", () => {
      const { getAllByTestId } = render(<ExperienceCardSkeleton />);
      // header + subtitle + date + 2 body lines + 4 tags = 10
      expect(getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(6);
    });
  });

  describe("ExperiencesSkeleton", () => {
    it("renders default 4 skeletons in a grid", () => {
      const { container } = render(<ExperiencesSkeleton />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("grid");
      expect(grid.children.length).toBe(4);
    });

    it("renders custom count", () => {
      const { container } = render(<ExperiencesSkeleton count={2} />);
      expect((container.firstChild as HTMLElement).children.length).toBe(2);
    });
  });

  describe("ProjectCardSkeleton", () => {
    it("renders a 12-column grid with fixed height", () => {
      const { container } = render(<ProjectCardSkeleton />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("grid-cols-12");
      expect(card.className).toContain("h-[350px]");
    });
  });

  describe("ProjectsSkeleton", () => {
    it("renders default 4 project skeletons", () => {
      const { container } = render(<ProjectsSkeleton />);
      expect((container.firstChild as HTMLElement).children.length).toBe(4);
    });

    it("renders custom count", () => {
      const { container } = render(<ProjectsSkeleton count={2} />);
      expect((container.firstChild as HTMLElement).children.length).toBe(2);
    });
  });

  describe("CertificationCardSkeleton", () => {
    it("renders a skeleton element", () => {
      const { getByTestId } = render(<CertificationCardSkeleton />);
      expect(getByTestId("skeleton")).toBeTruthy();
    });
  });

  describe("CertificationsSkeleton", () => {
    it("renders default 4 certification skeletons in a grid", () => {
      const { container } = render(<CertificationsSkeleton />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("grid");
      expect(grid.children.length).toBe(4);
    });

    it("renders custom count", () => {
      const { container } = render(<CertificationsSkeleton count={6} />);
      expect((container.firstChild as HTMLElement).children.length).toBe(6);
    });
  });

  describe("GallerySkeleton", () => {
    it("renders default 8 gallery items in a grid", () => {
      const { container } = render(<GallerySkeleton />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("grid");
      expect(grid.children.length).toBe(8);
    });

    it("renders custom count", () => {
      const { container } = render(<GallerySkeleton count={4} />);
      expect((container.firstChild as HTMLElement).children.length).toBe(4);
    });

    it("applies varied heights via inline styles", () => {
      const { getAllByTestId } = render(<GallerySkeleton count={2} />);
      const skeletons = getAllByTestId("skeleton");
      expect(skeletons[0].style.height).toBe("200px");
      expect(skeletons[1].style.height).toBe("280px");
    });
  });

  describe("RecommendationsSkeleton", () => {
    it("renders default 2 recommendation cards", () => {
      const { container } = render(<RecommendationsSkeleton />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("grid");
      expect(grid.children.length).toBe(2);
    });

    it("renders avatar placeholder circles", () => {
      const { container } = render(<RecommendationsSkeleton />);
      const circles = container.querySelectorAll("[data-testid='skeleton'].rounded-full");
      expect(circles.length).toBeGreaterThan(0);
    });
  });

  describe("TechStackSkeleton", () => {
    it("renders 12 tech badge skeletons in a flex row", () => {
      const { container, getAllByTestId } = render(<TechStackSkeleton />);
      const flex = container.firstChild as HTMLElement;
      expect(flex.className).toContain("flex");
      const badges = getAllByTestId("skeleton").filter((el) =>
        el.className.includes("shrink-0"),
      );
      expect(badges.length).toBe(12);
    });
  });

  describe("GithubStatsSkeleton", () => {
    it("renders 2 stat skeletons in a 2-column grid", () => {
      const { container } = render(<GithubStatsSkeleton />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("grid-cols-2");
      expect(grid.children.length).toBe(2);
    });
  });

  describe("GithubCalendarSkeleton", () => {
    it("renders a single full-width skeleton", () => {
      const { getByTestId } = render(<GithubCalendarSkeleton />);
      const skeleton = getByTestId("skeleton");
      expect(skeleton.className).toContain("w-full");
      expect(skeleton.className).toContain("h-44");
    });
  });

  describe("MembershipsSkeleton", () => {
    it("renders 4 membership badge skeletons", () => {
      const { container } = render(<MembershipsSkeleton />);
      const flex = container.firstChild as HTMLElement;
      expect(flex.className).toContain("flex");
      expect(flex.children.length).toBe(4);
    });
  });

  describe("ProfileCardSkeleton", () => {
    it("renders without crashing", () => {
      const { container } = render(<ProfileCardSkeleton />);
      expect(container.firstChild).toBeTruthy();
    });

    it("renders 6 social icon skeleton placeholders", () => {
      const { getAllByTestId } = render(<ProfileCardSkeleton />);
      const allSkeletons = getAllByTestId("skeleton");
      // Filter for social icon skeletons (size-8 rounded-lg in the last flex group)
      const socialIcons = allSkeletons.filter(
        (el) => el.className.includes("size-8") && el.className.includes("rounded-lg"),
      );
      // 6 social + 1 theme toggle skeleton = at least 6
      expect(socialIcons.length).toBeGreaterThanOrEqual(6);
    });
  });
});
