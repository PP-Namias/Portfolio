import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileCard } from "./profile-card";

// Provide a mock for all images glob
vi.hoisted(() => {
  // @ts-expect-error - mocking import.meta.glob
  import.meta.glob = () => ({
    "../../assets/portfolio-resources/assets/images/profile.jpg":
      "/mock-profile.webp",
  });
});

// Mock hooks
vi.mock("@/hooks/use-core", () => ({
  useCore: () => ({
    querySocials: () => ({
      data: [
        { name: "GitHub", label: "GitHub", link: "https://github.com/test" },
        {
          name: "LinkedIn",
          label: "LinkedIn",
          link: "https://linkedin.com/in/test",
        },
        {
          name: "Calendly",
          label: "Calendly",
          link: "https://calendly.com/test",
        },
      ],
      isLoading: false,
      error: null,
    }),
  }),
}));

const mockGithubData = {
  hireable: true,
};

vi.mock("@/hooks/use-github", () => ({
  default: () => ({
    queryBaseUserInformation: () => ({
      data: mockGithubData,
      isLoading: false,
      error: null,
    }),
  }),
}));

vi.mock("@/hooks/use-lastfm", () => ({
  useLastFm: () => ({
    queryRecentTrack: () => ({
      data: {
        title: "Test Song",
        artist: "Test Artist",
        image_url: "/album.jpg",
      },
      isLoading: false,
      error: null,
    }),
  }),
}));

vi.mock("@/hooks/use-philippine-time", () => ({
  usePhilippineTime: () => ({
    formattedTime: "12:00 PM",
    isAM: true,
  }),
}));

vi.mock("@/context/theme-context", () => ({
  useThemeContext: () => ({
    theme: "dark",
    setTheme: vi.fn(),
  }),
}));

// Mock HeroUI components
vi.mock("@heroui/react", () => ({
  Button: ({ children, onPress, ...props }: Record<string, unknown>) => (
    <button onClick={onPress as () => void} {...props}>
      {children as React.ReactNode}
    </button>
  ),
  Image: ({ src, alt, ...props }: Record<string, unknown>) => (
    <img src={src as string} alt={(alt as string) || ""} {...props} />
  ),
  Modal: ({ children, isOpen }: Record<string, unknown>) =>
    isOpen ? (
      <div data-testid="modal">{children as React.ReactNode}</div>
    ) : null,
  useDisclosure: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onOpenChange: vi.fn(),
  }),
}));

// Mock child components that have their own complex dependencies
vi.mock("@/components/common/calendly-button", () => ({
  CalendlyButton: (props: Record<string, unknown>) => (
    <button data-testid="calendly-button" className={props.className as string}>
      Calendly
    </button>
  ),
}));

vi.mock("@/components/ui/theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme</button>,
}));

vi.mock("@/components/common/philippine-time", () => ({
  PhilippineTime: () => <span data-testid="philippine-time">12:00 PM</span>,
}));

vi.mock("@/components/features/discord/discord-presence-card", () => ({
  DiscordPresenceCard: () => <div data-testid="discord-presence">Discord</div>,
}));

vi.mock("@/components/features/last-fm/lastfm-recent-track-tile", () => ({
  LastFmRecentTrackTile: () => <div data-testid="lastfm-tile">Last.fm</div>,
}));

vi.mock("@/components/common/resume-view-modal-content", () => ({
  ResumeViewModalContent: () => (
    <div data-testid="resume-modal-content">Resume</div>
  ),
}));

vi.mock("@/components/ui/loading-tile", () => ({
  LoadingTile: ({ className }: { className?: string }) => (
    <div data-testid="loading-tile" className={className}>
      Loading
    </div>
  ),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderProfileCard = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfileCard />
    </QueryClientProvider>,
  );
};

describe("ProfileCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Header bar", () => {
    it("renders the name", () => {
      renderProfileCard();
      expect(
        screen.getAllByText("Jhon Keneth Namias").length,
      ).toBeGreaterThanOrEqual(1);
    });

    it("renders the verified badge", () => {
      renderProfileCard();
      expect(screen.getByTestId("verified-badge")).toBeInTheDocument();
    });

    it("renders the View resume button", () => {
      renderProfileCard();
      expect(screen.getByText("View resume")).toBeInTheDocument();
    });

    it("renders the theme toggle", () => {
      renderProfileCard();
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("renders the Calendly button", () => {
      renderProfileCard();
      expect(screen.getByTestId("calendly-button")).toBeInTheDocument();
    });
  });

  describe("Profile info", () => {
    it("renders the title/subtitle text", () => {
      renderProfileCard();
      expect(screen.getByText(/Full-Stack Developer/)).toBeInTheDocument();
    });

    it("renders the Philippine time", () => {
      renderProfileCard();
      expect(screen.getByTestId("philippine-time")).toBeInTheDocument();
    });

    it("renders bio text", () => {
      renderProfileCard();
      expect(
        screen.getByText(/Philippines-based software engineer/),
      ).toBeInTheDocument();
    });
  });

  describe("Availability badge", () => {
    it("renders the availability badge", () => {
      renderProfileCard();
      expect(screen.getByTestId("availability-badge")).toBeInTheDocument();
    });

    it("shows 'Available for freelance' when hireable", () => {
      renderProfileCard();
      expect(
        screen.getByText(/Available for freelance/),
      ).toBeInTheDocument();
    });
  });

  describe("Integrations", () => {
    it("renders the Discord presence card", () => {
      renderProfileCard();
      expect(screen.getByTestId("discord-presence")).toBeInTheDocument();
    });

    it("renders the Last.fm tile", () => {
      renderProfileCard();
      expect(screen.getByTestId("lastfm-tile")).toBeInTheDocument();
    });
  });

  describe("Social links", () => {
    it("renders social links excluding Calendly", () => {
      renderProfileCard();
      const socialLinks = screen.getAllByRole("link");
      // Calendly is filtered out, so only GitHub and LinkedIn should render
      expect(socialLinks).toHaveLength(2);
      expect(socialLinks[0]).toHaveAttribute(
        "href",
        "https://github.com/test",
      );
      expect(socialLinks[1]).toHaveAttribute(
        "href",
        "https://linkedin.com/in/test",
      );
    });

    it("renders social link icons with correct alt text", () => {
      renderProfileCard();
      expect(screen.getByAltText("GitHub")).toBeInTheDocument();
      expect(screen.getByAltText("LinkedIn")).toBeInTheDocument();
    });
  });
});
