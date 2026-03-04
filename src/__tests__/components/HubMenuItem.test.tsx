import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HubMenuItem } from '@/components/ui/HubMenuItem';
import { Mail } from 'lucide-react';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      button: R.forwardRef(function MockButton(
        { children, className, onClick, role, tabIndex, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLButtonElement>
      ) {
        return R.createElement('button', { ref, className, onClick, role, tabIndex, ...props }, children);
      }),
      a: ({ children, className, onClick, href, download, target, rel, role, tabIndex, ...props }: Record<string, unknown>) =>
        R.createElement('a', { className, onClick, href, download, target, rel, role, tabIndex, ...props }, children),
    },
  };
});

describe('HubMenuItem', () => {
  it('renders label and subtitle', () => {
    render(<HubMenuItem icon={Mail} label="Send Email" subtitle="pp.namias@gmail.com" index={0} />);
    expect(screen.getByText('Send Email')).toBeInTheDocument();
    expect(screen.getByText('pp.namias@gmail.com')).toBeInTheDocument();
  });

  it('renders as a button when onClick is provided', () => {
    const onClick = vi.fn();
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} onClick={onClick} />);
    const btn = screen.getByText('Test').closest('button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a link when href is provided', () => {
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} href="mailto:test@test.com" />);
    const link = screen.getByText('Test').closest('a');
    expect(link).toHaveAttribute('href', 'mailto:test@test.com');
  });

  it('opens in new tab when external flag is set', () => {
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} href="https://example.com" external />);
    const link = screen.getByText('Test').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('adds download attribute when download is set', () => {
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} href="/resume.pdf" download />);
    const link = screen.getByText('Test').closest('a');
    expect(link).toHaveAttribute('download');
  });

  it('renders the icon', () => {
    const { container } = render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // --- New tests ---

  it('has role="menuitem" on button variant', () => {
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} onClick={() => {}} />);
    const btn = screen.getByRole('menuitem');
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
  });

  it('has role="menuitem" on link variant', () => {
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} href="/test" />);
    const link = screen.getByRole('menuitem');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('has tabIndex=0 for keyboard accessibility', () => {
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} onClick={() => {}} />);
    const item = screen.getByRole('menuitem');
    expect(item).toHaveAttribute('tabindex', '0');
  });

  it('applies custom icon color classes', () => {
    const { container } = render(
      <HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} iconColorClass="text-violet-500" iconBgClass="bg-violet-500/10" />
    );
    const iconWrapper = container.querySelector('[class*="bg-violet"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('uses default accent-pink colors when no custom colors provided', () => {
    const { container } = render(
      <HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} />
    );
    const iconWrapper = container.querySelector('[class*="bg-accent-pink"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('does not set target/rel when not external', () => {
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} href="/internal" />);
    const link = screen.getByText('Test').closest('a');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('fires onClick on link variant when provided', () => {
    const onClick = vi.fn();
    render(<HubMenuItem icon={Mail} label="Test" subtitle="Sub" index={0} href="/path" onClick={onClick} />);
    const link = screen.getByText('Test').closest('a')!;
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
