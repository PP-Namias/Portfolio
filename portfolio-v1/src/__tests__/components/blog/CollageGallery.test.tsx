import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CollageGallery from '@/components/blog/CollageGallery';

const sampleImages = [
  { url: '/img1.jpg', alt: 'Photo one', caption: 'First photo', credit: 'John' },
  { url: '/img2.jpg', alt: 'Photo two', caption: 'Second photo', credit: 'Jane' },
  { url: '/img3.jpg', alt: 'Photo three', caption: 'Third photo', credit: '' },
];

describe('CollageGallery', () => {
  it('renders nothing when images array is empty', () => {
    const { container } = render(<CollageGallery images={[]} layout="2col" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders 2-column grid layout', () => {
    const { container } = render(<CollageGallery images={sampleImages.slice(0, 2)} layout="2col" />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('sm:grid-cols-2');
  });

  it('renders 3-column grid layout', () => {
    const { container } = render(<CollageGallery images={sampleImages} layout="3col" />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
  });

  it('renders images with alt text', () => {
    render(<CollageGallery images={sampleImages} layout="2col" />);
    expect(screen.getByAltText('Photo one')).toBeInTheDocument();
    expect(screen.getByAltText('Photo two')).toBeInTheDocument();
  });

  it('renders captions and credits', () => {
    render(<CollageGallery images={sampleImages} layout="2col" />);
    expect(screen.getByText('First photo')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('renders images without caption gracefully', () => {
    const { container } = render(<CollageGallery images={[{ url: '/img.jpg', alt: 'Alone', caption: '', credit: '' }]} layout="2col" />);
    expect(screen.getByAltText('Alone')).toBeInTheDocument();
    const figcaptions = container.querySelectorAll('figcaption');
    expect(figcaptions.length).toBe(0);
  });
});
