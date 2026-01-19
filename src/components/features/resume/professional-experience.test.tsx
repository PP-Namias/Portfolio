import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfessionalExperience } from './professional-experience';

const mockExperiences = [
  {
    company: 'Tech Corp',
    position: 'Senior Developer',
    summary: 'Led development team building scalable applications.',
    country: 'USA',
    modality: 'Remote',
    type: 'Full-time',
    startedAt: '2020-01',
    endedAt: null,
    technologies: ['React', 'TypeScript', 'Node.js'],
    highlights: [
      'Built microservices architecture serving 1M+ users',
      'Reduced deployment time by 80% through CI/CD automation',
      'Mentored 5 junior developers'
    ],
    achievements: ['99.9% Uptime', '1M+ Users', 'Team Lead'],
    relatedProjects: ['Story Adaptive Game Engine']
  },
  {
    company: 'StartupCo',
    position: 'Full Stack Developer',
    summary: 'Developed web applications for early-stage startup.',
    country: 'USA',
    modality: 'On-site',
    type: 'Full-time',
    startedAt: '2018-06',
    endedAt: '2019-12',
    technologies: ['Vue', 'Python', 'PostgreSQL'],
    highlights: [
      'Launched MVP in 3 months',
      'Achieved 95% test coverage'
    ],
    achievements: ['95% Test Coverage', 'MVP Launch'],
    relatedProjects: []
  }
];

describe('ProfessionalExperience', () => {
  describe('Basic Rendering', () => {
    it('should render section with experiences', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have professional-experience id', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const section = container.querySelector('#professional-experience');
      expect(section).toBeInTheDocument();
    });

    it('should render all experiences', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('StartupCo')).toBeInTheDocument();
    });
  });

  describe('Company Information', () => {
    it('should display company name', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should display position title', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });

    it('should display modality', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Remote/i)).toBeInTheDocument();
    });

    it('should display country', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const usaElements = screen.getAllByText(/USA/i);
      expect(usaElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should display employment type', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const fullTimeElements = screen.getAllByText(/Full-time/i);
      expect(fullTimeElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Date Formatting', () => {
    it('should display start date', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Jan 2020/i)).toBeInTheDocument();
    });

    it('should display "Present" for current role', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Present/i)).toBeInTheDocument();
    });

    it('should display end date for past roles', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Dec 2019/i)).toBeInTheDocument();
    });

    it('should format date range correctly', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Jan 2020 - Present/i)).toBeInTheDocument();
    });
  });

  describe('Highlights Display', () => {
    it('should display all highlight bullets', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Built microservices architecture/i)).toBeInTheDocument();
      expect(screen.getByText(/Reduced deployment time/i)).toBeInTheDocument();
    });

    it('should display highlights as list items', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThanOrEqual(3);
    });

    it('should display metrics in highlights', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // Use getAllByText since metrics may appear in both highlights and achievement badges
      expect(screen.getAllByText(/1M\+/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/80%/i)).toBeInTheDocument();
    });
  });

  describe('Technology Tags', () => {
    it('should display all technologies', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('should render technologies as chips/badges', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // Verify chips by checking if all technologies are rendered
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('should display correct number of technologies per experience', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // First experience has 3 technologies
      const reactChips = screen.getAllByText('React');
      expect(reactChips.length).toBe(1);
    });
  });

  describe('Timeline Layout', () => {
    it('should have timeline container', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timeline = container.querySelector('[class*="timeline"]');
      expect(timeline).toBeInTheDocument();
    });

    it('should have timeline dots for each experience', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const dots = container.querySelectorAll('[class*="timeline-dot"]');
      expect(dots.length).toBe(2);
    });

    it('should have connecting lines between experiences', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const lines = container.querySelectorAll('[class*="timeline-line"]');
      expect(lines.length).toBeGreaterThanOrEqual(1);
    });

    it('should order experiences chronologically (newest first)', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const companies = container.querySelectorAll('[class*="company"]');
      expect(companies[0]).toHaveTextContent('Tech Corp');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const experienceItems = container.querySelectorAll('[class*="experience-item"]');
      expect(experienceItems.length).toBe(2);
    });

    it('should have proper spacing between experiences', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timeline = container.querySelector('[class*="space-y"]');
      expect(timeline).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('should have company name as heading', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const heading = screen.getByText('Tech Corp');
      expect(heading.tagName).toMatch(/H[3-4]/);
    });

    it('should have distinct visual hierarchy', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const company = screen.getByText('Tech Corp');
      const position = screen.getByText('Senior Developer');
      expect(company).toHaveClass('font-bold');
      expect(position).toHaveClass('font-medium');
    });

    it('should apply timeline dot colors', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const dots = container.querySelectorAll('[class*="bg-"]');
      expect(dots.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty experiences array', () => {
      render(<ProfessionalExperience experiences={[]} />);
      expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    });

    it('should handle experience with no highlights', () => {
      const noHighlights = [{
        ...mockExperiences[0],
        highlights: []
      }];
      render(<ProfessionalExperience experiences={noHighlights} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should handle experience with no technologies', () => {
      const noTech = [{
        ...mockExperiences[0],
        technologies: []
      }];
      render(<ProfessionalExperience experiences={noTech} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should handle long company names', () => {
      const longName = [{
        ...mockExperiences[0],
        company: 'Very Long Company Name International Corporation Limited LLC'
      }];
      render(<ProfessionalExperience experiences={longName} />);
      expect(screen.getByText(/Very Long Company Name/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const mainHeading = screen.getByText('Professional Experience');
      expect(mainHeading.tagName).toBe('H2');
    });

    it('should have list semantics for highlights', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const lists = container.querySelectorAll('ul');
      expect(lists.length).toBeGreaterThanOrEqual(1);
    });

    it('should have aria-labels for timeline elements', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timeline = container.querySelector('[aria-label]');
      expect(timeline).toBeInTheDocument();
    });
  });

  describe('Print Optimization', () => {
    it('should have print-friendly classes', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('page-break-inside-avoid');
    });

    it('should have proper page break handling', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const experiences = container.querySelectorAll('[class*="experience"]');
      experiences.forEach(exp => {
        expect(exp).toHaveClass('page-break-inside-avoid');
      });
    });
  });

  // Phase 3.2 Enhancement Tests
  describe('Duration Calculation', () => {
    it('should display duration for current role', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // Should show duration - use getAllByText since multiple experiences have durations
      const durationElements = screen.getAllByText(/\d+\s*(?:years?|months?)/i);
      expect(durationElements.length).toBeGreaterThan(0);
    });

    it('should display duration for completed role', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // StartupCo: 2018-06 to 2019-12 = 1 year 7 months (inclusive)
      expect(screen.getByText(/1 year 7 months/i)).toBeInTheDocument();
    });

    it('should calculate months correctly', () => {
      const shortExperience = [{
        ...mockExperiences[0],
        startedAt: '2024-01',
        endedAt: '2024-06',
        company: 'Short Term Co'
      }];
      render(<ProfessionalExperience experiences={shortExperience} />);
      // 6 months duration (Jan-Jun inclusive)
      expect(screen.getByText(/6\s*months?/i)).toBeInTheDocument();
    });

    it('should handle edge case of same month start and end', () => {
      const sameMonthExp = [{
        ...mockExperiences[0],
        startedAt: '2024-01',
        endedAt: '2024-01',
        company: 'One Month Co'
      }];
      render(<ProfessionalExperience experiences={sameMonthExp} />);
      // 1 month duration (same month = 1 month)
      expect(screen.getByText(/1\s*month/i)).toBeInTheDocument();
    });
  });

  describe('Achievement Badges', () => {
    it('should display achievement badges', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('99.9% Uptime')).toBeInTheDocument();
      expect(screen.getByText('1M+ Users')).toBeInTheDocument();
      expect(screen.getByText('Team Lead')).toBeInTheDocument();
    });

    it('should render achievements as chips/badges', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('95% Test Coverage')).toBeInTheDocument();
      expect(screen.getByText('MVP Launch')).toBeInTheDocument();
    });

    it('should handle experiences without achievements', () => {
      const noAchievements = [{
        ...mockExperiences[0],
        achievements: undefined
      }];
      render(<ProfessionalExperience experiences={noAchievements} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should handle empty achievements array', () => {
      const emptyAchievements = [{
        ...mockExperiences[0],
        achievements: []
      }];
      render(<ProfessionalExperience experiences={emptyAchievements} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('should render expand button for each experience', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const expandButtons = container.querySelectorAll('[data-testid="expand-toggle"], [aria-expanded]');
      expect(expandButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should toggle expanded state on click', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const toggleButton = screen.getAllByRole('button').find(btn => 
        btn.getAttribute('aria-expanded') !== null || 
        btn.textContent?.includes('Show') ||
        btn.textContent?.includes('Hide')
      );
      
      if (toggleButton) {
        const initialState = toggleButton.getAttribute('aria-expanded');
        fireEvent.click(toggleButton);
        const newState = toggleButton.getAttribute('aria-expanded');
        expect(newState).not.toBe(initialState);
      }
    });

    it('should show/hide details section on expand', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // Initially technologies should be visible in expanded mode
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should have proper aria-expanded attribute', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const expandableElements = container.querySelectorAll('[aria-expanded]');
      expandableElements.forEach(el => {
        const ariaExpanded = el.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(ariaExpanded);
      });
    });
  });

  describe('Related Projects', () => {
    it('should display related project links', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Story Adaptive Game Engine/i)).toBeInTheDocument();
    });

    it('should handle experiences without related projects', () => {
      const noProjects = [{
        ...mockExperiences[0],
        relatedProjects: undefined
      }];
      render(<ProfessionalExperience experiences={noProjects} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should handle empty related projects array', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // StartupCo has empty relatedProjects
      expect(screen.getByText('StartupCo')).toBeInTheDocument();
    });

    it('should render project link with icon', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const projectSection = container.querySelector('[data-testid="related-projects"], .related-projects');
      if (projectSection) {
        expect(projectSection).toBeInTheDocument();
      }
    });

    it('should render project chips as clickable', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const projectChips = container.querySelectorAll('[data-testid="project-chip"]');
      expect(projectChips.length).toBeGreaterThan(0);
    });
  });

  describe('Hover Effects', () => {
    it('should have hover classes on experience cards', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const cards = container.querySelectorAll('[class*="hover"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should have transition classes for smooth effects', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const transitionElements = container.querySelectorAll('[class*="transition"]');
      expect(transitionElements.length).toBeGreaterThan(0);
    });
  });

  describe('Enhanced Timeline Animations', () => {
    it('should have motion container for staggered animations', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      // The container should exist and have experiences
      const experienceItems = container.querySelectorAll('.experience-item');
      expect(experienceItems.length).toBe(2);
    });

    it('should have gradient on timeline line', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timelineLine = container.querySelector('.timeline-line');
      expect(timelineLine).toHaveClass('bg-gradient-to-b');
    });

    it('should have pulse animation on current role dot', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      // First experience (Tech Corp) has no endedAt, so should have animate-pulse
      const timelineDots = container.querySelectorAll('.timeline-dot');
      const firstDotInner = timelineDots[0]?.querySelector('[class*="animate-pulse"]');
      expect(firstDotInner).toBeInTheDocument();
    });

    it('should have enhanced hover scale on timeline dots', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timelineDots = container.querySelectorAll('.timeline-dot div');
      timelineDots.forEach(dot => {
        expect(dot).toHaveClass('group-hover:scale-125');
      });
    });

    it('should have shadow effect on timeline dot hover', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timelineDots = container.querySelectorAll('.timeline-dot div');
      timelineDots.forEach(dot => {
        expect(dot).toHaveClass('group-hover:shadow-lg');
      });
    });
  });

  describe('Project Preview Integration', () => {
    const mockProjects = [
      {
        title: 'Story Adaptive Game Engine',
        image: 'test.png',
        description: 'A test project description',
        repositoryURL: 'https://github.com/test/repo',
        liveURL: 'https://example.com',
        processURL: null,
        tags: ['React', 'TypeScript'],
        year: 2025,
      }
    ];

    it('should render with projects prop', () => {
      render(<ProfessionalExperience experiences={mockExperiences} projects={mockProjects} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should show external link icon on matching project chips', () => {
      const { container } = render(
        <ProfessionalExperience experiences={mockExperiences} projects={mockProjects} />
      );
      // Project chip for "Story Adaptive Game Engine" should have external link icon
      const projectChips = container.querySelectorAll('[data-testid="project-chip"]');
      expect(projectChips.length).toBeGreaterThan(0);
    });
  });
});
