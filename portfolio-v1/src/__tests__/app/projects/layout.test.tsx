import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ProjectsLayout from '@/app/projects/layout';

describe('ProjectsLayout', () => {
  it('renders children unchanged', () => {
    render(<ProjectsLayout><div data-testid="child">content</div></ProjectsLayout>);
    expect(screen.getByTestId('child')).toHaveTextContent('content');
  });

  it('wraps children in a fragment (no extra DOM wrapper)', () => {
    const { container } = render(<ProjectsLayout><span>hello</span></ProjectsLayout>);
    expect(container.innerHTML).toBe('<span>hello</span>');
  });
});
