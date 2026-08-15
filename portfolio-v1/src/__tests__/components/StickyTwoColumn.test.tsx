import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StickyTwoColumn } from '@/components/sections/StickyTwoColumn';

function mockHeights(leftHeight: number, rightHeight: number) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const isLeft = this.textContent?.includes('LeftColumn') ?? false;
    const height = isLeft ? leftHeight : rightHeight;
    return { height, width: 100, top: 0, left: 0, right: 100, bottom: height, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
  });
}

function stickyParent(text: string): HTMLElement | null {
  const node = screen.getByText(text);
  return node.closest('[class*="lg:sticky"]');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('StickyTwoColumn', () => {
  it('renders both columns', () => {
    render(<StickyTwoColumn left={<div>LeftColumn</div>} right={<div>RightColumn</div>} />);
    expect(screen.getByText('LeftColumn')).toBeInTheDocument();
    expect(screen.getByText('RightColumn')).toBeInTheDocument();
  });

  it('sticks the right column when the left column is taller', () => {
    mockHeights(800, 400);
    render(<StickyTwoColumn left={<div>LeftColumn</div>} right={<div>RightColumn</div>} />);
    expect(stickyParent('RightColumn')).not.toBeNull();
    expect(stickyParent('LeftColumn')).toBeNull();
  });

  it('sticks the left column when the right column is taller', () => {
    mockHeights(400, 800);
    render(<StickyTwoColumn left={<div>LeftColumn</div>} right={<div>RightColumn</div>} />);
    expect(stickyParent('LeftColumn')).not.toBeNull();
    expect(stickyParent('RightColumn')).toBeNull();
  });

  it('disables stickiness when both columns are near equal height', () => {
    mockHeights(500, 515);
    render(<StickyTwoColumn left={<div>LeftColumn</div>} right={<div>RightColumn</div>} />);
    expect(stickyParent('LeftColumn')).toBeNull();
    expect(stickyParent('RightColumn')).toBeNull();
  });

  it('disables stickiness on mobile viewports', () => {
    mockHeights(800, 400);
    const originalWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
    Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });
    render(<StickyTwoColumn left={<div>LeftColumn</div>} right={<div>RightColumn</div>} />);
    expect(stickyParent('LeftColumn')).toBeNull();
    expect(stickyParent('RightColumn')).toBeNull();
    if (originalWidth) Object.defineProperty(window, 'innerWidth', originalWidth);
  });

  it('disables stickiness when the shorter column is taller than the viewport', () => {
    mockHeights(800, 400);
    const originalHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight');
    Object.defineProperty(window, 'innerHeight', { value: 300, configurable: true });
    render(<StickyTwoColumn left={<div>LeftColumn</div>} right={<div>RightColumn</div>} />);
    expect(stickyParent('LeftColumn')).toBeNull();
    expect(stickyParent('RightColumn')).toBeNull();
    if (originalHeight) Object.defineProperty(window, 'innerHeight', originalHeight);
  });
});
