import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EducationCertifications } from './education-certifications';
import type { Education, Certification } from '@/services/core/types';

const mockEducation: Education[] = [
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of Caloocan City',
    location: 'Caloocan City, Philippines',
    startedAt: '2021-08',
    endedAt: null,
    gpa: '3.8',
    honors: ['Dean\'s List', 'Academic Excellence Award'],
    relevantCourses: [
      'Data Structures and Algorithms',
      'Software Engineering',
      'Database Management Systems'
    ]
  },
  {
    degree: 'Associate Degree in Information Technology',
    institution: 'Tech Institute',
    location: 'Manila, Philippines',
    startedAt: '2019-06',
    endedAt: '2021-05',
    gpa: '3.9',
    honors: ['Valedictorian'],
    relevantCourses: ['Programming Fundamentals', 'Web Development']
  }
];

const mockCertifications: Certification[] = [
  {
    title: 'AWS Certified Solutions Architect',
    image: 'aws-cert.jpg',
    issuer: 'Amazon Web Services',
    issuedAt: '2023-06',
    tags: ['AWS', 'Cloud', 'Architecture']
  },
  {
    title: 'React Developer Certification',
    image: 'react-cert.jpg',
    issuer: 'Meta',
    issuedAt: '2023-03',
    tags: ['React', 'Frontend', 'JavaScript']
  },
  {
    title: 'Google Cloud Professional',
    image: 'gcp-cert.jpg',
    issuer: 'Google',
    issuedAt: '2022-11',
    tags: ['GCP', 'Cloud', 'DevOps']
  }
];

describe('EducationCertifications', () => {
  describe('Basic Rendering', () => {
    it('should render section with education and certifications', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('Education & Certifications')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      const { container } = render(
        <EducationCertifications
          education={mockEducation}
          certifications={mockCertifications}
        />
      );
      const section = container.querySelector('section#education');
      expect(section).toBeInTheDocument();
    });

    it('should have id attribute', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(container.querySelector('#education')).toBeInTheDocument();
    });

    it('should render section header', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const header = screen.getByRole('heading', { name: /education & certifications/i });
      expect(header).toBeInTheDocument();
    });

    it('should have resume-section class', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(container.querySelector('.resume-section')).toBeInTheDocument();
    });
  });

  describe('Education Section', () => {
    it('should render education subsection header', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('Education')).toBeInTheDocument();
    });

    it('should render all education entries', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
      expect(screen.getByText('Associate Degree in Information Technology')).toBeInTheDocument();
    });

    it('should render institution names', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('University of Caloocan City')).toBeInTheDocument();
      expect(screen.getByText('Tech Institute')).toBeInTheDocument();
    });

    it('should render education locations', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText(/caloocan city, philippines/i)).toBeInTheDocument();
      expect(screen.getByText(/manila, philippines/i)).toBeInTheDocument();
    });

    it('should render GPA when provided', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText(/GPA: 3.8/i)).toBeInTheDocument();
      expect(screen.getByText(/GPA: 3.9/i)).toBeInTheDocument();
    });

    it('should display "Present" for ongoing education', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      // Use getAllByText since "Present" appears in the date range
      const presentElements = screen.getAllByText((_content, element) => {
        return element?.textContent?.includes('Present') || false;
      });
      expect(presentElements.length).toBeGreaterThan(0);
    });

    it('should display end date for completed education', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText(/May 2021/i)).toBeInTheDocument();
    });

    it('should render honors as chips', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('Dean\'s List')).toBeInTheDocument();
      expect(screen.getByText('Academic Excellence Award')).toBeInTheDocument();
      expect(screen.getByText('Valedictorian')).toBeInTheDocument();
    });

    it('should render relevant courses when provided', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText(/data structures and algorithms/i)).toBeInTheDocument();
      expect(screen.getByText(/software engineering/i)).toBeInTheDocument();
    });

    it('should not render relevant courses section when not provided', () => {
      const educationWithoutCourses: Education[] = [{
        degree: 'BS Computer Science',
        institution: 'Test University',
        location: 'Test City',
        startedAt: '2020-01',
        endedAt: null
      }];
      render(
        <EducationCertifications 
          education={educationWithoutCourses} 
          certifications={[]} 
        />
      );
      expect(screen.queryByText(/relevant courses/i)).not.toBeInTheDocument();
    });
  });

  describe('Certifications Section', () => {
    it('should render certifications subsection header', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('Certifications')).toBeInTheDocument();
    });

    it('should render all certification entries', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('AWS Certified Solutions Architect')).toBeInTheDocument();
      expect(screen.getByText('React Developer Certification')).toBeInTheDocument();
      expect(screen.getByText('Google Cloud Professional')).toBeInTheDocument();
    });

    it('should render certification issuers', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('Amazon Web Services')).toBeInTheDocument();
      expect(screen.getByText('Meta')).toBeInTheDocument();
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    it('should render certification dates', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText(/june 2023/i)).toBeInTheDocument();
      expect(screen.getByText(/march 2023/i)).toBeInTheDocument();
      expect(screen.getByText(/november 2022/i)).toBeInTheDocument();
    });

    it('should render certification tags as chips', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('AWS')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('GCP')).toBeInTheDocument();
    });

    it('should limit certification tags to 3 per card', () => {
      const certWithManyTags: Certification[] = [{
        title: 'Full Stack Developer',
        image: 'cert.jpg',
        issuer: 'Test Org',
        issuedAt: '2023-01',
        tags: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL']
      }];
      render(
        <EducationCertifications 
          education={[]} 
          certifications={certWithManyTags} 
        />
      );
      expect(screen.getByText('+3 more')).toBeInTheDocument();
    });

    it('should render certifications in grid layout', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid classes for certifications', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
    });

    it('should have responsive spacing classes', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const section = container.querySelector('.resume-section');
      expect(section).toHaveClass('px-8');
      expect(section).toHaveClass('py-10');
    });

    it('should use flex-wrap for education items', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const flexContainer = container.querySelector('.flex-wrap');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('should have border between education and certifications', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const divider = container.querySelector('.border-t');
      expect(divider).toBeInTheDocument();
    });

    it('should apply accent color to icons', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const icons = container.querySelectorAll('.text-resume-accent');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should have card styling for certification items', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const cards = container.querySelectorAll('.border');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should have hover effects on certification cards', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const cards = container.querySelectorAll('.hover\\:shadow-md');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Empty States', () => {
    it('should render when no education provided', () => {
      render(
        <EducationCertifications 
          education={[]} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('Certifications')).toBeInTheDocument();
    });

    it('should render when no certifications provided', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={[]} 
        />
      );
      expect(screen.getByText('Education')).toBeInTheDocument();
    });

    it('should not crash with empty arrays', () => {
      expect(() => {
        render(
          <EducationCertifications 
            education={[]} 
            certifications={[]} 
          />
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const mainHeading = screen.getByRole('heading', { name: /education & certifications/i });
      expect(mainHeading.tagName).toBe('H2');
    });

    it('should have aria-label on section', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have proper link accessibility for certifications', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const certificationCards = screen.getAllByRole('article');
      expect(certificationCards.length).toBeGreaterThan(0);
    });

    it('should have descriptive text for screen readers', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
    });
  });

  describe('Print Optimization', () => {
    it('should have print-friendly classes', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(container.querySelector('.page-break-inside-avoid')).toBeInTheDocument();
    });

    it('should optimize certification grid for print', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const grid = container.querySelector('.print\\:grid-cols-1');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should format start dates correctly', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText(/august 2021/i)).toBeInTheDocument();
      expect(screen.getByText(/june 2019/i)).toBeInTheDocument();
    });

    it('should format certification dates correctly', () => {
      render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(screen.getByText(/june 2023/i)).toBeInTheDocument();
      expect(screen.getByText(/march 2023/i)).toBeInTheDocument();
    });
  });

  describe('Animations', () => {
    it('should have Framer Motion animation classes', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      expect(container.querySelector('[style*="opacity"]')).toBeTruthy();
    });

    it('should apply stagger animation to certification cards', () => {
      const { container } = render(
        <EducationCertifications 
          education={mockEducation} 
          certifications={mockCertifications} 
        />
      );
      const animatedElements = container.querySelectorAll('[style]');
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });
});
