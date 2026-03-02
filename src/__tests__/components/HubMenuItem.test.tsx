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
        { children, className, onClick, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLButtonElement>
      ) {
        return R.createElement('button', { ref, className, onClick, ...props }, children);
      }),
      a: ({ children, className, onClick, href, download, target, rel, ...props }: Record<string, unknown>) =>
        R.createElement('a', { className, onClick, href, download, target, rel, ...props }, children),
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
});
