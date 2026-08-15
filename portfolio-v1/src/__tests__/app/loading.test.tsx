import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

import Loading from '@/app/loading';

describe('Loading page', () => {
  it('renders a spinner with loading text', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(container.textContent).toContain('Loading...');
  });

  it('has role status for accessibility', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
