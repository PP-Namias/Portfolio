import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('@/lib/features', () => ({
  IS_CHAT_THREADING_ENABLED: true,
}));

import { ThreadToggle } from '@/components/ui/ThreadToggle';

describe('ThreadToggle', () => {
  it('renders a button with accessible label when open', () => {
    render(<ThreadToggle isOpen={true} onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Close thread sidebar')).toBeInTheDocument();
  });

  it('renders a button with accessible label when closed', () => {
    render(<ThreadToggle isOpen={false} onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Open thread sidebar')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<ThreadToggle isOpen={true} onToggle={onToggle} />);
    fireEvent.click(screen.getByLabelText('Close thread sidebar'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('has correct title attribute', () => {
    render(<ThreadToggle isOpen={true} onToggle={vi.fn()} />);
    expect(screen.getByTitle('Close conversations')).toBeInTheDocument();
  });
});
